import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Challenges API Endpoints', () => {
  let createdChallengeId: string;

  it('should list challenges with pagination metadata', async () => {
    const res = await request(app).get('/api/v1/challenges?page=1&limit=5');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.items)).toBe(true);
    expect(res.body.data.pagination).toBeDefined();
    expect(res.body.data.pagination.page).toBe(1);
    expect(res.body.data.pagination.limit).toBe(5);
  });

  it('should create a new challenge using dev auth', async () => {
    const newChallenge = {
      title: 'Water Pipe Burst at Sector 5 Salt Lake',
      description: 'Major drinking water pipe burst causing localized flooding and water pressure drop across blocks AA and AB.',
      category: 'Water & Sanitation',
      locationName: 'Sector 5, Salt Lake',
      city: 'Kolkata',
      district: 'North 24 Parganas',
      state: 'West Bengal',
      latitude: 22.5868,
      longitude: 88.4312,
      priority: 'HIGH',
      affectedPopulation: 5000,
    };

    const res = await request(app)
      .post('/api/v1/challenges')
      .set('X-Dev-User-ID', 'kolkata-citizen-01')
      .set('X-Dev-Role', 'CITIZEN')
      .send(newChallenge);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe(newChallenge.title);
    expect(res.body.data.status).toBe('SUBMITTED');
    createdChallengeId = res.body.data.id;
  });

  it('should retrieve the created challenge by ID', async () => {
    if (!createdChallengeId) return;

    const res = await request(app).get(`/api/v1/challenges/${createdChallengeId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.id).toBe(createdChallengeId);
    expect(res.body.data.statusHistory).toBeDefined();
  });

  it('should filter challenges by state and category', async () => {
    const res = await request(app).get(
      '/api/v1/challenges?state=Maharashtra&category=Road Infrastructure'
    );
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should perform geospatial nearby queries (PostGIS)', async () => {
    // Search near Hinjewadi, Pune (lat: 18.5912, lng: 73.7385)
    const res = await request(app).get(
      '/api/v1/challenges/nearby?lat=18.5912&lng=73.7385&radius=25'
    );
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
