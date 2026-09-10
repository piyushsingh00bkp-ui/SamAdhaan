import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth.types.js';
import { UserService } from '../services/user.service.js';
import { sendSuccess } from '../utils/response.js';

export class UsersController {
  static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getMe(req.user!.id);
      sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  }

  static async updateMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await UserService.updateMe(req.user!.id, req.body);
      sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  static async getUserById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(String(req.params.id));
      sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  }
}
