import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth.types.js';
import { SolutionService } from '../services/solution.service.js';
import { sendSuccess } from '../utils/response.js';

export class SolutionsController {
  static async createSolution(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const solution = await SolutionService.createSolution(req.user!.id, req.body);
      sendSuccess(res, solution, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getSolutions(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const results = await SolutionService.getSolutions(req.query as any);
      sendSuccess(res, results);
    } catch (err) {
      next(err);
    }
  }

  static async getSolutionById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const solution = await SolutionService.getSolutionById(String(req.params.id));
      sendSuccess(res, solution);
    } catch (err) {
      next(err);
    }
  }

  static async updateSolution(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await SolutionService.updateSolution(String(req.params.id), req.user!.id, req.body);
      sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  static async deploySolution(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const deployment = await SolutionService.deploySolution(
        String(req.params.id),
        req.user!.id,
        req.body
      );
      sendSuccess(res, deployment, 201);
    } catch (err) {
      next(err);
    }
  }
}
