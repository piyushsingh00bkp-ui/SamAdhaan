import { Router } from 'express';
import { GovernmentController } from '../controllers/government.controller.js';
import { authenticateUser, optionalAuthenticateUser } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { Role } from '@prisma/client';

const router = Router();

router.get('/dashboard', optionalAuthenticateUser, GovernmentController.getDashboard);
router.get('/challenges', authenticateUser, requireRole(Role.GOVERNMENT, Role.ADMIN), GovernmentController.getChallenges);
router.get('/statistics', optionalAuthenticateUser, GovernmentController.getStatistics);
router.get('/departments', GovernmentController.getDepartments);
router.get('/hotspots', GovernmentController.getHotspots);

export default router;
