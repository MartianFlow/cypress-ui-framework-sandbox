/**
 * CheckoutPage - Page Object for Checkout process
 * @description Handles all checkout page interactions and verifications
 * @extends BasePage
 */
import BasePage from '../base/BasePage';
const { CHECKOUT } = require('../../utils/constants/selectors');
const { APP } = require('../../utils/constants/routes');

class CheckoutPage extends BasePage {
  /**
   * Creates a CheckoutPage instance
   */
  constructor() {
    super(APP.CHECKOUT);
    this.selectors = CHECKOUT;
  }

  // =================================
  // Page Elements
  // =================================

  get checkoutPage() {
    return cy.get(this.selectors.PAGE);
  }

  get checkoutForm() {
    return cy.get(this.selectors.FORM);
  }

  // Shipping Elements
  get shippingFirstName() {
    return cy.get(this.selectors.SHIPPING.FIRST_NAME);
  }

  get shippingLastName() {
    return cy.get(this.selectors.SHIPPING.LAST_NAME);
  }

  get shippingEmail() {
    return cy.get(this.selectors.SHIPPING.EMAIL);
  }

  get shippingPhone() {
    return cy.get(this.selectors.SHIPPING.PHONE);
  }

  get shippingAddress() {
    return cy.get(this.selectors.SHIPPING.ADDRESS);
  }

  get shippingCity() {
    return cy.get(this.selectors.SHIPPING.CITY);
  }

  get shippingState() {
    return cy.get(this.selectors.SHIPPING.STATE);
  }

  get shippingZip() {
    return cy.get(this.selectors.SHIPPING.ZIP);
  }

  get shippingCountry() {
    return cy.get(this.selectors.SHIPPING.COUNTRY);
  }

  // Payment Elements
  get paymentMethodSelect() {
    return cy.get(this.selectors.PAYMENT.METHOD_SELECT);
  }

  get cardNumber() {
    return cy.get(this.selectors.PAYMENT.CARD_NUMBER);
  }

  get cardName() {
    return cy.get(this.selectors.PAYMENT.CARD_NAME);
  }

  get cardExpiry() {
    return cy.get(this.selectors.PAYMENT.CARD_EXPIRY);
  }

  get cardCvv() {
    return cy.get(this.selectors.PAYMENT.CARD_CVV);
  }

  // Order Summary
  get orderSummary() {
    return cy.get(this.selectors.ORDER_SUMMARY.CONTAINER);
  }

  get summarySubtotal() {
    return cy.get(this.selectors.ORDER_SUMMARY.SUBTOTAL);
  }

  get summaryShipping() {
    return cy.get(this.selectors.ORDER_SUMMARY.SHIPPING);
  }

  get summaryTax() {
    return cy.get(this.selectors.ORDER_SUMMARY.TAX);
  }

  get summaryTotal() {
    return cy.get(this.selectors.ORDER_SUMMARY.TOTAL);
  }

  // Buttons
  get placeOrderButton() {
    return cy.get(this.selectors.PLACE_ORDER);
  }

  get continueButton() {
    return cy.get(this.selectors.CONTINUE_BUTTON);
  }

  get backButton() {
    return cy.get(this.selectors.BACK_BUTTON);
  }

  // Messages
  get errorMessage() {
    return cy.get(this.selectors.ERROR);
  }

  get loadingIndicator() {
    return cy.get(this.selectors.LOADING);
  }

  // =================================
  // Action Methods
  // =================================

  /**
   * Fill shipping address
   * @param {Object} address - Shipping address data
   * @returns {CheckoutPage} This page instance for chaining
   */
  fillShippingAddress(address) {
    if (address.firstName) {
      this.shippingFirstName.clear().type(address.firstName);
    }
    if (address.lastName) {
      this.shippingLastName.clear().type(address.lastName);
    }
    if (address.email) {
      this.shippingEmail.clear().type(address.email);
    }
    if (address.phone) {
      this.shippingPhone.clear().type(address.phone);
    }
    if (address.address) {
      this.shippingAddress.clear().type(address.address);
    }
    if (address.city) {
      this.shippingCity.clear().type(address.city);
    }
    if (address.state) {
      this.shippingState.clear().type(address.state);
    }
    if (address.zip) {
      this.shippingZip.clear().type(address.zip);
    }
    if (address.country) {
      this.shippingCountry.clear().type(address.country);
    }
    return this;
  }

  /**
   * Select payment method
   * @param {string} method - Payment method (credit_card, paypal, etc.)
   * @returns {CheckoutPage} This page instance for chaining
   */
  selectPaymentMethod(method) {
    const methodSelectors = {
      'credit_card': this.selectors.PAYMENT.CREDIT_CARD,
      'paypal': this.selectors.PAYMENT.PAYPAL,
    };
    cy.get(methodSelectors[method] || this.selectors.PAYMENT.CREDIT_CARD).click();
    return this;
  }

  /**
   * Fill credit card details
   * @param {Object} cardData - Credit card data
   * @returns {CheckoutPage} This page instance for chaining
   */
  fillCreditCard(cardData) {
    if (cardData.number) {
      this.cardNumber.clear().type(cardData.number);
    }
    if (cardData.name) {
      this.cardName.clear().type(cardData.name);
    }
    if (cardData.expiry) {
      this.cardExpiry.clear().type(cardData.expiry);
    }
    if (cardData.cvv) {
      this.cardCvv.clear().type(cardData.cvv, { log: false });
    }
    return this;
  }

  /**
   * Place order
   * @returns {CheckoutPage} This page instance for chaining
   */
  placeOrder() {
    this.placeOrderButton.click();
    return this;
  }

  /**
   * Click continue button
   * @returns {CheckoutPage} This page instance for chaining
   */
  continue() {
    this.continueButton.click();
    return this;
  }

  /**
   * Click back button
   * @returns {CheckoutPage} This page instance for chaining
   */
  goBack() {
    this.backButton.click();
    return this;
  }

  // =================================
  // High-Level Actions
  // =================================

  /**
   * Complete full checkout process
   * @param {Object} checkoutData - Complete checkout data
   * @returns {CheckoutPage} This page instance for chaining
   */
  completeCheckout(checkoutData) {
    // Fill shipping
    this.fillShippingAddress(checkoutData.shipping);

    // Fill payment
    if (checkoutData.paymentMethod) {
      this.selectPaymentMethod(checkoutData.paymentMethod);
    }

    if (checkoutData.card) {
      this.fillCreditCard(checkoutData.card);
    }

    // Place order
    this.placeOrder();

    return this;
  }

  /**
   * Fill checkout with fixture data
   * @param {string} [fixtureKey='default'] - Fixture key
   * @returns {CheckoutPage} This page instance for chaining
   */
  fillWithFixture(fixtureKey = 'default') {
    cy.fixture('testdata/checkout.json').then((data) => {
      const checkoutData = data[fixtureKey];
      if (!checkoutData) {
        throw new Error(`Checkout data '${fixtureKey}' not found in fixture`);
      }
      this.completeCheckout(checkoutData);
    });
    return this;
  }

  // =================================
  // Verification Methods
  // =================================

  /**
   * Verify page is loaded
   * @returns {CheckoutPage} This page instance for chaining
   */
  verifyPageLoaded() {
    this.verifyUrl('/checkout');
    this.checkoutPage.should('be.visible');
    return this;
  }

  /**
   * Verify shipping form is visible
   * @returns {CheckoutPage} This page instance for chaining
   */
  verifyShippingFormVisible() {
    cy.get(this.selectors.SHIPPING.FORM).should('be.visible');
    return this;
  }

  /**
   * Verify payment form is visible
   * @returns {CheckoutPage} This page instance for chaining
   */
  verifyPaymentFormVisible() {
    cy.get(this.selectors.PAYMENT.FORM).should('be.visible');
    return this;
  }

  /**
   * Verify order summary details
   * @param {Object} expectedData - Expected summary data
   * @returns {CheckoutPage} This page instance for chaining
   */
  verifyOrderSummary(expectedData) {
    if (expectedData.subtotal) {
      this.summarySubtotal.should('contain.text', expectedData.subtotal);
    }
    if (expectedData.shipping) {
      this.summaryShipping.should('contain.text', expectedData.shipping);
    }
    if (expectedData.tax) {
      this.summaryTax.should('contain.text', expectedData.tax);
    }
    if (expectedData.total) {
      this.summaryTotal.should('contain.text', expectedData.total);
    }
    return this;
  }

  /**
   * Verify error message is displayed
   * @param {string} [expectedMessage] - Expected error message
   * @returns {CheckoutPage} This page instance for chaining
   */
  verifyErrorDisplayed(expectedMessage) {
    this.errorMessage.should('be.visible');
    if (expectedMessage) {
      this.errorMessage.should('contain.text', expectedMessage);
    }
    return this;
  }

  /**
   * Verify place order button is enabled
   * @returns {CheckoutPage} This page instance for chaining
   */
  verifyPlaceOrderEnabled() {
    this.placeOrderButton.should('be.enabled');
    return this;
  }

  /**
   * Verify place order button is disabled
   * @returns {CheckoutPage} This page instance for chaining
   */
  verifyPlaceOrderDisabled() {
    this.placeOrderButton.should('be.disabled');
    return this;
  }

  /**
   * Verify loading state
   * @returns {CheckoutPage} This page instance for chaining
   */
  verifyLoading() {
    this.loadingIndicator.should('be.visible');
    return this;
  }

  /**
   * Verify checkout step
   * @param {string} step - Step name (shipping, payment, review)
   * @returns {CheckoutPage} This page instance for chaining
   */
  verifyCurrentStep(step) {
    cy.get(this.selectors.STEPS[step.toUpperCase()]).should('have.class', 'active');
    return this;
  }

  /**
   * Get order total as number
   * @returns {Cypress.Chainable<number>} Order total
   */
  getOrderTotal() {
    return this.summaryTotal.invoke('text').then((text) => {
      return parseFloat(text.replace(/[^0-9.]/g, ''));
    });
  }

  // =================================
  // API Interception Methods
  // =================================

  /**
   * Intercept create order request
   * @param {string} [alias='createOrder'] - Intercept alias
   * @returns {CheckoutPage} This page instance for chaining
   */
  interceptCreateOrderRequest(alias = 'createOrder') {
    cy.intercept('POST', '**/orders', (req) => { req.continue(); }).as(alias);
    return this;
  }

  /**
   * Intercept payment request
   * @param {string} [alias='processPayment'] - Intercept alias
   * @returns {CheckoutPage} This page instance for chaining
   */
  interceptPaymentRequest(alias = 'processPayment') {
    cy.intercept('POST', '**/payments/process', (req) => { req.continue(); }).as(alias);
    return this;
  }

  /**
   * Mock successful order creation
   * @param {Object} orderData - Order data to return
   * @param {string} [alias='createOrder'] - Intercept alias
   * @returns {CheckoutPage} This page instance for chaining
   */
  mockCreateOrderSuccess(orderData = {}, alias = 'createOrder') {
    cy.intercept('POST', '**/orders', {
      statusCode: 201,
      body: {
        success: true,
        data: {
          id: 1,
          orderNumber: 'ORD-001',
          status: 'pending',
          ...orderData,
        },
      },
    }).as(alias);
    return this;
  }

  /**
   * Mock failed order creation
   * @param {string} [message] - Error message
   * @param {number} [statusCode=400] - HTTP status code
   * @param {string} [alias='createOrder'] - Intercept alias
   * @returns {CheckoutPage} This page instance for chaining
   */
  mockCreateOrderFailure(message = 'Order creation failed', statusCode = 400, alias = 'createOrder') {
    cy.intercept('POST', '**/orders', {
      statusCode,
      body: {
        success: false,
        error: {
          message,
        },
      },
    }).as(alias);
    return this;
  }

  /**
   * Wait for create order request
   * @param {string} [alias='createOrder'] - Intercept alias
   * @returns {Cypress.Chainable} Intercepted request
   */
  waitForCreateOrderRequest(alias = 'createOrder') {
    return cy.wait(`@${alias}`);
  }
}

export default CheckoutPage;
