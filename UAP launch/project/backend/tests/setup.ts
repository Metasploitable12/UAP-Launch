import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.HMAC_SECRET = 'test-secret-key-for-testing-only';
process.env.LOG_LEVEL = 'error'; // Reduce noise during tests

// Global test setup
beforeAll(() => {
  // Any global setup for all tests
});

afterAll(() => {
  // Any global cleanup
});