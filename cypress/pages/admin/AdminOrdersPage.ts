/**
 * AdminOrdersPage - Page Object for Admin Orders Management
 * @description Handles all admin orders page interactions and verifications
 * @extends BasePage
 */
import BasePage from '../base/BasePage';
const { ADMIN, TABLE } = require('../../utils/constants/selectors');
const { APP } = require('../../utils/constants/routes');

class AdminOrdersPage extends BasePage {
  /**
   * Creates an AdminOrdersPage instance
   */
  constructor() {
    super(APP.ADMIN.ORDERS);
    this.selectors = ADMIN.ORDERS;
    this.tableSelectors = TABLE;
  }

  // =================================
  // Page Elements
  // =================================

  get ordersPage() {
    return cy.get(this.selectors.PAGE);
  }

  get ordersTable() {
    return cy.get(this.selectors.TABLE);
  }

  get orderRows() {
    return cy.get(this.selectors.ROW);
  }

  get searchInput() {
    return cy.get(this.selectors.SEARCH);
  }

  get statusFilter() {
    return cy.get(this.selectors.FILTER_STATUS);
  }

  get dateFilter() {
    return cy.get(this.selectors.FILTER_DATE);
  }

  // Status Modal
  get statusModal() {
    return cy.get(this.selectors.STATUS_MODAL.MODAL);
  }

  get statusSelect() {
    return cy.get(this.selectors.STATUS_MODAL.SELECT);
  }

  get statusNotes() {
    return cy.get(this.selectors.STATUS_MODAL.NOTES);
  }

  get statusSubmit() {
    return cy.get(this.selectors.STATUS_MODAL.SUBMIT);
  }

  get statusCancel() {
    return cy.get(this.selectors.STATUS_MODAL.CANCEL);
  }

  // =================================
  // Row Methods
  // =================================

  /**
   * Get order row by index
   * @param {number} index - Row index
   * @returns {Cypress.Chainable} Order row
   */
  getOrderRow(index) {
    return this.orderRows.eq(index);
  }

  /**
   * Get order row by order number
   * @param {string} orderNumber - Order number
   * @returns {Cypress.Chainable} Order row
   */
  getOrderRowByNumber(orderNumber) {
    return cy.contains(this.selectors.ROW, orderNumber);
  }

  // =================================
  // Action Methods
  // =================================

  /**
   * Search orders
   * @param {string} query - Search query
   * @returns {AdminOrdersPage} This page instance for chaining
   */
  searchOrders(query) {
    this.searchInput.clear().type(query);
    return this;
  }

  /**
   * Filter by status
   * @param {string} status - Status value
   * @returns {AdminOrdersPage} This page instance for chaining
   */
  filterByStatus(status) {
    this.statusFilter.select(status);
    return this;
  }

  /**
   * View order by index
   * @param {number} index - Row index
   * @returns {AdminOrdersPage} This page instance for chaining
   */
  viewOrder(index) {
    this.getOrderRow(index).find(this.selectors.VIEW_BUTTON).click();
    return this;
  }

  /**
   * View order by order number
   * @param {string} orderNumber - Order number
   * @returns {AdminOrdersPage} This page instance for chaining
   */
  viewOrderByNumber(orderNumber) {
    this.getOrderRowByNumber(orderNumber).find(this.selectors.VIEW_BUTTON).click();
    return this;
  }

  /**
   * Open edit status modal by index
   * @param {number} index - Row index
   * @returns {AdminOrdersPage} This page instance for chaining
   */
  openEditStatus(index) {
    this.getOrderRow(index).find(this.selectors.EDIT_STATUS).click();
    return this;
  }

  /**
   * Open edit status modal by order number
   * @param {string} orderNumber - Order number
   * @returns {AdminOrdersPage} This page instance for chaining
   */
  openEditStatusByNumber(orderNumber) {
    this.getOrderRowByNumber(orderNumber).find(this.selectors.EDIT_STATUS).click();
    return this;
  }

  /**
   * Update order status
   * @param {string} newStatus - New status
   * @param {string} [notes] - Optional notes
   * @returns {AdminOrdersPage} This page instance for chaining
   */
  updateStatus(newStatus, notes) {
    this.statusSelect.select(newStatus);
    if (notes) {
      this.statusNotes.clear().type(notes);
    }
    this.statusSubmit.click();
    return this;
  }

  /**
   * Cancel status update
   * @returns {AdminOrdersPage} This page instance for chaining
   */
  cancelStatusUpdate() {
    this.statusCancel.click();
    return this;
  }

  // =================================
  // High-Level Actions
  // =================================

  /**
   * Update order status by order number
   * @param {string} orderNumber - Order number
   * @param {string} newStatus - New status
   * @param {string} [notes] - Optional notes
   * @returns {AdminOrdersPage} This page instance for chaining
   */
  updateOrderStatus(orderNumber, newStatus, notes) {
    this.openEditStatusByNumber(orderNumber);
    this.updateStatus(newStatus, notes);
    return this;
  }

  // =================================
  // Verification Methods
  // =================================

  /**
   * Verify page is loaded
   * @returns {AdminOrdersPage} This page instance for chaining
   */
  verifyPageLoaded() {
    this.verifyUrl('/admin/orders');
    this.ordersPage.should('be.visible');
    return this;
  }

  /**
   * Verify orders are displayed
   * @param {number} [expectedCount] - Expected order count
   * @returns {AdminOrdersPage} This page instance for chaining
   */
  verifyOrdersDisplayed(expectedCount) {
    if (expectedCount !== undefined) {
      this.orderRows.should('have.length', expectedCount);
    } else {
      this.orderRows.should('have.length.at.least', 1);
    }
    return this;
  }

  /**
   * Verify order exists
   * @param {string} orderNumber - Order number
   * @returns {AdminOrdersPage} This page instance for chaining
   */
  verifyOrderExists(orderNumber) {
    this.getOrderRowByNumber(orderNumber).should('exist');
    return this;
  }

  /**
   * Verify order status
   * @param {string} orderNumber - Order number
   * @param {string} expectedStatus - Expected status
   * @returns {AdminOrdersPage} This page instance for chaining
   */
  verifyOrderStatus(orderNumber, expectedStatus) {
    this.getOrderRowByNumber(orderNumber).should('contain.text', expectedStatus);
    return this;
  }

  /**
   * Verify status modal is visible
   * @returns {AdminOrdersPage} This page instance for chaining
   */
  verifyStatusModalVisible() {
    this.statusModal.should('be.visible');
    return this;
  }

  /**
   * Verify success message
   * @param {string} [message] - Expected message
   * @returns {AdminOrdersPage} This page instance for chaining
   */
  verifySuccessMessage(message) {
    cy.get('[data-testid="toast-success"]').should('be.visible');
    if (message) {
      cy.get('[data-testid="toast-success"]').should('contain.text', message);
    }
    return this;
  }

  /**
   * Get order count
   * @returns {Cypress.Chainable<number>} Order count
   */
  getOrderCount() {
    return this.orderRows.its('length');
  }

  // =================================
  // API Interception Methods
  // =================================

  /**
   * Intercept get orders request
   * @param {string} [alias='getOrders'] - Intercept alias
   * @returns {AdminOrdersPage} This page instance for chaining
   */
  interceptGetOrdersRequest(alias = 'getOrders') {
    cy.intercept('GET', '**/orders*').as(alias);
    return this;
  }

  /**
   * Intercept update status request
   * @param {string} [alias='updateStatus'] - Intercept alias
   * @returns {AdminOrdersPage} This page instance for chaining
   */
  interceptUpdateStatusRequest(alias = 'updateStatus') {
    cy.intercept('PUT', '**/orders/*/status').as(alias);
    return this;
  }

  /**
   * Mock orders response
   * @param {Array} orders - Orders array
   * @param {string} [alias='getOrders'] - Intercept alias
   * @returns {AdminOrdersPage} This page instance for chaining
   */
  mockOrders(orders, alias = 'getOrders') {
    cy.intercept('GET', '**/orders*', {
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
   * Wait for orders request
   * @param {string} [alias='getOrders'] - Intercept alias
   * @returns {Cypress.Chainable} Intercepted request
   */
  waitForOrdersRequest(alias = 'getOrders') {
    return cy.wait(`@${alias}`);
  }
}

export default AdminOrdersPage;
