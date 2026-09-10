import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth.types.js';
import { ProjectService } from '../services/project.service.js';
import { sendSuccess } from '../utils/response.js';

export class ProjectsController {
  static async createProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.createProject(req.user!.id, req.body);
      sendSuccess(res, project, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getProjects(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const results = await ProjectService.getProjects(req.query as any);
      sendSuccess(res, results);
    } catch (err) {
      next(err);
    }
  }

  static async getProjectById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const project = await ProjectService.getProjectById(String(req.params.id));
      sendSuccess(res, project);
    } catch (err) {
      next(err);
    }
  }

  static async updateProject(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await ProjectService.updateProject(String(req.params.id), req.user!.id, req.body);
      sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  static async addTeamMember(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const member = await ProjectService.addTeamMember(
        String(req.params.id),
        req.user!.id,
        req.body.userId,
        req.body.role
      );
      sendSuccess(res, member, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getProjectTeam(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const team = await ProjectService.getProjectTeam(String(req.params.id));
      sendSuccess(res, team);
    } catch (err) {
      next(err);
    }
  }
}
