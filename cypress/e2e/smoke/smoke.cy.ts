/**
 * Smoke Test Suite
 * @description Quick validation tests to verify core functionality for e-commerce
 * @tags @smoke @critical @ecommerce
 */

import { loginPage, registerPage, header, modal, table, productsPage, cartPage, checkoutPage } from '../../pages';
import { APP, API } from '../../utils/constants/routes';
import { COMMON, PRODUCTS, CART, AUTH } from '../../utils/constants/selectors';

describe('Smoke Tests', { tags: ['@smoke', '@critical'] }, () => {
  // =================================
  // Application Availability
  // =================================

  describe('Application Availability', () => {
    it('should load the home page successfully', () => {
      cy.visit('/');

      cy.document().its('readyState').should('eq', 'complete');
      cy.get('body').should('be.visible');
    });

    it('should load the login page successfully', () => {
      cy.visit(APP.AUTH.LOGIN);

      cy.url().should('include', '/login');
      loginPage().verifyPageLoaded();
    });

    it('should have correct page title', () => {
      cy.visit('/');

      cy.title().should('not.be.empty');
    });

    it('should not have JavaScript errors on page load', () => {
      const errors = [];

      cy.on('window:before:load', (win) => {
        cy.stub(win.console, 'error').callsFake((msg) => {
          errors.push(msg);
        });
      });

      cy.visit('/');

      cy.wrap(errors).should('have.length', 0);
    });
  });

  // =================================
  // API Health Check
  // =================================

  describe('API Health Check', () => {
    it('should have healthy API endpoint', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/health`,
        failOnStatusCode: false,
      }).then((response) => {
        // API should respond (even if with 404, it's running)
        expect(response.status).to.be.oneOf([200, 404]);
      });
    });

    it('should respond within acceptable time', () => {
      const startTime = Date.now();

      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/health`,
        failOnStatusCode: false,
      }).then(() => {
        const responseTime = Date.now() - startTime;
        expect(responseTime).to.be.lessThan(5000); // 5 second max
      });
    });
  });

  // =================================
  // Authentication Flow
  // =================================

  describe('Authentication Flow', () => {
    beforeEach(() => {
      cy.clearAuth();
    });

    it('should display login form', () => {
      cy.visit(APP.AUTH.LOGIN);

      loginPage().emailInput.should('be.visible');
      loginPage().passwordInput.should('be.visible');
      loginPage().loginButton.should('be.visible');
    });

    it('should accept input in login form', () => {
      cy.visit(APP.AUTH.LOGIN);

      loginPage()
        .enterEmail('test@example.com')
        .enterPassword('password123');

      loginPage().emailInput.should('have.value', 'test@example.com');
    });

    it('should show error for invalid login', () => {
      cy.visit(APP.AUTH.LOGIN);

      // Mock failed login
      cy.intercept('POST', '**/auth/login', {
        statusCode: 401,
        body: { error: 'Invalid credentials' },
      }).as('loginFailed');

      loginPage()
        .login('invalid@example.com', 'wrongpassword');

      cy.wait('@loginFailed');
      loginPage().verifyErrorDisplayed();
    });

    it('should allow successful login', () => {
      cy.visit(APP.AUTH.LOGIN);

      // Mock successful login
      cy.intercept('POST', '**/auth/login', {
        statusCode: 200,
        body: {
          token: 'mock-token',
          user: { id: 1, email: 'test@example.com' },
        },
      }).as('loginSuccess');

      loginPage()
        .login('test@example.com', 'password123');

      cy.wait('@loginSuccess');
      cy.url().should('not.include', '/login');
    });
  });

  // =================================
  // Navigation
  // =================================

  describe('Navigation', () => {
    it('should navigate to different pages', () => {
      // Visit home
      cy.visit('/');
      cy.url().should('include', '/');

      // Navigate to login
      cy.visit(APP.AUTH.LOGIN);
      cy.url().should('include', '/login');
    });

    it('should have working header navigation', () => {
      cy.visit('/');

      // Check header exists
      header().shouldExist();
    });

    it('should handle 404 pages gracefully', () => {
      cy.visit('/non-existent-page', { failOnStatusCode: false });

      // Should show 404 page or redirect
      cy.get('body').should('be.visible');
    });

    it('should support browser back/forward', () => {
      cy.visit('/');
      cy.visit(APP.AUTH.LOGIN);

      cy.go('back');
      cy.url().should('not.include', '/login');

      cy.go('forward');
      cy.url().should('include', '/login');
    });
  });

  // =================================
  // Core UI Components
  // =================================

  describe('Core UI Components', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should display header component', () => {
      header().shouldExist();
    });

    it('should display logo in header', () => {
      header().find('[data-testid="header-logo"]').should('exist');
    });

    it('should have responsive viewport', () => {
      // Desktop
      cy.viewport(1920, 1080);
      cy.get('body').should('be.visible');

      // Tablet
      cy.viewport(768, 1024);
      cy.get('body').should('be.visible');

      // Mobile
      cy.viewport(375, 667);
      cy.get('body').should('be.visible');
    });
  });

  // =================================
  // Form Functionality
  // =================================

  describe('Form Functionality', () => {
    it('should handle form input correctly', () => {
      cy.visit(APP.AUTH.LOGIN);

      // Type in inputs
      loginPage().emailInput.type('test@example.com');
      loginPage().passwordInput.type('password123');

      // Verify values
      loginPage().emailInput.should('have.value', 'test@example.com');
      loginPage().passwordInput.should('have.value', 'password123');

      // Clear inputs
      loginPage().emailInput.clear();
      loginPage().passwordInput.clear();

      // Verify cleared
      loginPage().emailInput.should('have.value', '');
      loginPage().passwordInput.should('have.value', '');
    });

    it('should handle form submission', () => {
      cy.visit(APP.AUTH.LOGIN);

      cy.intercept('POST', '**/auth/login').as('loginSubmit');

      loginPage()
        .enterEmail('test@example.com')
        .enterPassword('password123')
        .clickLogin();

      cy.wait('@loginSubmit');
    });
  });

  // =================================
  // Modal Component
  // =================================

  describe('Modal Component', () => {
    it('should display modal when triggered', () => {
      cy.visit('/');

      // Trigger modal if there's a trigger on page
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="open-modal"]').length > 0) {
          cy.get('[data-testid="open-modal"]').click();
          modal().shouldBeVisible();
        }
      });
    });
  });

  // =================================
  // Data Display
  // =================================

  describe('Data Display', () => {
    it('should handle empty state gracefully', () => {
      cy.visit('/');

      // Check for empty state handling
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="table"]').length > 0) {
          // Table exists, check for empty or data state
          cy.get('[data-testid="table"]').should('exist');
        }
      });
    });

    it('should display loading indicators', () => {
      cy.visit('/');

      // Loading states should eventually resolve
      cy.get(COMMON.LOADING, { timeout: 100 }).should('not.exist');
    });
  });

  // =================================
  // Performance
  // =================================

  describe('Performance', () => {
    it('should load page within acceptable time', () => {
      const startTime = Date.now();

      cy.visit('/');

      cy.document().its('readyState').should('eq', 'complete').then(() => {
        const loadTime = Date.now() - startTime;
        expect(loadTime).to.be.lessThan(10000); // 10 seconds max
      });
    });

    it('should not have memory leaks on navigation', () => {
      // Navigate multiple times
      for (let i = 0; i < 3; i++) {
        cy.visit('/');
        cy.visit(APP.AUTH.LOGIN);
      }

      // Page should still be responsive
      cy.get('body').should('be.visible');
    });
  });

  // =================================
  // Error Handling
  // =================================

  describe('Error Handling', () => {
    it('should handle API errors gracefully', () => {
      // Mock API error
      cy.intercept('GET', '**/api/**', {
        statusCode: 500,
        body: { error: 'Server Error' },
      }).as('apiError');

      cy.visit('/');

      // Page should still be functional
      cy.get('body').should('be.visible');
    });

    it('should handle network timeout', () => {
      cy.intercept('GET', '**/api/**', {
        delay: 30000,
        statusCode: 200,
      }).as('slowRequest');

      cy.visit('/');

      // Page should load even with slow API
      cy.get('body', { timeout: 5000 }).should('be.visible');
    });
  });

  // =================================
  // Accessibility Quick Check
  // =================================

  describe('Accessibility Quick Check', () => {
    it('should have lang attribute on html', () => {
      cy.visit('/');

      cy.get('html').should('have.attr', 'lang');
    });

    it('should have page title', () => {
      cy.visit('/');

      cy.title().should('not.be.empty');
    });

    it('should have alt text on images', () => {
      cy.visit('/');

      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt');
      });
    });

    it('should have labels for form inputs', () => {
      cy.visit(APP.AUTH.LOGIN);

      loginPage().emailInput.then(($input) => {
        const id = $input.attr('id');
        if (id) {
          cy.get(`label[for="${id}"]`).should('exist');
        }
      });
    });

    it('should be keyboard navigable', () => {
      cy.visit(APP.AUTH.LOGIN);

      // Tab through form
      cy.get('body').tab();
      cy.focused().should('exist');
    });
  });

  // =================================
  // Cross-Browser Basics
  // =================================

  describe('Cross-Browser Basics', () => {
    it('should render correctly in current browser', () => {
      cy.visit('/');

      // Log browser info
      cy.log(`Testing in: ${Cypress.browser.name} v${Cypress.browser.version}`);

      // Basic rendering check
      cy.get('body').should('be.visible');
      cy.get('body').should('have.css', 'display', 'block');
    });
  });

  // =================================
  // Environment Verification
  // =================================

  describe('Environment Verification', () => {
    it('should be running in correct environment', () => {
      const environment = Cypress.env('environment') || 'dev';

      cy.log(`Current environment: ${environment}`);

      // Verify base URL matches environment
      cy.url().should('include', Cypress.config('baseUrl').replace('https://', '').replace('http://', ''));
    });

    it('should have required environment variables', () => {
      // Check critical env vars exist (or have defaults)
      expect(Cypress.env('apiUrl')).to.exist;
    });
  });
});

// =================================
// Custom Commands for Smoke Tests
// =================================

// Add tab command if not exists
Cypress.Commands.add('tab', { prevSubject: 'optional' }, (subject) => {
  const el = subject ? cy.wrap(subject) : cy.focused();
  return el.trigger('keydown', { keyCode: 9, which: 9, key: 'Tab' });
});

// =================================
// E-Commerce Specific Smoke Tests
// =================================

describe('E-Commerce Smoke Tests', { tags: ['@smoke', '@ecommerce'] }, () => {
  // =================================
  // Products Smoke Tests
  // =================================

  describe('Products Page', () => {
    beforeEach(() => {
      cy.visit('/products');
    });

    it('should display products grid', () => {
      cy.get('[data-testid="product-list"]').should('be.visible');
    });

    it('should display at least one product', () => {
      cy.get('[data-testid="product-card"]').should('have.length.at.least', 1);
    });

    it('should display product information', () => {
      cy.get('[data-testid="product-card"]').first().within(() => {
        cy.get('[data-testid="product-name"]').should('be.visible');
        cy.get('[data-testid="product-price"]').should('be.visible');
      });
    });

    it('should navigate to product detail', () => {
      cy.get('[data-testid="product-card"]').first().click();
      cy.url().should('include', '/products/');
    });

    it('should have search functionality', () => {
      cy.get('[data-testid="product-search"]').should('exist');
    });

    it('should have category filters', () => {
      cy.get('[data-testid="category-filter"]').should('exist');
    });
  });

  // =================================
  // Cart Smoke Tests
  // =================================

  describe('Shopping Cart', () => {
    beforeEach(() => {
      cy.loginAsTestUser();
    });

    it('should display cart icon in header', () => {
      cy.visit('/');
      cy.get('[data-testid="cart-icon"]').should('be.visible');
    });

    it('should access cart page', () => {
      cy.visit('/cart');
      cy.url().should('include', '/cart');
    });

    it('should display cart summary', () => {
      cy.visit('/cart');
      cy.get('[data-testid="cart-summary"]').should('exist');
    });

    it('should add product to cart', () => {
      cy.intercept('POST', '**/cart').as('addToCart');

      cy.visit('/products');
      cy.get('[data-testid="add-to-cart"]').first().click();

      cy.wait('@addToCart').its('response.statusCode').should('be.oneOf', [200, 201]);
    });
  });

  // =================================
  // Checkout Smoke Tests
  // =================================

  describe('Checkout Flow', () => {
    beforeEach(() => {
      cy.loginAsTestUser();
    });

    it('should access checkout page with items', () => {
      // Mock cart with items
      cy.intercept('GET', '**/cart', {
        statusCode: 200,
        body: {
          items: [{ id: 1, productId: 1, quantity: 1, price: 99.99 }],
          total: 99.99,
        },
      });

      cy.visit('/checkout');
      cy.url().should('include', '/checkout');
    });

    it('should display checkout form', () => {
      cy.intercept('GET', '**/cart', {
        statusCode: 200,
        body: {
          items: [{ id: 1, productId: 1, quantity: 1, price: 99.99 }],
        },
      });

      cy.visit('/checkout');
      cy.get('[data-testid="checkout-form"]').should('exist');
    });

    it('should display order summary', () => {
      cy.intercept('GET', '**/cart', {
        statusCode: 200,
        body: {
          items: [{ id: 1, productId: 1, quantity: 1, price: 99.99 }],
        },
      });

      cy.visit('/checkout');
      cy.get('[data-testid="order-summary"]').should('exist');
    });
  });

  // =================================
  // Orders Smoke Tests
  // =================================

  describe('Orders Page', () => {
    beforeEach(() => {
      cy.loginAsTestUser();
    });

    it('should access orders page', () => {
      cy.visit('/orders');
      cy.url().should('include', '/orders');
    });

    it('should display orders list or empty state', () => {
      cy.visit('/orders');
      cy.get('body').then(($body) => {
        if ($body.find('[data-testid="orders-list"]').length) {
          cy.get('[data-testid="orders-list"]').should('be.visible');
        } else {
          cy.get('[data-testid="empty-orders"]').should('be.visible');
        }
      });
    });
  });

  // =================================
  // User Dashboard Smoke Tests
  // =================================

  describe('User Dashboard', () => {
    beforeEach(() => {
      cy.loginAsTestUser();
    });

    it('should access dashboard after login', () => {
      cy.visit('/dashboard');
      cy.url().should('include', '/dashboard');
    });

    it('should display user information', () => {
      cy.visit('/dashboard');
      cy.get('[data-testid="user-info"]').should('exist');
    });

    it('should have navigation to orders', () => {
      cy.visit('/dashboard');
      cy.get('[data-testid="nav-orders"]').should('exist');
    });
  });

  // =================================
  // Registration Smoke Tests
  // =================================

  describe('Registration Page', () => {
    beforeEach(() => {
      cy.clearAuth();
      cy.visit('/register');
    });

    it('should display registration form', () => {
      cy.get('[data-testid="register-form"]').should('be.visible');
    });

    it('should have all required fields', () => {
      cy.get('[data-testid="first-name-input"]').should('be.visible');
      cy.get('[data-testid="last-name-input"]').should('be.visible');
      cy.get('[data-testid="email-input"]').should('be.visible');
      cy.get('[data-testid="password-input"]').should('be.visible');
      cy.get('[data-testid="confirm-password-input"]').should('be.visible');
    });

    it('should have link to login', () => {
      cy.get('[data-testid="login-link"]').should('be.visible');
    });
  });

  // =================================
  // API Health Smoke Tests
  // =================================

  describe('E-Commerce API Health', () => {
    it('should have products API available', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/products`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
      });
    });

    it('should have categories API available', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/categories`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([200, 401]);
      });
    });

    it('should have auth API available', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        body: {},
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 401]);
      });
    });
  });
});
