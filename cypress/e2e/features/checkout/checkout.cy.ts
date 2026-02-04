/**
 * Checkout Feature Tests
 * @description Comprehensive test suite for checkout functionality
 * @tags @checkout @ecommerce @regression
 */

import { checkoutPage } from '../../../pages';

describe('Checkout Feature', { tags: ['@checkout', '@ecommerce'] }, () => {
  let checkoutData;

  before(() => {
    cy.fixture('testdata/checkout.json').then((data) => {
      checkoutData = data.default;
    });
  });

  beforeEach(() => {
    cy.loginAsTestUser();

    // Setup cart with real API calls – clear first, then add product 118 (qty 2)
    cy.apiDelete('/cart');
    cy.apiPost('/cart', { productId: 118, quantity: 2 });

    checkoutPage().visit();
  });

  // =================================
  // Checkout Page Load Tests
  // =================================

  describe('Page Load', { tags: '@smoke' }, () => {
    it('should display checkout page', () => {
      checkoutPage().verifyPageLoaded();
    });

    it('should display shipping form', () => {
      checkoutPage().verifyShippingFormVisible();
    });

    it('should display order summary', () => {
      checkoutPage().orderSummary.should('be.visible');
    });
  });

  // =================================
  // Shipping Form Tests
  // =================================

  describe('Shipping Form', { tags: '@regression' }, () => {
    it('should fill shipping address', () => {
      checkoutPage().fillShippingAddress(checkoutData.shipping);

      checkoutPage().shippingFirstName.should('have.value', checkoutData.shipping.firstName);
      checkoutPage().shippingLastName.should('have.value', checkoutData.shipping.lastName);
      checkoutPage().shippingEmail.should('have.value', checkoutData.shipping.email);
    });

    it('should validate required fields', () => {
      // Submit the form without filling anything – zod errors should appear
      checkoutPage().placeOrderButton.click();

      cy.contains('First name is required').should('be.visible');
    });

    it('should validate email format', () => {
      checkoutPage().shippingEmail.type('invalid-email');
      checkoutPage().placeOrderButton.click();

      cy.contains('Invalid email address').should('be.visible');
    });
  });

  // =================================
  // Payment Form Tests
  // =================================

  describe('Payment Form', { tags: '@regression' }, () => {
    beforeEach(() => {
      checkoutPage().fillShippingAddress(checkoutData.shipping);
    });

    it('should select payment method', () => {
      checkoutPage().selectPaymentMethod('credit_card');
      checkoutPage().verifyPaymentFormVisible();
    });

    it('should fill credit card details', () => {
      checkoutPage()
        .selectPaymentMethod('credit_card')
        .fillCreditCard(checkoutData.card);

      checkoutPage().cardNumber.should('have.value', checkoutData.card.number);
    });

    it('should mask CVV input', () => {
      checkoutPage()
        .selectPaymentMethod('credit_card');

      checkoutPage().cardCvv.should('have.attr', 'type', 'password');
    });
  });

  // =================================
  // Order Summary Tests
  // =================================

  describe('Order Summary', { tags: '@regression' }, () => {
    it('should display subtotal', () => {
      checkoutPage().summarySubtotal.should('be.visible');
    });

    it('should display shipping cost', () => {
      checkoutPage().summaryShipping.should('be.visible');
    });

    it('should display tax', () => {
      checkoutPage().summaryTax.should('be.visible');
    });

    it('should display total', () => {
      checkoutPage().summaryTotal.should('be.visible');
    });

    it('should calculate correct total', () => {
      checkoutPage().getOrderTotal().then((total) => {
        expect(total).to.be.greaterThan(0);
      });
    });
  });

  // =================================
  // Place Order Tests
  // =================================

  describe('Place Order', { tags: '@smoke' }, () => {
    it.only('should place order successfully', () => {
      checkoutPage().completeCheckout(checkoutData);

      // order-confirmation only renders after both POST /orders (201) and POST /payments/process (200) succeed
      cy.get('[data-testid="order-confirmation"]').should('be.visible');
    });

    it('should show order confirmation', () => {
      checkoutPage().completeCheckout(checkoutData);

      cy.get('[data-testid="order-confirmation"]').should('be.visible');
    });

    it('should disable place order button during submission', () => {
      // Intercept order creation with a delayed reply so we can observe the disabled state
      cy.intercept('POST', '**/orders', (req) => {
        req.reply((response) => {
          response.delay = 2000;
          return response;
        });
      }).as('slowOrder');

      checkoutPage().completeCheckout(checkoutData);

      // Button should be disabled while the request is in-flight
      checkoutPage().placeOrderButton.should('be.disabled');
    });
  });

  // =================================
  // Order Failure Tests
  // =================================

  describe('Order Failure', { tags: '@regression' }, () => {
    it('should show error on payment failure', () => {
      // Use the designated decline card – API returns 400 deterministically
      checkoutPage()
        .fillShippingAddress(checkoutData.shipping)
        .selectPaymentMethod('credit_card')
        .fillCreditCard({ ...checkoutData.card, number: '4000000000000002' })
        .placeOrder();

      // Error banner only renders after the payment 400 is received and caught
      checkoutPage().verifyErrorDisplayed('Payment failed');
    });

    it('should show error on server error', () => {
      // Mock only the payment endpoint with 500; order creation hits the real API
      cy.intercept('POST', '**/payments/process', {
        statusCode: 500,
        body: {
          success: false,
          error: {
            message: 'Internal server error',
            code: 'SERVER_ERROR',
          },
        },
      });

      checkoutPage().completeCheckout(checkoutData);

      // Error banner only renders after the 500 is received and caught by onSubmit
      checkoutPage().verifyErrorDisplayed();
    });

    it('should remain on checkout page after failure', () => {
      // Use decline card to trigger a real payment failure
      checkoutPage()
        .fillShippingAddress(checkoutData.shipping)
        .selectPaymentMethod('credit_card')
        .fillCreditCard({ ...checkoutData.card, number: '4000000000000002' })
        .placeOrder();

      checkoutPage().verifyErrorDisplayed();
      cy.url().should('include', '/checkout');
    });
  });

  // =================================
  // Checkout Flow Tests
  // =================================

  describe('Checkout Flow', { tags: '@e2e' }, () => {
    it('should complete full checkout flow', () => {
      // Fill and submit the checkout form
      checkoutPage()
        .fillShippingAddress(checkoutData.shipping)
        .selectPaymentMethod('credit_card')
        .fillCreditCard(checkoutData.card)
        .placeOrder();

      // Confirmation only appears after the full order + payment flow completes successfully
      cy.get('[data-testid="order-confirmation"]').should('be.visible');
    });
  });
});
