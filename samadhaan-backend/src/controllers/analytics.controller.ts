import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service.js';
import { sendSuccess } from '../utils/response.js';

export class AnalyticsController {
  static async getOverview(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getOverview();
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async getChallenges(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getChallengesAnalytics();
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async getSeverity(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getSeverityAnalytics();
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getCategoriesAnalytics();
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async getStates(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getStatesAnalytics();
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async getImpact(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getImpactAnalytics();
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async getTrends(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getTrendsAnalytics();
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  static async getLifecycle(_req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getLifecycleAnalytics();
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }
}
