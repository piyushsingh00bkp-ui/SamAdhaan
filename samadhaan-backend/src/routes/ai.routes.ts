import { Router } from 'express';
import { AIController } from '../controllers/ai.controller.js';

const router = Router();

// 1. AI Engine Health
router.get('/health', AIController.getHealth);

// 1. 🧠 Problem Analyzer (Gemini + FastAPI)
router.post('/analyze', AIController.analyzeProblem);

// 2. 🏷️ Auto Categorization (Gemini)
router.post('/classify', AIController.classifyProblem);

// 3. 🚨 Severity Scoring (Python + ML)
router.post('/severity', AIController.assessSeverity);

// 4. 🔍 Duplicate Detection (Sentence Transformers + pgvector)
router.post('/duplicates', AIController.detectDuplicates);
router.post('/duplicates/analyze', AIController.detectDuplicates);

// 5. 🎯 AI Matching Engine (Embeddings + pgvector)
router.post('/match', AIController.findMatches);

// 6. 💡 Solution Generator (Gemini)
router.post('/solutions/generate', AIController.generateSolutions);
router.post('/solutions', AIController.generateSolutions);

// 7. 📸 Image Analyzer (Gemini Vision / YOLO)
router.post('/vision', AIController.analyzeVision);

// 8. 🎙️ Voice Problem AI (Whisper + Gemini)
router.post('/voice', AIController.processVoice);

// 9. 🌐 Multilingual AI (Bengali/Hindi/Marathi/English)
router.post('/translate', AIController.translateText);
router.post('/multilingual/translate', AIController.translateText);

// 10. 🏛️ Department Router (Gemini + Rules)
router.post('/route', AIController.routeDepartment);

// 11. 📊 Impact Predictor (Python + ML)
router.post('/impact', AIController.forecastImpact);

// 12. 📈 Trend Detector (Python + Pandas + ML)
router.post('/trends', AIController.analyzeTrends);
router.post('/trends/analyze', AIController.analyzeTrends);

// 13. 🛡️ Spam/Fake Detector (Python + Gemini)
router.post('/spam-check', AIController.checkSpam);
router.post('/spam', AIController.checkSpam);

// 14. 📝 AI Report Generator (Gemini + Python)
router.post('/reports/generate', AIController.generateReport);

// 15. 🤖 Project Copilot (Gemini + RAG)
router.post('/copilot/chat', AIController.copilotChat);
router.post('/copilot/ask', AIController.copilotChat);

export default router;

