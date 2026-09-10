import { prisma } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';
import { parsePagination, paginate } from '../utils/pagination.js';
import { AuditService } from './audit.service.js';
import { ChallengeStatus } from '@prisma/client';

export class SolutionService {
  static async createSolution(userId: string, data: any) {
    const solution = await prisma.solution.create({
      data,
    });

    await AuditService.log({
      userId,
      action: 'SOLUTION_CREATED',
      entityType: 'Solution',
      entityId: solution.id,
      metadata: { title: solution.title, projectId: solution.projectId },
    });

    return solution;
  }

  static async getSolutions(query: { page?: number; limit?: number; projectId?: string }) {
    const pagination = parsePagination(query.page, query.limit);
    const where: any = {};
    if (query.projectId) where.projectId = query.projectId;

    const [items, total] = await Promise.all([
      prisma.solution.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        include: {
          project: {
            include: {
              createdByUniversity: { select: { name: true, city: true } },
              challenge: { select: { title: true, category: true, city: true } },
            },
          },
          deployments: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.solution.count({ where }),
    ]);

    return paginate(items, total, pagination);
  }

  static async getSolutionById(id: string) {
    const solution = await prisma.solution.findUnique({
      where: { id },
      include: {
        project: {
          include: {
            createdByUniversity: true,
            challenge: true,
            partnerships: { include: { industryPartner: true } },
          },
        },
        deployments: {
          include: { impactMetrics: true },
        },
      },
    });

    if (!solution) throw new NotFoundError('Solution not found');
    return solution;
  }

  static async updateSolution(id: string, userId: string, data: any) {
    const updated = await prisma.solution.update({
      where: { id },
      data,
    });

    await AuditService.log({
      userId,
      action: 'SOLUTION_UPDATED',
      entityType: 'Solution',
      entityId: id,
      metadata: data,
    });

    return updated;
  }

  static async deploySolution(
    solutionId: string,
    userId: string,
    data: {
      location: string;
      latitude: number;
      longitude: number;
      startDate?: string | null;
      peopleImpacted?: number;
      deploymentNotes?: string | null;
    }
  ) {
    const solution = await prisma.solution.findUnique({
      where: { id: solutionId },
      include: { project: true },
    });

    if (!solution) throw new NotFoundError('Solution not found');

    return prisma.$transaction(async (tx) => {
      const deployment = await tx.deployment.create({
        data: {
          solutionId,
          location: data.location,
          latitude: data.latitude,
          longitude: data.longitude,
          startDate: data.startDate ? new Date(data.startDate) : new Date(),
          peopleImpacted: data.peopleImpacted || 0,
          deploymentNotes: data.deploymentNotes,
          status: 'ACTIVE',
        },
      });

      // Update Challenge status to DEPLOYED
      await tx.challenge.update({
        where: { id: solution.project.challengeId },
        data: { status: ChallengeStatus.DEPLOYED },
      });

      await tx.challengeStatusHistory.create({
        data: {
          challengeId: solution.project.challengeId,
          previousStatus: ChallengeStatus.PILOT,
          newStatus: ChallengeStatus.DEPLOYED,
          changedBy: userId,
          comment: `Solution "${solution.title}" deployed at ${data.location}`,
        },
      });

      return deployment;
    });
  }
}
