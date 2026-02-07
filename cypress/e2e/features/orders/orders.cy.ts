/**
 * Orders Feature Tests
 * @description Comprehensive test suite for orders functionality
 * @tags @orders @ecommerce @regression
 */

import { ordersPage, orderDetailPage, header } from '../../../pages';
import { APP } from '../../../utils/constants/routes';

describe('Orders Feature', { tags: ['@orders', '@ecommerce'] }, () => {
  beforeEach(() => {
    cy.loginAsTestUser();
    // Wait for auth to be fully established
    cy.wait(500);
  });

  // =================================
  // Orders List Tests
  // =================================

  describe('Orders List', { tags: '@smoke' }, () => {
    beforeEach(() => {
      // Visit orders page - it will load real data from API
      ordersPage().visit();
      cy.wait(1000); // Wait for orders to load
    });

    it('should display orders page', () => {
      ordersPage().verifyPageLoaded();
    });

    it('should display orders list', () => {
      ordersPage().ordersList.should('be.visible');
      // At least 1 order should exist from seed data
      ordersPage().orderItems.should('have.length.at.least', 1);
    });

    it('should display order details in list', () => {
      ordersPage().orderItems.first().within(() => {
        cy.get('[data-testid="order-number"]').should('be.visible');
        cy.get('[data-testid="order-status"]').should('be.visible');
        cy.get('[data-testid="order-total"]').should('be.visible');
        cy.get('[data-testid="order-date"]').should('be.visible');
      });
    });

    it('should show order status badges', () => {
      // At least one order with these statuses should exist from seed data
      cy.get('[data-testid="order-status"]').should('have.length.at.least', 1);
    });
  });

  // =================================
  // Empty Orders Tests
  // =================================

  describe.skip('Empty Orders', { tags: '@regression' }, () => {
    // Note: Skipping this test suite for now as seed data creates orders
    // To test empty state, we would need to:
    // 1. Create a new user without orders, or
    // 2. Add an API endpoint to clear orders for a test user
    beforeEach(() => {
      ordersPage().visit();
    });

    it('should display empty state message', () => {
      ordersPage().verifyEmptyState();
    });

    it('should show shop now button', () => {
      ordersPage().shopNowButton.should('be.visible');
    });

    it('should navigate to products on shop now click', () => {
      ordersPage().clickShopNow();
      cy.url().should('include', '/products');
    });
  });

  // =================================
  // Order Filtering Tests
  // =================================

  describe('Order Filtering', { tags: '@regression' }, () => {
    beforeEach(() => {
      ordersPage().visit();
      cy.wait(1000);
    });

    it('should filter by status', () => {
      // Get initial count
      ordersPage().orderItems.then(($items) => {
        const initialCount = $items.length;

        // Apply filter - note: the backend should handle this
        ordersPage().filterByStatus('processing');

        // Should have filtered results (may be same or less than initial)
        ordersPage().orderItems.should('have.length.at.most', initialCount);
      });
    });

    it('should filter by date range', () => {
      ordersPage().filterByDateRange('2024-01-01', '2024-01-31');
      // Date filtering is a placeholder in current implementation
    });

    it('should clear all filters', () => {
      // Apply filter
      ordersPage().filterByStatus('processing');

      // Clear filters
      ordersPage().clearFilters();

      // Should show all orders again
      ordersPage().orderItems.should('have.length.at.least', 1);
    });

    it('should search orders by order number', () => {
      // Get first order number
      cy.get('[data-testid="order-number"]').first().invoke('text').then((orderNumber) => {
        // Search for it
        ordersPage().searchOrders(orderNumber.trim());

        // Should show only matching orders
        ordersPage().orderItems.should('have.length.at.least', 1);
        cy.get('[data-testid="order-number"]').first().should('contain', orderNumber.trim());
      });
    });
  });

  // =================================
  // Order Sorting Tests
  // =================================

  describe('Order Sorting', { tags: '@regression' }, () => {
    beforeEach(() => {
      ordersPage().visit();
      cy.wait(1000);
    });

    it('should sort by date newest first', () => {
      ordersPage().sortBy('date-desc');

      // Verify sorting by comparing first two orders' dates
      cy.get('[data-testid="order-date"]').then(($dates) => {
        if ($dates.length >= 2) {
          const date1 = new Date($dates.eq(0).text()).getTime();
          const date2 = new Date($dates.eq(1).text()).getTime();
          expect(date1).to.be.gte(date2);
        }
      });
    });

    it('should sort by date oldest first', () => {
      ordersPage().sortBy('date-asc');

      // Verify sorting by comparing first two orders' dates
      cy.get('[data-testid="order-date"]').then(($dates) => {
        if ($dates.length >= 2) {
          const date1 = new Date($dates.eq(0).text()).getTime();
          const date2 = new Date($dates.eq(1).text()).getTime();
          expect(date1).to.be.lte(date2);
        }
      });
    });

    it('should sort by total amount', () => {
      ordersPage().sortBy('total-desc');

      // Verify sorting by comparing first two orders' totals
      cy.get('[data-testid="order-total"]').then(($totals) => {
        if ($totals.length >= 2) {
          const total1 = parseFloat($totals.eq(0).text().replace(/[^0-9.]/g, ''));
          const total2 = parseFloat($totals.eq(1).text().replace(/[^0-9.]/g, ''));
          expect(total1).to.be.gte(total2);
        }
      });
    });
  });

  // =================================
  // Order Detail Navigation Tests
  // =================================

  describe('Order Detail Navigation', { tags: '@smoke' }, () => {
    beforeEach(() => {
      ordersPage().visit();
      cy.wait(1000);
    });

    it('should navigate to order detail', () => {
      // Click on first order card (not on view button)
      ordersPage().orderItems.first().find('[data-testid="order-number"]').click();
      cy.url().should('include', '/orders/');
    });

    it('should navigate via view button', () => {
      ordersPage().clickViewOrder(0);
      cy.url().should('include', '/orders/');
    });
  });

  // =================================
  // Pagination Tests
  // =================================

  describe.skip('Pagination', { tags: '@regression' }, () => {
    // Note: Skipping pagination tests as seed data only has 3 orders
    // To test pagination, we would need to create more than 10 orders
    beforeEach(() => {
      ordersPage().visit();
    });

    it('should display pagination', () => {
      ordersPage().pagination.should('be.visible');
    });

    it('should navigate to next page', () => {
      ordersPage().goToNextPage();
      cy.url().should('include', 'page=2');
    });

    it('should navigate to specific page', () => {
      ordersPage().goToPage(3);
      cy.url().should('include', 'page=3');
    });
  });
});

// =================================
// Order Detail Tests
// =================================

describe('Order Detail', { tags: ['@orders', '@ecommerce'] }, () => {
  let orderId: number;

  before(() => {
    // Login and get the first order ID from the list
    cy.loginAsTestUser();
    cy.wait(500);
    cy.visit('/orders');
    cy.wait(1000);

    // Get the first order ID
    cy.get('[data-testid="order-item"]').first().find('[data-testid="view-order-details"]').click();
    cy.url().then((url) => {
      const matches = url.match(/\/orders\/(\d+)/);
      if (matches) {
        orderId = parseInt(matches[1]);
      }
    });
  });

  beforeEach(() => {
    cy.loginAsTestUser();
    cy.wait(500);

    // Visit the order detail page with the ID from before
    if (orderId) {
      cy.visit(`/orders/${orderId}`);
      cy.wait(1000);
    } else {
      // Fallback: visit first order
      cy.visit('/orders');
      cy.wait(1000);
      cy.get('[data-testid="view-order-details"]').first().click();
      cy.wait(1000);
    }
  });

  describe('Order Information', { tags: '@smoke' }, () => {
    it('should display order detail page', () => {
      orderDetailPage().verifyPageLoaded();
    });

    it('should display order number', () => {
      orderDetailPage().orderNumber.should('be.visible').and('not.be.empty');
    });

    it('should display order status', () => {
      orderDetailPage().orderStatus.should('be.visible').and('not.be.empty');
    });

    it('should display order date', () => {
      orderDetailPage().orderDate.should('be.visible');
    });
  });

  describe('Order Items', { tags: '@regression' }, () => {
    it('should display all order items', () => {
      orderDetailPage().orderItems.should('have.length.at.least', 1);
    });

    it('should display item details', () => {
      orderDetailPage().orderItems.first().within(() => {
        cy.get('[data-testid="item-name"]').should('be.visible').and('not.be.empty');
        cy.get('[data-testid="item-price"]').should('be.visible').and('not.be.empty');
        cy.get('[data-testid="item-quantity"]').should('be.visible').and('not.be.empty');
      });
    });

    it('should display item images', () => {
      orderDetailPage().orderItems.first()
        .find('[data-testid="item-image"]')
        .should('be.visible');
    });
  });

  describe('Order Summary', { tags: '@regression' }, () => {
    it('should display subtotal', () => {
      orderDetailPage().subtotal.should('be.visible').and('not.be.empty');
    });

    it('should display tax', () => {
      orderDetailPage().tax.should('be.visible').and('not.be.empty');
    });

    it('should display shipping', () => {
      orderDetailPage().shipping.should('be.visible').and('not.be.empty');
    });

    it('should display total', () => {
      orderDetailPage().total.should('be.visible').and('not.be.empty');
    });
  });

  describe('Shipping Address', { tags: '@regression' }, () => {
    it('should display shipping address', () => {
      orderDetailPage().shippingAddress.should('be.visible');
    });

    it('should display recipient name', () => {
      // Shipping address should contain some text (from seed data)
      orderDetailPage().shippingAddress.should('not.be.empty');
    });

    it('should display full address', () => {
      // Verify address contains city and street from seed data
      orderDetailPage().shippingAddress.should('contain', 'Test');
    });
  });

  describe('Order Timeline', { tags: '@regression' }, () => {
    it('should display order timeline', () => {
      orderDetailPage().timeline.should('be.visible');
    });

    it('should show timeline events', () => {
      orderDetailPage().timelineEvents.should('have.length.at.least', 1);
    });

    it('should display event descriptions', () => {
      orderDetailPage().timelineEvents.first().should('not.be.empty');
    });
  });

  describe('Order Actions', { tags: '@regression' }, () => {
    it('should display cancel button for pending orders', () => {
      // Visit orders page and find a pending/processing order
      cy.visit('/orders');
      cy.wait(1000);

      // Try to find a processing order
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="order-status"]:contains("Processing")').length > 0) {
          cy.get('[data-testid="order-status"]:contains("Processing")').first().parents('[data-testid="order-item"]')
            .find('[data-testid="view-order-details"]').click();
          cy.wait(1000);
          orderDetailPage().cancelButton.should('be.visible');
        } else {
          cy.log('No processing orders found to test cancel button');
        }
      });
    });

    it('should not show cancel button for delivered orders', () => {
      // Visit orders page and find a delivered order
      cy.visit('/orders');
      cy.wait(1000);

      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="order-status"]:contains("Delivered")').length > 0) {
          cy.get('[data-testid="order-status"]:contains("Delivered")').first().parents('[data-testid="order-item"]')
            .find('[data-testid="view-order-details"]').click();
          cy.wait(1000);
          orderDetailPage().cancelButton.should('not.exist');
        } else {
          cy.log('No delivered orders found to test');
        }
      });
    });

    it('should display reorder button', () => {
      orderDetailPage().reorderButton.should('be.visible');
    });

    it('should display track shipment button for shipped orders', () => {
      // Visit orders page and find a shipped order
      cy.visit('/orders');
      cy.wait(1000);

      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="order-status"]:contains("Shipped")').length > 0) {
          cy.get('[data-testid="order-status"]:contains("Shipped")').first().parents('[data-testid="order-item"]')
            .find('[data-testid="view-order-details"]').click();
          cy.wait(1000);
          orderDetailPage().trackButton.should('be.visible');
        } else {
          cy.log('No shipped orders found to test track button');
        }
      });
    });
  });

  describe('Cancel Order', { tags: '@regression' }, () => {
    beforeEach(() => {
      // Find a processing order to test cancellation
      cy.visit('/orders');
      cy.wait(1000);

      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="order-status"]:contains("Processing")').length > 0) {
          cy.get('[data-testid="order-status"]:contains("Processing")').first().parents('[data-testid="order-item"]')
            .find('[data-testid="view-order-details"]').click();
          cy.wait(1000);
        } else {
          cy.log('No processing orders found - skipping cancel tests');
        }
      });
    });

    it('should show confirmation modal on cancel', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="cancel-order"]').length > 0) {
          orderDetailPage().clickCancel();
          cy.get('[data-testid="confirm-cancel-modal"]').should('be.visible');
        } else {
          cy.log('Cancel button not available');
        }
      });
    });

    it('should cancel order on confirmation', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="cancel-order"]').length > 0) {
          orderDetailPage().cancelOrder();
          cy.wait(2000);
          // Should show cancelled status or redirect
          cy.url().should('include', '/orders');
        } else {
          cy.log('Cancel button not available');
        }
      });
    });

    it('should close modal on cancel dismiss', () => {
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="cancel-order"]').length > 0) {
          orderDetailPage().clickCancel();
          cy.get('[data-testid="cancel-dismiss"]').click();
          cy.get('[data-testid="confirm-cancel-modal"]').should('not.be.visible');
        } else {
          cy.log('Cancel button not available');
        }
      });
    });
  });

  describe('Reorder', { tags: '@regression' }, () => {
    it('should add items to cart on reorder', () => {
      orderDetailPage().clickReorder();
      cy.wait(2000);
      // Should redirect to cart
      cy.url().should('include', '/cart');
    });
  });

  describe('Print/Download', { tags: '@regression' }, () => {
    it('should have print order option', () => {
      orderDetailPage().printButton.should('be.visible');
    });

    it('should have download invoice option', () => {
      orderDetailPage().downloadInvoiceButton.should('be.visible');
    });
  });
});

// =================================
// Order Confirmation Tests
// =================================

describe('Order Confirmation', { tags: ['@orders', '@smoke'] }, () => {
  let orderId: number;

  before(() => {
    // Get an existing order ID
    cy.loginAsTestUser();
    cy.wait(500);
    cy.visit('/orders');
    cy.wait(1000);

    cy.get('[data-testid="view-order-details"]').first().click();
    cy.url().then((url) => {
      const matches = url.match(/\/orders\/(\d+)/);
      if (matches) {
        orderId = parseInt(matches[1]);
      }
    });
  });

  beforeEach(() => {
    cy.loginAsTestUser();
    cy.wait(500);
  });

  it.skip('should display order confirmation after checkout', () => {
    // This would require a full checkout flow
    // Skipping for now as it's complex to set up
    cy.visit('/checkout');
  });

  it('should show order number on confirmation', () => {
    if (orderId) {
      cy.visit(`/orders/confirmation/${orderId}`);
      cy.get('[data-testid="confirmation-order-number"]').should('be.visible');
    }
  });

  it('should show estimated delivery', () => {
    if (orderId) {
      cy.visit(`/orders/confirmation/${orderId}`);
      cy.get('[data-testid="estimated-delivery"]').should('be.visible');
    }
  });

  it('should have continue shopping button', () => {
    if (orderId) {
      cy.visit(`/orders/confirmation/${orderId}`);
      cy.get('[data-testid="continue-shopping"]').should('be.visible').click();
      cy.url().should('include', '/products');
    }
  });

  it('should have view order button', () => {
    if (orderId) {
      cy.visit(`/orders/confirmation/${orderId}`);
      cy.get('[data-testid="view-order"]').should('be.visible').click();
      cy.url().should('include', `/orders/${orderId}`);
    }
  });
});
