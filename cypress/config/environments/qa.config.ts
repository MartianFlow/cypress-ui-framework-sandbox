/**
 * QA Environment Configuration
 * @description Cypress configuration for QA/Testing environment
 */
const { defineConfig } = require('cypress');
import baseConfig from '../../../cypress.config.js';

export default defineConfig({
  ...baseConfig,

  e2e: {
    ...baseConfig.e2e,

    // QA base URL
    baseUrl: process.env.CYPRESS_QA_URL || 'https://qa.example.com',

    /**
     * Setup Node Events - inherits from base config
     */
    setupNodeEvents(on, config) {
      // Call base setupNodeEvents
      config = baseConfig.e2e.setupNodeEvents(on, config);

      // Override environment-specific settings
      config.env = {
        ...config.env,
        environment: 'qa',
        apiUrl: process.env.CYPRESS_QA_API_URL || 'https://api.qa.example.com',
        enableMocking: false,
      };

      return config;
    },
  },

  // QA-specific settings
  env: {
    ...baseConfig.env,
    environment: 'qa',
    apiUrl: process.env.CYPRESS_QA_API_URL || 'https://api.qa.example.com',
    enableMocking: false,
  },

  // Standard timeouts for QA
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 60000,

  // Enable video for test evidence
  video: true,

  // Moderate retries for flaky test detection
  retries: {
    runMode: 1,
    openMode: 0,
  },
});
