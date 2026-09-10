import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth.types.js';
import { GovernmentService } from '../services/government.service.js';
import { sendSuccess } from '../utils/response.js';

export class GovernmentController {
  static async getDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { state, district } = req.query as any;
      const data = await GovernmentService.getDashboard(state, district);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async getChallenges(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const challenges = await GovernmentService.getGovernmentChallenges(req.query as any);
      sendSuccess(res, challenges);
    } catch (err) {
      next(err);
    }
  }

  static async getStatistics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { state } = req.query as any;
      const stats = await GovernmentService.getStatistics(state);
      sendSuccess(res, stats);
    } catch (err) {
      next(err);
    }
  }

  static async getDepartments(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const departments = await GovernmentService.getDepartments();
      sendSuccess(res, departments);
    } catch (err) {
      next(err);
    }
  }

  static async getHotspots(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const hotspots = await GovernmentService.getHotspots();
      sendSuccess(res, hotspots);
    } catch (err) {
      next(err);
    }
  }
}
