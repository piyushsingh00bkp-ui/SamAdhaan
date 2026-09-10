import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Universities & Research API', () => {
  it('should list universities with pagination', async () => {
    const res = await request(app).get('/api/v1/universities?limit=5');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.items)).toBe(true);
  });
});
