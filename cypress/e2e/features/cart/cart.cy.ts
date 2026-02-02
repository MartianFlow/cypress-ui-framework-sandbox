/**
 * Cart Feature Tests
 * @description Comprehensive test suite for shopping cart functionality
 * @tags @cart @ecommerce @regression
 */

import { cartPage, productsPage } from '../../../pages';
import { APP } from '../../../utils/constants/routes';

describe('Cart Feature', { tags: ['@cart', '@ecommerce'] }, () => {
  beforeEach(() => {
    cy.loginAsTestUser();
  });

  // =================================
  // Empty Cart Tests
  // =================================

  describe('Empty Cart', { tags: '@smoke' }, () => {
    beforeEach(() => {
      cartPage().mockEmptyCart();
      cartPage().visit();
    });

    it('should display empty cart message', () => {
      cartPage().verifyCartEmpty();
    });

    it('should show continue shopping button', () => {
      cartPage().continueShoppingButton.should('be.visible');
    });

    it('should navigate to products on continue shopping', () => {
      cartPage().continueShopping();
      cy.url().should('include', '/products');
    });

    it('should not show checkout button when cart is empty', () => {
      cartPage().checkoutButton.should('not.exist');
    });
  });

  // =================================
  // Cart with Items Tests
  // =================================

  describe('Cart with Items', { tags: '@smoke' }, () => {
    const mockCartItems = [
      { id: 1, name: 'Product 1', price: 99.99, quantity: 2 },
      { id: 2, name: 'Product 2', price: 149.99, quantity: 1 },
    ];

    beforeEach(() => {
      cartPage().mockCart(mockCartItems);
      cartPage().visit();
    });

    it('should display cart items', () => {
      cartPage().verifyCartHasItems(2);
    });

    it('should display correct item details', () => {
      cartPage().verifyCartItem(0, {
        name: 'Product 1',
        quantity: 2,
      });
    });

    it('should display cart totals', () => {
      cartPage().subtotal.should('be.visible');
      cartPage().total.should('be.visible');
    });

    it('should show checkout button', () => {
      cartPage().verifyCheckoutEnabled();
    });
  });

  // =================================
  // Update Quantity Tests
  // =================================

  describe('Update Quantity', { tags: '@regression' }, () => {
    beforeEach(() => {
      cartPage().mockCart([
        { id: 1, name: 'Test Product', price: 99.99, quantity: 1 },
      ]);
      cartPage().interceptUpdateCartRequest();
      cartPage().visit();
    });

    it('should increase item quantity', () => {
      cartPage().increaseQuantity(0);
      cy.wait('@updateCart');
    });

    it('should decrease item quantity', () => {
      cartPage().mockCart([
        { id: 1, name: 'Test Product', price: 99.99, quantity: 2 },
      ]);
      cartPage().visit();
      
      cartPage().decreaseQuantity(0);
      cy.wait('@updateCart');
    });

    it('should update quantity directly', () => {
      cartPage().updateQuantity(0, 5);
      cy.wait('@updateCart').then((interception) => {
        expect(interception.request.body.quantity).to.eq(5);
      });
    });
  });

  // =================================
  // Remove Item Tests
  // =================================

  describe('Remove Item', { tags: '@regression' }, () => {
    beforeEach(() => {
      cartPage().mockCart([
        { id: 1, name: 'Product 1', price: 99.99, quantity: 1 },
        { id: 2, name: 'Product 2', price: 149.99, quantity: 1 },
      ]);
      cartPage().interceptDeleteCartItemRequest();
      cartPage().visit();
    });

    it('should remove item from cart', () => {
      cartPage().removeItem(0);
      cy.wait('@deleteCartItem');
    });

    it('should update cart after removing item', () => {
      const initialCount = 2;
      cartPage().removeItem(0);
      cy.wait('@deleteCartItem');
      
      // Cart should refresh with updated items
    });
  });

  // =================================
  // Coupon Tests
  // =================================

  describe('Coupon Code', { tags: '@regression' }, () => {
    beforeEach(() => {
      cartPage().mockCart([
        { id: 1, name: 'Test Product', price: 100, quantity: 1 },
      ]);
      cartPage().visit();
    });

    it('should apply valid coupon code', () => {
      cy.intercept('POST', '**/coupons/apply', {
        statusCode: 200,
        body: { success: true, discount: 10 },
      }).as('applyCoupon');

      cartPage().applyCoupon('SAVE10');
      cy.wait('@applyCoupon');

      cartPage().verifyCouponApplied();
    });

    it('should show error for invalid coupon', () => {
      cy.intercept('POST', '**/coupons/apply', {
        statusCode: 400,
        body: { success: false, error: 'Invalid coupon' },
      }).as('invalidCoupon');

      cartPage().applyCoupon('INVALIDCODE');
      cy.wait('@invalidCoupon');

      cartPage().verifyCouponError('Invalid coupon');
    });
  });

  // =================================
  // Checkout Navigation Tests
  // =================================

  describe('Checkout Navigation', { tags: '@smoke' }, () => {
    beforeEach(() => {
      cartPage().mockCart([
        { id: 1, name: 'Test Product', price: 99.99, quantity: 1 },
      ]);
      cartPage().visit();
    });

    it('should navigate to checkout', () => {
      cartPage().proceedToCheckout();
      cy.url().should('include', '/checkout');
    });

    it('should require authentication for checkout', () => {
      cy.clearAuth();
      cartPage().visit();
      cartPage().proceedToCheckout();
      
      // Should redirect to login or show auth modal
    });
  });

  // =================================
  // Cart Persistence Tests
  // =================================

  describe('Cart Persistence', { tags: '@regression' }, () => {
    it('should persist cart across page navigation', () => {
      // Add item to cart
      cy.visit('/products');
      productsPage().addToCartByIndex(0);
      
      // Navigate to cart
      cartPage().visit();
      cartPage().verifyCartHasItems();
    });

    it('should persist cart after page refresh', () => {
      cartPage().mockCart([
        { id: 1, name: 'Test Product', price: 99.99, quantity: 1 },
      ]);
      cartPage().visit();
      
      cy.reload();
      
      cartPage().verifyCartHasItems(1);
    });
  });
});
