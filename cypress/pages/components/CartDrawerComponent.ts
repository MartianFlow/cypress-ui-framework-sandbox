/**
 * CartDrawerComponent - Component Object for Cart Drawer/Sidebar
 * @description Handles all cart drawer interactions and verifications
 * @extends BaseComponent
 */
import BaseComponent from '../base/BaseComponent';
const { CART } = require('../../utils/constants/selectors');

class CartDrawerComponent extends BaseComponent {
  /**
   * Creates a CartDrawerComponent instance
   * @param {string} [selector] - Custom selector for the cart drawer
   */
  constructor(selector = CART.DRAWER) {
    super(selector);
    this.selectors = CART;
  }

  // =================================
  // Element Getters
  // =================================

  get closeButton() {
    return cy.get(this.selectors.DRAWER_CLOSE);
  }

  get cartItems() {
    return this.root.find(this.selectors.ITEM);
  }

  get emptyState() {
    return this.root.find(this.selectors.EMPTY_STATE);
  }

  get subtotal() {
    return this.root.find(this.selectors.SUBTOTAL);
  }

  get total() {
    return this.root.find(this.selectors.TOTAL);
  }

  get checkoutButton() {
    return this.root.find(this.selectors.CHECKOUT_BUTTON);
  }

  get continueShoppingButton() {
    return this.root.find(this.selectors.CONTINUE_SHOPPING);
  }

  // =================================
  // Action Methods
  // =================================

  /**
   * Open cart drawer
   * @returns {CartDrawerComponent} This component instance for chaining
   */
  open() {
    cy.get(this.selectors.ICON).click();
    this.shouldBeVisible();
    return this;
  }

  /**
   * Close cart drawer
   * @returns {CartDrawerComponent} This component instance for chaining
   */
  close() {
    this.closeButton.click();
    return this;
  }

  /**
   * Get cart item by index
   * @param {number} index - Item index
   * @returns {Cypress.Chainable} Cart item element
   */
  getCartItem(index) {
    return this.cartItems.eq(index);
  }

  /**
   * Update item quantity
   * @param {number} index - Item index
   * @param {number} quantity - New quantity
   * @returns {CartDrawerComponent} This component instance for chaining
   */
  updateItemQuantity(index, quantity) {
    this.getCartItem(index)
      .find(this.selectors.ITEM_QUANTITY)
      .clear()
      .type(quantity.toString());
    return this;
  }

  /**
   * Increase item quantity
   * @param {number} index - Item index
   * @returns {CartDrawerComponent} This component instance for chaining
   */
  increaseItemQuantity(index) {
    this.getCartItem(index)
      .find(this.selectors.ITEM_QUANTITY_INCREASE)
      .click();
    return this;
  }

  /**
   * Decrease item quantity
   * @param {number} index - Item index
   * @returns {CartDrawerComponent} This component instance for chaining
   */
  decreaseItemQuantity(index) {
    this.getCartItem(index)
      .find(this.selectors.ITEM_QUANTITY_DECREASE)
      .click();
    return this;
  }

  /**
   * Remove item from cart
   * @param {number} index - Item index
   * @returns {CartDrawerComponent} This component instance for chaining
   */
  removeItem(index) {
    this.getCartItem(index)
      .find(this.selectors.ITEM_REMOVE)
      .click();
    return this;
  }

  /**
   * Proceed to checkout
   * @returns {CartDrawerComponent} This component instance for chaining
   */
  proceedToCheckout() {
    this.checkoutButton.click();
    return this;
  }

  /**
   * Continue shopping
   * @returns {CartDrawerComponent} This component instance for chaining
   */
  continueShopping() {
    this.continueShoppingButton.click();
    return this;
  }

  // =================================
  // Verification Methods
  // =================================

  /**
   * Verify cart drawer is open
   * @returns {CartDrawerComponent} This component instance for chaining
   */
  verifyOpen() {
    this.shouldBeVisible();
    return this;
  }

  /**
   * Verify cart drawer is closed
   * @returns {CartDrawerComponent} This component instance for chaining
   */
  verifyClosed() {
    this.root.should('not.be.visible');
    return this;
  }

  /**
   * Verify cart is empty
   * @returns {CartDrawerComponent} This component instance for chaining
   */
  verifyEmpty() {
    this.emptyState.should('be.visible');
    return this;
  }

  /**
   * Verify cart has items
   * @param {number} [expectedCount] - Expected item count
   * @returns {CartDrawerComponent} This component instance for chaining
   */
  verifyHasItems(expectedCount) {
    if (expectedCount !== undefined) {
      this.cartItems.should('have.length', expectedCount);
    } else {
      this.cartItems.should('have.length.at.least', 1);
    }
    return this;
  }

  /**
   * Verify cart item
   * @param {number} index - Item index
   * @param {Object} expectedData - Expected item data
   * @returns {CartDrawerComponent} This component instance for chaining
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
   * @returns {CartDrawerComponent} This component instance for chaining
   */
  verifySubtotal(expectedSubtotal) {
    this.subtotal.should('contain.text', expectedSubtotal);
    return this;
  }

  /**
   * Verify total
   * @param {string} expectedTotal - Expected total
   * @returns {CartDrawerComponent} This component instance for chaining
   */
  verifyTotal(expectedTotal) {
    this.total.should('contain.text', expectedTotal);
    return this;
  }

  /**
   * Verify checkout button is enabled
   * @returns {CartDrawerComponent} This component instance for chaining
   */
  verifyCheckoutEnabled() {
    this.checkoutButton.should('be.visible').and('be.enabled');
    return this;
  }

  /**
   * Verify checkout button is disabled
   * @returns {CartDrawerComponent} This component instance for chaining
   */
  verifyCheckoutDisabled() {
    this.checkoutButton.should('be.disabled');
    return this;
  }

  /**
   * Get cart items count
   * @returns {Cypress.Chainable<number>} Item count
   */
  getItemCount() {
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
}

export default CartDrawerComponent;
