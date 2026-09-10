import { Router } from 'express';
import { UniversitiesController } from '../controllers/universities.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { createUniversitySchema, updateUniversitySchema } from '../schemas/university.schema.js';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', UniversitiesController.getUniversities);
router.get('/:id', UniversitiesController.getUniversityById);
router.get('/:id/challenges', UniversitiesController.getUniversityChallenges);
router.get('/:id/projects', UniversitiesController.getUniversityProjects);

router.post(
  '/',
  authenticateUser,
  requireRole(Role.ADMIN, Role.UNIVERSITY),
  validateBody(createUniversitySchema),
  UniversitiesController.createUniversity
);

router.put(
  '/:id',
  authenticateUser,
  requireRole(Role.ADMIN, Role.UNIVERSITY),
  validateBody(updateUniversitySchema),
  UniversitiesController.updateUniversity
);

export default router;
