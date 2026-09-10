import { Router } from 'express';
import { PartnershipsController } from '../controllers/partnerships.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { createPartnershipSchema, updatePartnershipSchema } from '../schemas/solution.schema.js';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', PartnershipsController.getPartnerships);
router.get('/:id', PartnershipsController.getPartnershipById);

router.post(
  '/',
  authenticateUser,
  requireRole(Role.ADMIN, Role.INDUSTRY, Role.UNIVERSITY),
  validateBody(createPartnershipSchema),
  PartnershipsController.createPartnership
);

router.put(
  '/:id',
  authenticateUser,
  requireRole(Role.ADMIN, Role.INDUSTRY, Role.UNIVERSITY),
  validateBody(updatePartnershipSchema),
  PartnershipsController.updatePartnership
);

export default router;
