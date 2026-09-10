import { prisma } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';
import { parsePagination, paginate } from '../utils/pagination.js';
import { AuditService } from './audit.service.js';
import { NotificationService } from './notification.service.js';
import { ProjectStatus, TeamRole, ChallengeStatus } from '@prisma/client';

export class ProjectService {
  static async createProject(
    userId: string,
    data: {
      challengeId: string;
      name: string;
      description: string;
      createdByUniversityId: string;
      startDate?: string | null;
      targetDate?: string | null;
      budget?: number | null;
      fundingSource?: string | null;
    }
  ) {
    const project = await prisma.$transaction(async (tx) => {
      const created = await tx.project.create({
        data: {
          ...data,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
          status: ProjectStatus.RESEARCH,
        },
      });

      // Update challenge status to R_AND_D
      await tx.challenge.update({
        where: { id: data.challengeId },
        data: { status: ChallengeStatus.R_AND_D },
      });

      // Record challenge status history
      await tx.challengeStatusHistory.create({
        data: {
          challengeId: data.challengeId,
          previousStatus: ChallengeStatus.UNIVERSITY_ASSIGNED,
          newStatus: ChallengeStatus.R_AND_D,
          changedBy: userId,
          comment: `Research project "${data.name}" initiated.`,
        },
      });

      // Create primary research team
      await tx.researchTeam.create({
        data: {
          projectId: created.id,
          name: `${data.name} Core R&D Team`,
          members: {
            create: {
              userId,
              role: TeamRole.PROJECT_MANAGER,
            },
          },
        },
      });

      return created;
    });

    await AuditService.log({
      userId,
      action: 'PROJECT_CREATED',
      entityType: 'Project',
      entityId: project.id,
      metadata: { name: project.name, challengeId: project.challengeId },
    });

    return project;
  }

  static async getProjects(query: {
    page?: number;
    limit?: number;
    status?: ProjectStatus;
    universityId?: string;
    challengeId?: string;
  }) {
    const pagination = parsePagination(query.page, query.limit);
    const where: any = {};

    if (query.status) where.status = query.status;
    if (query.universityId) where.createdByUniversityId = query.universityId;
    if (query.challengeId) where.challengeId = query.challengeId;

    const [items, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: pagination.skip,
        take: pagination.limit,
        include: {
          createdByUniversity: { select: { id: true, name: true, city: true } },
          challenge: { select: { id: true, title: true, category: true, city: true, state: true } },
          solutions: true,
          partnerships: { include: { industryPartner: { select: { organizationName: true } } } },
          _count: { select: { teams: true, solutions: true, impactMetrics: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.project.count({ where }),
    ]);

    return paginate(items, total, pagination);
  }

  static async getProjectById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        createdByUniversity: true,
        challenge: {
          include: {
            evidence: true,
            aiAnalysis: true,
          },
        },
        teams: {
          include: {
            members: {
              include: {
                user: { select: { id: true, name: true, email: true, avatarUrl: true, role: true } },
              },
            },
          },
        },
        solutions: {
          include: {
            deployments: { include: { impactMetrics: true } },
          },
        },
        partnerships: {
          include: { industryPartner: true },
        },
        impactMetrics: true,
      },
    });

    if (!project) throw new NotFoundError('Project not found');
    return project;
  }

  static async updateProject(id: string, userId: string, data: any) {
    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
      },
    });

    await AuditService.log({
      userId,
      action: 'PROJECT_UPDATED',
      entityType: 'Project',
      entityId: id,
      metadata: data,
    });

    return updated;
  }

  static async addTeamMember(projectId: string, userId: string, memberUserId: string, role: TeamRole) {
    let team = await prisma.researchTeam.findFirst({
      where: { projectId },
    });

    if (!team) {
      team = await prisma.researchTeam.create({
        data: { projectId, name: 'Project R&D Team' },
      });
    }

    const member = await prisma.researchTeamMember.upsert({
      where: {
        teamId_userId: { teamId: team.id, userId: memberUserId },
      },
      create: {
        teamId: team.id,
        userId: memberUserId,
        role,
      },
      update: { role },
      include: { user: { select: { id: true, name: true, email: true, role: true } } },
    });

    await NotificationService.create({
      userId: memberUserId,
      type: 'ADDED_TO_RESEARCH_TEAM',
      title: 'Added to Research Team',
      message: `You were added to project team as ${role}.`,
      relatedProjectId: projectId,
    });

    return member;
  }

  static async getProjectTeam(projectId: string) {
    return prisma.researchTeam.findMany({
      where: { projectId },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatarUrl: true, role: true },
            },
          },
        },
      },
    });
  }
}
