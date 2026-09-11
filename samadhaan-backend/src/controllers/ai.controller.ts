import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai.service.js';
import { sendSuccess } from '../utils/response.js';

export class AIController {
  // 1. AI Engine Health
  static async getHealth(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.getHealth();
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // 1.1 Problem Analyzer (Gemini + FastAPI)
  static async analyzeProblem(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.analyzeProblem(req.body);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // 2. Problem Classification
  static async classifyProblem(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.classifyProblem(req.body);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // 3. Severity & Urgency Assessment
  static async assessSeverity(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.assessSeverity(req.body);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // 4. Duplicate Detection
  static async detectDuplicates(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.detectDuplicates(req.body);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // 5. Multi-Stakeholder Matching
  static async findMatches(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.findMatches(req.body);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // 5.1 AI Assign Stakeholders
  static async assignStakeholders(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.assignStakeholders(req.body);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // 6. Solution Generator
  static async generateSolutions(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.generateSolutions(req.body);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // 7. Vision / Multimodal Image Analysis
  static async analyzeVision(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.analyzeVision(req.body);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // 8. Regional Voice & Speech Transcription
  static async processVoice(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.processVoice(req.body);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // 9. Multilingual AI Translation
  static async translateText(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.translateText(req.body);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // 10. Department Routing
  static async routeDepartment(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.routeDepartment(req.body);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // 11. Impact & ROI Forecasting
  static async forecastImpact(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.forecastImpact(req.body);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // 9. Trend Detection & Hotspot Intelligence
  static async analyzeTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.detectTrends(req.body);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // 10. Spam, Fake & Credibility Verification
  static async checkSpam(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.checkSpam(req.body);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // 11. GovTech & Municipal Report Generator
  static async generateReport(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.generateReport(req.body);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  // 12. Project & R&D Copilot
  static async copilotChat(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AIService.copilotChat(req.body);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }
}

