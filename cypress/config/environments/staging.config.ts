/**
 * Staging Environment Configuration
 * @description Cypress configuration for staging/pre-production environment
 */
const { defineConfig } = require('cypress');
import baseConfig from '../../../cypress.config.js';

export default defineConfig({
  ...baseConfig,

  e2e: {
    ...baseConfig.e2e,

    // Staging base URL
    baseUrl: process.env.CYPRESS_STAGING_URL || 'https://staging.example.com',

    /**
     * Setup Node Events - inherits from base config
     */
    setupNodeEvents(on, config) {
      // Call base setupNodeEvents
      config = baseConfig.e2e.setupNodeEvents(on, config);

      // Override environment-specific settings
      config.env = {
        ...config.env,
        environment: 'staging',
        apiUrl: process.env.CYPRESS_STAGING_API_URL || 'https://api.staging.example.com',
        enableMocking: false,
      };

      return config;
    },
  },

  // Staging-specific settings
  env: {
    ...baseConfig.env,
    environment: 'staging',
    apiUrl: process.env.CYPRESS_STAGING_API_URL || 'https://api.staging.example.com',
    enableMocking: false,
  },

  // Production-like timeouts
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 60000,

  // Enable video for evidence
  video: true,

  // Production-like retries
  retries: {
    runMode: 2,
    openMode: 0,
  },
});
