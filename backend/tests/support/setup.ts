/**
 * Vitest Test Setup File
 * This file runs before all tests
 */

import { vi } from 'vitest';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.ACCESS_TOKEN_SECRET = 'test-access-token-secret-key-12345';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-token-secret-key-12345';
process.env.MONGODB_URI = 'mongodb://localhost:27017/talketeer-test';
process.env.PORT = '3001';
process.env.HOST = 'localhost';
process.env.FRONTEND_ORIGIN = 'http://localhost:5173';
process.env.APP_NAME = 'Talketeer-Test';

// Mock the logger to prevent console output during tests
vi.mock('@src/utils/logger.utils', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
}));
