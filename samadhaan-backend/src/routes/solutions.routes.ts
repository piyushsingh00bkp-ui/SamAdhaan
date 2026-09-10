import { Router } from 'express';
import { SolutionsController } from '../controllers/solutions.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import {
  createSolutionSchema,
  updateSolutionSchema,
  deploySolutionSchema,
} from '../schemas/solution.schema.js';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', SolutionsController.getSolutions);
router.get('/:id', SolutionsController.getSolutionById);

router.post(
  '/',
  authenticateUser,
  requireRole(Role.ADMIN, Role.UNIVERSITY),
  validateBody(createSolutionSchema),
  SolutionsController.createSolution
);

router.put(
  '/:id',
  authenticateUser,
  requireRole(Role.ADMIN, Role.UNIVERSITY),
  validateBody(updateSolutionSchema),
  SolutionsController.updateSolution
);

router.post(
  '/:id/deploy',
  authenticateUser,
  requireRole(Role.ADMIN, Role.UNIVERSITY, Role.GOVERNMENT, Role.INDUSTRY),
  validateBody(deploySolutionSchema),
  SolutionsController.deploySolution
);

export default router;
