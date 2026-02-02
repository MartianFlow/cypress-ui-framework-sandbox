/**
 * Production Environment Configuration
 * @description Cypress configuration for production environment (read-only tests)
 * @warning Only run smoke tests and read-only validations in production
 */
const { defineConfig } = require('cypress');
import baseConfig from '../../../cypress.config.js';

export default defineConfig({
  ...baseConfig,

  e2e: {
    ...baseConfig.e2e,

    // Production base URL
    baseUrl: process.env.CYPRESS_PROD_URL || 'https://www.example.com',

    // Only run smoke tests in production
    specPattern: 'cypress/e2e/smoke/**/*.cy.js',

    /**
     * Setup Node Events - inherits from base config
     */
    setupNodeEvents(on, config) {
      // Call base setupNodeEvents
      config = baseConfig.e2e.setupNodeEvents(on, config);

      // Override environment-specific settings
      config.env = {
        ...config.env,
        environment: 'prod',
        apiUrl: process.env.CYPRESS_PROD_API_URL || 'https://api.example.com',
        enableMocking: false,
        // Production safety flag
        isProduction: true,
      };

      return config;
    },
  },

  // Production-specific settings
  env: {
    ...baseConfig.env,
    environment: 'prod',
    apiUrl: process.env.CYPRESS_PROD_API_URL || 'https://api.example.com',
    enableMocking: false,
    isProduction: true,
  },

  // Strict timeouts for production
  defaultCommandTimeout: 8000,
  pageLoadTimeout: 45000,

  // Disable video in production for performance
  video: false,

  // Higher retries for production stability
  retries: {
    runMode: 3,
    openMode: 0,
  },
});
