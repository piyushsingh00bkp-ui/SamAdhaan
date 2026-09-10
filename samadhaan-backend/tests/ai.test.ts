import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('SAMADHAAN 12 AI Features Integration Suite', () => {
  // 1. AI Engine Health
  it('1. should return AI Engine health and active models status', async () => {
    const res = await request(app).get('/api/v1/ai/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('healthy');
    expect(res.body.data.featuresAvailable).toHaveLength(12);
  });

  // 2. Problem Classification
  it('2. should classify civic problem into category and SDGs', async () => {
    const res = await request(app)
      .post('/api/v1/ai/classify')
      .send({
        title: 'Huge drainage overflow on main street',
        description: 'Sewage water is flooding the street and blocking vehicles.',
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.primaryCategory).toMatch(/Water|Sanitation|Sewage|Drainage/i);
    expect(res.body.data.sdgGoals.length).toBeGreaterThan(0);
  });

  // 3. Severity & Urgency Assessment
  it('3. should evaluate severity and recommend SLA', async () => {
    const res = await request(app)
      .post('/api/v1/ai/severity')
      .send({
        title: 'Dangerous electrical pole collapse risk',
        description: 'High voltage live wire hanging close to public walkway.',
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.severityScore).toBeGreaterThanOrEqual(80);
    expect(['HIGH', 'CRITICAL']).toContain(res.body.data.priority);
  });

  // 4. Department Routing
  it('4. should route problem to exact municipal department and nodal officer', async () => {
    const res = await request(app)
      .post('/api/v1/ai/route')
      .send({
        title: 'Road pothole cluster near IT park',
        description: 'Multiple deep potholes causing traffic congestion.',
        category: 'Roads & Infrastructure',
        city: 'Pune',
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.primaryDepartment).toContain('Road');
    expect(res.body.data.recommendedActionPlan.length).toBeGreaterThan(0);
  });

  // 5. Multi-Stakeholder Matching
  it('5. should match challenge with universities and CSR partners', async () => {
    const res = await request(app)
      .post('/api/v1/ai/match')
      .send({
        category: 'Water Infrastructure',
        description: 'Smart drainage automation needed for urban flooding.',
        city: 'Pune',
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.matchedUniversities.length).toBeGreaterThan(0);
    expect(res.body.data.matchedIndustryPartners.length).toBeGreaterThan(0);
  });

  // 6. Vision / Multimodal Image Analysis
  it('6. should perform multimodal computer vision analysis on damage evidence', async () => {
    const res = await request(app)
      .post('/api/v1/ai/vision')
      .send({
        imageUrl: 'https://example.com/pothole_evidence.jpg',
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.visualVerificationStatus).toBe('VERIFIED_DAMAGE');
    expect(res.body.data.detectedDefects.length).toBeGreaterThan(0);
  });

  // 7. Regional Voice & Speech Transcription
  it('7. should transcribe regional voice audio and extract civic entities', async () => {
    const res = await request(app)
      .post('/api/v1/ai/voice')
      .send({
        audioUrl: 'https://example.com/voice_complaint.mp3',
        languageHint: 'mr',
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.transcribedText).toBeTruthy();
    expect(res.body.data.detectedLanguage).toBeTruthy();
  });

  // 8. Impact & ROI Forecasting
  it('8. should forecast social ROI and carbon reduction metrics', async () => {
    const res = await request(app)
      .post('/api/v1/ai/impact')
      .send({
        title: 'Decentralized Solar Water Treatment Units',
        category: 'Water',
        proposedSolution: 'Installation of 50 decentralized filtration nodes.',
        estimatedBudget: 800000,
        targetPopulation: 25000,
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.socialReturnOnInvestment).toContain('x');
    expect(res.body.data.sdgImpactScores).toBeDefined();
  });

  // 9. Trend Detection & Hotspot Intelligence
  it('9. should detect geographic hotspots and emerging civic trends', async () => {
    const res = await request(app)
      .post('/api/v1/ai/trends')
      .send({
        district: 'Pune',
        timeWindowDays: 30,
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.identifiedHotspots.length).toBeGreaterThan(0);
    expect(res.body.data.predictiveAlerts.length).toBeGreaterThan(0);
  });

  // 10. Spam, Fake & Credibility Verification
  it('10. should verify report credibility and filter spam', async () => {
    const res = await request(app)
      .post('/api/v1/ai/spam-check')
      .send({
        title: 'Broken stormwater drain lid near school',
        description: 'The concrete lid of the drainage chamber is cracked and open.',
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.isSpam).toBe(false);
    expect(res.body.data.credibilityScore).toBeGreaterThan(80);
  });

  // 11. GovTech & Municipal Report Generator
  it('11. should generate structured municipal executive briefing report', async () => {
    const res = await request(app)
      .post('/api/v1/ai/reports/generate')
      .send({
        reportType: 'EXECUTIVE_SUMMARY',
        district: 'Pune',
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.markdownContent).toContain('SAMADHAAN Executive Civic Intelligence');
    expect(res.body.data.kpiHighlights).toBeDefined();
  }, 30000);

  // 12. Project & R&D Copilot
  it('12. should provide contextual R&D and GovTech guidance via Copilot', async () => {
    const res = await request(app)
      .post('/api/v1/ai/copilot/chat')
      .send({
        query: 'How can our university team apply for CSR funding for a water purification pilot?',
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.answer).toContain('CSR');
    expect(res.body.data.suggestedFollowUps.length).toBeGreaterThan(0);
  }, 30000);
});
