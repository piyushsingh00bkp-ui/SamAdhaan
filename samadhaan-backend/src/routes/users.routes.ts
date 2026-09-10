import { Router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { authenticateUser } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validation.middleware.js';
import { updateUserSchema } from '../schemas/user.schema.js';

const router = Router();

router.get('/me', authenticateUser, UsersController.getMe);
router.put('/me', authenticateUser, validateBody(updateUserSchema), UsersController.updateMe);
router.get('/:id', authenticateUser, UsersController.getUserById);

export default router;
