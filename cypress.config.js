/**
 * Cypress Configuration - Main Entry Point
 * @description Central configuration hub for Cypress UI Framework
 * @see https://docs.cypress.io/guides/references/configuration
 */
const { defineConfig } = require('cypress');
const fix = require('cypress-on-fix');
const allureWriter = require('@shelex/cypress-allure-plugin/writer');

// Load environment variables
require('dotenv').config();

module.exports = defineConfig({
  // =================================
  // Project Settings
  // =================================
  projectId: process.env.CYPRESS_PROJECT_ID || 'cypress-ui-framework',

  // =================================
  // Viewport Configuration
  // =================================
  viewportWidth: 1920,
  viewportHeight: 1080,

  // =================================
  // Timeouts
  // =================================
  defaultCommandTimeout: parseInt(process.env.CYPRESS_DEFAULT_COMMAND_TIMEOUT) || 5000,
  pageLoadTimeout: parseInt(process.env.CYPRESS_PAGE_LOAD_TIMEOUT) || 5000,
  requestTimeout: parseInt(process.env.CYPRESS_REQUEST_TIMEOUT) || 5000,
  responseTimeout: 5000,
  execTimeout: 5000,
  taskTimeout: 5000,

  // =================================
  // Network Settings
  // =================================
  numTestsKeptInMemory: 0,
  watchForFileChanges: false,

  // =================================
  // Retries Configuration
  // =================================
  retries: {
    runMode: 2,
    openMode: 1,
  },

  // =================================
  // Video & Screenshots
  // =================================
  video: process.env.CYPRESS_ENABLE_VIDEO !== 'false',
  videoCompression: 32,
  screenshotOnRunFailure: true,
  screenshotsFolder: 'cypress/screenshots',
  videosFolder: 'cypress/videos',
  trashAssetsBeforeRuns: true,

  // =================================
  // Browser Configuration
  // =================================
  chromeWebSecurity: false,
  modifyObstructiveCode: false,

  // =================================
  // Experimental Features
  // =================================
  experimentalModifyObstructiveThirdPartyCode: true,
  experimentalMemoryManagement: true,

  // =================================
  // Reporter Configuration
  // =================================
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/reports/mochawesome',
    overwrite: false,
    html: false,
    json: true,
    timestamp: 'mmddyyyy_HHMMss',
    charts: true,
    reportPageTitle: 'Cypress Test Report',
    embeddedScreenshots: true,
    inlineAssets: true,
  },

  // =================================
  // Environment Variables
  // =================================
  env: {
    // Environment
    environment: process.env.CYPRESS_ENV || 'dev',

    // API Configuration
    apiUrl: process.env.CYPRESS_API_URL || 'http://localhost:3000/api/v1',

    // Allure Configuration
    allure: true,
    allureReuseAfterSpec: true,
    allureResultsPath: process.env.ALLURE_RESULTS_PATH || 'cypress/reports/allure-results',

    // Grep Configuration (cy-grep)
    grepFilterSpecs: true,
    grepOmitFiltered: true,

    // Test Data
    testUserEmail: process.env.CYPRESS_TEST_USER_EMAIL,
    testUserPassword: process.env.CYPRESS_TEST_USER_PASSWORD,
    adminUserEmail: process.env.CYPRESS_ADMIN_USER_EMAIL,
    adminUserPassword: process.env.CYPRESS_ADMIN_USER_PASSWORD,

    // Feature Flags
    enableMocking: false,
  },

  // =================================
  // E2E Test Configuration
  // =================================
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:5173',
    specPattern: 'cypress/e2e/**/*.cy.{js,ts}',
    supportFile: 'cypress/support/e2e.ts',
    fixturesFolder: 'cypress/fixtures',
    downloadsFolder: 'cypress/downloads',

    // Test isolation
    testIsolation: true,

    /**
     * Setup Node Events
     * @param {Cypress.PluginEvents} on - Event listener
     * @param {Cypress.PluginConfigOptions} config - Configuration options
     * @returns {Cypress.PluginConfigOptions} Modified configuration
     */
    setupNodeEvents(on, config) {
      // Fix for multiple plugin compatibility
      on = fix(on);

      // Allure reporter setup
      allureWriter(on, config);

      // Grep plugin setup
      // require('@bahmutov/cy-grep/src/plugin')(config);

      // Custom task for logging
      on('task', {
        /**
         * Log message to Node console
         * @param {string} message - Message to log
         * @returns {null}
         */
        log(message) {
          console.log(message);
          return null;
        },

        /**
         * Log table data to Node console
         * @param {Array|Object} data - Data to display as table
         * @returns {null}
         */
        table(data) {
          console.table(data);
          return null;
        },

        /**
         * Clear specific test data
         * @param {Object} options - Clear options
         * @returns {null}
         */
        clearTestData(options) {
          console.log('Clearing test data:', options);
          return null;
        },
      });

      // Before browser launch - configure browser
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium' && browser.name !== 'electron') {
          // Disable GPU for CI environments
          launchOptions.args.push('--disable-gpu');
          // Increase shared memory for Docker
          launchOptions.args.push('--disable-dev-shm-usage');
          // Disable extensions
          launchOptions.args.push('--disable-extensions');
        }

        if (browser.family === 'firefox') {
          // Firefox specific settings
          launchOptions.preferences['ui.prefersReducedMotion'] = 1;
        }

        return launchOptions;
      });

      // After spec - cleanup
      on('after:spec', (spec, results) => {
        if (results && results.stats.failures === 0 && results.video) {
          // Delete video if no failures (optional)
          // const fs = require('fs');
          // fs.unlinkSync(results.video);
        }
      });

      return config;
    },
  },
});
