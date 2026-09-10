import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth.types.js';
import { NotificationService } from '../services/notification.service.js';
import { sendSuccess } from '../utils/response.js';

export class NotificationsController {
  static async getNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const notifications = await NotificationService.getUserNotifications(req.user!.id);
      sendSuccess(res, notifications);
    } catch (err) {
      next(err);
    }
  }

  static async markAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await NotificationService.markAsRead(String(req.params.id), req.user!.id);
      sendSuccess(res, { message: 'Notification marked as read' });
    } catch (err) {
      next(err);
    }
  }

  static async markAllAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await NotificationService.markAllAsRead(req.user!.id);
      sendSuccess(res, { message: 'All notifications marked as read' });
    } catch (err) {
      next(err);
    }
  }
}
