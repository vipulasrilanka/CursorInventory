import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import { Inventory } from '../models/Inventory';
import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { setupTestDB, teardownTestDB, clearTestDB } from './setup';

describe('Inventory API Tests', () => {
  const sampleItem = {
    description: 'Test Laptop',
    manufacturer: 'Test Manufacturer',
    model: 'Test Model',
    serialNumber: 'TEST123',
    type: 'Laptop',
    owner: 'Test Owner',
    currentUser: 'Test User',
    status: 'Available'
  };

  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await teardownTestDB();
  });

  beforeEach(async () => {
    await clearTestDB();
  });

  describe('POST /api/inventory', () => {
    it('should create a new inventory item', async () => {
      const response = await request(app)
        .post('/api/inventory')
        .send(sampleItem);

      expect(response.status).toBe(201);
      expect(response.body.serialNumber).toBe(sampleItem.serialNumber);
    });

    it('should reject duplicate serial number for same type', async () => {
      // Create first item
      await request(app)
        .post('/api/inventory')
        .send(sampleItem);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/inventory')
        .send(sampleItem);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('already exists');
    });

    it('should allow same serial number for different types', async () => {
      // Create first item
      await request(app)
        .post('/api/inventory')
        .send(sampleItem);

      // Create second item with same serial number but different type
      const response = await request(app)
        .post('/api/inventory')
        .send({
          ...sampleItem,
          description: 'Test Desktop',
          model: 'Test Desktop Model',
          type: 'Desktop'
        });

      expect(response.status).toBe(201);
      expect(response.body.type).toBe('Desktop');
      expect(response.body.serialNumber).toBe(sampleItem.serialNumber);
    });

    it('should handle invalid data', async () => {
      const invalidItem = {
        serialNumber: 'TEST123',
        type: 'Laptop'
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/inventory')
        .send(invalidItem);

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/inventory', () => {
    it('should return all inventory items', async () => {
      // Create test items
      await Inventory.create(sampleItem);
      await Inventory.create({
        ...sampleItem,
        serialNumber: 'TEST456',
        type: 'Desktop'
      });

      const response = await request(app)
        .get('/api/inventory');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });

    it('should return empty array when no items exist', async () => {
      const response = await request(app)
        .get('/api/inventory');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });
  });

  describe('PUT /api/inventory/:id', () => {
    it('should update an existing item', async () => {
      // Create an item
      const createResponse = await request(app)
        .post('/api/inventory')
        .send(sampleItem);

      const updateResponse = await request(app)
        .put(`/api/inventory/${createResponse.body._id}`)
        .send({
          ...sampleItem,
          owner: 'New Owner'
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.owner).toBe('New Owner');
    });

    it('should reject update with duplicate serial number', async () => {
      // Create first item
      await request(app)
        .post('/api/inventory')
        .send(sampleItem);

      // Create second item
      const secondItem = await request(app)
        .post('/api/inventory')
        .send({
          ...sampleItem,
          serialNumber: 'TEST456'
        });

      // Try to update second item with first item's serial number
      const updateResponse = await request(app)
        .put(`/api/inventory/${secondItem.body._id}`)
        .send({
          ...sampleItem,
          serialNumber: 'TEST123'
        });

      expect(updateResponse.status).toBe(400);
      expect(updateResponse.body.message).toContain('already exists');
    });

    it('should handle non-existent item', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/inventory/${nonExistentId}`)
        .send(sampleItem);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('not found');
    });

    it('should handle invalid ObjectId', async () => {
      const response = await request(app)
        .put('/api/inventory/invalid-id')
        .send(sampleItem);

      expect(response.status).toBe(500);
    });
  });
}); 