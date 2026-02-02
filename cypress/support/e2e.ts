/// <reference types="./cypress" />

/**
 * Cypress E2E Support File - Entry Point
 * @description Main entry point for Cypress support configuration
 * @see https://on.cypress.io/configuration
 */

// =================================
// Import Custom Commands
// =================================
import './commands/auth.commands';
import './commands/ui.commands';
import './commands/api.commands';

// =================================
// Import Plugins
// =================================
import 'cypress-real-events';
import '@shelex/cypress-allure-plugin';
import '@bahmutov/cy-grep';

// =================================
// Global Configuration
// =================================

/**
 * Disable uncaught exception failures
 * Prevents tests from failing on application errors
 */
Cypress.on('uncaught:exception', (err, runnable) => {
  // Log the error for debugging
  cy.log(`Uncaught Exception: ${err.message}`);

  // Return false to prevent the error from failing the test
  // You can add specific error handling here
  if (err.message.includes('ResizeObserver loop')) {
    return false;
  }

  // For other errors, you might want to fail the test
  // return true; // uncomment to fail on uncaught exceptions

  return false;
});

/**
 * Log failed commands for debugging
 */
Cypress.on('fail', (error, runnable) => {
  // Log additional context on failure
  cy.log(`Test Failed: ${runnable.title}`);
  cy.log(`Error: ${error.message}`);

  // Re-throw the error to fail the test
  throw error;
});

// =================================
// Before Each Test Hook
// =================================

beforeEach(() => {
  // Log test start
  cy.log(`Starting test: ${Cypress.currentTest.title}`);

  // Clear any previous intercepts
  cy.intercept('**', (req) => {
    req.continue();
  });
});

// =================================
// After Each Test Hook
// =================================

afterEach(function () {
  // Log test result
  const testState = this.currentTest?.state || 'unknown';
  cy.log(`Test completed with state: ${testState}`);

  // Take screenshot on failure (handled by Cypress config, but can customize here)
  if (testState === 'failed') {
    // Additional failure handling can go here
  }
});

// =================================
// Custom Assertions
// =================================

/**
 * Custom chai assertion for checking element visibility
 */
chai.Assertion.addMethod('beFullyVisible', function () {
  const $element = this._obj;

  this.assert(
    $element.is(':visible') && $element.css('opacity') !== '0',
    'expected #{this} to be fully visible',
    'expected #{this} not to be fully visible'
  );
});

/**
 * Custom chai assertion for checking element in viewport
 */
chai.Assertion.addMethod('beInViewport', function () {
  const $element = this._obj;

  const rect = $element[0].getBoundingClientRect();
  const windowHeight = Cypress.config('viewportHeight');
  const windowWidth = Cypress.config('viewportWidth');

  const isInViewport =
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= windowHeight &&
    rect.right <= windowWidth;

  this.assert(
    isInViewport,
    'expected #{this} to be in viewport',
    'expected #{this} not to be in viewport'
  );
});

// =================================
// Environment-Specific Setup
// =================================

/**
 * Setup based on environment
 */
const setupEnvironment = () => {
  const environment = Cypress.env('environment');

  switch (environment) {
    case 'dev':
      // Development-specific setup
      Cypress.config('defaultCommandTimeout', 15000);
      break;

    case 'qa':
      // QA-specific setup
      break;

    case 'staging':
      // Staging-specific setup
      break;

    case 'prod':
      // Production-specific setup (read-only tests)
      Cypress.config('defaultCommandTimeout', 8000);
      break;

    default:
      // Default setup
      break;
  }
};

// Run environment setup
setupEnvironment();

// =================================
// Allure Reporter Configuration
// =================================

/**
 * Configure Allure labels for better reporting
 * Note: Allure labels can be added within tests using:
 * cy.allure().label('environment', 'dev');
 */
// Allure event hooks are configured in cypress.config.js

// =================================
// Accessibility Testing Setup (Optional)
// =================================

/**
 * Add accessibility testing command if needed
 * Uncomment and install cypress-axe if accessibility testing is required
 */
// import 'cypress-axe';
// Cypress.Commands.add('checkA11y', (context, options) => {
//   cy.injectAxe();
//   cy.checkA11y(context, options);
// });

// =================================
// Console Log Capture
// =================================

/**
 * Capture browser console logs for debugging
 */
Cypress.on('window:before:load', (win) => {
  // Store original console methods
  const originalLog = win.console.log;
  const originalError = win.console.error;
  const originalWarn = win.console.warn;

  // Override console.error to capture errors
  win.console.error = (...args) => {
    originalError.apply(win.console, args);
    // Optionally log to Cypress
    // cy.task('log', `Console Error: ${args.join(' ')}`);
  };

  // Override console.warn to capture warnings
  win.console.warn = (...args) => {
    originalWarn.apply(win.console, args);
    // Optionally log to Cypress
    // cy.task('log', `Console Warn: ${args.join(' ')}`);
  };
});

// =================================
// Global Utilities
// =================================

/**
 * Add global test utilities
 */
Cypress.testUtils = {
  /**
   * Generate random string
   * @param {number} length - String length
   * @returns {string} Random string
   */
  randomString: (length = 10) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  /**
   * Generate random email
   * @param {string} domain - Email domain
   * @returns {string} Random email
   */
  randomEmail: (domain = 'test.com') => {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 5)}@${domain}`;
  },

  /**
   * Generate random number
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   */
  randomNumber: (min = 1, max = 1000) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Format date
   * @param {Date} date - Date object
   * @param {string} format - Date format
   * @returns {string} Formatted date
   */
  formatDate: (date = new Date(), format = 'YYYY-MM-DD') => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  },
};

// =================================
// Export for external use
// =================================

export {};
