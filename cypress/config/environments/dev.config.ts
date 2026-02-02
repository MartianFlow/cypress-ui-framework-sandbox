/**
 * Development Environment Configuration
 * @description Cypress configuration for local e-commerce development environment
 */
const { defineConfig } = require('cypress');
import baseConfig from '../../../cypress.config.js';

export default defineConfig({
  ...baseConfig,

  e2e: {
    ...baseConfig.e2e,

    // Local development base URL
    baseUrl: process.env.CYPRESS_DEV_URL || 'http://localhost:5173',

    /**
     * Setup Node Events - inherits from base config
     */
    setupNodeEvents(on, config) {
      // Call base setupNodeEvents
      config = baseConfig.e2e.setupNodeEvents(on, config);

      // Override environment-specific settings
      config.env = {
        ...config.env,
        environment: 'dev',
        apiUrl: process.env.CYPRESS_DEV_API_URL || 'http://localhost:3001/api/v1',
        enableMocking: false,
        // Test user credentials (from seed data)
        testUserEmail: 'testuser@example.com',
        testUserPassword: 'Test@123456',
        adminUserEmail: 'admin@example.com',
        adminUserPassword: 'Admin@123456',
      };

      return config;
    },
  },

  // Development-specific settings
  env: {
    ...baseConfig.env,
    environment: 'dev',
    apiUrl: process.env.CYPRESS_DEV_API_URL || 'http://localhost:3001/api/v1',
    enableMocking: false,
    // Test user credentials (from seed data)
    testUserEmail: 'testuser@example.com',
    testUserPassword: 'Test@123456',
    adminUserEmail: 'admin@example.com',
    adminUserPassword: 'Admin@123456',
  },

  // More lenient timeouts for development
  defaultCommandTimeout: 15000,
  pageLoadTimeout: 90000,

  // Enable video for debugging
  video: true,

  // No retries in development for faster feedback
  retries: {
    runMode: 0,
    openMode: 0,
  },
});
