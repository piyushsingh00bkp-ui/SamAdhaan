import { Router } from 'express';
import { NotificationsController } from '../controllers/notifications.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticateUser, NotificationsController.getNotifications);
router.patch('/:id/read', authenticateUser, NotificationsController.markAsRead);
router.patch('/read-all', authenticateUser, NotificationsController.markAllAsRead);

export default router;
