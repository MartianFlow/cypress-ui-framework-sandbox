/**
 * OrdersPage - Page Object for Orders listing
 * @description Handles all orders page interactions and verifications
 * @extends BasePage
 */
import BasePage from '../base/BasePage';
const { ORDERS } = require('../../utils/constants/selectors');
const { APP } = require('../../utils/constants/routes');

class OrdersPage extends BasePage {
  /**
   * Creates an OrdersPage instance
   */
  constructor() {
    super(APP.ORDERS.LIST);
    this.selectors = ORDERS;
  }

  // =================================
  // Page Elements
  // =================================

  get ordersPage() {
    return cy.get(this.selectors.PAGE);
  }

  get ordersList() {
    return cy.get(this.selectors.LIST);
  }

  get orderItems() {
    return cy.get(this.selectors.ITEM);
  }

  get emptyState() {
    return cy.get(this.selectors.EMPTY_STATE);
  }

  get statusFilter() {
    return cy.get(this.selectors.FILTERS.STATUS);
  }

  get searchInput() {
    return cy.get(this.selectors.FILTERS.SEARCH);
  }

  // =================================
  // Order Item Methods
  // =================================

  /**
   * Get order by index
   * @param {number} index - Order index (0-based)
   * @returns {Cypress.Chainable} Order item element
   */
  getOrder(index) {
    return this.orderItems.eq(index);
  }

  /**
   * Get order by order number
   * @param {string} orderNumber - Order number
   * @returns {Cypress.Chainable} Order item element
   */
  getOrderByNumber(orderNumber) {
    return cy.contains(this.selectors.ITEM, orderNumber);
  }

  // =================================
  // Action Methods
  // =================================

  /**
   * Filter orders by status
   * @param {string} status - Order status
   * @returns {OrdersPage} This page instance for chaining
   */
  filterByStatus(status) {
    this.statusFilter.select(status);
    cy.wait(500); // Wait for filter to apply
    return this;
  }

  /**
   * Search orders
   * @param {string} query - Search query
   * @returns {OrdersPage} This page instance for chaining
   */
  searchOrders(query) {
    this.searchInput.clear().type(query);
    cy.wait(500); // Wait for search to apply
    return this;
  }

  /**
   * Filter by date range
   * @param {string} fromDate - Start date
   * @param {string} toDate - End date
   * @returns {OrdersPage} This page instance for chaining
   */
  filterByDateRange(fromDate, toDate) {
    // In a real implementation, this would interact with date picker components
    // For now, we'll just return this
    return this;
  }

  /**
   * Clear all filters
   * @returns {OrdersPage} This page instance for chaining
   */
  clearFilters() {
    cy.get('[data-testid="clear-filters"]').click();
    cy.wait(500); // Wait for filters to clear
    return this;
  }

  /**
   * Sort orders
   * @param {string} sortOption - Sort option (date-desc, date-asc, total-desc, total-asc)
   * @returns {OrdersPage} This page instance for chaining
   */
  sortBy(sortOption) {
    cy.get('[data-testid="sort-select"]').select(sortOption);
    cy.wait(500); // Wait for sort to apply
    return this;
  }

  /**
   * Get order by status
   * @param {string} status - Order status
   * @returns {Cypress.Chainable} Order elements with that status
   */
  getOrderByStatus(status) {
    return cy.get(`[data-testid="order-status"]:contains("${status}")`).parent().parent();
  }

  /**
   * Click view order button
   * @param {number} index - Order index
   * @returns {OrdersPage} This page instance for chaining
   */
  clickViewOrder(index) {
    this.orderItems.eq(index).find('[data-testid="view-order-details"]').click();
    return this;
  }

  /**
   * Get empty state element
   * @returns {Cypress.Chainable} Empty state element
   */
  verifyEmptyState() {
    cy.get('[data-testid="orders-empty"]').should('be.visible');
    return this;
  }

  /**
   * Get shop now button
   * @returns {Cypress.Chainable} Shop now button element
   */
  get shopNowButton() {
    return cy.get('[data-testid="shop-now-button"]');
  }

  /**
   * Click shop now button
   * @returns {OrdersPage} This page instance for chaining
   */
  clickShopNow() {
    this.shopNowButton.click();
    return this;
  }

  /**
   * Get pagination element
   * @returns {Cypress.Chainable} Pagination element
   */
  get pagination() {
    return cy.get('[data-testid="table-pagination"]');
  }

  /**
   * Go to next page
   * @returns {OrdersPage} This page instance for chaining
   */
  goToNextPage() {
    cy.get('[data-testid="next-page"]').click();
    cy.wait(500); // Wait for page to load
    return this;
  }

  /**
   * Go to specific page
   * @param {number} page - Page number
   * @returns {OrdersPage} This page instance for chaining
   */
  goToPage(page) {
    cy.get(`[data-testid="page-${page}"]`).click();
    cy.wait(500); // Wait for page to load
    return this;
  }

  /**
   * View order details by index
   * @param {number} index - Order index
   * @returns {OrdersPage} This page instance for chaining
   */
  viewOrderDetails(index) {
    this.getOrder(index).find(this.selectors.VIEW_DETAILS).click();
    return this;
  }

  /**
   * View order details by order number
   * @param {string} orderNumber - Order number
   * @returns {OrdersPage} This page instance for chaining
   */
  viewOrderDetailsByNumber(orderNumber) {
    this.getOrderByNumber(orderNumber).find(this.selectors.VIEW_DETAILS).click();
    return this;
  }

  /**
   * Click on an order to view details
   * @param {number} index - Order index
   * @returns {OrdersPage} This page instance for chaining
   */
  clickOrder(index) {
    this.getOrder(index).click();
    return this;
  }

  // =================================
  // Verification Methods
  // =================================

  /**
   * Verify page is loaded
   * @returns {OrdersPage} This page instance for chaining
   */
  verifyPageLoaded() {
    this.verifyUrl('/orders');
    this.ordersPage.should('be.visible');
    return this;
  }

  /**
   * Verify no orders
   * @returns {OrdersPage} This page instance for chaining
   */
  verifyNoOrders() {
    this.emptyState.should('be.visible');
    return this;
  }

  /**
   * Verify orders are displayed
   * @param {number} [expectedCount] - Expected order count
   * @returns {OrdersPage} This page instance for chaining
   */
  verifyOrdersDisplayed(expectedCount) {
    if (expectedCount !== undefined) {
      this.orderItems.should('have.length', expectedCount);
    } else {
      this.orderItems.should('have.length.at.least', 1);
    }
    return this;
  }

  /**
   * Verify order details
   * @param {number} index - Order index
   * @param {Object} expectedData - Expected order data
   * @returns {OrdersPage} This page instance for chaining
   */
  verifyOrderItem(index, expectedData) {
    const order = this.getOrder(index);

    if (expectedData.orderNumber) {
      order.find(this.selectors.ORDER_NUMBER).should('contain.text', expectedData.orderNumber);
    }
    if (expectedData.status) {
      order.find(this.selectors.ORDER_STATUS).should('contain.text', expectedData.status);
    }
    if (expectedData.total) {
      order.find(this.selectors.ORDER_TOTAL).should('contain.text', expectedData.total);
    }
    if (expectedData.date) {
      order.find(this.selectors.ORDER_DATE).should('contain.text', expectedData.date);
    }

    return this;
  }

  /**
   * Verify order exists with number
   * @param {string} orderNumber - Order number
   * @returns {OrdersPage} This page instance for chaining
   */
  verifyOrderExists(orderNumber) {
    this.getOrderByNumber(orderNumber).should('exist');
    return this;
  }

  /**
   * Get order count
   * @returns {Cypress.Chainable<number>} Order count
   */
  getOrderCount() {
    return this.orderItems.its('length');
  }

  // =================================
  // API Interception Methods
  // =================================

  /**
   * Intercept get orders request
   * @param {string} [alias='getOrders'] - Intercept alias
   * @returns {OrdersPage} This page instance for chaining
   */
  interceptGetOrdersRequest(alias = 'getOrders') {
    cy.intercept('GET', '**/orders').as(alias);
    return this;
  }

  /**
   * Mock orders response
   * @param {Array} orders - Orders array
   * @param {string} [alias='getOrders'] - Intercept alias
   * @returns {OrdersPage} This page instance for chaining
   */
  mockOrders(orders, alias = 'getOrders') {
    cy.intercept('GET', '**/orders', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          data: orders,
          pagination: {
            page: 1,
            pageSize: 10,
            total: orders.length,
            totalPages: 1,
          },
        },
      },
    }).as(alias);
    return this;
  }

  /**
   * Mock empty orders
   * @param {string} [alias='getOrders'] - Intercept alias
   * @returns {OrdersPage} This page instance for chaining
   */
  mockEmptyOrders(alias = 'getOrders') {
    cy.intercept('GET', '**/orders', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          data: [],
          pagination: {
            page: 1,
            pageSize: 10,
            total: 0,
            totalPages: 0,
          },
        },
      },
    }).as(alias);
    return this;
  }

  /**
   * Wait for orders request
   * @param {string} [alias='getOrders'] - Intercept alias
   * @returns {Cypress.Chainable} Intercepted request
   */
  waitForOrdersRequest(alias = 'getOrders') {
    return cy.wait(`@${alias}`);
  }
}

export default OrdersPage;
