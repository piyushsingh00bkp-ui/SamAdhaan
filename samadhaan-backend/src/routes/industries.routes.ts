import { Router } from 'express';
import { IndustriesController } from '../controllers/industries.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { createIndustrySchema, updateIndustrySchema } from '../schemas/industry.schema.js';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', IndustriesController.getIndustries);
router.get('/:id', IndustriesController.getIndustryById);
router.get('/:id/projects', IndustriesController.getIndustryProjects);

router.post(
  '/',
  authenticateUser,
  requireRole(Role.ADMIN, Role.INDUSTRY),
  validateBody(createIndustrySchema),
  IndustriesController.createIndustry
);

router.put(
  '/:id',
  authenticateUser,
  requireRole(Role.ADMIN, Role.INDUSTRY),
  validateBody(updateIndustrySchema),
  IndustriesController.updateIndustry
);

export default router;
