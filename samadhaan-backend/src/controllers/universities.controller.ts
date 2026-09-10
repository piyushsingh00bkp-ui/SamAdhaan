import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth.types.js';
import { UniversityService } from '../services/university.service.js';
import { sendSuccess } from '../utils/response.js';

export class UniversitiesController {
  static async getUniversities(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const results = await UniversityService.getUniversities(req.query as any);
      sendSuccess(res, results);
    } catch (err) {
      next(err);
    }
  }

  static async getUniversityById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const university = await UniversityService.getUniversityById(String(req.params.id));
      sendSuccess(res, university);
    } catch (err) {
      next(err);
    }
  }

  static async createUniversity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const created = await UniversityService.createUniversity(req.body);
      sendSuccess(res, created, 201);
    } catch (err) {
      next(err);
    }
  }

  static async updateUniversity(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await UniversityService.updateUniversity(String(req.params.id), req.body);
      sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  static async getUniversityChallenges(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const challenges = await UniversityService.getUniversityChallenges(String(req.params.id));
      sendSuccess(res, challenges);
    } catch (err) {
      next(err);
    }
  }

  static async getUniversityProjects(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const projects = await UniversityService.getUniversityProjects(String(req.params.id));
      sendSuccess(res, projects);
    } catch (err) {
      next(err);
    }
  }
}
