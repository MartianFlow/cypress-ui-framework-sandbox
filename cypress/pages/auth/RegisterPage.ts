/**
 * RegisterPage - Page Object for Registration functionality
 * @description Handles all registration page interactions and verifications
 * @extends BasePage
 */
import BasePage from '../base/BasePage';
const { AUTH } = require('../../utils/constants/selectors');
const { APP } = require('../../utils/constants/routes');

class RegisterPage extends BasePage {
  /**
   * Creates a RegisterPage instance
   */
  constructor() {
    super(APP.AUTH.REGISTER);
    this.selectors = AUTH.REGISTER;
  }

  // =================================
  // Page Elements
  // =================================

  get firstNameInput() {
    return cy.get(this.selectors.FIRST_NAME_INPUT);
  }

  get lastNameInput() {
    return cy.get(this.selectors.LAST_NAME_INPUT);
  }

  get emailInput() {
    return cy.get(this.selectors.EMAIL_INPUT);
  }

  get passwordInput() {
    return cy.get(this.selectors.PASSWORD_INPUT);
  }

  get confirmPasswordInput() {
    return cy.get(this.selectors.CONFIRM_PASSWORD_INPUT);
  }

  get termsCheckbox() {
    return cy.get(this.selectors.TERMS_CHECKBOX);
  }

  get registerButton() {
    return cy.get(this.selectors.SUBMIT_BUTTON);
  }

  get loginLink() {
    return cy.get(this.selectors.LOGIN_LINK);
  }

  get errorMessage() {
    return cy.get(this.selectors.ERROR_MESSAGE);
  }

  get successMessage() {
    return cy.get(this.selectors.SUCCESS_MESSAGE);
  }

  // =================================
  // Action Methods
  // =================================

  /**
   * Enter first name
   * @param {string} firstName - First name to enter
   * @returns {RegisterPage} This page instance for chaining
   */
  enterFirstName(firstName) {
    this.firstNameInput.clear().type(firstName);
    return this;
  }

  /**
   * Enter last name
   * @param {string} lastName - Last name to enter
   * @returns {RegisterPage} This page instance for chaining
   */
  enterLastName(lastName) {
    this.lastNameInput.clear().type(lastName);
    return this;
  }

  /**
   * Enter email address
   * @param {string} email - Email to enter
   * @returns {RegisterPage} This page instance for chaining
   */
  enterEmail(email) {
    this.emailInput.clear().type(email);
    return this;
  }

  /**
   * Enter password
   * @param {string} password - Password to enter
   * @returns {RegisterPage} This page instance for chaining
   */
  enterPassword(password) {
    this.passwordInput.clear().type(password, { log: false });
    return this;
  }

  /**
   * Enter confirm password
   * @param {string} password - Password to confirm
   * @returns {RegisterPage} This page instance for chaining
   */
  enterConfirmPassword(password) {
    this.confirmPasswordInput.clear().type(password, { log: false });
    return this;
  }

  /**
   * Accept terms and conditions
   * @returns {RegisterPage} This page instance for chaining
   */
  acceptTerms() {
    this.termsCheckbox.check();
    return this;
  }

  /**
   * Click register button
   * @returns {RegisterPage} This page instance for chaining
   */
  clickRegister() {
    this.registerButton.click();
    return this;
  }

  /**
   * Click login link
   * @returns {RegisterPage} This page instance for chaining
   */
  clickLoginLink() {
    this.loginLink.click();
    return this;
  }

  // =================================
  // High-Level Actions
  // =================================

  /**
   * Perform complete registration
   * @param {Object} userData - User registration data
   * @param {string} userData.firstName - First name
   * @param {string} userData.lastName - Last name
   * @param {string} userData.email - Email address
   * @param {string} userData.password - Password
   * @param {Object} [options] - Registration options
   * @param {boolean} [options.acceptTerms=true] - Accept terms
   * @param {boolean} [options.submit=true] - Submit the form
   * @returns {RegisterPage} This page instance for chaining
   */
  register(userData, options = {}) {
    const { acceptTerms = true, submit = true } = options;

    this.enterFirstName(userData.firstName);
    this.enterLastName(userData.lastName);
    this.enterEmail(userData.email);
    this.enterPassword(userData.password);
    this.enterConfirmPassword(userData.password);

    if (acceptTerms) {
      this.acceptTerms();
    }

    if (submit) {
      this.clickRegister();
    }

    return this;
  }

  /**
   * Register with fixture data
   * @param {string} userType - User type key from fixture
   * @returns {RegisterPage} This page instance for chaining
   */
  registerWithFixture(userType = 'newUser') {
    cy.fixture('testdata/users.json').then((users) => {
      const user = users[userType];
      if (!user) {
        throw new Error(`User type '${userType}' not found in fixture`);
      }
      this.register(user);
    });
    return this;
  }

  // =================================
  // Verification Methods
  // =================================

  /**
   * Verify page is loaded
   * @returns {RegisterPage} This page instance for chaining
   */
  verifyPageLoaded() {
    this.verifyUrl(this.path);
    cy.get(this.selectors.PAGE).should('be.visible');
    this.firstNameInput.should('be.visible');
    this.emailInput.should('be.visible');
    this.passwordInput.should('be.visible');
    this.registerButton.should('be.visible');
    return this;
  }

  /**
   * Verify error message is displayed
   * @param {string} [expectedMessage] - Expected error message
   * @returns {RegisterPage} This page instance for chaining
   */
  verifyErrorDisplayed(expectedMessage) {
    this.errorMessage.should('be.visible');
    if (expectedMessage) {
      this.errorMessage.should('contain.text', expectedMessage);
    }
    return this;
  }

  /**
   * Verify success message is displayed
   * @param {string} [expectedMessage] - Expected success message
   * @returns {RegisterPage} This page instance for chaining
   */
  verifySuccessDisplayed(expectedMessage) {
    this.successMessage.should('be.visible');
    if (expectedMessage) {
      this.successMessage.should('contain.text', expectedMessage);
    }
    return this;
  }

  /**
   * Verify registration button is disabled
   * @returns {RegisterPage} This page instance for chaining
   */
  verifyRegisterButtonDisabled() {
    this.registerButton.should('be.disabled');
    return this;
  }

  /**
   * Verify registration button is enabled
   * @returns {RegisterPage} This page instance for chaining
   */
  verifyRegisterButtonEnabled() {
    this.registerButton.should('be.enabled');
    return this;
  }

  /**
   * Verify redirected to login after registration
   * @returns {RegisterPage} This page instance for chaining
   */
  verifyRedirectedToLogin() {
    cy.url().should('include', '/login');
    return this;
  }

  /**
   * Verify redirected to dashboard after registration
   * @returns {RegisterPage} This page instance for chaining
   */
  verifyRedirectedToDashboard() {
    cy.url().should('include', '/dashboard');
    return this;
  }

  // =================================
  // Field Verification Methods
  // =================================

  /**
   * Verify error message for a specific field
   * @param {Cypress.Chainable} element - Input element
   * @param {string} message - Expected error message
   * @returns {RegisterPage} This page instance for chaining
   */
  verifyFieldError(element, message) {
    element.should('have.class', 'border-red-500');
    // Find the closest container div that holds both the input/wrapper and the error message
    element.closest('.space-y-6 > div').find('[data-testid="field-error"]')
      .should('be.visible')
      .should('contain.text', message);
    return this;
  }

  verifyFirstNameError(message) {
    return this.verifyFieldError(this.firstNameInput, message);
  }

  verifyLastNameError(message) {
    return this.verifyFieldError(this.lastNameInput, message);
  }

  verifyEmailError(message) {
    return this.verifyFieldError(this.emailInput, message);
  }

  verifyPasswordError(message) {
    return this.verifyFieldError(this.passwordInput, message);
  }

  verifyConfirmPasswordError(message) {
    return this.verifyFieldError(this.confirmPasswordInput, message);
  }

  verifyTermsError(message) {
    this.termsCheckbox.closest('div').find('[data-testid="field-error"]')
      .should('be.visible')
      .should('contain.text', message);
    return this;
  }

  // =================================
  // API Interception Methods
  // =================================

  /**
   * Setup registration API intercept
   * @param {string} [alias='registerRequest'] - Intercept alias
   * @returns {RegisterPage} This page instance for chaining
   */
  interceptRegisterRequest(alias = 'registerRequest') {
    cy.intercept('POST', '**/auth/register').as(alias);
    return this;
  }

  /**
   * Mock successful registration response
   * @param {Object} [userData] - User data to return
   * @param {string} [alias='registerRequest'] - Intercept alias
   * @returns {RegisterPage} This page instance for chaining
   */
  mockRegisterSuccess(userData = {}, alias = 'registerRequest') {
    cy.intercept('POST', '**/auth/register', {
      statusCode: 201,
      body: {
        success: true,
        data: {
          id: 1,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          ...userData,
        },
      },
    }).as(alias);
    return this;
  }

  /**
   * Mock failed registration response
   * @param {string} [message] - Error message
   * @param {number} [statusCode=400] - HTTP status code
   * @param {string} [alias='registerRequest'] - Intercept alias
   * @returns {RegisterPage} This page instance for chaining
   */
  mockRegisterFailure(message = 'Email already exists', statusCode = 400, alias = 'registerRequest') {
    cy.intercept('POST', '**/auth/register', {
      statusCode,
      body: {
        success: false,
        error: {
          message,
        },
      },
    }).as(alias);
    return this;
  }

  /**
   * Wait for registration request
   * @param {string} [alias='registerRequest'] - Intercept alias
   * @returns {Cypress.Chainable} Intercepted request
   */
  waitForRegisterRequest(alias = 'registerRequest') {
    return cy.wait(`@${alias}`);
  }
}

export default RegisterPage;
