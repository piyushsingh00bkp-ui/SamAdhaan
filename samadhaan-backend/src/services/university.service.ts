import { prisma } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';
import { parsePagination, paginate } from '../utils/pagination.js';

export class UniversityService {
  static async getUniversities(query: {
    page?: number;
    limit?: number;
    search?: string;
    state?: string;
    city?: string;
  }) {
    const pagination = parsePagination(query.page, query.limit);

    const where: any = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { shortName: { contains: query.search, mode: 'insensitive' } },
        { city: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.state) where.state = { contains: query.state, mode: 'insensitive' };
    if (query.city) where.city = { contains: query.city, mode: 'insensitive' };

    const [items, total] = await Promise.all([
      prisma.university.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        include: {
          departments: { select: { id: true, name: true, domain: true } },
          _count: { select: { experts: true, students: true, projects: true } },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.university.count({ where }),
    ]);

    return paginate(items, total, pagination);
  }

  static async getUniversityById(id: string) {
    const university = await prisma.university.findUnique({
      where: { id },
      include: {
        departments: {
          include: {
            experts: {
              include: { user: { select: { id: true, name: true, avatarUrl: true } } },
            },
            _count: { select: { students: true } },
          },
        },
        projects: {
          include: {
            challenge: { select: { id: true, title: true, category: true, city: true } },
            solutions: true,
          },
        },
      },
    });

    if (!university) throw new NotFoundError('University not found');
    return university;
  }

  static async createUniversity(data: any) {
    return prisma.university.create({ data });
  }

  static async updateUniversity(id: string, data: any) {
    return prisma.university.update({ where: { id }, data });
  }

  static async getUniversityChallenges(universityId: string) {
    return prisma.challenge.findMany({
      where: {
        isDeleted: false,
        OR: [
          { universityMatches: { some: { universityId } } },
          { projects: { some: { createdByUniversityId: universityId } } },
        ],
      },
      include: {
        aiAnalysis: true,
        projects: true,
      },
    });
  }

  static async getUniversityProjects(universityId: string) {
    return prisma.project.findMany({
      where: { createdByUniversityId: universityId },
      include: {
        challenge: true,
        solutions: true,
        teams: { include: { members: { include: { user: true } } } },
        partnerships: { include: { industryPartner: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
