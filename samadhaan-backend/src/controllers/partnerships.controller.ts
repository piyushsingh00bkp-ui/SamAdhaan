import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth.types.js';
import { PartnershipService } from '../services/partnership.service.js';
import { sendSuccess } from '../utils/response.js';

export class PartnershipsController {
  static async createPartnership(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const partnership = await PartnershipService.createPartnership(req.user!.id, req.body);
      sendSuccess(res, partnership, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getPartnerships(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const results = await PartnershipService.getPartnerships(req.query as any);
      sendSuccess(res, results);
    } catch (err) {
      next(err);
    }
  }

  static async getPartnershipById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const partnership = await PartnershipService.getPartnershipById(String(req.params.id));
      sendSuccess(res, partnership);
    } catch (err) {
      next(err);
    }
  }

  static async updatePartnership(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await PartnershipService.updatePartnership(String(req.params.id), req.user!.id, req.body);
      sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }
}
