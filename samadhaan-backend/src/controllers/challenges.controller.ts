import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/auth.types.js';
import { ChallengeService } from '../services/challenge.service.js';
import { EvidenceService } from '../services/evidence.service.js';
import { sendSuccess } from '../utils/response.js';

export class ChallengesController {
  static async createChallenge(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const challenge = await ChallengeService.createChallenge(req.user!.id, req.body);
      sendSuccess(res, challenge, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getChallenges(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const results = await ChallengeService.getChallenges(req.query as any);
      sendSuccess(res, results);
    } catch (err) {
      next(err);
    }
  }

  static async getChallengeById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const challenge = await ChallengeService.getChallengeById(String(req.params.id));
      sendSuccess(res, challenge);
    } catch (err) {
      next(err);
    }
  }

  static async updateChallenge(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await ChallengeService.updateChallenge(
        String(req.params.id),
        req.user!.id,
        req.user!.role,
        req.body
      );
      sendSuccess(res, updated);
    } catch (err) {
      next(err);
    }
  }

  static async deleteChallenge(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ChallengeService.deleteChallenge(
        String(req.params.id),
        req.user!.id,
        req.user!.role
      );
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  static async getNearbyChallenges(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { lat, lng, radius, limit } = req.query as any;
      const nearby = await ChallengeService.getNearbyChallenges(
        Number(lat),
        Number(lng),
        radius ? Number(radius) : 10,
        limit ? Number(limit) : 50
      );
      sendSuccess(res, nearby);
    } catch (err) {
      next(err);
    }
  }

  static async addEvidence(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const evidence = await EvidenceService.addEvidence(
        String(req.params.id),
        req.user!.id,
        req.file!
      );
      sendSuccess(res, evidence, 201);
    } catch (err) {
      next(err);
    }
  }

  static async getEvidence(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const evidence = await EvidenceService.getEvidenceByChallengeId(String(req.params.id));
      sendSuccess(res, evidence);
    } catch (err) {
      next(err);
    }
  }

  static async getTimeline(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const challenge = await ChallengeService.getChallengeById(String(req.params.id));
      sendSuccess(res, challenge.statusHistory);
    } catch (err) {
      next(err);
    }
  }
}
