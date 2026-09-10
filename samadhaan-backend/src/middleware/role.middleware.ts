import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from '../types/auth.types.js';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';

export function requireRole(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    // ADMIN has full access across all endpoints
    if (req.user.role === Role.ADMIN) {
      return next();
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ForbiddenError(
          `Insufficient permissions. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`
        )
      );
    }

    next();
  };
}
