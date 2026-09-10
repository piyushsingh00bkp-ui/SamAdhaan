import { prisma } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';
import { parsePagination, paginate } from '../utils/pagination.js';
import { AuditService } from './audit.service.js';

export class PartnershipService {
  static async createPartnership(userId: string, data: any) {
    const partnership = await prisma.partnership.create({
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });

    await AuditService.log({
      userId,
      action: 'PARTNERSHIP_CREATED',
      entityType: 'Partnership',
      entityId: partnership.id,
      metadata: { projectId: partnership.projectId, industryPartnerId: partnership.industryPartnerId },
    });

    return partnership;
  }

  static async getPartnerships(query: { page?: number; limit?: number; projectId?: string }) {
    const pagination = parsePagination(query.page, query.limit);
    const where: any = {};
    if (query.projectId) where.projectId = query.projectId;

    const [items, total] = await Promise.all([
      prisma.partnership.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        include: {
          industryPartner: true,
          project: {
            include: {
              createdByUniversity: { select: { name: true } },
              challenge: { select: { title: true, category: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.partnership.count({ where }),
    ]);

    return paginate(items, total, pagination);
  }

  static async getPartnershipById(id: string) {
    const partnership = await prisma.partnership.findUnique({
      where: { id },
      include: {
        industryPartner: true,
        project: {
          include: {
            createdByUniversity: true,
            challenge: true,
            solutions: true,
          },
        },
      },
    });

    if (!partnership) throw new NotFoundError('Partnership not found');
    return partnership;
  }

  static async updatePartnership(id: string, userId: string, data: any) {
    const updated = await prisma.partnership.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      },
    });

    await AuditService.log({
      userId,
      action: 'PARTNERSHIP_UPDATED',
      entityType: 'Partnership',
      entityId: id,
      metadata: data,
    });

    return updated;
  }
}
