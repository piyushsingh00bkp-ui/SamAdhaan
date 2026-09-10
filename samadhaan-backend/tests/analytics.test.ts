import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Analytics & Government API', () => {
  it('should return national platform overview analytics', async () => {
    const res = await request(app).get('/api/v1/analytics/overview');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalChallenges).toBeDefined();
    expect(res.body.data.resolutionRate).toBeDefined();
  });

  it('should return categories breakdown with percentages', async () => {
    const res = await request(app).get('/api/v1/analytics/categories');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('should return government hotspots for map aggregation', async () => {
    const res = await request(app).get('/api/v1/government/hotspots');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.hotspots).toBeDefined();
    expect(res.body.data.points).toBeDefined();
  });
});
