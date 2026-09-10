import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Authentication & RBAC Middleware', () => {
  it('should reject access to protected /users/me without credentials (401)', async () => {
    const res = await request(app).get('/api/v1/users/me');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });

  it('should reject invalid Bearer tokens (401)', async () => {
    const res = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', 'Bearer invalid_firebase_jwt_token_123');
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should accept X-Dev-User-ID in development mode', async () => {
    const res = await request(app)
      .get('/api/v1/users/me')
      .set('X-Dev-User-ID', 'test-citizen-01')
      .set('X-Dev-Role', 'CITIZEN');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.role).toBe('CITIZEN');
  });

  it('should reject non-admin from accessing /admin/audit-logs (403)', async () => {
    const res = await request(app)
      .get('/api/v1/admin/audit-logs')
      .set('X-Dev-User-ID', 'regular-citizen')
      .set('X-Dev-Role', 'CITIZEN');

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });
});
