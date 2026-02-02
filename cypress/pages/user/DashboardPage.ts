/**
 * DashboardPage - Page Object for User Dashboard
 * @description Handles all dashboard page interactions and verifications
 * @extends BasePage
 */
import BasePage from '../base/BasePage';
const { DASHBOARD } = require('../../utils/constants/selectors');
const { APP } = require('../../utils/constants/routes');

class DashboardPage extends BasePage {
  /**
   * Creates a DashboardPage instance
   */
  constructor() {
    super(APP.DASHBOARD.HOME);
    this.selectors = DASHBOARD;
  }

  // =================================
  // Page Elements
  // =================================

  get dashboardPage() {
    return cy.get(this.selectors.PAGE);
  }

  get welcomeMessage() {
    return cy.get(this.selectors.WELCOME_MESSAGE);
  }

  get statsCards() {
    return cy.get(this.selectors.STATS_CARD);
  }

  get activityFeed() {
    return cy.get(this.selectors.ACTIVITY_FEED);
  }

  get quickActions() {
    return cy.get(this.selectors.QUICK_ACTIONS);
  }

  get widgets() {
    return cy.get(this.selectors.WIDGET);
  }

  get chart() {
    return cy.get(this.selectors.CHART);
  }

  // =================================
  // Action Methods
  // =================================

  /**
   * Click on a stats card
   * @param {number} index - Stats card index
   * @returns {DashboardPage} This page instance for chaining
   */
  clickStatsCard(index) {
    this.statsCards.eq(index).click();
    return this;
  }

  /**
   * Click on a quick action
   * @param {string} actionName - Action name
   * @returns {DashboardPage} This page instance for chaining
   */
  clickQuickAction(actionName) {
    this.quickActions.contains(actionName).click();
    return this;
  }

  /**
   * Refresh dashboard data
   * @returns {DashboardPage} This page instance for chaining
   */
  refresh() {
    cy.get('[data-testid="refresh-dashboard"]').click();
    return this;
  }

  // =================================
  // Verification Methods
  // =================================

  /**
   * Verify page is loaded
   * @returns {DashboardPage} This page instance for chaining
   */
  verifyPageLoaded() {
    this.verifyUrl('/dashboard');
    this.dashboardPage.should('be.visible');
    return this;
  }

  /**
   * Verify welcome message
   * @param {string} [userName] - Expected user name in message
   * @returns {DashboardPage} This page instance for chaining
   */
  verifyWelcomeMessage(userName) {
    this.welcomeMessage.should('be.visible');
    if (userName) {
      this.welcomeMessage.should('contain.text', userName);
    }
    return this;
  }

  /**
   * Verify stats cards are displayed
   * @param {number} [expectedCount] - Expected number of stats cards
   * @returns {DashboardPage} This page instance for chaining
   */
  verifyStatsCardsDisplayed(expectedCount) {
    if (expectedCount !== undefined) {
      this.statsCards.should('have.length', expectedCount);
    } else {
      this.statsCards.should('have.length.at.least', 1);
    }
    return this;
  }

  /**
   * Verify stats card value
   * @param {number} index - Stats card index
   * @param {Object} expectedData - Expected data
   * @returns {DashboardPage} This page instance for chaining
   */
  verifyStatsCard(index, expectedData) {
    const card = this.statsCards.eq(index);

    if (expectedData.title) {
      card.should('contain.text', expectedData.title);
    }
    if (expectedData.value) {
      card.should('contain.text', expectedData.value);
    }

    return this;
  }

  /**
   * Verify activity feed is displayed
   * @returns {DashboardPage} This page instance for chaining
   */
  verifyActivityFeedDisplayed() {
    this.activityFeed.should('be.visible');
    return this;
  }

  /**
   * Verify quick actions are available
   * @param {string[]} expectedActions - Expected action names
   * @returns {DashboardPage} This page instance for chaining
   */
  verifyQuickActionsAvailable(expectedActions) {
    expectedActions.forEach((action) => {
      this.quickActions.should('contain.text', action);
    });
    return this;
  }

  /**
   * Verify user is logged in on dashboard
   * @returns {DashboardPage} This page instance for chaining
   */
  verifyUserLoggedIn() {
    this.dashboardPage.should('be.visible');
    cy.url().should('include', '/dashboard');
    return this;
  }

  /**
   * Get stats card count
   * @returns {Cypress.Chainable<number>} Stats card count
   */
  getStatsCardCount() {
    return this.statsCards.its('length');
  }

  // =================================
  // API Interception Methods
  // =================================

  /**
   * Intercept dashboard data request
   * @param {string} [alias='getDashboard'] - Intercept alias
   * @returns {DashboardPage} This page instance for chaining
   */
  interceptDashboardRequest(alias = 'getDashboard') {
    cy.intercept('GET', '**/dashboard*').as(alias);
    return this;
  }

  /**
   * Intercept user stats request
   * @param {string} [alias='getStats'] - Intercept alias
   * @returns {DashboardPage} This page instance for chaining
   */
  interceptStatsRequest(alias = 'getStats') {
    cy.intercept('GET', '**/users/*/stats').as(alias);
    return this;
  }

  /**
   * Mock dashboard data
   * @param {Object} dashboardData - Dashboard data
   * @param {string} [alias='getDashboard'] - Intercept alias
   * @returns {DashboardPage} This page instance for chaining
   */
  mockDashboardData(dashboardData, alias = 'getDashboard') {
    cy.intercept('GET', '**/dashboard*', {
      statusCode: 200,
      body: {
        success: true,
        data: dashboardData,
      },
    }).as(alias);
    return this;
  }

  /**
   * Wait for dashboard request
   * @param {string} [alias='getDashboard'] - Intercept alias
   * @returns {Cypress.Chainable} Intercepted request
   */
  waitForDashboardRequest(alias = 'getDashboard') {
    return cy.wait(`@${alias}`);
  }
}

export default DashboardPage;
