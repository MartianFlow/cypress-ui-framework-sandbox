/**
 * BaseComponent - Abstract base class for reusable UI components
 * @description Provides common functionality for component-level interactions
 * @abstract
 */
class BaseComponent {
  /**
   * Creates a BaseComponent instance
   * @param {string} rootSelector - The root CSS selector for this component
   */
  constructor(rootSelector) {
    if (new.target === BaseComponent) {
      throw new TypeError('Cannot instantiate BaseComponent directly - use a derived class');
    }

    if (!rootSelector) {
      throw new Error('Root selector is required for BaseComponent');
    }

    this.rootSelector = rootSelector;
    this.timeout = Cypress.config('defaultCommandTimeout');
  }

  // =================================
  // Root Element Methods
  // =================================

  /**
   * Get the root element of this component
   * @param {Object} [options] - Cypress get options
   * @returns {Cypress.Chainable} Root element
   */
  getRoot(options = {}) {
    return cy.get(this.rootSelector, {
      timeout: this.timeout,
      ...options,
    });
  }

  /**
   * Check if component exists in DOM
   * @returns {Cypress.Chainable<boolean>} True if component exists
   */
  exists() {
    return cy.get('body').then(($body) => {
      return $body.find(this.rootSelector).length > 0;
    });
  }

  /**
   * Check if component is visible
   * @returns {Cypress.Chainable<boolean>} True if component is visible
   */
  isVisible() {
    return this.getRoot().then(($el) => {
      return $el.is(':visible');
    });
  }

  // =================================
  // Element Selection Within Component
  // =================================

  /**
   * Find element within component by selector
   * @param {string} selector - CSS selector
   * @param {Object} [options] - Cypress find options
   * @returns {Cypress.Chainable} Found element
   */
  find(selector, options = {}) {
    return this.getRoot().find(selector, {
      timeout: this.timeout,
      ...options,
    });
  }

  /**
   * Find element within component by data-testid
   * @param {string} testId - The data-testid value
   * @param {Object} [options] - Cypress find options
   * @returns {Cypress.Chainable} Found element
   */
  findByTestId(testId, options = {}) {
    return this.find(`[data-testid="${testId}"]`, options);
  }

  /**
   * Find element containing text within component
   * @param {string} text - Text to find
   * @param {Object} [options] - Cypress contains options
   * @returns {Cypress.Chainable} Found element
   */
  findByText(text, options = {}) {
    return this.getRoot().contains(text, {
      timeout: this.timeout,
      ...options,
    });
  }

  /**
   * Find all matching elements within component
   * @param {string} selector - CSS selector
   * @returns {Cypress.Chainable} Found elements
   */
  findAll(selector) {
    return this.getRoot().find(selector);
  }

  // =================================
  // Interaction Methods
  // =================================

  /**
   * Click within component
   * @param {string} [selector] - Optional selector within component
   * @param {Object} [options] - Click options
   * @returns {BaseComponent} This component instance for chaining
   */
  click(selector, options = {}) {
    if (selector) {
      this.find(selector).click(options);
    } else {
      this.getRoot().click(options);
    }
    return this;
  }

  /**
   * Type text into element within component
   * @param {string} selector - Element selector
   * @param {string} text - Text to type
   * @param {Object} [options] - Type options
   * @returns {BaseComponent} This component instance for chaining
   */
  type(selector, text, options = {}) {
    const { clear = true, delay = 0 } = options;
    const element = this.find(selector);

    if (clear) {
      element.clear();
    }

    element.type(text, { delay });
    return this;
  }

  /**
   * Select option from dropdown within component
   * @param {string} selector - Select element selector
   * @param {string|string[]} value - Value(s) to select
   * @returns {BaseComponent} This component instance for chaining
   */
  select(selector, value) {
    this.find(selector).select(value);
    return this;
  }

  /**
   * Check checkbox within component
   * @param {string} selector - Checkbox selector
   * @param {Object} [options] - Check options
   * @returns {BaseComponent} This component instance for chaining
   */
  check(selector, options = {}) {
    this.find(selector).check(options);
    return this;
  }

  /**
   * Uncheck checkbox within component
   * @param {string} selector - Checkbox selector
   * @param {Object} [options] - Uncheck options
   * @returns {BaseComponent} This component instance for chaining
   */
  uncheck(selector, options = {}) {
    this.find(selector).uncheck(options);
    return this;
  }

  /**
   * Hover over element within component
   * @param {string} [selector] - Optional selector within component
   * @returns {BaseComponent} This component instance for chaining
   */
  hover(selector) {
    if (selector) {
      this.find(selector).trigger('mouseover');
    } else {
      this.getRoot().trigger('mouseover');
    }
    return this;
  }

  /**
   * Scroll component into view
   * @param {Object} [options] - Scroll options
   * @returns {BaseComponent} This component instance for chaining
   */
  scrollIntoView(options = {}) {
    this.getRoot().scrollIntoView(options);
    return this;
  }

  // =================================
  // Wait Methods
  // =================================

  /**
   * Wait for component to be visible
   * @param {number} [timeout] - Custom timeout
   * @returns {BaseComponent} This component instance for chaining
   */
  waitForVisible(timeout = this.timeout) {
    this.getRoot({ timeout }).should('be.visible');
    return this;
  }

  /**
   * Wait for component to be hidden
   * @param {number} [timeout] - Custom timeout
   * @returns {BaseComponent} This component instance for chaining
   */
  waitForHidden(timeout = this.timeout) {
    cy.get(this.rootSelector, { timeout }).should('not.be.visible');
    return this;
  }

  /**
   * Wait for component to be removed from DOM
   * @param {number} [timeout] - Custom timeout
   * @returns {BaseComponent} This component instance for chaining
   */
  waitForRemoved(timeout = this.timeout) {
    cy.get(this.rootSelector, { timeout }).should('not.exist');
    return this;
  }

  /**
   * Wait for element within component
   * @param {string} selector - Element selector
   * @param {number} [timeout] - Custom timeout
   * @returns {BaseComponent} This component instance for chaining
   */
  waitForElement(selector, timeout = this.timeout) {
    this.find(selector, { timeout }).should('be.visible');
    return this;
  }

  // =================================
  // Assertion Methods
  // =================================

  /**
   * Verify component is visible
   * @returns {BaseComponent} This component instance for chaining
   */
  shouldBeVisible() {
    this.getRoot().should('be.visible');
    return this;
  }

  /**
   * Verify component is not visible
   * @returns {BaseComponent} This component instance for chaining
   */
  shouldNotBeVisible() {
    cy.get(this.rootSelector).should('not.be.visible');
    return this;
  }

  /**
   * Verify component exists
   * @returns {BaseComponent} This component instance for chaining
   */
  shouldExist() {
    this.getRoot().should('exist');
    return this;
  }

  /**
   * Verify component does not exist
   * @returns {BaseComponent} This component instance for chaining
   */
  shouldNotExist() {
    cy.get(this.rootSelector).should('not.exist');
    return this;
  }

  /**
   * Verify component contains text
   * @param {string} text - Expected text
   * @returns {BaseComponent} This component instance for chaining
   */
  shouldContainText(text) {
    this.getRoot().should('contain.text', text);
    return this;
  }

  /**
   * Verify component has specific class
   * @param {string} className - Expected class name
   * @returns {BaseComponent} This component instance for chaining
   */
  shouldHaveClass(className) {
    this.getRoot().should('have.class', className);
    return this;
  }

  /**
   * Verify component has specific attribute
   * @param {string} attribute - Attribute name
   * @param {string} [value] - Expected attribute value
   * @returns {BaseComponent} This component instance for chaining
   */
  shouldHaveAttribute(attribute, value) {
    if (value !== undefined) {
      this.getRoot().should('have.attr', attribute, value);
    } else {
      this.getRoot().should('have.attr', attribute);
    }
    return this;
  }

  /**
   * Verify element count within component
   * @param {string} selector - Element selector
   * @param {number} expectedCount - Expected count
   * @returns {BaseComponent} This component instance for chaining
   */
  shouldHaveElementCount(selector, expectedCount) {
    this.findAll(selector).should('have.length', expectedCount);
    return this;
  }

  // =================================
  // Utility Methods
  // =================================

  /**
   * Get text content of component
   * @returns {Cypress.Chainable<string>} Text content
   */
  getText() {
    return this.getRoot().invoke('text');
  }

  /**
   * Get attribute value from component
   * @param {string} attribute - Attribute name
   * @returns {Cypress.Chainable<string>} Attribute value
   */
  getAttribute(attribute) {
    return this.getRoot().invoke('attr', attribute);
  }

  /**
   * Get CSS property value
   * @param {string} property - CSS property name
   * @returns {Cypress.Chainable<string>} CSS value
   */
  getCssValue(property) {
    return this.getRoot().invoke('css', property);
  }

  /**
   * Execute callback within component scope
   * @param {Function} callback - Callback function
   * @returns {BaseComponent} This component instance for chaining
   */
  within(callback) {
    this.getRoot().within(callback);
    return this;
  }

  /**
   * Take screenshot of component
   * @param {string} [name] - Screenshot name
   * @returns {BaseComponent} This component instance for chaining
   */
  screenshot(name) {
    if (name) {
      this.getRoot().screenshot(name);
    } else {
      this.getRoot().screenshot();
    }
    return this;
  }

  /**
   * Log component state for debugging
   * @returns {BaseComponent} This component instance for chaining
   */
  debug() {
    this.getRoot().then(($el) => {
      cy.log(`Component: ${this.rootSelector}`);
      cy.log(`Visible: ${$el.is(':visible')}`);
      cy.log(`Text: ${$el.text().substring(0, 100)}`);
    });
    return this;
  }
}

export default BaseComponent;
