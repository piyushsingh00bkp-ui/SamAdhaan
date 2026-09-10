import { prisma } from '../config/database.js';

export class AuditService {
  static async log(params: {
    userId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          userId: params.userId,
          action: params.action,
          entityType: params.entityType,
          entityId: params.entityId,
          metadata: params.metadata as any,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        },
      });
    } catch (err) {
      console.error('Failed to write audit log:', err);
    }
  }
}
