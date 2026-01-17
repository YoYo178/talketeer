/**
 * Test Configuration File
 * This file is loaded by vitest before tests run
 * It sets up environment variables needed for testing
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.ACCESS_TOKEN_SECRET = 'test-access-token-secret-key-12345';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-token-secret-key-12345';
process.env.MONGODB_URI = 'mongodb://localhost:27017/talketeer-test';
process.env.PORT = '3001';
process.env.HOST = 'localhost';
process.env.FRONTEND_ORIGIN = 'http://localhost:5173';
process.env.APP_NAME = 'Talketeer-Test';

// Tenor API config (required by ENV.ts)
process.env.TENOR_API_BASE_URL = 'https://tenor.googleapis.com/v2';
process.env.TENOR_API_KEY = 'test-tenor-api-key';
process.env.TENOR_API_CLIENT_KEY = 'test-tenor-client-key';

// SMTP config (required by ENV.ts)
process.env.SMTP_PROVIDER = 'gmail';
process.env.SMTP_EMAIL = 'test@example.com';
process.env.SMTP_PASS = 'test-smtp-password';
