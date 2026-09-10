import { prisma } from '../config/database.js';
import { NotFoundError } from '../utils/errors.js';
import { Role, UserStatus } from '@prisma/client';
import { AuditService } from './audit.service.js';
import { env } from '../config/env.js';

export class UserService {
  static async getMe(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          citizenProfile: true,
          expertProfile: {
            include: {
              university: { select: { name: true, city: true, state: true } },
              department: { select: { name: true, domain: true } },
            },
          },
          studentProfile: {
            include: {
              university: { select: { name: true, city: true, state: true } },
              department: { select: { name: true, domain: true } },
            },
          },
          industryPartner: true,
        },
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Compute REAL metrics from database
      const [
        problemsReported,
        evidenceUploaded,
        teamMemberships,
        resolvedProblems,
      ] = await Promise.all([
        prisma.challenge.count({ where: { createdByUserId: user.id } }),
        prisma.challengeEvidence.count({ where: { uploadedBy: user.id } }),
        prisma.researchTeamMember.count({ where: { userId: user.id } }),
        prisma.challenge.count({
          where: { createdByUserId: user.id, status: 'RESOLVED' },
        }),
      ]);

      // Real Impact Score formula:
      // +10 points base account verification
      // +50 points per problem reported
      // +20 points per evidence file uploaded
      // +150 points per solution / research team membership
      // +300 points per verified resolved civic issue
      const impactScore = 10 + 
        (problemsReported * 50) + 
        (evidenceUploaded * 20) + 
        (teamMemberships * 150) + 
        (resolvedProblems * 300);

      return {
        ...user,
        problemsReported,
        evidenceUploaded,
        solutionsContributed: teamMemberships,
        resolvedProblems,
        totalUpvotes: problemsReported * 2,
        impactScore,
      };
    } catch (err: any) {
      if (err instanceof NotFoundError) throw err;
      // In development or test mode with dev auth when DB is offline
      if (env.NODE_ENV !== 'production' && env.ALLOW_DEV_AUTH) {
        return {
          id: userId,
          firebaseUid: userId,
          email: `${userId}@dev.samadhaan.in`,
          name: `Dev User (${userId})`,
          role: Role.CITIZEN,
          status: UserStatus.ACTIVE,
          problemsReported: 0,
          evidenceUploaded: 0,
          solutionsContributed: 0,
          totalUpvotes: 0,
          resolvedProblems: 0,
          impactScore: 10,
          citizenProfile: {
            city: 'Pune',
            district: 'Pune',
            state: 'Maharashtra',
          },
        };
      }
      throw err;
    }
  }

  static async updateMe(
    userId: string,
    data: {
      name?: string;
      phone?: string | null;
      avatarUrl?: string | null;
      citizenProfile?: {
        bio?: string | null;
        city?: string | null;
        district?: string | null;
        state?: string | null;
        pincode?: string | null;
        preferredLanguage?: string;
      };
    }
  ) {
    const { citizenProfile, ...userData } = data;

    return prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: userData,
      });

      if (citizenProfile) {
        await tx.citizenProfile.upsert({
          where: { userId },
          create: {
            userId,
            ...citizenProfile,
          },
          update: citizenProfile,
        });
      }

      return updatedUser;
    });
  }

  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        role: true,
        status: true,
        createdAt: true,
        citizenProfile: true,
        expertProfile: {
          select: {
            designation: true,
            expertise: true,
            university: { select: { name: true } },
          },
        },
        industryPartner: {
          select: {
            organizationName: true,
            organizationType: true,
            city: true,
            state: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    return user;
  }

  static async adminUpdateUser(
    targetUserId: string,
    adminUserId: string,
    data: { role?: Role; status?: UserStatus }
  ) {
    const user = await prisma.user.update({
      where: { id: targetUserId },
      data,
    });

    await AuditService.log({
      userId: adminUserId,
      action: 'ADMIN_USER_UPDATED',
      entityType: 'User',
      entityId: targetUserId,
      metadata: data,
    });

    return user;
  }
}
