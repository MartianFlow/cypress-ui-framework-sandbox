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
    return this;
  }

  /**
   * Search orders
   * @param {string} query - Search query
   * @returns {OrdersPage} This page instance for chaining
   */
  searchOrders(query) {
    this.searchInput.clear().type(query);
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
