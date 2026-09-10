import { Router } from 'express';
import { ChallengesController } from '../controllers/challenges.controller.js';
import { authenticateUser, optionalAuthenticateUser } from '../middleware/auth.middleware.js';
import { validateBody, validateQuery } from '../middleware/validation.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import {
  createChallengeSchema,
  updateChallengeSchema,
  challengeQuerySchema,
  nearbyChallengeQuerySchema,
} from '../schemas/challenge.schema.js';

const router = Router();

// Public / Paginated listings
router.get('/', validateQuery(challengeQuerySchema), optionalAuthenticateUser, ChallengesController.getChallenges);
router.get('/nearby', validateQuery(nearbyChallengeQuerySchema), ChallengesController.getNearbyChallenges);
router.get('/:id', optionalAuthenticateUser, ChallengesController.getChallengeById);
router.get('/:id/evidence', ChallengesController.getEvidence);
router.get('/:id/timeline', ChallengesController.getTimeline);

// Authenticated mutations
router.post('/', authenticateUser, validateBody(createChallengeSchema), ChallengesController.createChallenge);
router.put('/:id', authenticateUser, validateBody(updateChallengeSchema), ChallengesController.updateChallenge);
router.delete('/:id', authenticateUser, ChallengesController.deleteChallenge);
router.post('/:id/evidence', authenticateUser, upload.single('file'), ChallengesController.addEvidence);

export default router;
