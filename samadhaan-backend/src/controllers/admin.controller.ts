import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth.types.js';
import { UserService } from '../services/user.service.js';
import { prisma } from '../config/database.js';
import { parsePagination, paginate } from '../utils/pagination.js';
import { sendSuccess } from '../utils/response.js';

export class AdminController {
  static async updateUserRole(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await UserService.adminUpdateUser(String(req.params.id), req.user!.id, req.body);
      sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  static async getAuditLogs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const pagination = parsePagination(req.query.page, req.query.limit);
      const [items, total] = await Promise.all([
        prisma.auditLog.findMany({
          skip: pagination.skip,
          take: pagination.limit,
          include: { user: { select: { name: true, email: true, role: true } } },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.auditLog.count(),
      ]);

      sendSuccess(res, paginate(items, total, pagination));
    } catch (err) {
      next(err);
    }
  }
}
