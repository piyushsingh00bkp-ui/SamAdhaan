import { prisma } from '../config/database.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import { parsePagination, paginate } from '../utils/pagination.js';
import { calculateDistanceKm, getBoundingBox } from '../utils/geo.js';
import { AIService } from './ai.service.js';
import { AuditService } from './audit.service.js';
import { NotificationService } from './notification.service.js';
import { ChallengeStatus, Priority, Role } from '@prisma/client';

export class ChallengeService {
  /**
   * Create new citizen challenge
   */
  static async createChallenge(
    userId: string,
    data: {
      title: string;
      description: string;
      category: string;
      subcategory?: string | null;
      priority?: Priority;
      affectedPopulation?: number | null;
      locationName: string;
      city: string;
      district: string;
      state: string;
      pincode?: string | null;
      latitude: number;
      longitude: number;
    }
  ) {
    const challenge = await prisma.$transaction(async (tx) => {
      const created = await tx.challenge.create({
        data: {
          ...data,
          createdByUserId: userId,
          status: ChallengeStatus.SUBMITTED,
        },
      });

      // Record initial status history
      await tx.challengeStatusHistory.create({
        data: {
          challengeId: created.id,
          previousStatus: ChallengeStatus.SUBMITTED,
          newStatus: ChallengeStatus.SUBMITTED,
          changedBy: userId,
          comment: 'Citizen report submitted to SAMADHAAN platform.',
        },
      });

      return created;
    });

    // Asynchronously trigger AI processing without blocking controller
    setImmediate(() => {
      AIService.processChallengeAI(challenge.id).catch((err) =>
        console.error('Async AI processing error:', err)
      );
    });

    await AuditService.log({
      userId,
      action: 'CHALLENGE_CREATED',
      entityType: 'Challenge',
      entityId: challenge.id,
      metadata: { title: challenge.title, category: challenge.category },
    });

    return challenge;
  }

  /**
   * Filter and paginate challenges
   */
  static async getChallenges(query: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    subcategory?: string;
    status?: string;
    priority?: string;
    state?: string;
    district?: string;
    city?: string;
    minSeverity?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const pagination = parsePagination(query.page, query.limit);

    const where: any = {
      isDeleted: false,
    };

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { locationName: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.category) where.category = query.category;
    if (query.subcategory) where.subcategory = query.subcategory;
    if (query.status) where.status = query.status as ChallengeStatus;
    if (query.priority) where.priority = query.priority as Priority;
    if (query.state) where.state = { contains: query.state, mode: 'insensitive' };
    if (query.district) where.district = { contains: query.district, mode: 'insensitive' };
    if (query.city) where.city = { contains: query.city, mode: 'insensitive' };
    if (query.minSeverity !== undefined) where.severity = { gte: query.minSeverity };

    const orderBy: any = {};
    const sortField = query.sortBy || 'createdAt';
    const sortDirection = query.sortOrder || 'desc';
    orderBy[sortField] = sortDirection;

    const [items, total] = await Promise.all([
      prisma.challenge.findMany({
        where,
        orderBy,
        skip: pagination.skip,
        take: pagination.limit,
        include: {
          createdByUser: {
            select: { id: true, name: true, avatarUrl: true, role: true },
          },
          evidence: {
            take: 3,
            select: { id: true, type: true, fileUrl: true, fileName: true },
          },
          aiAnalysis: {
            select: { severity: true, urgency: true, aiConfidence: true },
          },
          _count: {
            select: { evidence: true, projects: true, duplicateMatches: true },
          },
        },
      }),
      prisma.challenge.count({ where }),
    ]);

    return paginate(items, total, pagination);
  }

  /**
   * Get challenge by ID with all relational context
   */
  static async getChallengeById(id: string) {
    const challenge = await prisma.challenge.findFirst({
      where: { id, isDeleted: false },
      include: {
        createdByUser: {
          select: { id: true, name: true, email: true, phone: true, avatarUrl: true, role: true },
        },
        evidence: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          include: {
            changer: { select: { id: true, name: true, role: true } },
          },
        },
        aiAnalysis: true,
        universityMatches: {
          include: { university: true },
        },
        expertMatches: {
          include: { expert: { include: { user: { select: { name: true } } } } },
        },
        industryMatches: {
          include: { industryPartner: true },
        },
        projects: {
          include: {
            createdByUniversity: { select: { name: true, city: true } },
            solutions: true,
            partnerships: { include: { industryPartner: true } },
          },
        },
      },
    });

    if (!challenge) {
      throw new NotFoundError(`Challenge with id ${id} not found`);
    }

    return challenge;
  }

  /**
   * Update challenge status or fields
   */
  static async updateChallenge(
    id: string,
    userId: string,
    userRole: Role,
    data: {
      status?: ChallengeStatus;
      title?: string;
      description?: string;
      priority?: Priority;
      comment?: string;
    }
  ) {
    const challenge = await prisma.challenge.findUnique({ where: { id } });

    if (!challenge) {
      throw new NotFoundError(`Challenge with id ${id} not found`);
    }

    // Citizens can only edit their own submitted challenges
    if (userRole === Role.CITIZEN && challenge.createdByUserId !== userId) {
      throw new ForbiddenError('You can only update your own challenges');
    }

    const { status, comment, ...fieldsToUpdate } = data;

    return prisma.$transaction(async (tx) => {
      const updated = await tx.challenge.update({
        where: { id },
        data: {
          ...fieldsToUpdate,
          ...(status ? { status } : {}),
          ...(status === ChallengeStatus.RESOLVED ? { resolvedAt: new Date() } : {}),
        },
      });

      if (status && status !== challenge.status) {
        await tx.challengeStatusHistory.create({
          data: {
            challengeId: id,
            previousStatus: challenge.status,
            newStatus: status,
            changedBy: userId,
            comment: comment || `Status transitioned to ${status}`,
          },
        });

        // Notify challenge owner
        await NotificationService.create({
          userId: challenge.createdByUserId,
          type: 'CHALLENGE_STATUS_CHANGED',
          title: 'Challenge Update',
          message: `Your challenge "${challenge.title}" status is now ${status}.`,
          relatedChallengeId: id,
        });
      }

      return updated;
    });
  }

  /**
   * Soft delete challenge
   */
  static async deleteChallenge(id: string, userId: string, userRole: Role) {
    const challenge = await prisma.challenge.findUnique({ where: { id } });
    if (!challenge) throw new NotFoundError('Challenge not found');

    if (userRole !== Role.ADMIN && challenge.createdByUserId !== userId) {
      throw new ForbiddenError('You can only delete your own challenges');
    }

    await prisma.challenge.update({
      where: { id },
      data: { isDeleted: true },
    });

    await AuditService.log({
      userId,
      action: 'CHALLENGE_DELETED',
      entityType: 'Challenge',
      entityId: id,
    });

    return { message: 'Challenge deleted successfully' };
  }

  /**
   * PostGIS / Geospatial radius search
   */
  static async getNearbyChallenges(lat: number, lng: number, radiusKm = 10, limit = 50) {
    const bbox = getBoundingBox(lat, lng, radiusKm);

    // Initial bounding box filter using indexes
    const candidates = await prisma.challenge.findMany({
      where: {
        isDeleted: false,
        latitude: { gte: bbox.minLat, lte: bbox.maxLat },
        longitude: { gte: bbox.minLon, lte: bbox.maxLon },
      },
      take: limit * 2,
      include: {
        evidence: { take: 1, select: { fileUrl: true } },
      },
    });

    // Compute exact distance and filter within radius
    const results = candidates
      .map((c) => {
        const distanceKm = calculateDistanceKm(lat, lng, c.latitude, c.longitude);
        return {
          ...c,
          distanceKm: Math.round(distanceKm * 100) / 100,
        };
      })
      .filter((c) => c.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, limit);

    return results;
  }
}
