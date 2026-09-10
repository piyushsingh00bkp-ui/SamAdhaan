import { Request } from 'express';
import { User, Role } from '@prisma/client';

export interface AuthenticatedUser extends User {
  firebaseUid: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  requestId?: string;
}
