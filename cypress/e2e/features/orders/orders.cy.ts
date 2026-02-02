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
  });

  // =================================
  // Orders List Tests
  // =================================

  describe('Orders List', { tags: '@smoke' }, () => {
    beforeEach(() => {
      ordersPage().mockOrders([
        {
          id: 1,
          orderNumber: 'ORD-001',
          status: 'delivered',
          total: 199.99,
          createdAt: '2024-01-15T10:00:00Z',
          items: 3,
        },
        {
          id: 2,
          orderNumber: 'ORD-002',
          status: 'processing',
          total: 99.99,
          createdAt: '2024-01-20T14:30:00Z',
          items: 1,
        },
        {
          id: 3,
          orderNumber: 'ORD-003',
          status: 'pending',
          total: 299.99,
          createdAt: '2024-01-22T09:15:00Z',
          items: 5,
        },
      ]);
      ordersPage().visit();
    });

    it('should display orders page', () => {
      ordersPage().verifyPageLoaded();
    });

    it('should display orders list', () => {
      ordersPage().ordersList.should('be.visible');
      ordersPage().orderItems.should('have.length', 3);
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
      ordersPage().getOrderByStatus('delivered').should('exist');
      ordersPage().getOrderByStatus('processing').should('exist');
      ordersPage().getOrderByStatus('pending').should('exist');
    });
  });

  // =================================
  // Empty Orders Tests
  // =================================

  describe('Empty Orders', { tags: '@regression' }, () => {
    beforeEach(() => {
      ordersPage().mockEmptyOrders();
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
      ordersPage().mockOrders([
        { id: 1, orderNumber: 'ORD-001', status: 'delivered', total: 199.99 },
        { id: 2, orderNumber: 'ORD-002', status: 'processing', total: 99.99 },
        { id: 3, orderNumber: 'ORD-003', status: 'cancelled', total: 149.99 },
        { id: 4, orderNumber: 'ORD-004', status: 'delivered', total: 299.99 },
      ]);
      ordersPage().visit();
    });

    it('should filter by status', () => {
      ordersPage().filterByStatus('delivered');
      ordersPage().orderItems.should('have.length', 2);
    });

    it('should filter by date range', () => {
      ordersPage().filterByDateRange('2024-01-01', '2024-01-31');
      // Verify filtered results
    });

    it('should clear all filters', () => {
      ordersPage()
        .filterByStatus('delivered')
        .clearFilters();

      ordersPage().orderItems.should('have.length', 4);
    });

    it('should search orders by order number', () => {
      ordersPage().searchOrders('ORD-001');
      ordersPage().orderItems.should('have.length', 1);
    });
  });

  // =================================
  // Order Sorting Tests
  // =================================

  describe('Order Sorting', { tags: '@regression' }, () => {
    beforeEach(() => {
      ordersPage().mockOrders([
        { id: 1, orderNumber: 'ORD-001', total: 100, createdAt: '2024-01-15T10:00:00Z' },
        { id: 2, orderNumber: 'ORD-002', total: 200, createdAt: '2024-01-10T10:00:00Z' },
        { id: 3, orderNumber: 'ORD-003', total: 50, createdAt: '2024-01-20T10:00:00Z' },
      ]);
      ordersPage().visit();
    });

    it('should sort by date newest first', () => {
      ordersPage().sortBy('date-desc');
      ordersPage().orderItems.first().should('contain', 'ORD-003');
    });

    it('should sort by date oldest first', () => {
      ordersPage().sortBy('date-asc');
      ordersPage().orderItems.first().should('contain', 'ORD-002');
    });

    it('should sort by total amount', () => {
      ordersPage().sortBy('total-desc');
      ordersPage().orderItems.first().should('contain', 'ORD-002');
    });
  });

  // =================================
  // Order Detail Navigation Tests
  // =================================

  describe('Order Detail Navigation', { tags: '@smoke' }, () => {
    beforeEach(() => {
      ordersPage().mockOrders([
        {
          id: 1,
          orderNumber: 'ORD-001',
          status: 'delivered',
          total: 199.99,
          items: [
            { id: 1, name: 'Product 1', price: 99.99, quantity: 2 },
          ],
        },
      ]);
      ordersPage().visit();
    });

    it('should navigate to order detail', () => {
      ordersPage().clickOrder(0);
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

  describe('Pagination', { tags: '@regression' }, () => {
    beforeEach(() => {
      // Mock paginated response
      const orders = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        orderNumber: `ORD-${String(i + 1).padStart(3, '0')}`,
        status: 'delivered',
        total: (i + 1) * 10,
      }));
      ordersPage().mockOrders(orders, { page: 1, perPage: 10, total: 25 });
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
  const mockOrder = {
    id: 1,
    orderNumber: 'ORD-12345',
    status: 'processing',
    subtotal: 189.98,
    tax: 19.00,
    shipping: 10.00,
    total: 218.98,
    createdAt: '2024-01-20T14:30:00Z',
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    items: [
      { id: 1, name: 'Product 1', price: 99.99, quantity: 1, image: '/img/product1.jpg' },
      { id: 2, name: 'Product 2', price: 89.99, quantity: 1, image: '/img/product2.jpg' },
    ],
    timeline: [
      { status: 'pending', date: '2024-01-20T14:30:00Z', description: 'Order placed' },
      { status: 'processing', date: '2024-01-20T15:00:00Z', description: 'Payment confirmed' },
    ],
  };

  beforeEach(() => {
    cy.loginAsTestUser();
    orderDetailPage().mockOrder(mockOrder);
    orderDetailPage().visit(1);
  });

  describe('Order Information', { tags: '@smoke' }, () => {
    it('should display order detail page', () => {
      orderDetailPage().verifyPageLoaded();
    });

    it('should display order number', () => {
      orderDetailPage().orderNumber.should('contain', 'ORD-12345');
    });

    it('should display order status', () => {
      orderDetailPage().orderStatus.should('contain', 'processing');
    });

    it('should display order date', () => {
      orderDetailPage().orderDate.should('be.visible');
    });
  });

  describe('Order Items', { tags: '@regression' }, () => {
    it('should display all order items', () => {
      orderDetailPage().orderItems.should('have.length', 2);
    });

    it('should display item details', () => {
      orderDetailPage().orderItems.first().within(() => {
        cy.get('[data-testid="item-name"]').should('contain', 'Product 1');
        cy.get('[data-testid="item-price"]').should('contain', '99.99');
        cy.get('[data-testid="item-quantity"]').should('contain', '1');
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
      orderDetailPage().subtotal.should('contain', '189.98');
    });

    it('should display tax', () => {
      orderDetailPage().tax.should('contain', '19.00');
    });

    it('should display shipping', () => {
      orderDetailPage().shipping.should('contain', '10.00');
    });

    it('should display total', () => {
      orderDetailPage().total.should('contain', '218.98');
    });
  });

  describe('Shipping Address', { tags: '@regression' }, () => {
    it('should display shipping address', () => {
      orderDetailPage().shippingAddress.should('be.visible');
    });

    it('should display recipient name', () => {
      orderDetailPage().shippingAddress.should('contain', 'John Doe');
    });

    it('should display full address', () => {
      orderDetailPage().shippingAddress.should('contain', '123 Main St');
      orderDetailPage().shippingAddress.should('contain', 'New York');
    });
  });

  describe('Order Timeline', { tags: '@regression' }, () => {
    it('should display order timeline', () => {
      orderDetailPage().timeline.should('be.visible');
    });

    it('should show timeline events', () => {
      orderDetailPage().timelineEvents.should('have.length.at.least', 2);
    });

    it('should display event descriptions', () => {
      orderDetailPage().timelineEvents.first().should('contain', 'Order placed');
    });
  });

  describe('Order Actions', { tags: '@regression' }, () => {
    it('should display cancel button for pending orders', () => {
      orderDetailPage().mockOrder({ ...mockOrder, status: 'pending' });
      orderDetailPage().visit(1);

      orderDetailPage().cancelButton.should('be.visible');
    });

    it('should not show cancel button for delivered orders', () => {
      orderDetailPage().mockOrder({ ...mockOrder, status: 'delivered' });
      orderDetailPage().visit(1);

      orderDetailPage().cancelButton.should('not.exist');
    });

    it('should display reorder button', () => {
      orderDetailPage().reorderButton.should('be.visible');
    });

    it('should display track shipment button for shipped orders', () => {
      orderDetailPage().mockOrder({ ...mockOrder, status: 'shipped' });
      orderDetailPage().visit(1);

      orderDetailPage().trackButton.should('be.visible');
    });
  });

  describe('Cancel Order', { tags: '@regression' }, () => {
    beforeEach(() => {
      orderDetailPage().mockOrder({ ...mockOrder, status: 'pending' });
      orderDetailPage().visit(1);
    });

    it('should show confirmation modal on cancel', () => {
      orderDetailPage().clickCancel();
      cy.get('[data-testid="confirm-cancel-modal"]').should('be.visible');
    });

    it('should cancel order on confirmation', () => {
      orderDetailPage().mockCancelOrder(1);
      orderDetailPage().cancelOrder();

      cy.wait('@cancelOrder');
      orderDetailPage().orderStatus.should('contain', 'cancelled');
    });

    it('should close modal on cancel dismiss', () => {
      orderDetailPage().clickCancel();
      cy.get('[data-testid="cancel-dismiss"]').click();
      cy.get('[data-testid="confirm-cancel-modal"]').should('not.exist');
    });
  });

  describe('Reorder', { tags: '@regression' }, () => {
    it('should add items to cart on reorder', () => {
      cy.intercept('POST', '**/cart', {
        statusCode: 201,
        body: { success: true },
      }).as('addToCart');

      orderDetailPage().clickReorder();

      cy.wait('@addToCart');
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
  beforeEach(() => {
    cy.loginAsTestUser();
  });

  it('should display order confirmation after checkout', () => {
    cy.intercept('POST', '**/orders', {
      statusCode: 201,
      body: {
        success: true,
        data: {
          id: 123,
          orderNumber: 'ORD-NEW-001',
          status: 'pending',
          total: 199.99,
        },
      },
    }).as('createOrder');

    cy.visit('/checkout');
    // Simulate order completion
    cy.get('[data-testid="order-confirmation"]', { timeout: 10000 }).should('be.visible');
  });

  it('should show order number on confirmation', () => {
    cy.visit('/orders/confirmation/123');
    cy.get('[data-testid="confirmation-order-number"]').should('be.visible');
  });

  it('should show estimated delivery', () => {
    cy.visit('/orders/confirmation/123');
    cy.get('[data-testid="estimated-delivery"]').should('be.visible');
  });

  it('should have continue shopping button', () => {
    cy.visit('/orders/confirmation/123');
    cy.get('[data-testid="continue-shopping"]').should('be.visible').click();
    cy.url().should('include', '/products');
  });

  it('should have view order button', () => {
    cy.visit('/orders/confirmation/123');
    cy.get('[data-testid="view-order"]').should('be.visible').click();
    cy.url().should('include', '/orders/123');
  });
});
