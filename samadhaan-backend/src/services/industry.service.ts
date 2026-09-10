import { prisma } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';
import { parsePagination, paginate } from '../utils/pagination.js';
import { OrgType } from '@prisma/client';

export class IndustryService {
  static async getIndustries(query: {
    page?: number;
    limit?: number;
    search?: string;
    organizationType?: OrgType;
    state?: string;
    city?: string;
  }) {
    const pagination = parsePagination(query.page, query.limit);
    const where: any = {};

    if (query.search) {
      where.OR = [
        { organizationName: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { city: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.organizationType) where.organizationType = query.organizationType;
    if (query.state) where.state = { contains: query.state, mode: 'insensitive' };
    if (query.city) where.city = { contains: query.city, mode: 'insensitive' };

    const [items, total] = await Promise.all([
      prisma.industryPartner.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        include: {
          _count: { select: { partnerships: true, matches: true } },
        },
        orderBy: { organizationName: 'asc' },
      }),
      prisma.industryPartner.count({ where }),
    ]);

    return paginate(items, total, pagination);
  }

  static async getIndustryById(id: string) {
    const partner = await prisma.industryPartner.findUnique({
      where: { id },
      include: {
        partnerships: {
          include: {
            project: {
              include: {
                challenge: { select: { id: true, title: true, category: true, city: true } },
                solutions: true,
              },
            },
          },
        },
      },
    });

    if (!partner) throw new NotFoundError('Industry Partner not found');
    return partner;
  }

  static async createIndustry(userId: string, data: any) {
    return prisma.industryPartner.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  static async updateIndustry(id: string, data: any) {
    return prisma.industryPartner.update({
      where: { id },
      data,
    });
  }

  static async getIndustryProjects(industryId: string) {
    return prisma.partnership.findMany({
      where: { industryPartnerId: industryId },
      include: {
        project: {
          include: {
            challenge: true,
            createdByUniversity: { select: { name: true, city: true } },
            solutions: true,
            impactMetrics: true,
          },
        },
      },
    });
  }
}
