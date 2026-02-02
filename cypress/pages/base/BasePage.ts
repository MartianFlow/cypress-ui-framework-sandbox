/**
 * BasePage - Abstract base class for all Page Objects
 * @description Provides common functionality and patterns for page interactions
 * @abstract
 */
class BasePage {
  /**
   * Creates a BasePage instance
   * @param {string} path - The URL path for this page (relative to baseUrl)
   */
  constructor(path = '/') {
    if (new.target === BasePage) {
      throw new TypeError('Cannot instantiate BasePage directly - use a derived class');
    }
    this.path = path;
    this.timeout = Cypress.config('defaultCommandTimeout');
  }

  // =================================
  // Navigation Methods
  // =================================

  /**
   * Navigate to this page
   * @param {Object} [options] - Visit options
   * @param {Object} [options.queryParams] - Query parameters to append
   * @param {boolean} [options.failOnStatusCode=true] - Fail on non-2xx status
   * @returns {BasePage} This page instance for chaining
   */
  visit(options = {}) {
    const { queryParams = {}, failOnStatusCode = true } = options;

    let url = this.path;

    // Append query parameters if provided
    if (Object.keys(queryParams).length > 0) {
      const params = new URLSearchParams(queryParams).toString();
      url = `${url}?${params}`;
    }

    cy.visit(url, {
      failOnStatusCode,
      timeout: Cypress.config('pageLoadTimeout'),
    });

    return this;
  }

  /**
   * Navigate to this page and wait for load
   * @param {Object} [options] - Visit options
   * @returns {BasePage} This page instance for chaining
   */
  open(options = {}) {
    this.visit(options);
    this.waitForPageLoad();
    return this;
  }

  /**
   * Reload the current page
   * @param {boolean} [forceReload=false] - Force reload from server
   * @returns {BasePage} This page instance for chaining
   */
  reload(forceReload = false) {
    cy.reload(forceReload);
    this.waitForPageLoad();
    return this;
  }

  /**
   * Navigate back in browser history
   * @returns {BasePage} This page instance for chaining
   */
  goBack() {
    cy.go('back');
    return this;
  }

  /**
   * Navigate forward in browser history
   * @returns {BasePage} This page instance for chaining
   */
  goForward() {
    cy.go('forward');
    return this;
  }

  // =================================
  // Element Selection Methods
  // =================================

  /**
   * Get element by data-testid attribute
   * @param {string} testId - The data-testid value
   * @param {Object} [options] - Cypress get options
   * @returns {Cypress.Chainable} Cypress chainable element
   */
  getByTestId(testId, options = {}) {
    return cy.get(`[data-testid="${testId}"]`, {
      timeout: this.timeout,
      ...options,
    });
  }

  /**
   * Get element by CSS selector
   * @param {string} selector - CSS selector
   * @param {Object} [options] - Cypress get options
   * @returns {Cypress.Chainable} Cypress chainable element
   */
  getElement(selector, options = {}) {
    return cy.get(selector, {
      timeout: this.timeout,
      ...options,
    });
  }

  /**
   * Get element containing specific text
   * @param {string} text - Text to find
   * @param {Object} [options] - Cypress contains options
   * @returns {Cypress.Chainable} Cypress chainable element
   */
  getByText(text, options = {}) {
    return cy.contains(text, {
      timeout: this.timeout,
      ...options,
    });
  }

  /**
   * Get element by role attribute
   * @param {string} role - The role attribute value
   * @param {Object} [options] - Cypress get options
   * @returns {Cypress.Chainable} Cypress chainable element
   */
  getByRole(role, options = {}) {
    return cy.get(`[role="${role}"]`, {
      timeout: this.timeout,
      ...options,
    });
  }

  /**
   * Get element by placeholder text
   * @param {string} placeholder - Placeholder text
   * @param {Object} [options] - Cypress get options
   * @returns {Cypress.Chainable} Cypress chainable element
   */
  getByPlaceholder(placeholder, options = {}) {
    return cy.get(`[placeholder="${placeholder}"]`, {
      timeout: this.timeout,
      ...options,
    });
  }

  /**
   * Get element by label text
   * @param {string} label - Label text
   * @returns {Cypress.Chainable} Cypress chainable element
   */
  getByLabel(label) {
    return cy.contains('label', label).invoke('attr', 'for').then((id) => {
      if (id) {
        return cy.get(`#${id}`);
      }
      return cy.contains('label', label).find('input, select, textarea');
    });
  }

  // =================================
  // Interaction Methods
  // =================================

  /**
   * Type text into an element
   * @param {string} selector - Element selector
   * @param {string} text - Text to type
   * @param {Object} [options] - Type options
   * @param {boolean} [options.clear=true] - Clear field before typing
   * @param {number} [options.delay=0] - Delay between keystrokes
   * @returns {BasePage} This page instance for chaining
   */
  type(selector, text, options = {}) {
    const { clear = true, delay = 0 } = options;
    const element = cy.get(selector, { timeout: this.timeout });

    if (clear) {
      element.clear();
    }

    element.type(text, { delay });
    return this;
  }

  /**
   * Click on an element
   * @param {string} selector - Element selector
   * @param {Object} [options] - Click options
   * @returns {BasePage} This page instance for chaining
   */
  click(selector, options = {}) {
    cy.get(selector, { timeout: this.timeout }).click(options);
    return this;
  }

  /**
   * Double click on an element
   * @param {string} selector - Element selector
   * @param {Object} [options] - Click options
   * @returns {BasePage} This page instance for chaining
   */
  doubleClick(selector, options = {}) {
    cy.get(selector, { timeout: this.timeout }).dblclick(options);
    return this;
  }

  /**
   * Right click on an element
   * @param {string} selector - Element selector
   * @param {Object} [options] - Click options
   * @returns {BasePage} This page instance for chaining
   */
  rightClick(selector, options = {}) {
    cy.get(selector, { timeout: this.timeout }).rightclick(options);
    return this;
  }

  /**
   * Select option from dropdown
   * @param {string} selector - Select element selector
   * @param {string|string[]} value - Value(s) to select
   * @returns {BasePage} This page instance for chaining
   */
  select(selector, value) {
    cy.get(selector, { timeout: this.timeout }).select(value);
    return this;
  }

  /**
   * Check a checkbox or radio button
   * @param {string} selector - Element selector
   * @param {Object} [options] - Check options
   * @returns {BasePage} This page instance for chaining
   */
  check(selector, options = {}) {
    cy.get(selector, { timeout: this.timeout }).check(options);
    return this;
  }

  /**
   * Uncheck a checkbox
   * @param {string} selector - Element selector
   * @param {Object} [options] - Uncheck options
   * @returns {BasePage} This page instance for chaining
   */
  uncheck(selector, options = {}) {
    cy.get(selector, { timeout: this.timeout }).uncheck(options);
    return this;
  }

  /**
   * Hover over an element
   * @param {string} selector - Element selector
   * @returns {BasePage} This page instance for chaining
   */
  hover(selector) {
    cy.get(selector, { timeout: this.timeout }).trigger('mouseover');
    return this;
  }

  /**
   * Scroll element into view
   * @param {string} selector - Element selector
   * @param {Object} [options] - Scroll options
   * @returns {BasePage} This page instance for chaining
   */
  scrollIntoView(selector, options = {}) {
    cy.get(selector, { timeout: this.timeout }).scrollIntoView(options);
    return this;
  }

  /**
   * Upload file to input
   * @param {string} selector - File input selector
   * @param {string|string[]} filePath - Path to file(s) in fixtures
   * @returns {BasePage} This page instance for chaining
   */
  uploadFile(selector, filePath) {
    cy.get(selector, { timeout: this.timeout }).selectFile(filePath);
    return this;
  }

  // =================================
  // Wait Methods
  // =================================

  /**
   * Wait for page to fully load
   * @returns {BasePage} This page instance for chaining
   */
  waitForPageLoad() {
    cy.document().its('readyState').should('eq', 'complete');
    return this;
  }

  /**
   * Wait for element to be visible
   * @param {string} selector - Element selector
   * @param {number} [timeout] - Custom timeout
   * @returns {BasePage} This page instance for chaining
   */
  waitForElement(selector, timeout = this.timeout) {
    cy.get(selector, { timeout }).should('be.visible');
    return this;
  }

  /**
   * Wait for element to disappear
   * @param {string} selector - Element selector
   * @param {number} [timeout] - Custom timeout
   * @returns {BasePage} This page instance for chaining
   */
  waitForElementToDisappear(selector, timeout = this.timeout) {
    cy.get(selector, { timeout }).should('not.exist');
    return this;
  }

  /**
   * Wait for URL to contain text
   * @param {string} text - Text URL should contain
   * @param {number} [timeout] - Custom timeout
   * @returns {BasePage} This page instance for chaining
   */
  waitForUrl(text, timeout = this.timeout) {
    cy.url({ timeout }).should('include', text);
    return this;
  }

  /**
   * Wait for network request to complete
   * @param {string} alias - Request alias (without @)
   * @param {number} [timeout] - Custom timeout
   * @returns {Cypress.Chainable} Intercepted request
   */
  waitForRequest(alias, timeout = this.timeout) {
    return cy.wait(`@${alias}`, { timeout });
  }

  /**
   * Wait for loading indicator to disappear
   * @param {string} [selector='[data-testid="loading"]'] - Loading indicator selector
   * @returns {BasePage} This page instance for chaining
   */
  waitForLoadingComplete(selector = '[data-testid="loading"]') {
    cy.get('body').then(($body) => {
      if ($body.find(selector).length > 0) {
        cy.get(selector).should('not.exist');
      }
    });
    return this;
  }

  // =================================
  // Assertion Methods
  // =================================

  /**
   * Verify current URL
   * @param {string|RegExp} expected - Expected URL or pattern
   * @returns {BasePage} This page instance for chaining
   */
  verifyUrl(expected) {
    if (expected instanceof RegExp) {
      cy.url().should('match', expected);
    } else {
      cy.url().should('include', expected);
    }
    return this;
  }

  /**
   * Verify page title
   * @param {string} expected - Expected title
   * @returns {BasePage} This page instance for chaining
   */
  verifyTitle(expected) {
    cy.title().should('contain', expected);
    return this;
  }

  /**
   * Verify element is visible
   * @param {string} selector - Element selector
   * @returns {BasePage} This page instance for chaining
   */
  verifyElementVisible(selector) {
    cy.get(selector, { timeout: this.timeout }).should('be.visible');
    return this;
  }

  /**
   * Verify element is not visible
   * @param {string} selector - Element selector
   * @returns {BasePage} This page instance for chaining
   */
  verifyElementNotVisible(selector) {
    cy.get(selector).should('not.be.visible');
    return this;
  }

  /**
   * Verify element exists in DOM
   * @param {string} selector - Element selector
   * @returns {BasePage} This page instance for chaining
   */
  verifyElementExists(selector) {
    cy.get(selector, { timeout: this.timeout }).should('exist');
    return this;
  }

  /**
   * Verify element does not exist in DOM
   * @param {string} selector - Element selector
   * @returns {BasePage} This page instance for chaining
   */
  verifyElementNotExists(selector) {
    cy.get(selector).should('not.exist');
    return this;
  }

  /**
   * Verify element text
   * @param {string} selector - Element selector
   * @param {string} expectedText - Expected text
   * @returns {BasePage} This page instance for chaining
   */
  verifyElementText(selector, expectedText) {
    cy.get(selector, { timeout: this.timeout }).should('contain.text', expectedText);
    return this;
  }

  /**
   * Verify element has attribute with value
   * @param {string} selector - Element selector
   * @param {string} attribute - Attribute name
   * @param {string} value - Expected attribute value
   * @returns {BasePage} This page instance for chaining
   */
  verifyElementAttribute(selector, attribute, value) {
    cy.get(selector, { timeout: this.timeout }).should('have.attr', attribute, value);
    return this;
  }

  /**
   * Verify element is enabled
   * @param {string} selector - Element selector
   * @returns {BasePage} This page instance for chaining
   */
  verifyElementEnabled(selector) {
    cy.get(selector, { timeout: this.timeout }).should('be.enabled');
    return this;
  }

  /**
   * Verify element is disabled
   * @param {string} selector - Element selector
   * @returns {BasePage} This page instance for chaining
   */
  verifyElementDisabled(selector) {
    cy.get(selector, { timeout: this.timeout }).should('be.disabled');
    return this;
  }

  // =================================
  // Utility Methods
  // =================================

  /**
   * Take a screenshot
   * @param {string} [name] - Screenshot name
   * @returns {BasePage} This page instance for chaining
   */
  takeScreenshot(name) {
    if (name) {
      cy.screenshot(name);
    } else {
      cy.screenshot();
    }
    return this;
  }

  /**
   * Get current URL
   * @returns {Cypress.Chainable<string>} Current URL
   */
  getCurrentUrl() {
    return cy.url();
  }

  /**
   * Get page title
   * @returns {Cypress.Chainable<string>} Page title
   */
  getPageTitle() {
    return cy.title();
  }

  /**
   * Clear local storage
   * @returns {BasePage} This page instance for chaining
   */
  clearLocalStorage() {
    cy.clearLocalStorage();
    return this;
  }

  /**
   * Clear session storage
   * @returns {BasePage} This page instance for chaining
   */
  clearSessionStorage() {
    cy.window().then((win) => {
      win.sessionStorage.clear();
    });
    return this;
  }

  /**
   * Clear all cookies
   * @returns {BasePage} This page instance for chaining
   */
  clearCookies() {
    cy.clearCookies();
    return this;
  }

  /**
   * Set local storage item
   * @param {string} key - Storage key
   * @param {string} value - Storage value
   * @returns {BasePage} This page instance for chaining
   */
  setLocalStorageItem(key, value) {
    cy.window().then((win) => {
      win.localStorage.setItem(key, value);
    });
    return this;
  }

  /**
   * Get local storage item
   * @param {string} key - Storage key
   * @returns {Cypress.Chainable} Storage value
   */
  getLocalStorageItem(key) {
    return cy.window().then((win) => win.localStorage.getItem(key));
  }

  /**
   * Log message to Cypress command log
   * @param {string} message - Message to log
   * @returns {BasePage} This page instance for chaining
   */
  log(message) {
    cy.log(message);
    return this;
  }

  /**
   * Execute callback within iframe
   * @param {string} iframeSelector - Iframe selector
   * @param {Function} callback - Callback function to execute
   * @returns {BasePage} This page instance for chaining
   */
  withinIframe(iframeSelector, callback) {
    cy.get(iframeSelector)
      .its('0.contentDocument.body')
      .should('not.be.empty')
      .then(cy.wrap)
      .within(callback);
    return this;
  }
}

export default BasePage;
