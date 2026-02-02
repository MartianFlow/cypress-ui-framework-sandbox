/**
 * OrderDetailPage - Page Object for Order Detail view
 * @description Handles all order detail page interactions and verifications
 * @extends BasePage
 */
import BasePage from '../base/BasePage';
const { ORDERS } = require('../../utils/constants/selectors');
const { APP } = require('../../utils/constants/routes');

class OrderDetailPage extends BasePage {
  /**
   * Creates an OrderDetailPage instance
   * @param {string|number} [orderId] - Order ID
   */
  constructor(orderId = '') {
    super(orderId ? APP.ORDERS.DETAIL(orderId) : '/orders');
    this.selectors = ORDERS.DETAIL;
    this.orderId = orderId;
  }

  // =================================
  // Page Elements
  // =================================

  get detailPage() {
    return cy.get(this.selectors.PAGE);
  }

  get orderHeader() {
    return cy.get(this.selectors.HEADER);
  }

  get orderNumber() {
    return cy.get(this.selectors.NUMBER);
  }

  get orderDate() {
    return cy.get(this.selectors.DATE);
  }

  get orderStatus() {
    return cy.get(this.selectors.STATUS);
  }

  get orderItems() {
    return cy.get(this.selectors.ITEM);
  }

  get shippingAddress() {
    return cy.get(this.selectors.SHIPPING_ADDRESS);
  }

  get billingAddress() {
    return cy.get(this.selectors.BILLING_ADDRESS);
  }

  get paymentMethod() {
    return cy.get(this.selectors.PAYMENT_METHOD);
  }

  get subtotal() {
    return cy.get(this.selectors.SUBTOTAL);
  }

  get shipping() {
    return cy.get(this.selectors.SHIPPING);
  }

  get tax() {
    return cy.get(this.selectors.TAX);
  }

  get total() {
    return cy.get(this.selectors.TOTAL);
  }

  get cancelButton() {
    return cy.get(this.selectors.CANCEL_BUTTON);
  }

  get trackButton() {
    return cy.get(this.selectors.TRACK_BUTTON);
  }

  get reorderButton() {
    return cy.get(this.selectors.REORDER_BUTTON);
  }

  // =================================
  // Navigation Methods
  // =================================

  /**
   * Open order detail by ID
   * @param {string|number} orderId - Order ID
   * @returns {OrderDetailPage} This page instance for chaining
   */
  openOrder(orderId) {
    this.orderId = orderId;
    cy.visit(APP.ORDERS.DETAIL(orderId));
    this.waitForPageLoad();
    return this;
  }

  // =================================
  // Action Methods
  // =================================

  /**
   * Cancel order
   * @returns {OrderDetailPage} This page instance for chaining
   */
  cancelOrder() {
    this.cancelButton.click();
    // Handle confirmation modal if needed
    cy.get('[data-testid="confirm-cancel"]').click();
    return this;
  }

  /**
   * Track order
   * @returns {OrderDetailPage} This page instance for chaining
   */
  trackOrder() {
    this.trackButton.click();
    return this;
  }

  /**
   * Reorder
   * @returns {OrderDetailPage} This page instance for chaining
   */
  reorder() {
    this.reorderButton.click();
    return this;
  }

  // =================================
  // Verification Methods
  // =================================

  /**
   * Verify page is loaded
   * @returns {OrderDetailPage} This page instance for chaining
   */
  verifyPageLoaded() {
    this.verifyUrl('/orders/');
    this.detailPage.should('be.visible');
    this.orderNumber.should('be.visible');
    return this;
  }

  /**
   * Verify order details
   * @param {Object} expectedData - Expected order data
   * @returns {OrderDetailPage} This page instance for chaining
   */
  verifyOrderDetails(expectedData) {
    if (expectedData.orderNumber) {
      this.orderNumber.should('contain.text', expectedData.orderNumber);
    }
    if (expectedData.status) {
      this.orderStatus.should('contain.text', expectedData.status);
    }
    if (expectedData.total) {
      this.total.should('contain.text', expectedData.total);
    }
    return this;
  }

  /**
   * Verify order status
   * @param {string} expectedStatus - Expected status
   * @returns {OrderDetailPage} This page instance for chaining
   */
  verifyOrderStatus(expectedStatus) {
    this.orderStatus.should('contain.text', expectedStatus);
    return this;
  }

  /**
   * Verify order can be cancelled
   * @returns {OrderDetailPage} This page instance for chaining
   */
  verifyCanCancel() {
    this.cancelButton.should('be.visible').and('be.enabled');
    return this;
  }

  /**
   * Verify order cannot be cancelled
   * @returns {OrderDetailPage} This page instance for chaining
   */
  verifyCannotCancel() {
    this.cancelButton.should('not.exist');
    return this;
  }

  /**
   * Verify order items count
   * @param {number} expectedCount - Expected items count
   * @returns {OrderDetailPage} This page instance for chaining
   */
  verifyItemsCount(expectedCount) {
    this.orderItems.should('have.length', expectedCount);
    return this;
  }

  /**
   * Verify shipping address
   * @param {Object} expectedAddress - Expected address
   * @returns {OrderDetailPage} This page instance for chaining
   */
  verifyShippingAddress(expectedAddress) {
    Object.values(expectedAddress).forEach((value) => {
      this.shippingAddress.should('contain.text', value);
    });
    return this;
  }

  /**
   * Get order status
   * @returns {Cypress.Chainable<string>} Order status
   */
  getOrderStatus() {
    return this.orderStatus.invoke('text');
  }

  /**
   * Get total as number
   * @returns {Cypress.Chainable<number>} Order total
   */
  getTotalAmount() {
    return this.total.invoke('text').then((text) => {
      return parseFloat(text.replace(/[^0-9.]/g, ''));
    });
  }

  // =================================
  // API Interception Methods
  // =================================

  /**
   * Intercept get order request
   * @param {string} [alias='getOrder'] - Intercept alias
   * @returns {OrderDetailPage} This page instance for chaining
   */
  interceptGetOrderRequest(alias = 'getOrder') {
    cy.intercept('GET', '**/orders/*').as(alias);
    return this;
  }

  /**
   * Intercept cancel order request
   * @param {string} [alias='cancelOrder'] - Intercept alias
   * @returns {OrderDetailPage} This page instance for chaining
   */
  interceptCancelOrderRequest(alias = 'cancelOrder') {
    cy.intercept('PUT', '**/orders/*/cancel').as(alias);
    return this;
  }

  /**
   * Mock order response
   * @param {Object} order - Order data
   * @param {string} [alias='getOrder'] - Intercept alias
   * @returns {OrderDetailPage} This page instance for chaining
   */
  mockOrder(order, alias = 'getOrder') {
    cy.intercept('GET', '**/orders/*', {
      statusCode: 200,
      body: {
        success: true,
        data: order,
      },
    }).as(alias);
    return this;
  }

  /**
   * Mock cancel order success
   * @param {string} [alias='cancelOrder'] - Intercept alias
   * @returns {OrderDetailPage} This page instance for chaining
   */
  mockCancelOrderSuccess(alias = 'cancelOrder') {
    cy.intercept('PUT', '**/orders/*/cancel', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          status: 'cancelled',
        },
      },
    }).as(alias);
    return this;
  }

  /**
   * Wait for order request
   * @param {string} [alias='getOrder'] - Intercept alias
   * @returns {Cypress.Chainable} Intercepted request
   */
  waitForOrderRequest(alias = 'getOrder') {
    return cy.wait(`@${alias}`);
  }
}

export default OrderDetailPage;
