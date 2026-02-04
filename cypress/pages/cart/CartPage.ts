/**
 * CartPage - Page Object for Shopping Cart
 * @description Handles all cart page interactions and verifications
 * @extends BasePage
 */
import BasePage from '../base/BasePage';
const { CART } = require('../../utils/constants/selectors');
const { APP } = require('../../utils/constants/routes');

class CartPage extends BasePage {
  /**
   * Creates a CartPage instance
   */
  constructor() {
    super(APP.CART);
    this.selectors = CART;
  }

  // =================================
  // Page Elements
  // =================================

  get cartPage() {
    return cy.get(this.selectors.PAGE);
  }

  get cartItems() {
    return cy.get(this.selectors.ITEM);
  }

  get emptyState() {
    return cy.get(this.selectors.EMPTY_STATE);
  }

  get continueShoppingButton() {
    return cy.get(this.selectors.CONTINUE_SHOPPING);
  }

  get subtotal() {
    return cy.get(this.selectors.SUBTOTAL);
  }

  get tax() {
    return cy.get(this.selectors.TAX);
  }

  get shipping() {
    return cy.get(this.selectors.SHIPPING);
  }

  get total() {
    return cy.get(this.selectors.TOTAL);
  }

  get checkoutButton() {
    return cy.get(this.selectors.CHECKOUT_BUTTON);
  }

  get clearCartButton() {
    return cy.get(this.selectors.CLEAR_CART);
  }

  get couponInput() {
    return cy.get(this.selectors.COUPON_INPUT);
  }

  get couponApplyButton() {
    return cy.get(this.selectors.COUPON_APPLY);
  }

  // =================================
  // Cart Item Methods
  // =================================

  /**
   * Get cart item by index
   * @param {number} index - Item index (0-based)
   * @returns {Cypress.Chainable} Cart item element
   */
  getCartItem(index) {
    return this.cartItems.eq(index);
  }

  /**
   * Get cart item by product name
   * @param {string} productName - Product name
   * @returns {Cypress.Chainable} Cart item element
   */
  getCartItemByName(productName) {
    return cy.contains(this.selectors.ITEM, productName);
  }

  /**
   * Get quantity input for item
   * @param {number} index - Item index
   * @returns {Cypress.Chainable} Quantity input element
   */
  getItemQuantityInput(index) {
    return this.getCartItem(index).find(this.selectors.ITEM_QUANTITY);
  }

  // =================================
  // Action Methods
  // =================================

  /**
   * Update item quantity by index
   * @param {number} index - Item index
   * @param {number} quantity - New quantity
   * @returns {CartPage} This page instance for chaining
   */
  updateQuantity(index, quantity) {
    this.getItemQuantityInput(index).type(`{selectall}${quantity}`);
    return this;
  }

  /**
   * Increase item quantity by index
   * @param {number} index - Item index
   * @returns {CartPage} This page instance for chaining
   */
  increaseQuantity(index) {
    this.getCartItem(index).find(this.selectors.ITEM_QUANTITY_INCREASE).click();
    return this;
  }

  /**
   * Decrease item quantity by index
   * @param {number} index - Item index
   * @returns {CartPage} This page instance for chaining
   */
  decreaseQuantity(index) {
    this.getCartItem(index).find(this.selectors.ITEM_QUANTITY_DECREASE).click();
    return this;
  }

  /**
   * Remove item by index
   * @param {number} index - Item index
   * @returns {CartPage} This page instance for chaining
   */
  removeItem(index) {
    this.getCartItem(index).find(this.selectors.ITEM_REMOVE).click();
    return this;
  }

  /**
   * Remove item by product name
   * @param {string} productName - Product name
   * @returns {CartPage} This page instance for chaining
   */
  removeItemByName(productName) {
    this.getCartItemByName(productName).find(this.selectors.ITEM_REMOVE).click();
    return this;
  }

  /**
   * Clear all items from cart
   * @returns {CartPage} This page instance for chaining
   */
  clearCart() {
    this.clearCartButton.click();
    return this;
  }

  /**
   * Apply coupon code
   * @param {string} couponCode - Coupon code
   * @returns {CartPage} This page instance for chaining
   */
  applyCoupon(couponCode) {
    this.couponInput.clear().type(couponCode);
    this.couponApplyButton.click();
    return this;
  }

  /**
   * Remove applied coupon
   * @returns {CartPage} This page instance for chaining
   */
  removeCoupon() {
    cy.get(this.selectors.COUPON_REMOVE).click();
    return this;
  }

  /**
   * Proceed to checkout
   * @returns {CartPage} This page instance for chaining
   */
  proceedToCheckout() {
    this.checkoutButton.click();
    return this;
  }

  /**
   * Continue shopping
   * @returns {CartPage} This page instance for chaining
   */
  continueShopping() {
    this.continueShoppingButton.click();
    return this;
  }

  // =================================
  // Verification Methods
  // =================================

  /**
   * Verify page is loaded
   * @returns {CartPage} This page instance for chaining
   */
  verifyPageLoaded() {
    this.verifyUrl('/cart');
    this.cartPage.should('be.visible');
    return this;
  }

  /**
   * Verify cart is empty
   * @returns {CartPage} This page instance for chaining
   */
  verifyCartEmpty() {
    this.emptyState.should('be.visible');
    this.checkoutButton.should('not.exist');
    return this;
  }

  /**
   * Verify cart has items
   * @param {number} [expectedCount] - Expected item count
   * @returns {CartPage} This page instance for chaining
   */
  verifyCartHasItems(expectedCount) {
    if (expectedCount !== undefined) {
      this.cartItems.should('have.length', expectedCount);
    } else {
      this.cartItems.should('have.length.at.least', 1);
    }
    return this;
  }

  /**
   * Verify cart item details
   * @param {number} index - Item index
   * @param {Object} expectedData - Expected item data
   * @returns {CartPage} This page instance for chaining
   */
  verifyCartItem(index, expectedData) {
    const item = this.getCartItem(index);

    if (expectedData.name) {
      item.find(this.selectors.ITEM_NAME).should('contain.text', expectedData.name);
    }
    if (expectedData.price) {
      item.find(this.selectors.ITEM_PRICE).should('contain.text', expectedData.price);
    }
    if (expectedData.quantity) {
      item.find(this.selectors.ITEM_QUANTITY).should('have.value', expectedData.quantity.toString());
    }

    return this;
  }

  /**
   * Verify subtotal
   * @param {string} expectedSubtotal - Expected subtotal
   * @returns {CartPage} This page instance for chaining
   */
  verifySubtotal(expectedSubtotal) {
    this.subtotal.should('contain.text', expectedSubtotal);
    return this;
  }

  /**
   * Verify total
   * @param {string} expectedTotal - Expected total
   * @returns {CartPage} This page instance for chaining
   */
  verifyTotal(expectedTotal) {
    this.total.should('contain.text', expectedTotal);
    return this;
  }

  /**
   * Verify coupon applied successfully
   * @returns {CartPage} This page instance for chaining
   */
  verifyCouponApplied() {
    cy.get(this.selectors.COUPON_SUCCESS).should('be.visible');
    cy.get(this.selectors.DISCOUNT).should('be.visible');
    return this;
  }

  /**
   * Verify coupon error
   * @param {string} [expectedMessage] - Expected error message
   * @returns {CartPage} This page instance for chaining
   */
  verifyCouponError(expectedMessage) {
    cy.get(this.selectors.COUPON_ERROR).should('be.visible');
    if (expectedMessage) {
      cy.get(this.selectors.COUPON_ERROR).should('contain.text', expectedMessage);
    }
    return this;
  }

  /**
   * Verify checkout button is enabled
   * @returns {CartPage} This page instance for chaining
   */
  verifyCheckoutEnabled() {
    this.checkoutButton.should('be.visible').and('be.enabled');
    return this;
  }

  /**
   * Verify checkout button is disabled
   * @returns {CartPage} This page instance for chaining
   */
  verifyCheckoutDisabled() {
    this.checkoutButton.should('be.disabled');
    return this;
  }

  /**
   * Get cart item count
   * @returns {Cypress.Chainable<number>} Item count
   */
  getCartItemCount() {
    return this.cartItems.its('length');
  }

  /**
   * Get total as number
   * @returns {Cypress.Chainable<number>} Total amount
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
   * Intercept get cart request
   * @param {string} [alias='getCart'] - Intercept alias
   * @returns {CartPage} This page instance for chaining
   */
  interceptGetCartRequest(alias = 'getCart') {
    cy.intercept('GET', '/api/v1/cart').as(alias);
    return this;
  }

  /**
   * Intercept update cart request
   * @param {string} [alias='updateCart'] - Intercept alias
   * @returns {CartPage} This page instance for chaining
   */
  interceptUpdateCartRequest(alias = 'updateCart') {
    cy.intercept('PUT', '/api/v1/cart/*', { statusCode: 200, body: { success: true, data: {} } }).as(alias);
    return this;
  }

  /**
   * Intercept delete cart item request
   * @param {string} [alias='deleteCartItem'] - Intercept alias
   * @returns {CartPage} This page instance for chaining
   */
  interceptDeleteCartItemRequest(alias = 'deleteCartItem') {
    cy.intercept('DELETE', '/api/v1/cart/*', { statusCode: 200, body: { success: true, data: {} } }).as(alias);
    return this;
  }

  /**
   * Mock cart response
   * @param {Array} items - Cart items
   * @param {string} [alias='getCart'] - Intercept alias
   * @returns {CartPage} This page instance for chaining
   */
  mockCart(items, alias = 'getCart') {
    // Transform flat items { id, name, price, quantity } into nested structure { id, quantity, product: {...} }
    const transformedItems = items.map(item => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.productId || item.id,
        name: item.name,
        price: item.price,
        images: item.images || ['/placeholder.jpg'],
        stock: item.stock || 100,
      },
    }));
    const subtotal = transformedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const itemCount = transformedItems.reduce((sum, item) => sum + item.quantity, 0);
    cy.intercept('GET', '/api/v1/cart', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          items: transformedItems,
          subtotal,
          itemCount,
        },
      },
    }).as(alias);
    return this;
  }

  /**
   * Mock empty cart response
   * @param {string} [alias='getCart'] - Intercept alias
   * @returns {CartPage} This page instance for chaining
   */
  mockEmptyCart(alias = 'getCart') {
    cy.intercept('GET', '/api/v1/cart', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          items: [],
          subtotal: 0,
          itemCount: 0,
        },
      },
    }).as(alias);
    return this;
  }

  /**
   * Wait for cart request
   * @param {string} [alias='getCart'] - Intercept alias
   * @returns {Cypress.Chainable} Intercepted request
   */
  waitForCartRequest(alias = 'getCart') {
    return cy.wait(`@${alias}`);
  }
}

export default CartPage;
