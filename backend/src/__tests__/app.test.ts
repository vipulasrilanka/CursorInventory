import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../app';
import { setupTestDB, teardownTestDB } from './setup';

describe('App Setup', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  it('should handle CORS', async () => {
    const response = await request(app)
      .options('/api/inventory')
      .set('Origin', 'http://localhost:3000');

    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  it('should parse JSON', async () => {
    const response = await request(app)
      .post('/api/inventory')
      .send({
        // Missing required fields to trigger validation error
        serialNumber: 'TEST123'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBeDefined();
  });

  it('should handle non-existent routes', async () => {
    const response = await request(app)
      .get('/api/non-existent');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Route not found');
  });
}); 