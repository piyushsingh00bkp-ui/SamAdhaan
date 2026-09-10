import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth.types.js';
import { IndustryService } from '../services/industry.service.js';
import { sendSuccess } from '../utils/response.js';

export class IndustriesController {
  static async getIndustries(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const results = await IndustryService.getIndustries(req.query as any);
      sendSuccess(res, results);
    } catch (err) {
      next(err);
    }
  }

  static async getIndustryById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const industry = await IndustryService.getIndustryById(String(req.params.id));
      sendSuccess(res, industry);
    } catch (err) {
      next(err);
    }
  }

  static async createIndustry(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await IndustryService.createIndustry(req.user!.id, req.body);
      sendSuccess(res, created, 201);
    } catch (err) {
      next(err);
    }
  }

  static async updateIndustry(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await IndustryService.updateIndustry(String(req.params.id), req.body);
      sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  static async getIndustryProjects(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const projects = await IndustryService.getIndustryProjects(String(req.params.id));
      sendSuccess(res, projects);
    } catch (err) {
      next(err);
    }
  }
}
