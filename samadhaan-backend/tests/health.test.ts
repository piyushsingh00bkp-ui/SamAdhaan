import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('GET /api/v1/health', () => {
  it('should return 200 and healthy status format', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.service).toBe('samadhaan-backend');
    expect(res.body.data.status).toBe('ok');
  });

  it('should return welcome info on root /', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('SAMADHAAN GovTech API');
  });
});
