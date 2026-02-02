/**
 * ModalComponent - Reusable modal/dialog component
 * @description Handles interactions with modal dialogs and popups
 * @extends BaseComponent
 */
import BaseComponent from '../base/BaseComponent';

class ModalComponent extends BaseComponent {
  /**
   * Creates a ModalComponent instance
   * @param {string} [rootSelector='[data-testid="modal"]'] - Modal root selector
   */
  constructor(rootSelector = '[data-testid="modal"]') {
    super(rootSelector);

    // Define component selectors
    this.selectors = {
      overlay: '[data-testid="modal-overlay"]',
      content: '[data-testid="modal-content"]',
      header: '[data-testid="modal-header"]',
      title: '[data-testid="modal-title"]',
      body: '[data-testid="modal-body"]',
      footer: '[data-testid="modal-footer"]',
      closeButton: '[data-testid="modal-close"]',
      confirmButton: '[data-testid="modal-confirm"]',
      cancelButton: '[data-testid="modal-cancel"]',
      submitButton: '[data-testid="modal-submit"]',
      input: '[data-testid="modal-input"]',
      errorMessage: '[data-testid="modal-error"]',
      successMessage: '[data-testid="modal-success"]',
      loadingSpinner: '[data-testid="modal-loading"]',
    };
  }

  // =================================
  // Open/Close Methods
  // =================================

  /**
   * Wait for modal to open
   * @param {number} [timeout] - Custom timeout
   * @returns {ModalComponent} This component instance for chaining
   */
  waitForOpen(timeout) {
    this.waitForVisible(timeout);
    return this;
  }

  /**
   * Wait for modal to close
   * @param {number} [timeout] - Custom timeout
   * @returns {ModalComponent} This component instance for chaining
   */
  waitForClose(timeout) {
    this.waitForRemoved(timeout);
    return this;
  }

  /**
   * Close modal by clicking close button
   * @returns {ModalComponent} This component instance for chaining
   */
  close() {
    this.find(this.selectors.closeButton).click();
    return this;
  }

  /**
   * Close modal by clicking overlay/backdrop
   * @returns {ModalComponent} This component instance for chaining
   */
  closeByOverlay() {
    cy.get(this.selectors.overlay).click({ force: true });
    return this;
  }

  /**
   * Close modal by pressing Escape key
   * @returns {ModalComponent} This component instance for chaining
   */
  closeByEscape() {
    this.getRoot().type('{esc}');
    return this;
  }

  // =================================
  // Header Methods
  // =================================

  /**
   * Get modal title text
   * @returns {Cypress.Chainable<string>} Title text
   */
  getTitle() {
    return this.find(this.selectors.title).invoke('text');
  }

  /**
   * Verify modal title
   * @param {string} expectedTitle - Expected title text
   * @returns {ModalComponent} This component instance for chaining
   */
  verifyTitle(expectedTitle) {
    this.find(this.selectors.title).should('contain.text', expectedTitle);
    return this;
  }

  // =================================
  // Body Methods
  // =================================

  /**
   * Get modal body content
   * @returns {Cypress.Chainable} Modal body element
   */
  getBody() {
    return this.find(this.selectors.body);
  }

  /**
   * Get modal body text
   * @returns {Cypress.Chainable<string>} Body text
   */
  getBodyText() {
    return this.find(this.selectors.body).invoke('text');
  }

  /**
   * Verify modal body contains text
   * @param {string} text - Expected text in body
   * @returns {ModalComponent} This component instance for chaining
   */
  verifyBodyContains(text) {
    this.find(this.selectors.body).should('contain.text', text);
    return this;
  }

  /**
   * Fill input in modal body
   * @param {string} text - Text to enter
   * @param {Object} [options] - Type options
   * @returns {ModalComponent} This component instance for chaining
   */
  fillInput(text, options = {}) {
    const { clear = true, selector = this.selectors.input } = options;
    const input = this.find(selector);

    if (clear) {
      input.clear();
    }

    input.type(text);
    return this;
  }

  /**
   * Get input value in modal
   * @param {string} [selector] - Optional input selector
   * @returns {Cypress.Chainable<string>} Input value
   */
  getInputValue(selector = this.selectors.input) {
    return this.find(selector).invoke('val');
  }

  // =================================
  // Footer/Action Methods
  // =================================

  /**
   * Click confirm button
   * @returns {ModalComponent} This component instance for chaining
   */
  confirm() {
    this.find(this.selectors.confirmButton).click();
    return this;
  }

  /**
   * Click cancel button
   * @returns {ModalComponent} This component instance for chaining
   */
  cancel() {
    this.find(this.selectors.cancelButton).click();
    return this;
  }

  /**
   * Click submit button
   * @returns {ModalComponent} This component instance for chaining
   */
  submit() {
    this.find(this.selectors.submitButton).click();
    return this;
  }

  /**
   * Click button by text in modal footer
   * @param {string} buttonText - Button text
   * @returns {ModalComponent} This component instance for chaining
   */
  clickButton(buttonText) {
    this.find(this.selectors.footer).contains('button', buttonText).click();
    return this;
  }

  /**
   * Verify confirm button is enabled
   * @returns {ModalComponent} This component instance for chaining
   */
  verifyConfirmEnabled() {
    this.find(this.selectors.confirmButton).should('be.enabled');
    return this;
  }

  /**
   * Verify confirm button is disabled
   * @returns {ModalComponent} This component instance for chaining
   */
  verifyConfirmDisabled() {
    this.find(this.selectors.confirmButton).should('be.disabled');
    return this;
  }

  /**
   * Verify submit button is enabled
   * @returns {ModalComponent} This component instance for chaining
   */
  verifySubmitEnabled() {
    this.find(this.selectors.submitButton).should('be.enabled');
    return this;
  }

  /**
   * Verify submit button is disabled
   * @returns {ModalComponent} This component instance for chaining
   */
  verifySubmitDisabled() {
    this.find(this.selectors.submitButton).should('be.disabled');
    return this;
  }

  // =================================
  // Message Methods
  // =================================

  /**
   * Verify error message is displayed
   * @param {string} [message] - Optional expected message
   * @returns {ModalComponent} This component instance for chaining
   */
  verifyError(message) {
    this.find(this.selectors.errorMessage).should('be.visible');
    if (message) {
      this.find(this.selectors.errorMessage).should('contain.text', message);
    }
    return this;
  }

  /**
   * Verify success message is displayed
   * @param {string} [message] - Optional expected message
   * @returns {ModalComponent} This component instance for chaining
   */
  verifySuccess(message) {
    this.find(this.selectors.successMessage).should('be.visible');
    if (message) {
      this.find(this.selectors.successMessage).should('contain.text', message);
    }
    return this;
  }

  /**
   * Get error message text
   * @returns {Cypress.Chainable<string>} Error message text
   */
  getErrorMessage() {
    return this.find(this.selectors.errorMessage).invoke('text');
  }

  /**
   * Get success message text
   * @returns {Cypress.Chainable<string>} Success message text
   */
  getSuccessMessage() {
    return this.find(this.selectors.successMessage).invoke('text');
  }

  // =================================
  // Loading State Methods
  // =================================

  /**
   * Verify modal is in loading state
   * @returns {ModalComponent} This component instance for chaining
   */
  verifyLoading() {
    this.find(this.selectors.loadingSpinner).should('be.visible');
    return this;
  }

  /**
   * Wait for loading to complete
   * @param {number} [timeout] - Custom timeout
   * @returns {ModalComponent} This component instance for chaining
   */
  waitForLoadingComplete(timeout = this.timeout) {
    cy.get('body').then(($body) => {
      if ($body.find(`${this.rootSelector} ${this.selectors.loadingSpinner}`).length > 0) {
        this.find(this.selectors.loadingSpinner, { timeout }).should('not.exist');
      }
    });
    return this;
  }

  // =================================
  // Verification Methods
  // =================================

  /**
   * Verify modal is open
   * @returns {ModalComponent} This component instance for chaining
   */
  verifyOpen() {
    this.shouldBeVisible();
    return this;
  }

  /**
   * Verify modal is closed
   * @returns {ModalComponent} This component instance for chaining
   */
  verifyClosed() {
    this.shouldNotExist();
    return this;
  }

  /**
   * Verify modal structure (header, body, footer)
   * @returns {ModalComponent} This component instance for chaining
   */
  verifyStructure() {
    this.find(this.selectors.header).should('exist');
    this.find(this.selectors.body).should('exist');
    this.find(this.selectors.footer).should('exist');
    return this;
  }

  /**
   * Verify modal has close button
   * @returns {ModalComponent} This component instance for chaining
   */
  verifyHasCloseButton() {
    this.find(this.selectors.closeButton).should('be.visible');
    return this;
  }

  /**
   * Verify modal can be dismissed by overlay click
   * @param {boolean} canDismiss - Whether overlay dismissal is expected to work
   * @returns {ModalComponent} This component instance for chaining
   */
  verifyOverlayDismissable(canDismiss = true) {
    if (canDismiss) {
      this.closeByOverlay();
      this.verifyClosed();
    }
    return this;
  }

  // =================================
  // Form Modal Methods
  // =================================

  /**
   * Fill form field in modal
   * @param {string} fieldTestId - Field data-testid
   * @param {string} value - Value to enter
   * @returns {ModalComponent} This component instance for chaining
   */
  fillField(fieldTestId, value) {
    this.findByTestId(fieldTestId).clear().type(value);
    return this;
  }

  /**
   * Select dropdown option in modal
   * @param {string} selectTestId - Select data-testid
   * @param {string} value - Value to select
   * @returns {ModalComponent} This component instance for chaining
   */
  selectOption(selectTestId, value) {
    this.findByTestId(selectTestId).select(value);
    return this;
  }

  /**
   * Check checkbox in modal
   * @param {string} checkboxTestId - Checkbox data-testid
   * @returns {ModalComponent} This component instance for chaining
   */
  checkCheckbox(checkboxTestId) {
    this.findByTestId(checkboxTestId).check();
    return this;
  }

  /**
   * Uncheck checkbox in modal
   * @param {string} checkboxTestId - Checkbox data-testid
   * @returns {ModalComponent} This component instance for chaining
   */
  uncheckCheckbox(checkboxTestId) {
    this.findByTestId(checkboxTestId).uncheck();
    return this;
  }

  // =================================
  // Confirmation Dialog Methods
  // =================================

  /**
   * Accept confirmation dialog
   * @returns {ModalComponent} This component instance for chaining
   */
  acceptConfirmation() {
    this.confirm();
    return this;
  }

  /**
   * Decline confirmation dialog
   * @returns {ModalComponent} This component instance for chaining
   */
  declineConfirmation() {
    this.cancel();
    return this;
  }

  /**
   * Verify confirmation dialog text
   * @param {string} text - Expected confirmation text
   * @returns {ModalComponent} This component instance for chaining
   */
  verifyConfirmationText(text) {
    this.verifyBodyContains(text);
    return this;
  }
}

export default ModalComponent;
