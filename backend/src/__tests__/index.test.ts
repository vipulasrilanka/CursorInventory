import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as dotenv from 'dotenv';
import { startServer } from '../index';
import { AddressInfo } from 'net';

// Mock console methods
console.error = vi.fn();
console.log = vi.fn();

// Mock express with partial mocking
vi.mock('express', async () => {
  const mockRouter = {
    use: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn()
  };

  const mockApp = {
    use: vi.fn(),
    listen: vi.fn((port, callback) => {
      callback();
      return {
        close: vi.fn(),
        address: () => ({ port }),
      };
    })
  };

  const mockJson = vi.fn(() => vi.fn());

  const actual = await vi.importActual('express');
  return {
    ...actual,
    default: Object.assign(vi.fn(() => mockApp), {
      json: mockJson,
      Router: vi.fn(() => mockRouter)
    })
  };
});

// Mock cors
vi.mock('cors', () => ({
  default: vi.fn(() => vi.fn())
}));

// Mock mongoose to handle model compilation
vi.mock('mongoose', () => {
  const mockSchema = {
    index: vi.fn().mockReturnThis(),
  };

  const mockModel = {
    find: vi.fn(),
    findOne: vi.fn(),
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
    findByIdAndDelete: vi.fn(),
  };

  return {
    default: {
      connect: vi.fn(),
      disconnect: vi.fn(),
      connection: {
        close: vi.fn(),
        readyState: 0,
      },
      Schema: vi.fn().mockImplementation(() => mockSchema),
      model: vi.fn().mockReturnValue(mockModel),
      models: {},
      Types: {
        ObjectId: vi.fn(),
      },
    },
  };
});

describe('Server Setup', () => {
  let mongoServer: MongoMemoryServer;
  let originalEnv: NodeJS.ProcessEnv;

  beforeAll(() => {
    originalEnv = { ...process.env };
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules();

    // Disconnect from any existing connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // Create a new MongoDB memory server for each test
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = await mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
  });

  afterEach(async () => {
    if (mongoServer) {
      await mongoServer.stop();
    }
    await mongoose.disconnect();
  });

  afterAll(async () => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  it('should connect to MongoDB successfully', async () => {
    // Mock successful connection
    (mongoose as any).connect.mockResolvedValueOnce(undefined);
    
    const server = await startServer();
    expect(mongoose.connect).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Connected to MongoDB');
    await server.close();
  }, 15000);

  it('should handle MongoDB connection error', async () => {
    // Mock connection failure
    const mockError = new Error('Connection failed');
    (mongoose as any).connect.mockRejectedValueOnce(mockError);

    try {
      await startServer();
    } catch (error) {
      expect(error).toBe(mockError);
      expect(console.error).toHaveBeenCalledWith('MongoDB connection error:', mockError);
      return;
    }
    throw new Error('Expected MongoDB connection to fail');
  }, 15000);

  it('should use default port when PORT env variable is not set', async () => {
    // Mock successful connection
    (mongoose as any).connect.mockResolvedValueOnce(undefined);
    
    delete process.env.PORT;
    const server = await startServer();
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('Invalid server address');
    }
    expect(address.port).toBe(3000);
    await server.close();
  }, 20000);

  it('should use custom port from PORT env variable', async () => {
    // Mock successful connection
    (mongoose as any).connect.mockResolvedValueOnce(undefined);
    
    process.env.PORT = '4000';
    const server = await startServer();
    const address = server.address();
    if (!address || typeof address === 'string') {
      throw new Error('Invalid server address');
    }
    expect(address.port).toBe(4000);
    await server.close();
    delete process.env.PORT;
  }, 15000);
}); 