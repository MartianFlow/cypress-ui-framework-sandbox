/**
 * Framework Methods Demo Tests
 * @description Comprehensive examples demonstrating ALL framework methods
 * @tags @demo @framework @examples
 *
 * This file demonstrates the usage of:
 * - BasePage methods (50+ methods)
 * - BaseComponent methods (40+ methods)
 * - Auth custom commands
 * - UI custom commands
 * - API custom commands
 * - Page Objects (LoginPage, RegisterPage, ProductsPage, CartPage, etc.)
 * - Components (HeaderComponent, ModalComponent, TableComponent, etc.)
 * - Builder Pattern (UserBuilder)
 */

import {
  loginPage,
  registerPage,
  productsPage,
  productDetailPage,
  cartPage,
  checkoutPage,
  ordersPage,
  orderDetailPage,
  dashboardPage,
  profilePage,
  header,
  modal,
  table,
  productCard,
  cartDrawer,
  pagination,
} from '../../pages';
import UserBuilder from '../../utils/builders/UserBuilder';
import { APP, API } from '../../utils/constants/routes';

// =============================================================================
// SECTION 1: BasePage Methods Demonstration
// =============================================================================

describe('BasePage Methods Demo', { tags: ['@demo', '@basepage'] }, () => {
  /**
   * BasePage provides 50+ methods for page interactions.
   * This section demonstrates each method category.
   */

  // =========================================
  // Navigation Methods
  // =========================================

  describe('Navigation Methods', () => {
    it('visit() - Navigate to page with options', () => {
      // Basic visit
      loginPage().visit();
      cy.url().should('include', '/login');

      // Visit with query params
      productsPage().visit({ queryParams: { category: 'electronics', page: 1 } });
      cy.url().should('include', 'category=electronics');
      cy.url().should('include', 'page=1');

      // Visit with failOnStatusCode option
      loginPage().visit({ failOnStatusCode: false });
    });

    it('open() - Navigate and wait for page load', () => {
      // Open waits for document ready state
      loginPage().open();
      cy.document().its('readyState').should('eq', 'complete');
    });

    it('reload() - Reload current page', () => {
      loginPage().visit();

      // Normal reload
      loginPage().reload();

      // Force reload from server
      loginPage().reload(true);
    });

    it('goBack() and goForward() - Browser history navigation', () => {
      cy.visit('/');
      loginPage().visit();

      // Go back
      loginPage().goBack();
      cy.url().should('not.include', '/login');

      // Go forward
      loginPage().goForward();
      cy.url().should('include', '/login');
    });
  });

  // =========================================
  // Element Selection Methods
  // =========================================

  describe('Element Selection Methods', () => {
    beforeEach(() => {
      loginPage().visit();
    });

    it('getByTestId() - Get element by data-testid', () => {
      loginPage().getByTestId('email-input').should('exist');
      loginPage().getByTestId('password-input').should('exist');
      loginPage().getByTestId('login-button').should('exist');

      // With options
      loginPage().getByTestId('email-input', { timeout: 10000 }).should('be.visible');
    });

    it('getElement() - Get element by CSS selector', () => {
      loginPage().getElement('input[type="email"]').should('exist');
      loginPage().getElement('button[type="submit"]').should('exist');
      loginPage().getElement('.form-container').should('exist');
    });

    it('getByText() - Get element containing text', () => {
      loginPage().getByText('Login').should('exist');
      loginPage().getByText('Forgot').should('exist');

      // With options
      loginPage().getByText('Login', { timeout: 5000 }).should('be.visible');
    });

    it('getByRole() - Get element by role attribute', () => {
      loginPage().getByRole('button').should('exist');
      loginPage().getByRole('textbox').should('exist');
    });

    it('getByPlaceholder() - Get element by placeholder', () => {
      loginPage().getByPlaceholder('Email').should('exist');
      loginPage().getByPlaceholder('Password').should('exist');
    });

    it('getByLabel() - Get element by label text', () => {
      // Gets the input associated with a label
      loginPage().getByLabel('Email').should('exist');
    });
  });

  // =========================================
  // Interaction Methods
  // =========================================

  describe('Interaction Methods', () => {
    beforeEach(() => {
      loginPage().visit();
    });

    it('type() - Type text into element', () => {
      // Basic type (clears first by default)
      loginPage().type('[data-testid="email-input"]', 'test@example.com');
      loginPage().emailInput.should('have.value', 'test@example.com');

      // Type without clearing
      loginPage().type('[data-testid="password-input"]', 'password', { clear: false });

      // Type with delay
      loginPage().type('[data-testid="email-input"]', 'slow@example.com', { delay: 50 });
    });

    it('click() - Click on element', () => {
      // Basic click
      loginPage().click('[data-testid="forgot-password-link"]');

      // Click with options (force, position, etc.)
      cy.visit('/login');
      loginPage().click('[data-testid="register-link"]', { force: true });
    });

    it('doubleClick() - Double click on element', () => {
      cy.visit('/products');
      productsPage().doubleClick('[data-testid="product-card"]:first');
    });

    it('rightClick() - Right click on element', () => {
      cy.visit('/products');
      productsPage().rightClick('[data-testid="product-card"]:first');
    });

    it('select() - Select option from dropdown', () => {
      cy.visit('/products');
      // Select by value
      productsPage().select('[data-testid="sort-select"]', 'price-asc');

      // Select multiple values
      // productsPage().select('[data-testid="category-select"]', ['electronics', 'clothing']);
    });

    it('check() and uncheck() - Checkbox interactions', () => {
      loginPage().visit();

      // Check checkbox
      loginPage().check('[data-testid="remember-me"]');
      loginPage().rememberMeCheckbox.should('be.checked');

      // Uncheck checkbox
      loginPage().uncheck('[data-testid="remember-me"]');
      loginPage().rememberMeCheckbox.should('not.be.checked');
    });

    it('hover() - Hover over element', () => {
      cy.visit('/products');
      productsPage().hover('[data-testid="product-card"]:first');
    });

    it('scrollIntoView() - Scroll element into view', () => {
      cy.visit('/products');
      productsPage().scrollIntoView('[data-testid="pagination"]');
    });

    it('uploadFile() - Upload file to input', () => {
      // Upload single file
      // page.uploadFile('[data-testid="file-input"]', 'images/test.png');

      // Upload multiple files
      // page.uploadFile('[data-testid="file-input"]', ['file1.png', 'file2.png']);
    });
  });

  // =========================================
  // Wait Methods
  // =========================================

  describe('Wait Methods', () => {
    it('waitForPageLoad() - Wait for document ready', () => {
      loginPage().visit();
      loginPage().waitForPageLoad();
      cy.document().its('readyState').should('eq', 'complete');
    });

    it('waitForElement() - Wait for element visibility', () => {
      loginPage().visit();
      loginPage().waitForElement('[data-testid="email-input"]');
      loginPage().emailInput.should('be.visible');
    });

    it('waitForElementToDisappear() - Wait for element to be removed', () => {
      // Useful for loading indicators
      cy.visit('/products');
      productsPage().waitForElementToDisappear('[data-testid="loading"]', 10000);
    });

    it('waitForUrl() - Wait for URL to contain text', () => {
      loginPage().visit();
      loginPage().waitForUrl('/login');
    });

    it('waitForRequest() - Wait for network request', () => {
      cy.intercept('GET', '**/products').as('getProducts');
      cy.visit('/products');
      productsPage().waitForRequest('getProducts');
    });

    it('waitForLoadingComplete() - Wait for loading indicator', () => {
      cy.visit('/products');
      productsPage().waitForLoadingComplete();
    });
  });

  // =========================================
  // Assertion Methods
  // =========================================

  describe('Assertion Methods', () => {
    beforeEach(() => {
      loginPage().visit();
    });

    it('verifyUrl() - Verify current URL', () => {
      // Verify URL contains text
      loginPage().verifyUrl('/login');

      // Verify URL matches regex
      loginPage().verifyUrl(/\/login$/);
    });

    it('verifyTitle() - Verify page title', () => {
      loginPage().verifyTitle('Login');
    });

    it('verifyElementVisible() - Verify element is visible', () => {
      loginPage().verifyElementVisible('[data-testid="email-input"]');
    });

    it('verifyElementNotVisible() - Verify element is hidden', () => {
      // loginPage().verifyElementNotVisible('[data-testid="hidden-element"]');
    });

    it('verifyElementExists() - Verify element exists in DOM', () => {
      loginPage().verifyElementExists('[data-testid="login-form"]');
    });

    it('verifyElementNotExists() - Verify element not in DOM', () => {
      loginPage().verifyElementNotExists('[data-testid="nonexistent"]');
    });

    it('verifyElementText() - Verify element text content', () => {
      loginPage().verifyElementText('[data-testid="login-button"]', 'Login');
    });

    it('verifyElementAttribute() - Verify element attribute', () => {
      loginPage().verifyElementAttribute('[data-testid="password-input"]', 'type', 'password');
    });

    it('verifyElementEnabled() and verifyElementDisabled()', () => {
      loginPage().verifyElementEnabled('[data-testid="email-input"]');
      // loginPage().verifyElementDisabled('[data-testid="disabled-button"]');
    });
  });

  // =========================================
  // Utility Methods
  // =========================================

  describe('Utility Methods', () => {
    beforeEach(() => {
      loginPage().visit();
    });

    it('takeScreenshot() - Capture screenshot', () => {
      loginPage().takeScreenshot('login-page');
      loginPage().takeScreenshot(); // Auto-named
    });

    it('getCurrentUrl() - Get current URL', () => {
      loginPage().getCurrentUrl().should('include', '/login');
    });

    it('getPageTitle() - Get page title', () => {
      loginPage().getPageTitle().should('not.be.empty');
    });

    it('clearLocalStorage() - Clear local storage', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('test', 'value');
      });

      loginPage().clearLocalStorage();

      cy.window().then((win) => {
        expect(win.localStorage.getItem('test')).to.be.null;
      });
    });

    it('clearSessionStorage() - Clear session storage', () => {
      cy.window().then((win) => {
        win.sessionStorage.setItem('test', 'value');
      });

      loginPage().clearSessionStorage();

      cy.window().then((win) => {
        expect(win.sessionStorage.getItem('test')).to.be.null;
      });
    });

    it('clearCookies() - Clear all cookies', () => {
      loginPage().clearCookies();
      cy.getCookies().should('have.length', 0);
    });

    it('setLocalStorageItem() and getLocalStorageItem()', () => {
      loginPage()
        .setLocalStorageItem('testKey', 'testValue');

      loginPage()
        .getLocalStorageItem('testKey')
        .should('eq', 'testValue');
    });

    it('log() - Log message to Cypress', () => {
      loginPage().log('This is a log message');
    });

    it('withinIframe() - Work within iframe', () => {
      // If page has iframes
      // loginPage().withinIframe('[data-testid="payment-iframe"]', () => {
      //   cy.get('[data-testid="card-number"]').type('4242424242424242');
      // });
    });
  });
});

// =============================================================================
// SECTION 2: BaseComponent Methods Demonstration
// =============================================================================

describe('BaseComponent Methods Demo', { tags: ['@demo', '@basecomponent'] }, () => {
  /**
   * BaseComponent provides 40+ methods for component-level interactions.
   */

  beforeEach(() => {
    cy.visit('/');
  });

  // =========================================
  // Root Element Methods
  // =========================================

  describe('Root Element Methods', () => {
    it('getRoot() - Get component root element', () => {
      header().getRoot().should('exist');
      header().getRoot().should('be.visible');

      // With options
      header().getRoot({ timeout: 10000 }).should('exist');
    });

    it('exists() - Check if component exists', () => {
      header().exists().then((exists) => {
        expect(exists).to.be.true;
      });
    });

    it('isVisible() - Check if component is visible', () => {
      header().isVisible().then((visible) => {
        expect(visible).to.be.true;
      });
    });
  });

  // =========================================
  // Element Selection Within Component
  // =========================================

  describe('Element Selection Within Component', () => {
    it('find() - Find element within component', () => {
      header().find('[data-testid="header-logo"]').should('exist');
      header().find('nav').should('exist');

      // With options
      header().find('[data-testid="search-button"]', { timeout: 5000 }).should('exist');
    });

    it('findByTestId() - Find by data-testid within component', () => {
      header().findByTestId('header-logo').should('exist');
      header().findByTestId('nav-menu').should('exist');
    });

    it('findByText() - Find element by text within component', () => {
      header().findByText('Home').should('exist');
      header().findByText('Products').should('exist');
    });

    it('findAll() - Find all matching elements', () => {
      header().findAll('[data-testid="nav-item"]').should('have.length.at.least', 1);
    });
  });

  // =========================================
  // Interaction Methods
  // =========================================

  describe('Component Interaction Methods', () => {
    it('click() - Click within component', () => {
      // Click specific element
      header().click('[data-testid="header-logo"]');

      // Click component root
      // header().click();
    });

    it('type() - Type into element within component', () => {
      header().type('[data-testid="header-search"]', 'laptop');
    });

    it('select() - Select option within component', () => {
      // If component has dropdown
      // header().select('[data-testid="language-select"]', 'en');
    });

    it('check() and uncheck() - Checkbox within component', () => {
      // If component has checkboxes
      // component().check('[data-testid="filter-checkbox"]');
      // component().uncheck('[data-testid="filter-checkbox"]');
    });

    it('hover() - Hover within component', () => {
      // Hover on element within component
      header().hover('[data-testid="user-menu-trigger"]');

      // Hover on component root
      header().hover();
    });

    it('scrollIntoView() - Scroll component into view', () => {
      header().scrollIntoView();
    });
  });

  // =========================================
  // Wait Methods
  // =========================================

  describe('Component Wait Methods', () => {
    it('waitForVisible() - Wait for component visibility', () => {
      header().waitForVisible();
      header().getRoot().should('be.visible');
    });

    it('waitForHidden() - Wait for component to hide', () => {
      // After triggering hide action
      // modal().waitForHidden();
    });

    it('waitForRemoved() - Wait for component removal', () => {
      // After triggering removal
      // modal().waitForRemoved();
    });

    it('waitForElement() - Wait for element within component', () => {
      header().waitForElement('[data-testid="header-logo"]');
    });
  });

  // =========================================
  // Assertion Methods
  // =========================================

  describe('Component Assertion Methods', () => {
    it('shouldBeVisible() - Assert component is visible', () => {
      header().shouldBeVisible();
    });

    it('shouldNotBeVisible() - Assert component is hidden', () => {
      // For hidden components
      // modal().shouldNotBeVisible();
    });

    it('shouldExist() - Assert component exists', () => {
      header().shouldExist();
    });

    it('shouldNotExist() - Assert component not in DOM', () => {
      // For components that shouldn't exist
      // modal().shouldNotExist();
    });

    it('shouldContainText() - Assert component contains text', () => {
      header().shouldContainText('Home');
    });

    it('shouldHaveClass() - Assert component has CSS class', () => {
      // header().shouldHaveClass('header-main');
    });

    it('shouldHaveAttribute() - Assert component has attribute', () => {
      header().shouldHaveAttribute('data-testid', 'header');

      // Just check attribute exists
      header().shouldHaveAttribute('data-testid');
    });

    it('shouldHaveElementCount() - Assert element count', () => {
      header().shouldHaveElementCount('[data-testid="nav-item"]', 3);
    });
  });

  // =========================================
  // Utility Methods
  // =========================================

  describe('Component Utility Methods', () => {
    it('getText() - Get component text content', () => {
      header().getText().should('not.be.empty');
    });

    it('getAttribute() - Get attribute value', () => {
      header().getAttribute('data-testid').should('eq', 'header');
    });

    it('getCssValue() - Get CSS property value', () => {
      header().getCssValue('display').should('not.be.empty');
    });

    it('within() - Execute callback within component', () => {
      header().within(() => {
        cy.get('[data-testid="header-logo"]').should('exist');
        cy.get('[data-testid="nav-menu"]').should('exist');
      });
    });

    it('screenshot() - Take component screenshot', () => {
      header().screenshot('header-component');
    });

    it('debug() - Log component debug info', () => {
      header().debug();
    });
  });
});

// =============================================================================
// SECTION 3: Auth Commands Demonstration
// =============================================================================

describe('Auth Commands Demo', { tags: ['@demo', '@auth'] }, () => {
  beforeEach(() => {
    cy.clearAuth();
  });

  it('cy.login() - Login via UI', () => {
    cy.login('testuser@example.com', 'Test@123456', { cached: false });
    cy.url().should('not.include', '/login');
  });

  it('cy.login() with rememberMe option', () => {
    cy.login('testuser@example.com', 'Test@123456', { rememberMe: true, cached: false });
  });

  it('cy.loginByApi() - Login via API (faster)', () => {
    cy.loginByApi('testuser@example.com', 'Test@123456', { cached: false });
    cy.visit('/dashboard');
  });

  it('cy.loginAsTestUser() - Login as default test user', () => {
    cy.loginAsTestUser();
    cy.visit('/dashboard');
  });

  it('cy.loginAsAdmin() - Login as admin user', () => {
    cy.loginAsAdmin();
    cy.visit('/admin');
  });

  it('cy.logout() - Logout via API', () => {
    cy.loginAsTestUser();
    cy.logout();
    cy.getLocalStorage('authToken').should('be.null');
  });

  it('cy.logout() via UI', () => {
    cy.loginAsTestUser();
    cy.visit('/dashboard');
    cy.logout({ viaApi: false });
  });

  it('cy.isAuthenticated() - Check auth status', () => {
    cy.loginAsTestUser();
    cy.isAuthenticated().should('be.true');

    cy.clearAuth();
    cy.isAuthenticated().should('be.false');
  });

  it('cy.getCurrentUser() - Get current user info', () => {
    cy.loginAsTestUser();
    cy.getCurrentUser().then((user) => {
      expect(user).to.have.property('email');
    });
  });

  it('cy.verifyLoggedIn() - Verify user is logged in', () => {
    cy.loginAsTestUser();
    cy.visit('/dashboard');
    cy.verifyLoggedIn();
    cy.verifyLoggedIn('testuser@example.com');
  });

  it('cy.clearAuth() - Clear all auth data', () => {
    cy.loginAsTestUser();
    cy.clearAuth();
    cy.isAuthenticated().should('be.false');
  });

  it('cy.setAuthState() - Set auth state manually', () => {
    cy.setAuthState('mock-token', { id: 1, email: 'test@example.com' });
    cy.getLocalStorage('authToken').should('eq', 'mock-token');
  });
});

// =============================================================================
// SECTION 4: UI Commands Demonstration
// =============================================================================

describe('UI Commands Demo', { tags: ['@demo', '@ui'] }, () => {
  beforeEach(() => {
    loginPage().visit();
  });

  // =========================================
  // Element Selection Commands
  // =========================================

  describe('Element Selection Commands', () => {
    it('cy.getByTestId() - Get element by data-testid', () => {
      cy.getByTestId('email-input').should('exist');
      cy.getByTestId('login-button', { timeout: 10000 }).should('exist');
    });

    it('cy.findByTestId() - Find within parent', () => {
      cy.get('[data-testid="login-form"]')
        .findByTestId('email-input')
        .should('exist');
    });

    it('cy.getByRole() - Get element by role', () => {
      cy.getByRole('button').should('exist');
      cy.getByRole('textbox').should('exist');
    });

    it('cy.getByPlaceholder() - Get by placeholder', () => {
      cy.getByPlaceholder('Email').should('exist');
    });

    it('cy.getByAriaLabel() - Get by aria-label', () => {
      cy.getByAriaLabel('Close').should('exist');
    });
  });

  // =========================================
  // Enhanced Interaction Commands
  // =========================================

  describe('Enhanced Interaction Commands', () => {
    it('cy.clearAndType() - Clear and type', () => {
      cy.getByTestId('email-input').clearAndType('new@example.com');
      cy.getByTestId('email-input').should('have.value', 'new@example.com');
    });

    it('cy.clickAndWait() - Click and wait', () => {
      cy.getByTestId('forgot-password-link').clickAndWait({ waitFor: 500 });
    });

    it('cy.forceClick() - Force click', () => {
      cy.getByTestId('login-button').forceClick();
    });

    it('cy.hover() - Hover over element', () => {
      cy.getByTestId('login-button').hover();
    });

    it('cy.dragTo() - Drag and drop', () => {
      // cy.getByTestId('draggable').dragTo('[data-testid="droppable"]');
    });
  });

  // =========================================
  // File Upload Commands
  // =========================================

  describe('File Upload Commands', () => {
    it('cy.uploadFile() - Upload file', () => {
      // cy.getByTestId('file-input').uploadFile('documents/test.pdf');
      // cy.getByTestId('file-input').uploadFile(['file1.png', 'file2.png']);
    });

    it('cy.uploadByDragDrop() - Upload via drag drop', () => {
      // cy.getByTestId('drop-zone').uploadByDragDrop('image.png');
    });
  });

  // =========================================
  // Wait Commands
  // =========================================

  describe('Wait Commands', () => {
    it('cy.waitForVisible() - Wait for element', () => {
      cy.waitForVisible('[data-testid="login-form"]');
    });

    it('cy.waitForHidden() - Wait for element to hide', () => {
      // cy.waitForHidden('[data-testid="loading"]');
    });

    it('cy.waitForLoading() - Wait for loading to complete', () => {
      cy.waitForLoading();
    });

    it('cy.waitForPageLoad() - Wait for page load', () => {
      cy.waitForPageLoad();
    });
  });

  // =========================================
  // Scroll Commands
  // =========================================

  describe('Scroll Commands', () => {
    it('cy.scrollToView() - Scroll element into view', () => {
      cy.getByTestId('login-button').scrollToView();
    });

    it('cy.scrollToBottom() - Scroll to bottom', () => {
      cy.get('body').scrollToBottom();
    });

    it('cy.scrollToTop() - Scroll to top', () => {
      cy.get('body').scrollToTop();
    });
  });

  // =========================================
  // Assertion Commands
  // =========================================

  describe('Assertion Commands', () => {
    it('cy.shouldHaveText() - Verify exact text', () => {
      cy.getByTestId('login-button').shouldHaveText('Login');
    });

    it('cy.shouldContainText() - Verify contains text', () => {
      cy.getByTestId('login-button').shouldContainText('Log');
    });

    it('cy.shouldBeInteractable() - Verify visible and enabled', () => {
      cy.getByTestId('login-button').shouldBeInteractable();
    });

    it('cy.shouldHaveValue() - Verify input value', () => {
      cy.getByTestId('email-input').type('test@example.com');
      cy.getByTestId('email-input').shouldHaveValue('test@example.com');
    });

    it('cy.shouldHaveCount() - Verify element count', () => {
      cy.get('input').shouldHaveCount(2);
    });
  });

  // =========================================
  // Storage Commands
  // =========================================

  describe('Storage Commands', () => {
    it('cy.setLocalStorage() and cy.getLocalStorage()', () => {
      cy.setLocalStorage('key', 'value');
      cy.getLocalStorage('key').should('eq', 'value');

      cy.setLocalStorage('user', { name: 'John' });
      cy.getLocalStorage('user').should('include', 'John');
    });
  });

  // =========================================
  // Iframe Commands
  // =========================================

  describe('Iframe Commands', () => {
    it('cy.getIframeBody() - Get iframe body', () => {
      // cy.getByTestId('iframe').getIframeBody().find('button').click();
    });

    it('cy.withinIframe() - Execute within iframe', () => {
      // cy.withinIframe('[data-testid="iframe"]', () => {
      //   cy.get('button').click();
      // });
    });
  });

  // =========================================
  // Shadow DOM Commands
  // =========================================

  describe('Shadow DOM Commands', () => {
    it('cy.getShadowRoot() - Get shadow root', () => {
      // cy.get('my-component').getShadowRoot().find('button').click();
    });
  });

  // =========================================
  // Clipboard Commands
  // =========================================

  describe('Clipboard Commands', () => {
    it('cy.copyToClipboard() and cy.getClipboard()', () => {
      cy.copyToClipboard('Hello World');
      // cy.getClipboard().should('eq', 'Hello World');
    });
  });

  // =========================================
  // Screenshot Commands
  // =========================================

  describe('Screenshot Commands', () => {
    it('cy.screenshotFullPage() - Full page screenshot', () => {
      cy.screenshotFullPage('login-full-page');
    });

    it('cy.screenshotElement() - Element screenshot', () => {
      cy.getByTestId('login-form').screenshotElement('login-form');
    });
  });
});

// =============================================================================
// SECTION 5: API Commands Demonstration
// =============================================================================

describe('API Commands Demo', { tags: ['@demo', '@api'] }, () => {
  // =========================================
  // Request Commands
  // =========================================

  describe('Request Commands', () => {
    it('cy.apiRequest() - Make authenticated request', () => {
      cy.loginAsTestUser();
      cy.apiRequest({
        method: 'GET',
        url: '/products',
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it('cy.apiGet() - GET request', () => {
      cy.apiGet('/products').shouldHaveStatus(200);
      cy.apiGet('/products', { qs: { page: 1 } });
    });

    it('cy.apiPost() - POST request', () => {
      cy.loginAsTestUser();
      cy.apiPost('/cart', { productId: 1, quantity: 1 });
    });

    it('cy.apiPut() - PUT request', () => {
      cy.loginAsTestUser();
      cy.apiPut('/cart/1', { quantity: 2 });
    });

    it('cy.apiPatch() - PATCH request', () => {
      cy.loginAsTestUser();
      cy.apiPatch('/users/1', { firstName: 'Updated' });
    });

    it('cy.apiDelete() - DELETE request', () => {
      cy.loginAsTestUser();
      cy.apiDelete('/cart/1');
    });
  });

  // =========================================
  // Intercept Commands
  // =========================================

  describe('Intercept Commands', () => {
    it('cy.interceptApi() - Intercept API request', () => {
      cy.interceptApi('GET', '/products', 'getProducts');
      cy.visit('/products');
      cy.wait('@getProducts');
    });

    it('cy.mockApi() - Mock with fixture', () => {
      cy.mockApi('GET', '**/products', 'testdata/products.json', 'mockProducts');
      cy.visit('/products');
      cy.wait('@mockProducts');
    });

    it('cy.mockApiError() - Mock error response', () => {
      cy.mockApiError('POST', '**/cart', 400, 'cartError', { message: 'Invalid' });
    });

    it('cy.mockNetworkError() - Mock network failure', () => {
      cy.mockNetworkError('GET', '**/products', 'networkError');
    });

    it('cy.mockSlowApi() - Mock slow response', () => {
      cy.mockSlowApi('GET', '**/products', 2000, 'slowProducts');
    });
  });

  // =========================================
  // Wait Commands
  // =========================================

  describe('API Wait Commands', () => {
    it('cy.waitForApi() - Wait for API request', () => {
      cy.interceptApi('GET', '/products', 'getProducts');
      cy.visit('/products');
      cy.waitForApi('getProducts', { statusCode: 200 });
    });

    it('cy.waitForApis() - Wait for multiple requests', () => {
      cy.interceptApi('GET', '/products', 'getProducts');
      cy.interceptApi('GET', '/categories', 'getCategories');
      cy.visit('/products');
      cy.waitForApis(['getProducts', 'getCategories']);
    });
  });

  // =========================================
  // Response Assertion Commands
  // =========================================

  describe('Response Assertion Commands', () => {
    it('cy.shouldHaveStatus() - Verify status code', () => {
      cy.apiGet('/products').shouldHaveStatus(200);
    });

    it('cy.shouldHaveProperty() - Verify response property', () => {
      cy.apiGet('/products/1')
        .shouldHaveProperty('id')
        .shouldHaveProperty('name');
    });

    it('cy.shouldHaveLength() - Verify array length', () => {
      // cy.apiGet('/products').shouldHaveLength(10);
    });
  });

  // =========================================
  // Data Setup Commands
  // =========================================

  describe('Data Setup Commands', () => {
    it('cy.createTestData() - Create test data', () => {
      cy.loginAsAdmin();
      // cy.createTestData('/products', { name: 'Test' }, 'testProduct');
    });

    it('cy.deleteTestData() - Delete test data', () => {
      cy.loginAsAdmin();
      // cy.deleteTestData('/products/123');
    });

    it('cy.cleanupTestData() - Cleanup multiple items', () => {
      cy.loginAsAdmin();
      // cy.cleanupTestData('/products', 'id', ['1', '2', '3']);
    });
  });

  // =========================================
  // GraphQL Commands
  // =========================================

  describe('GraphQL Commands', () => {
    it('cy.graphqlQuery() - Execute GraphQL query', () => {
      cy.graphqlQuery('query { products { id name } }');
    });

    it('cy.graphqlMutation() - Execute GraphQL mutation', () => {
      cy.loginAsTestUser();
      cy.graphqlMutation(
        'mutation AddToCart($input: CartInput!) { addToCart(input: $input) { id } }',
        { input: { productId: 1, quantity: 1 } }
      );
    });

    it('cy.interceptGraphql() - Intercept GraphQL operation', () => {
      cy.interceptGraphql('GetProducts', 'getProducts');
    });
  });

  // =========================================
  // Health Check Commands
  // =========================================

  describe('Health Check Commands', () => {
    it('cy.checkApiHealth() - Check API health', () => {
      cy.checkApiHealth().then((isHealthy) => {
        expect(isHealthy).to.be.true;
      });
    });

    it('cy.waitForApiReady() - Wait for API', () => {
      cy.waitForApiReady('/health', 5, 1000);
    });
  });
});

// =============================================================================
// SECTION 6: Page Objects Demonstration
// =============================================================================

describe('Page Objects Demo', { tags: ['@demo', '@pageobjects'] }, () => {
  // =========================================
  // LoginPage Demo
  // =========================================

  describe('LoginPage Methods', () => {
    beforeEach(() => {
      cy.clearAuth();
      loginPage().visit();
    });

    it('should demonstrate LoginPage element getters', () => {
      // Element getters return Cypress chainables
      loginPage().emailInput.should('be.visible');
      loginPage().passwordInput.should('be.visible');
      loginPage().loginButton.should('be.visible');
      loginPage().rememberMeCheckbox.should('exist');
      loginPage().forgotPasswordLink.should('be.visible');
      loginPage().registerLink.should('exist');
      loginPage().errorMessage.should('not.exist');
      loginPage().loadingIndicator.should('not.exist');
    });

    it('should demonstrate LoginPage action methods', () => {
      loginPage()
        .enterEmail('test@example.com')
        .enterPassword('password123')
        .checkRememberMe()
        .clickLogin();
    });

    it('should demonstrate LoginPage high-level action methods', () => {
      loginPage().mockLoginSuccess();
      loginPage()
        .login('test@example.com', 'password123', { rememberMe: true })
        .waitForLoginRequest();
    });

    it('should demonstrate LoginPage verification methods', () => {
      loginPage().verifyPageLoaded();
      loginPage().verifyRememberMeNotChecked();

      loginPage().checkRememberMe();
      loginPage().verifyRememberMeChecked();
    });

    it('should demonstrate LoginPage API mocking methods', () => {
      // Mock success
      loginPage().mockLoginSuccess({ id: 1, email: 'test@example.com' });

      // Mock failure
      loginPage().mockLoginFailure('Invalid credentials', 401);

      // Intercept for verification
      loginPage().interceptLoginRequest();
    });
  });

  // =========================================
  // RegisterPage Demo
  // =========================================

  describe('RegisterPage Methods', () => {
    beforeEach(() => {
      cy.clearAuth();
      registerPage().visit();
    });

    it('should demonstrate RegisterPage element getters', () => {
      registerPage().firstNameInput.should('be.visible');
      registerPage().lastNameInput.should('be.visible');
      registerPage().emailInput.should('be.visible');
      registerPage().passwordInput.should('be.visible');
      registerPage().confirmPasswordInput.should('be.visible');
      registerPage().registerButton.should('be.visible');
      registerPage().loginLink.should('exist');
    });

    it('should demonstrate RegisterPage action methods', () => {
      registerPage()
        .enterFirstName('John')
        .enterLastName('Doe')
        .enterEmail('john@example.com')
        .enterPassword('Password@123')
        .enterConfirmPassword('Password@123')
        .clickRegister();
    });

    it('should demonstrate RegisterPage high-level actions', () => {
      registerPage().mockRegisterSuccess();
      registerPage().register({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password@123',
      });
    });
  });

  // =========================================
  // ProductsPage Demo
  // =========================================

  describe('ProductsPage Methods', () => {
    beforeEach(() => {
      productsPage().visit();
    });

    it('should demonstrate ProductsPage element getters', () => {
      productsPage().productCards.should('exist');
      productsPage().searchInput.should('exist');
      productsPage().categoryFilter.should('exist');
      productsPage().sortSelect.should('exist');
    });

    it('should demonstrate ProductsPage action methods', () => {
      productsPage()
        .search('laptop')
        .filterByCategory('Electronics')
        .sortBy('price-asc')
        .clickProductByIndex(0);
    });

    it('should demonstrate ProductsPage API methods', () => {
      productsPage().interceptProductsRequest();
      productsPage().mockProducts([
        { id: 1, name: 'Product 1', price: 99.99 },
      ]);
    });
  });

  // =========================================
  // CartPage Demo
  // =========================================

  describe('CartPage Methods', () => {
    beforeEach(() => {
      cy.loginAsTestUser();
      cartPage().visit();
    });

    it('should demonstrate CartPage element getters', () => {
      cartPage().cartItems.should('exist');
      cartPage().subtotal.should('exist');
      cartPage().total.should('exist');
      cartPage().checkoutButton.should('exist');
    });

    it('should demonstrate CartPage action methods', () => {
      cartPage().mockCart([
        { id: 1, name: 'Product', price: 99.99, quantity: 1 },
      ]);
      cartPage().visit();

      cartPage()
        .increaseQuantity(0)
        .updateQuantity(0, 3)
        .removeItem(0);
    });

    it('should demonstrate CartPage verification methods', () => {
      cartPage().mockEmptyCart();
      cartPage().visit();
      cartPage().verifyCartEmpty();
    });
  });

  // =========================================
  // CheckoutPage Demo
  // =========================================

  describe('CheckoutPage Methods', () => {
    beforeEach(() => {
      cy.loginAsTestUser();
      checkoutPage().mockCart([
        { id: 1, name: 'Product', price: 99.99, quantity: 1 },
      ]);
      checkoutPage().visit();
    });

    it('should demonstrate CheckoutPage methods', () => {
      checkoutPage()
        .fillShippingAddress({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
        })
        .selectPaymentMethod('credit_card')
        .fillCreditCard({
          number: '4242424242424242',
          expiry: '12/25',
          cvv: '123',
        });
    });
  });
});

// =============================================================================
// SECTION 7: Component Objects Demonstration
// =============================================================================

describe('Component Objects Demo', { tags: ['@demo', '@components'] }, () => {
  // =========================================
  // HeaderComponent Demo
  // =========================================

  describe('HeaderComponent Methods', () => {
    beforeEach(() => {
      cy.visit('/');
    });

    it('should demonstrate HeaderComponent element getters', () => {
      header().logo.should('be.visible');
      header().navMenu.should('be.visible');
      header().searchInput.should('exist');
      header().cartIcon.should('exist');
      header().userMenuTrigger.should('exist');
    });

    it('should demonstrate HeaderComponent action methods', () => {
      header()
        .search('laptop')
        .clickLogo()
        .openUserMenu()
        .closeUserMenu();
    });

    it('should demonstrate HeaderComponent navigation', () => {
      header().navigateTo('Products');
      cy.url().should('include', '/products');
    });
  });

  // =========================================
  // ModalComponent Demo
  // =========================================

  describe('ModalComponent Methods', () => {
    it('should demonstrate ModalComponent methods', () => {
      // Trigger modal
      cy.visit('/');
      // modal().open();

      // Modal assertions
      // modal().shouldBeVisible();
      // modal().shouldHaveTitle('Confirm');
      // modal().getContent().should('contain', 'message');

      // Modal actions
      // modal().clickButton('Confirm');
      // modal().close();
      // modal().clickOverlay();
    });
  });

  // =========================================
  // TableComponent Demo
  // =========================================

  describe('TableComponent Methods', () => {
    beforeEach(() => {
      cy.loginAsAdmin();
      cy.visit('/admin/products');
    });

    it('should demonstrate TableComponent methods', () => {
      // Element getters
      table().getRows();
      table().getHeaders();
      table().getCell(0, 0);

      // Actions
      table().sortBy('name');
      table().search('product');
      table().selectRow(0);
      table().selectAllRows();

      // Assertions
      table().shouldHaveRowCount(10);
      table().shouldContainText('Product');
    });
  });

  // =========================================
  // PaginationComponent Demo
  // =========================================

  describe('PaginationComponent Methods', () => {
    beforeEach(() => {
      cy.visit('/products');
    });

    it('should demonstrate PaginationComponent methods', () => {
      pagination().goToNextPage();
      pagination().goToPreviousPage();
      pagination().goToPage(3);
      pagination().getCurrentPage();
      pagination().getTotalPages();
    });
  });
});

// =============================================================================
// SECTION 8: Builder Pattern Demonstration
// =============================================================================

describe('Builder Pattern Demo', { tags: ['@demo', '@builder'] }, () => {
  describe('UserBuilder', () => {
    it('should create user with email', () => {
      const user = UserBuilder.create()
        .withEmail('test@example.com')
        .build();

      expect(user.email).to.eq('test@example.com');
    });

    it('should create user with random email', () => {
      const user = UserBuilder.create()
        .withRandomEmail()
        .build();

      expect(user.email).to.include('@test.com');
    });

    it('should create user with password', () => {
      const user = UserBuilder.create()
        .withPassword('SecurePass@123')
        .build();

      expect(user.password).to.eq('SecurePass@123');
    });

    it('should create user with name', () => {
      const user = UserBuilder.create()
        .withFirstName('John')
        .withLastName('Doe')
        .build();

      expect(user.firstName).to.eq('John');
      expect(user.lastName).to.eq('Doe');
    });

    it('should create standard user', () => {
      const user = UserBuilder.create()
        .withRandomEmail()
        .withPassword('Pass@123')
        .asStandardUser()
        .build();

      expect(user.role).to.eq('user');
    });

    it('should create admin user', () => {
      const user = UserBuilder.create()
        .withEmail('admin@example.com')
        .withPassword('Admin@123')
        .asAdmin()
        .build();

      expect(user.role).to.eq('admin');
    });

    it('should chain all builder methods', () => {
      const user = UserBuilder.create()
        .withRandomEmail()
        .withPassword('Complex@Pass123')
        .withFirstName('Jane')
        .withLastName('Smith')
        .withAvatar('https://example.com/avatar.png')
        .asStandardUser()
        .withStatus('active')
        .build();

      expect(user).to.have.property('email');
      expect(user).to.have.property('password');
      expect(user.firstName).to.eq('Jane');
      expect(user.lastName).to.eq('Smith');
      expect(user.avatar).to.eq('https://example.com/avatar.png');
      expect(user.role).to.eq('user');
      expect(user.status).to.eq('active');
    });
  });
});

// =============================================================================
// SECTION 9: Method Chaining Demonstration
// =============================================================================

describe('Method Chaining Demo', { tags: ['@demo', '@chaining'] }, () => {
  it('should demonstrate fluent API with page objects', () => {
    cy.clearAuth();

    loginPage()
      .visit()
      .verifyPageLoaded()
      .mockLoginSuccess()
      .enterEmail('test@example.com')
      .enterPassword('password123')
      .checkRememberMe()
      .clickLogin()
      .waitForLoginRequest();
  });

  it('should demonstrate fluent API with components', () => {
    cy.visit('/');

    header()
      .shouldBeVisible()
      .search('laptop')
      .waitForElement('[data-testid="search-results"]');
  });

  it('should demonstrate combining page objects and commands', () => {
    cy.clearAuth();
    cy.loginAsTestUser();

    productsPage()
      .visit()
      .verifyPageLoaded()
      .search('headphones')
      .filterByCategory('Electronics')
      .sortBy('price-asc');

    cy.getByTestId('product-card').first().click();

    productDetailPage()
      .verifyPageLoaded()
      .increaseQuantity()
      .setQuantity(2)
      .addToCart();

    cy.getByTestId('toast-success').should('be.visible');
  });
});

// =============================================================================
// SECTION 10: Complete E2E Flow Demonstration
// =============================================================================

describe('Complete E2E Flow Demo', { tags: ['@demo', '@e2e'] }, () => {
  it('should demonstrate complete shopping flow using all framework features', () => {
    // Create test user with builder
    const user = UserBuilder.create()
      .withRandomEmail()
      .withPassword('Test@123456')
      .withFirstName('E2E')
      .withLastName('Test')
      .build();

    // Clear previous auth
    cy.clearAuth();

    // Register new user (with API mocking)
    registerPage()
      .visit()
      .mockRegisterSuccess()
      .register(user)
      .waitForRegisterRequest();

    // Login
    cy.loginByApi(user.email, user.password, { cached: false });

    // Browse products
    productsPage()
      .visit()
      .verifyPageLoaded()
      .filterByCategory('Electronics');

    // Add to cart using component
    productCard()
      .getRoot()
      .first()
      .within(() => {
        cy.get('[data-testid="add-to-cart"]').click();
      });

    // Verify cart using header component
    header()
      .cartBadge
      .should('contain', '1');

    // Go to cart
    cartPage()
      .visit()
      .verifyCartHasItems(1)
      .updateQuantity(0, 2)
      .proceedToCheckout();

    // Complete checkout
    checkoutPage()
      .verifyPageLoaded()
      .mockCreateOrderSuccess({ id: 1, orderNumber: 'ORD-001' })
      .fillShippingAddress({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        address: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
      })
      .selectPaymentMethod('credit_card')
      .placeOrder()
      .waitForCreateOrderRequest();

    // Verify order
    cy.url().should('include', '/orders');

    // View orders
    ordersPage()
      .visit()
      .verifyPageLoaded();

    // Logout
    cy.logout();
    cy.isAuthenticated().should('be.false');
  });
});
