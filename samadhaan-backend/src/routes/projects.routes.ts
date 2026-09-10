import { Router } from 'express';
import { ProjectsController } from '../controllers/projects.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { requireRole } from '../middleware/role.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import {
  createProjectSchema,
  updateProjectSchema,
  addTeamMemberSchema,
} from '../schemas/project.schema.js';
import { Role } from '@prisma/client';

const router = Router();

router.get('/', ProjectsController.getProjects);
router.get('/:id', ProjectsController.getProjectById);
router.get('/:id/team', ProjectsController.getProjectTeam);

router.post(
  '/',
  authenticateUser,
  requireRole(Role.ADMIN, Role.UNIVERSITY),
  validateBody(createProjectSchema),
  ProjectsController.createProject
);

router.put(
  '/:id',
  authenticateUser,
  requireRole(Role.ADMIN, Role.UNIVERSITY),
  validateBody(updateProjectSchema),
  ProjectsController.updateProject
);

router.post(
  '/:id/team',
  authenticateUser,
  requireRole(Role.ADMIN, Role.UNIVERSITY),
  validateBody(addTeamMemberSchema),
  ProjectsController.addTeamMember
);

export default router;
