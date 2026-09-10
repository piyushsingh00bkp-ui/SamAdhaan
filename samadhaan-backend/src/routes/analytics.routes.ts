import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller.js';

const router = Router();

router.get('/overview', AnalyticsController.getOverview);
router.get('/challenges', AnalyticsController.getChallenges);
router.get('/severity', AnalyticsController.getSeverity);
router.get('/categories', AnalyticsController.getCategories);
router.get('/states', AnalyticsController.getStates);
router.get('/impact', AnalyticsController.getImpact);
router.get('/trends', AnalyticsController.getTrends);
router.get('/lifecycle', AnalyticsController.getLifecycle);

export default router;
