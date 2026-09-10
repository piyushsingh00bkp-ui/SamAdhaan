import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { sendError } from '../utils/response.js';
import { env } from '../config/env.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode, err.code, err.details);
    return;
  }

  // Prisma unique constraint violation or record not found
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as unknown as { code: string; meta?: { target?: string[] } };
    if (prismaError.code === 'P2002') {
      sendError(
        res,
        `Duplicate value violates unique constraint on: ${prismaError.meta?.target?.join(', ') || 'field'}`,
        409,
        'DUPLICATE_RESOURCE'
      );
      return;
    }
    if (prismaError.code === 'P2025') {
      sendError(res, 'Record not found in database', 404, 'NOT_FOUND');
      return;
    }
  }

  // Fallback internal server error
  console.error('💥 Unhandled Internal Server Error:', err);
  const message =
    env.NODE_ENV === 'production'
      ? 'An unexpected internal server error occurred.'
      : err.message || 'Internal Server Error';

  sendError(res, message, 500, 'INTERNAL_ERROR', env.NODE_ENV !== 'production' ? err.stack : undefined);
}
