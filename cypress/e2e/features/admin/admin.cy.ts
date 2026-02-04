/**
 * Admin Panel Tests
 * @description Comprehensive test suite for admin functionality
 * @tags @admin @ecommerce @regression
 */

import { adminDashboardPage, adminProductsPage, adminOrdersPage, adminUsersPage } from '../../../pages';
import { APP } from '../../../utils/constants/routes';

describe('Admin Panel', { tags: ['@admin', '@ecommerce'] }, () => {
  const mockOrders = [
    { id: 1, userId: 1, total: 99.99, status: 'delivered', createdAt: '2024-01-15' },
    { id: 2, userId: 2, total: 149.99, status: 'pending', createdAt: '2024-01-16' },
    { id: 3, userId: 3, total: 49.99, status: 'delivered', createdAt: '2024-01-17' },
  ];

  const mockUsers = [
    { id: 1, email: 'user1@test.com', name: 'User 1', role: 'customer' },
    { id: 2, email: 'user2@test.com', name: 'User 2', role: 'customer' },
    { id: 3, email: 'user3@test.com', name: 'User 3', role: 'admin' },
  ];

  beforeEach(() => {
    cy.loginAsAdmin();
  });

  // =================================
  // Admin Dashboard Tests
  // =================================

  describe('Admin Dashboard', { tags: '@smoke' }, () => {
    beforeEach(() => {
      adminDashboardPage()
        .mockDashboardData(mockOrders, mockUsers)
        .visit();
    });

    it('should display admin dashboard', () => {
      cy.get('[data-testid="admin-dashboard"]').should('be.visible');
    });

    it('should display stats cards', () => {
      cy.get('[data-testid="stats-total-orders"]').should('be.visible');
      cy.get('[data-testid="stats-total-revenue"]').should('be.visible');
      cy.get('[data-testid="stats-total-users"]').should('be.visible');
      cy.get('[data-testid="stats-total-products"]').should('be.visible');
    });

    it('should display sidebar navigation', () => {
      cy.get('[data-testid="admin-sidebar"]').should('be.visible');
      cy.get('[data-testid="admin-nav-dashboard"]').should('be.visible');
      cy.get('[data-testid="admin-nav-products"]').should('be.visible');
      cy.get('[data-testid="admin-nav-orders"]').should('be.visible');
      cy.get('[data-testid="admin-nav-users"]').should('be.visible');
    });

    it('should display recent orders', () => {
      cy.get('[data-testid="recent-orders"]').should('be.visible');
    });

    it('should display recent activity', () => {
      cy.get('[data-testid="recent-activity"]').should('be.visible');
    });
  });

  // =================================
  // Admin Access Control Tests
  // =================================

  describe('Access Control', { tags: '@security' }, () => {
    it('should deny access to non-admin users', () => {
      cy.clearAuth();
      cy.loginAsTestUser(); // Regular user

      adminDashboardPage()
        .mockDashboardData(mockOrders, mockUsers)
        .visit({ failOnStatusCode: false });

      // Should redirect or show access denied
      cy.url().should('not.include', '/admin');
    });

    it('should redirect unauthenticated users to login', () => {
      cy.clearAuth();
      adminDashboardPage()
        .mockDashboardData(mockOrders, mockUsers)
        .visit({ failOnStatusCode: false });

      cy.url().should('include', '/login');
    });
  });
});

// =================================
// Admin Products Management Tests
// =================================

describe('Admin Products Management', { tags: ['@admin', '@products'] }, () => {
  const mockProducts = [
    { id: 1, name: 'Product 1', price: 99.99, stock: 50, status: 'active', categoryId: 1, category: { id: 1, name: 'Electronics', slug: 'electronics' } },
    { id: 2, name: 'Product 2', price: 149.99, stock: 0, status: 'out_of_stock', categoryId: 2, category: { id: 2, name: 'Clothing', slug: 'clothing' } },
    { id: 3, name: 'Product 3', price: 49.99, stock: 100, status: 'active', categoryId: 1, category: { id: 1, name: 'Electronics', slug: 'electronics' } },
  ];

  beforeEach(() => {
    cy.loginAsAdmin();
    // Visit a simple page first to establish the session context
    cy.visit('/');
    // Now setup interceptors and visit the admin page
    adminProductsPage().mockProducts(mockProducts);
    cy.visit('/admin/products');
  });

  describe('Products List', { tags: '@smoke' }, () => {
    it('should display products table', () => {
      adminProductsPage().verifyPageLoaded();
      adminProductsPage().productsTable.should('be.visible');
    });

    it('should display all products', () => {
      adminProductsPage().productRows.should('have.length', 3);
    });

    it('should display product details in table', () => {
      adminProductsPage().productRows.first().within(() => {
        cy.get('[data-testid="product-name"]').should('contain', 'Product 1');
        cy.get('[data-testid="product-price"]').should('contain', '99.99');
        cy.get('[data-testid="product-stock"]').should('contain', '50');
        cy.get('[data-testid="product-status"]').should('be.visible');
      });
    });

    it('should show action buttons for each product', () => {
      adminProductsPage().productRows.first().within(() => {
        cy.get('[data-testid="edit-product"]').should('be.visible');
        cy.get('[data-testid="delete-product"]').should('be.visible');
      });
    });
  });

  describe('Product Search and Filter', { tags: '@regression' }, () => {
    it('should search products by name', () => {
      adminProductsPage().searchProducts('Product 1');
      adminProductsPage().productRows.should('have.length', 1);
    });

    it('should filter by category', () => {
      // Wait for categories to load first
      adminProductsPage().filterByCategory('1');
      // The filter triggers a new products request automatically via the onChange handler
      adminProductsPage().productRows.should('have.length', 2);
    });

    it('should filter by status', () => {
      adminProductsPage().filterByStatus('out_of_stock');
      adminProductsPage().productRows.should('have.length', 1);
    });

    it('should clear filters', () => {
      adminProductsPage()
        .filterByCategory('Electronics')
        .clearFilters();

      adminProductsPage().productRows.should('have.length', 3);
    });
  });

  describe('Create Product', { tags: '@regression' }, () => {
    beforeEach(() => {
      adminProductsPage().interceptCreateProduct();
    });

    it('should open create product modal', () => {
      adminProductsPage().clickAddProduct();
      adminProductsPage().productModal.should('be.visible');
    });

    it('should create new product', () => {
      const newProduct = {
        name: 'New Product',
        price: 79.99,
        stock: 25,
        category: 'Electronics',
        description: 'A new product description',
      };

      adminProductsPage()
        .clickAddProduct()
        .fillProductForm(newProduct)
        .submitProductForm();

      cy.wait('@createProduct').then((interception) => {
        if (interception.response.statusCode !== 201) {
          cy.log('Error Response:', JSON.stringify(interception.response.body));
          console.log('Error Response:', interception.response.body);
        }
        expect(interception.response.statusCode).to.eq(201);
      });
    });

    it('should validate required fields', () => {
      adminProductsPage()
        .clickAddProduct()
        .submitProductForm();

      cy.get('[data-testid="name-error"]').should('be.visible');
      cy.get('[data-testid="price-error"]').should('be.visible');
    });
  });

  describe('Edit Product', { tags: '@regression' }, () => {
    beforeEach(() => {
      adminProductsPage().interceptUpdateProduct();
    });

    it('should open edit product modal', () => {
      adminProductsPage().clickEditProduct(0);
      adminProductsPage().productModal.should('be.visible');
    });

    it('should populate form with product data', () => {
      adminProductsPage().clickEditProduct(0);

      adminProductsPage().productNameInput.should('have.value', 'Product 1');
      adminProductsPage().productPriceInput.should('have.value', '99.99');
    });

    it('should update product', () => {
      adminProductsPage()
        .clickEditProduct(0)
        .updateProductName('Updated Product')
        .submitProductForm();

      cy.wait('@updateProduct').its('response.statusCode').should('eq', 200);
    });
  });

  describe('Delete Product', { tags: '@regression' }, () => {
    beforeEach(() => {
      adminProductsPage().interceptDeleteProduct();
    });

    it('should show delete confirmation', () => {
      adminProductsPage().clickDeleteProduct(0);
      cy.get('[data-testid="confirm-delete-modal"]').should('be.visible');
    });

    it('should delete product on confirmation', () => {
      adminProductsPage().deleteProduct(0);

      cy.wait('@deleteProduct').its('response.statusCode').should('eq', 200);
    });

    it('should cancel delete', () => {
      adminProductsPage().clickDeleteProduct(0);
      cy.get('[data-testid="cancel-delete"]').click();
      cy.get('[data-testid="confirm-delete-modal"]').should('not.exist');
    });
  });

  describe('Bulk Actions', { tags: '@regression' }, () => {
    it('should select all products', () => {
      adminProductsPage().selectAllProducts();
      adminProductsPage().selectedCount.should('contain', '3');
    });

    it('should select individual products', () => {
      adminProductsPage().selectProduct(0);
      adminProductsPage().selectProduct(1);
      adminProductsPage().selectedCount.should('contain', '2');
    });

    it('should bulk delete products', () => {
      adminProductsPage().interceptBulkDelete();

      adminProductsPage()
        .selectProduct(0)
        .selectProduct(1)
        .bulkDelete();

      cy.wait('@bulkDelete');
    });

    it('should bulk update status', () => {
      adminProductsPage().interceptBulkUpdate();

      adminProductsPage()
        .selectProduct(0)
        .selectProduct(2)
        .bulkUpdateStatus('inactive');

      cy.wait('@bulkUpdate');
    });
  });
});

// =================================
// Admin Orders Management Tests
// =================================

describe('Admin Orders Management', { tags: ['@admin', '@orders'] }, () => {
  const mockOrders = [
    { id: 1, status: 'pending', total: 199.99, user: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' }, createdAt: '2024-01-15T00:00:00.000Z', paymentStatus: 'completed' },
    { id: 2, status: 'processing', total: 99.99, user: { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' }, createdAt: '2024-01-16T00:00:00.000Z', paymentStatus: 'completed' },
    { id: 3, status: 'shipped', total: 299.99, user: { firstName: 'Bob', lastName: 'Williams', email: 'bob@example.com' }, createdAt: '2024-01-17T00:00:00.000Z', paymentStatus: 'completed' },
    { id: 4, status: 'delivered', total: 149.99, user: { firstName: 'Alice', lastName: 'Brown', email: 'alice@example.com' }, createdAt: '2024-01-18T00:00:00.000Z', paymentStatus: 'completed' },
  ];

  beforeEach(() => {
    cy.loginAsAdmin();
    adminOrdersPage().mockOrders(mockOrders);
    adminOrdersPage().visit();
  });

  describe('Orders List', { tags: '@smoke' }, () => {
    it('should display orders table', () => {
      adminOrdersPage().verifyPageLoaded();
      adminOrdersPage().ordersTable.should('be.visible');
    });

    it('should display all orders', () => {
      adminOrdersPage().orderRows.should('have.length', 4);
    });

    it('should display order details', () => {
      adminOrdersPage().orderRows.first().within(() => {
        cy.get('[data-testid="order-number"]').should('contain', '#1');
        cy.get('[data-testid="order-customer"]').should('contain', 'John Doe');
        cy.get('[data-testid="order-total"]').should('contain', '199.99');
        cy.get('[data-testid="status-select"]').should('be.visible');
      });
    });
  });

  describe('Order Filtering', { tags: '@regression' }, () => {
    it('should filter by status', () => {
      adminOrdersPage().filterByStatus('pending');
      adminOrdersPage().orderRows.should('have.length', 1);
    });

    it('should filter by date range', () => {
      adminOrdersPage().filterByDateRange('2024-01-01', '2024-01-31');
      // Verify filtered results
    });

    it('should search by order number', () => {
      adminOrdersPage().searchOrders('1');
      adminOrdersPage().orderRows.should('have.length', 1);
    });

    it('should search by customer name', () => {
      adminOrdersPage().searchOrders('John');
      adminOrdersPage().orderRows.should('have.length', 1);
    });
  });

  describe('Update Order Status', { tags: '@regression' }, () => {
    beforeEach(() => {
      adminOrdersPage().interceptUpdateStatus();
    });

    it('should update order status', () => {
      adminOrdersPage().updateOrderStatusByIndex(0, 'processing');

      cy.wait('@updateStatus').its('response.statusCode').should('eq', 200);
    });

    it('should show status history', () => {
      adminOrdersPage().clickViewOrder(0);
      cy.get('[data-testid="status-history"]').should('be.visible');
    });
  });

  describe('Order Detail View', { tags: '@regression' }, () => {
    it('should navigate to order detail', () => {
      adminOrdersPage().clickViewOrder(0);
      cy.url().should('include', '/admin/orders/');
    });

    it('should display order items', () => {
      adminOrdersPage().clickViewOrder(0);
      cy.get('[data-testid="order-items"]').should('be.visible');
    });

    it('should display customer information', () => {
      adminOrdersPage().clickViewOrder(0);
      cy.get('[data-testid="customer-info"]').should('be.visible');
    });

    it('should display shipping information', () => {
      adminOrdersPage().clickViewOrder(0);
      cy.get('[data-testid="shipping-info"]').should('be.visible');
    });
  });

  describe('Export Orders', { tags: '@regression' }, () => {
    it('should export orders to CSV', () => {
      cy.intercept('GET', '**/orders/admin/export*', { statusCode: 200, body: 'id,status,total' }).as('exportOrders');

      adminOrdersPage().exportToCSV();

      cy.wait('@exportOrders');
    });

    it('should export filtered orders', () => {
      adminOrdersPage().filterByStatus('delivered');
      adminOrdersPage().exportToCSV();
      // Verify export includes filter
    });
  });
});

// =================================
// Admin Users Management Tests
// =================================

describe('Admin Users Management', { tags: ['@admin', '@users'] }, () => {
  const mockUsers = [
    { id: 1, email: 'john@example.com', firstName: 'John', lastName: 'Doe', role: 'user', status: 'active' },
    { id: 2, email: 'jane@example.com', firstName: 'Jane', lastName: 'Smith', role: 'admin', status: 'active' },
    { id: 3, email: 'bob@example.com', firstName: 'Bob', lastName: 'Johnson', role: 'user', status: 'inactive' },
  ];

  beforeEach(() => {
    cy.loginAsAdmin();
    adminUsersPage().mockUsers(mockUsers);
    adminUsersPage().visit();
  });

  describe('Users List', { tags: '@smoke' }, () => {
    it('should display users table', () => {
      adminUsersPage().verifyPageLoaded();
      adminUsersPage().usersTable.should('be.visible');
    });

    it('should display all users', () => {
      adminUsersPage().userRows.should('have.length', 3);
    });

    it('should display user details', () => {
      adminUsersPage().userRows.first().within(() => {
        cy.get('[data-testid="user-email"]').should('contain', 'john@example.com');
        cy.get('[data-testid="user-name"]').should('contain', 'John Doe');
        cy.get('[data-testid="user-role"]').should('contain', 'user');
        cy.get('[data-testid="user-status"]').should('be.visible');
      });
    });
  });

  describe('User Search and Filter', { tags: '@regression' }, () => {
    it('should search users by email', () => {
      adminUsersPage().searchUsers('john@example.com');
      adminUsersPage().userRows.should('have.length', 1);
    });

    it('should search users by name', () => {
      adminUsersPage().searchUsers('Jane');
      adminUsersPage().userRows.should('have.length', 1);
    });

    it('should filter by role', () => {
      adminUsersPage().filterByRole('admin');
      adminUsersPage().userRows.should('have.length', 1);
    });

    it('should filter by status', () => {
      adminUsersPage().filterByStatus('inactive');
      adminUsersPage().userRows.should('have.length', 1);
    });
  });

  describe('Create User', { tags: '@regression' }, () => {
    beforeEach(() => {
      adminUsersPage().interceptCreateUser();
    });

    it('should open create user modal', () => {
      adminUsersPage().clickAddUser();
      adminUsersPage().userModal.should('be.visible');
    });

    it('should create new user', () => {
      const newUser = {
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        password: 'Password@123',
        role: 'user',
      };

      adminUsersPage()
        .clickAddUser()
        .fillUserForm(newUser)
        .submitUserForm();

      cy.wait('@createUser').its('response.statusCode').should('eq', 201);
    });

    it('should validate email uniqueness', () => {
      adminUsersPage().mockCreateUserError('Email already exists');

      adminUsersPage()
        .clickAddUser()
        .fillUserForm({ email: 'john@example.com', firstName: 'Test', lastName: 'User', password: 'Pass@123' })
        .submitUserForm();

      cy.get('[data-testid="form-error"]').should('contain', 'Email already exists');
    });
  });

  describe('Edit User', { tags: '@regression' }, () => {
    beforeEach(() => {
      adminUsersPage().interceptUpdateUser();
    });

    it('should open edit user modal', () => {
      adminUsersPage().clickEditUser(0);
      adminUsersPage().userModal.should('be.visible');
    });

    it('should update user role', () => {
      adminUsersPage()
        .clickEditUser(0)
        .selectRole('admin')
        .submitUserForm();

      cy.wait('@updateUser').its('response.statusCode').should('eq', 200);
    });

    it('should update user status', () => {
      adminUsersPage()
        .clickEditUser(2)
        .selectStatus('active')
        .submitUserForm();

      cy.wait('@updateUser');
    });
  });

  describe('Delete User', { tags: '@regression' }, () => {
    beforeEach(() => {
      adminUsersPage().interceptDeleteUser();
    });

    it('should show delete confirmation', () => {
      adminUsersPage().clickDeleteUser(0);
      cy.get('[data-testid="confirm-delete-modal"]').should('be.visible');
    });

    it('should delete user on confirmation', () => {
      adminUsersPage().deleteUser(0);

      cy.wait('@deleteUser').its('response.statusCode').should('eq', 200);
    });

    it('should not allow self-deletion', () => {
      // Current admin user should not have delete option
      adminUsersPage().userRows.eq(1).within(() => {
        cy.get('[data-testid="delete-user"]').should('be.disabled');
      });
    });
  });

  describe('User Actions', { tags: '@regression' }, () => {
    it('should send password reset email', () => {
      cy.intercept('POST', '**/users/*/reset-password', { statusCode: 200, body: { success: true } }).as('resetPassword');

      adminUsersPage().sendPasswordReset(0);

      cy.wait('@resetPassword').its('response.statusCode').should('eq', 200);
    });

    it('should impersonate user', () => {
      cy.intercept('POST', '**/users/*/impersonate', { statusCode: 200, body: { success: true } }).as('impersonate');

      adminUsersPage().impersonateUser(0);

      cy.wait('@impersonate');
    });

    it('should view user activity', () => {
      adminUsersPage().viewUserActivity(0);
      cy.get('[data-testid="user-activity"]').should('be.visible');
    });
  });
});

// =================================
// Admin Categories Management Tests
// =================================

describe('Admin Categories Management', { tags: ['@admin', '@categories'] }, () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/admin/categories');
  });

  describe('Categories List', { tags: '@smoke' }, () => {
    it('should display categories page', () => {
      cy.get('[data-testid="admin-categories"]').should('be.visible');
    });

    it('should display category tree', () => {
      cy.get('[data-testid="category-tree"]').should('be.visible');
    });
  });

  describe('CRUD Operations', { tags: '@regression' }, () => {
    it('should create new category', () => {
      cy.intercept('POST', '**/admin/categories').as('createCategory');

      cy.get('[data-testid="add-category"]').click();
      cy.get('[data-testid="category-name"]').type('New Category');
      cy.get('[data-testid="category-slug"]').type('new-category');
      cy.get('[data-testid="submit-category"]').click();

      cy.wait('@createCategory').its('response.statusCode').should('eq', 201);
    });

    it('should edit category', () => {
      cy.intercept('PUT', '**/admin/categories/*').as('updateCategory');

      cy.get('[data-testid="edit-category"]').first().click();
      cy.get('[data-testid="category-name"]').clear().type('Updated Category');
      cy.get('[data-testid="submit-category"]').click();

      cy.wait('@updateCategory').its('response.statusCode').should('eq', 200);
    });

    it('should delete category', () => {
      cy.intercept('DELETE', '**/admin/categories/*').as('deleteCategory');

      cy.get('[data-testid="delete-category"]').first().click();
      cy.get('[data-testid="confirm-delete"]').click();

      cy.wait('@deleteCategory').its('response.statusCode').should('eq', 200);
    });
  });
});

// =================================
// Admin Settings Tests
// =================================

describe('Admin Settings', { tags: ['@admin', '@settings'] }, () => {
  beforeEach(() => {
    cy.loginAsAdmin();
    cy.visit('/admin/settings');
  });

  describe('General Settings', { tags: '@regression' }, () => {
    it('should display settings page', () => {
      cy.get('[data-testid="admin-settings"]').should('be.visible');
    });

    it('should update store name', () => {
      cy.intercept('PUT', '**/admin/settings').as('updateSettings');

      cy.get('[data-testid="store-name"]').clear().type('My E-Commerce Store');
      cy.get('[data-testid="save-settings"]').click();

      cy.wait('@updateSettings').its('response.statusCode').should('eq', 200);
    });

    it('should update store email', () => {
      cy.get('[data-testid="store-email"]').clear().type('store@example.com');
      cy.get('[data-testid="save-settings"]').click();
    });
  });

  describe('Payment Settings', { tags: '@regression' }, () => {
    it('should display payment providers', () => {
      cy.get('[data-testid="payment-settings"]').click();
      cy.get('[data-testid="payment-providers"]').should('be.visible');
    });

    it('should toggle payment provider', () => {
      cy.get('[data-testid="payment-settings"]').click();
      cy.get('[data-testid="toggle-stripe"]').click();
    });
  });

  describe('Shipping Settings', { tags: '@regression' }, () => {
    it('should display shipping zones', () => {
      cy.get('[data-testid="shipping-settings"]').click();
      cy.get('[data-testid="shipping-zones"]').should('be.visible');
    });

    it('should add shipping zone', () => {
      cy.get('[data-testid="shipping-settings"]').click();
      cy.get('[data-testid="add-shipping-zone"]').click();
      cy.get('[data-testid="zone-name"]').type('US Domestic');
      cy.get('[data-testid="zone-rate"]').type('9.99');
      cy.get('[data-testid="save-zone"]').click();
    });
  });
});
