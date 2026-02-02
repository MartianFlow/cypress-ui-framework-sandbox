/**
 * Checkout Feature Tests
 * @description Comprehensive test suite for checkout functionality
 * @tags @checkout @ecommerce @regression
 */

import { checkoutPage, cartPage } from '../../../pages';
import { APP } from '../../../utils/constants/routes';

describe('Checkout Feature', { tags: ['@checkout', '@ecommerce'] }, () => {
  let checkoutData;

  before(() => {
    cy.fixture('testdata/checkout.json').then((data) => {
      checkoutData = data.default;
    });
  });

  beforeEach(() => {
    cy.loginAsTestUser();
    
    // Setup cart with items
    cartPage().mockCart([
      { id: 1, name: 'Test Product', price: 99.99, quantity: 2 },
    ]);
    
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
      checkoutPage().placeOrderButton.click();

      checkoutPage().shippingFirstName.then(($input) => {
        expect($input[0].validity.valueMissing).to.be.true;
      });
    });

    it('should validate email format', () => {
      checkoutPage().shippingEmail.type('invalid-email');
      checkoutPage().placeOrderButton.click();

      checkoutPage().shippingEmail.then(($input) => {
        expect($input[0].validity.typeMismatch).to.be.true;
      });
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
    beforeEach(() => {
      checkoutPage().mockCreateOrderSuccess({
        id: 1,
        orderNumber: 'ORD-001',
        status: 'pending',
      });
    });

    it('should place order successfully', () => {
      checkoutPage()
        .completeCheckout(checkoutData)
        .waitForCreateOrderRequest()
        .its('response.statusCode')
        .should('eq', 201);

      cy.url().should('include', '/orders');
    });

    it('should show order confirmation', () => {
      checkoutPage().completeCheckout(checkoutData);

      cy.wait('@createOrder');
      cy.get('[data-testid="order-confirmation"]').should('be.visible');
    });

    it('should disable place order button during submission', () => {
      cy.intercept('POST', '**/orders', {
        delay: 1000,
        statusCode: 201,
        body: { success: true, data: { id: 1 } },
      }).as('slowOrder');

      checkoutPage().completeCheckout(checkoutData);

      checkoutPage().placeOrderButton.should('be.disabled');
    });
  });

  // =================================
  // Order Failure Tests
  // =================================

  describe('Order Failure', { tags: '@regression' }, () => {
    it('should show error on payment failure', () => {
      checkoutPage().mockCreateOrderFailure('Payment failed', 400);

      checkoutPage()
        .completeCheckout(checkoutData)
        .waitForCreateOrderRequest();

      checkoutPage().verifyErrorDisplayed('Payment failed');
    });

    it('should show error on server error', () => {
      checkoutPage().mockCreateOrderFailure('Server error', 500);

      checkoutPage()
        .completeCheckout(checkoutData)
        .waitForCreateOrderRequest();

      checkoutPage().verifyErrorDisplayed();
    });

    it('should remain on checkout page after failure', () => {
      checkoutPage().mockCreateOrderFailure();

      checkoutPage().completeCheckout(checkoutData);

      cy.url().should('include', '/checkout');
    });
  });

  // =================================
  // Checkout Flow Tests
  // =================================

  describe('Checkout Flow', { tags: '@e2e' }, () => {
    it('should complete full checkout flow', () => {
      // Mock successful order
      checkoutPage().mockCreateOrderSuccess({
        id: 1,
        orderNumber: 'ORD-12345',
      });

      // Fill checkout form
      checkoutPage()
        .fillShippingAddress(checkoutData.shipping)
        .selectPaymentMethod('credit_card')
        .fillCreditCard(checkoutData.card)
        .placeOrder();

      // Verify success
      cy.wait('@createOrder');
      cy.url().should('match', /orders|confirmation/);
    });
  });
});
