import { Router } from 'express';
import { AIController } from '../controllers/ai.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { AdminController } from '../controllers/admin.controller.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { adminUpdateRoleSchema } from '../schemas/user.schema.js';
import { Role } from '@prisma/client';

export const aiRouter = Router();
aiRouter.post('/copilot/chat', AIController.copilotChat);
aiRouter.post('/trends/analyze', AIController.analyzeTrends);

export const adminRouter = Router();
adminRouter.use(authenticateUser, requireRole(Role.ADMIN));
adminRouter.patch('/users/:id/role', validateBody(adminUpdateRoleSchema), AdminController.updateUserRole);
adminRouter.get('/audit-logs', AdminController.getAuditLogs);
