/**
 * UI Custom Commands
 * @description Enhanced commands for UI interactions and assertions
 * @module UICommands
 */

// =================================
// Element Selection Commands
// =================================

/**
 * Get element by data-testid attribute
 * @param {string} testId - The data-testid value
 * @param {Object} [options] - Cypress get options
 * @returns {Cypress.Chainable} Element
 * @example
 * cy.getByTestId('submit-button')
 * cy.getByTestId('input-field', { timeout: 10000 })
 */
Cypress.Commands.add('getByTestId', (testId, options = {}) => {
  const defaultOptions = {
    timeout: Cypress.config('defaultCommandTimeout'),
  };
  return cy.get(`[data-testid="${testId}"]`, { ...defaultOptions, ...options });
});

/**
 * Find element by data-testid within parent
 * @param {string} testId - The data-testid value
 * @returns {Cypress.Chainable} Element
 * @example
 * cy.get('.form').findByTestId('submit-button')
 */
Cypress.Commands.add('findByTestId', { prevSubject: true }, (subject, testId) => {
  return cy.wrap(subject).find(`[data-testid="${testId}"]`);
});

/**
 * Get element by role attribute
 * @param {string} role - The role value
 * @param {Object} [options] - Additional options
 * @returns {Cypress.Chainable} Element
 * @example
 * cy.getByRole('button')
 * cy.getByRole('dialog', { name: 'Confirm' })
 */
Cypress.Commands.add('getByRole', (role, options = {}) => {
  const { name, ...cypressOptions } = options;
  let selector = `[role="${role}"]`;

  if (name) {
    return cy.get(selector, cypressOptions).filter(`:contains("${name}")`);
  }

  return cy.get(selector, cypressOptions);
});

/**
 * Get element by placeholder text
 * @param {string} placeholder - Placeholder text
 * @returns {Cypress.Chainable} Element
 * @example
 * cy.getByPlaceholder('Enter your email')
 */
Cypress.Commands.add('getByPlaceholder', (placeholder) => {
  return cy.get(`[placeholder="${placeholder}"]`);
});

/**
 * Get element by aria-label
 * @param {string} label - Aria label text
 * @returns {Cypress.Chainable} Element
 * @example
 * cy.getByAriaLabel('Close modal')
 */
Cypress.Commands.add('getByAriaLabel', (label) => {
  return cy.get(`[aria-label="${label}"]`);
});

// =================================
// Enhanced Interaction Commands
// =================================

/**
 * Clear field and type text
 * @param {string} text - Text to type
 * @param {Object} [options] - Type options
 * @returns {Cypress.Chainable} Element
 * @example
 * cy.getByTestId('input').clearAndType('new value')
 */
Cypress.Commands.add('clearAndType', { prevSubject: true }, (subject, text, options = {}) => {
  return cy.wrap(subject).clear().type(text, options);
});

/**
 * Click element and wait for navigation
 * @param {Object} [options] - Click and wait options
 * @returns {Cypress.Chainable} Element
 * @example
 * cy.getByTestId('submit').clickAndWait()
 */
Cypress.Commands.add('clickAndWait', { prevSubject: true }, (subject, options = {}) => {
  const { waitFor = 1000, ...clickOptions } = options;
  return cy.wrap(subject).click(clickOptions).wait(waitFor);
});

/**
 * Force click on element (bypasses visibility checks)
 * @param {Object} [options] - Click options
 * @returns {Cypress.Chainable} Element
 * @example
 * cy.getByTestId('hidden-button').forceClick()
 */
Cypress.Commands.add('forceClick', { prevSubject: true }, (subject, options = {}) => {
  return cy.wrap(subject).click({ force: true, ...options });
});

/**
 * Hover over element
 * @returns {Cypress.Chainable} Element
 * @example
 * cy.getByTestId('menu-trigger').hover()
 */
Cypress.Commands.add('hover', { prevSubject: true }, (subject) => {
  return cy.wrap(subject)
    .trigger('mouseenter')
    .trigger('mouseover');
});

/**
 * Drag element to target
 * @param {string} targetSelector - Target element selector
 * @returns {Cypress.Chainable} Element
 * @example
 * cy.getByTestId('drag-item').dragTo('[data-testid="drop-zone"]')
 */
Cypress.Commands.add('dragTo', { prevSubject: true }, (subject, targetSelector) => {
  return cy.wrap(subject)
    .trigger('dragstart')
    .get(targetSelector)
    .trigger('drop')
    .trigger('dragend');
});

// =================================
// File Upload Commands
// =================================

/**
 * Upload file to input
 * @param {string|string[]} filePath - File path(s) in fixtures or absolute
 * @param {Object} [options] - Upload options
 * @returns {Cypress.Chainable} Element
 * @example
 * cy.getByTestId('file-input').uploadFile('documents/test.pdf')
 * cy.getByTestId('file-input').uploadFile(['file1.png', 'file2.png'])
 */
Cypress.Commands.add('uploadFile', { prevSubject: true }, (subject, filePath, options = {}) => {
  const files = Array.isArray(filePath) ? filePath : [filePath];
  const processedFiles = files.map(file =>
    file.startsWith('cypress/fixtures/') ? file : `cypress/fixtures/${file}`
  );

  return cy.wrap(subject).selectFile(processedFiles, options);
});

/**
 * Upload file via drag and drop
 * @param {string} filePath - File path in fixtures
 * @returns {Cypress.Chainable} Element
 * @example
 * cy.getByTestId('drop-zone').uploadByDragDrop('image.png')
 */
Cypress.Commands.add('uploadByDragDrop', { prevSubject: true }, (subject, filePath) => {
  const file = filePath.startsWith('cypress/fixtures/')
    ? filePath
    : `cypress/fixtures/${filePath}`;

  return cy.wrap(subject).selectFile(file, { action: 'drag-drop' });
});

// =================================
// Wait Commands
// =================================

/**
 * Wait for element to be visible
 * @param {string} selector - Element selector
 * @param {number} [timeout] - Custom timeout
 * @example
 * cy.waitForVisible('[data-testid="modal"]')
 */
Cypress.Commands.add('waitForVisible', (selector, timeout = Cypress.config('defaultCommandTimeout')) => {
  return cy.get(selector, { timeout }).should('be.visible');
});

/**
 * Wait for element to disappear
 * @param {string} selector - Element selector
 * @param {number} [timeout] - Custom timeout
 * @example
 * cy.waitForHidden('[data-testid="loading"]')
 */
Cypress.Commands.add('waitForHidden', (selector, timeout = Cypress.config('defaultCommandTimeout')) => {
  return cy.get(selector, { timeout }).should('not.exist');
});

/**
 * Wait for loading indicator to complete
 * @param {string} [selector='[data-testid="loading"]'] - Loading selector
 * @param {number} [timeout] - Custom timeout
 * @example
 * cy.waitForLoading()
 * cy.waitForLoading('[data-testid="spinner"]')
 */
Cypress.Commands.add('waitForLoading', (selector = '[data-testid="loading"]', timeout) => {
  cy.get('body').then(($body) => {
    if ($body.find(selector).length > 0) {
      cy.get(selector, { timeout: timeout || Cypress.config('defaultCommandTimeout') })
        .should('not.exist');
    }
  });
});

/**
 * Wait for page to fully load
 * @example
 * cy.waitForPageLoad()
 */
Cypress.Commands.add('waitForPageLoad', () => {
  cy.document().its('readyState').should('eq', 'complete');
  cy.waitForLoading();
});

// =================================
// Scroll Commands
// =================================

/**
 * Scroll element into view (alias for scrollIntoView)
 * @param {Object} [options] - Scroll options
 * @returns {Cypress.Chainable} Element
 * @example
 * cy.getByTestId('footer').scrollToView()
 */
Cypress.Commands.add('scrollToView', { prevSubject: true }, (subject, options = {}) => {
  return cy.wrap(subject).scrollIntoView(options);
});

/**
 * Scroll to bottom of element
 * @returns {Cypress.Chainable} Element
 * @example
 * cy.getByTestId('scrollable-list').scrollToBottom()
 */
Cypress.Commands.add('scrollToBottom', { prevSubject: true }, (subject) => {
  return cy.wrap(subject).scrollTo('bottom');
});

/**
 * Scroll to top of element
 * @returns {Cypress.Chainable} Element
 * @example
 * cy.getByTestId('scrollable-list').scrollToTop()
 */
Cypress.Commands.add('scrollToTop', { prevSubject: true }, (subject) => {
  return cy.wrap(subject).scrollTo('top');
});

// =================================
// Assertion Commands
// =================================

/**
 * Verify element has specific text
 * @param {string} expectedText - Expected text
 * @returns {Cypress.Chainable} Element
 * @example
 * cy.getByTestId('message').shouldHaveText('Success!')
 */
Cypress.Commands.add('shouldHaveText', { prevSubject: true }, (subject, expectedText) => {
  return cy.wrap(subject).should('have.text', expectedText.trim());
});

/**
 * Verify element contains text
 * @param {string} text - Text to find
 * @returns {Cypress.Chainable} Element
 * @example
 * cy.getByTestId('message').shouldContainText('Success')
 */
Cypress.Commands.add('shouldContainText', { prevSubject: true }, (subject, text) => {
  return cy.wrap(subject).should('contain.text', text);
});

/**
 * Verify element is visible and enabled
 * @returns {Cypress.Chainable} Element
 * @example
 * cy.getByTestId('submit-btn').shouldBeInteractable()
 */
Cypress.Commands.add('shouldBeInteractable', { prevSubject: true }, (subject) => {
  return cy.wrap(subject)
    .should('be.visible')
    .and('be.enabled');
});

/**
 * Verify input has specific value
 * @param {string} value - Expected value
 * @returns {Cypress.Chainable} Element
 * @example
 * cy.getByTestId('email-input').shouldHaveValue('test@example.com')
 */
Cypress.Commands.add('shouldHaveValue', { prevSubject: true }, (subject, value) => {
  return cy.wrap(subject).should('have.value', value);
});

/**
 * Verify element count
 * @param {number} count - Expected count
 * @returns {Cypress.Chainable} Elements
 * @example
 * cy.getByTestId('list-item').shouldHaveCount(5)
 */
Cypress.Commands.add('shouldHaveCount', { prevSubject: true }, (subject, count) => {
  return cy.wrap(subject).should('have.length', count);
});

// =================================
// Storage Commands
// =================================

/**
 * Set item in local storage
 * @param {string} key - Storage key
 * @param {*} value - Storage value (will be stringified if object)
 * @example
 * cy.setLocalStorage('user', { name: 'John' })
 */
Cypress.Commands.add('setLocalStorage', (key, value) => {
  const stringValue = typeof value === 'object' ? JSON.stringify(value) : value;
  cy.window().then((win) => {
    win.localStorage.setItem(key, stringValue);
  });
});

/**
 * Get item from local storage
 * @param {string} key - Storage key
 * @returns {Cypress.Chainable<string|null>} Storage value
 * @example
 * cy.getLocalStorage('user').then(value => { ... })
 */
Cypress.Commands.add('getLocalStorage', (key) => {
  return cy.window().then((win) => win.localStorage.getItem(key));
});

// Note: cy.clearAllSessionStorage() is now a built-in Cypress command

// =================================
// Iframe Commands
// =================================

/**
 * Get iframe body
 * @returns {Cypress.Chainable} Iframe body
 * @example
 * cy.getByTestId('iframe').getIframeBody().find('button').click()
 */
Cypress.Commands.add('getIframeBody', { prevSubject: true }, (subject) => {
  return cy.wrap(subject)
    .its('0.contentDocument.body')
    .should('not.be.empty')
    .then(cy.wrap);
});

/**
 * Execute actions within iframe
 * @param {string} selector - Iframe selector
 * @param {Function} callback - Actions to perform in iframe
 * @example
 * cy.withinIframe('[data-testid="iframe"]', () => {
 *   cy.get('button').click()
 * })
 */
Cypress.Commands.add('withinIframe', (selector, callback) => {
  cy.get(selector)
    .getIframeBody()
    .within(callback);
});

// =================================
// Shadow DOM Commands
// =================================

/**
 * Get shadow root of element
 * @returns {Cypress.Chainable} Shadow root
 * @example
 * cy.get('my-component').getShadowRoot().find('button').click()
 */
Cypress.Commands.add('getShadowRoot', { prevSubject: true }, (subject) => {
  return cy.wrap(subject).shadow();
});

// =================================
// Clipboard Commands
// =================================

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @example
 * cy.copyToClipboard('Hello World')
 */
Cypress.Commands.add('copyToClipboard', (text) => {
  cy.window().then((win) => {
    win.navigator.clipboard.writeText(text);
  });
});

/**
 * Get clipboard text
 * @returns {Cypress.Chainable<string>} Clipboard content
 * @example
 * cy.getClipboard().then(text => { ... })
 */
Cypress.Commands.add('getClipboard', () => {
  return cy.window().then((win) => {
    return win.navigator.clipboard.readText();
  });
});

// =================================
// Screenshot Commands
// =================================

/**
 * Take full page screenshot
 * @param {string} [name] - Screenshot name
 * @example
 * cy.screenshotFullPage('home-page')
 */
Cypress.Commands.add('screenshotFullPage', (name) => {
  cy.screenshot(name, { capture: 'fullPage' });
});

/**
 * Take element screenshot
 * @param {string} [name] - Screenshot name
 * @returns {Cypress.Chainable} Element
 * @example
 * cy.getByTestId('chart').screenshotElement('chart-widget')
 */
Cypress.Commands.add('screenshotElement', { prevSubject: true }, (subject, name) => {
  return cy.wrap(subject).screenshot(name);
});
