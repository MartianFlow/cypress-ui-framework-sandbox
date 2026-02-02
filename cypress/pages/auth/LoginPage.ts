/**
 * LoginPage - Page Object for Login functionality
 * @description Handles all login page interactions and verifications
 * @extends BasePage
 */
import BasePage from '../base/BasePage';
const { AUTH } = require('../../utils/constants/selectors');
const { AUTH: AUTH_MESSAGES } = require('../../utils/constants/messages');
const { APP } = require('../../utils/constants/routes');

class LoginPage extends BasePage {
  /**
   * Creates a LoginPage instance
   */
  constructor() {
    super(APP.AUTH.LOGIN);

    // Define page-specific selectors
    this.selectors = AUTH.LOGIN;
  }

  // =================================
  // Page Elements
  // =================================

  /**
   * Get email input field
   * @returns {Cypress.Chainable} Email input element
   */
  get emailInput() {
    return cy.get(this.selectors.EMAIL_INPUT);
  }

  /**
   * Get password input field
   * @returns {Cypress.Chainable} Password input element
   */
  get passwordInput() {
    return cy.get(this.selectors.PASSWORD_INPUT);
  }

  /**
   * Get login button
   * @returns {Cypress.Chainable} Login button element
   */
  get loginButton() {
    return cy.get(`${this.selectors.FORM} ${this.selectors.SUBMIT_BUTTON}`);
  }

  /**
   * Get remember me checkbox
   * @returns {Cypress.Chainable} Remember me checkbox element
   */
  get rememberMeCheckbox() {
    return cy.get(this.selectors.REMEMBER_ME);
  }

  /**
   * Get forgot password link
   * @returns {Cypress.Chainable} Forgot password link element
   */
  get forgotPasswordLink() {
    return cy.get(this.selectors.FORGOT_PASSWORD_LINK);
  }

  /**
   * Get register link
   * @returns {Cypress.Chainable} Register link element
   */
  get registerLink() {
    return cy.get(this.selectors.REGISTER_LINK);
  }

  /**
   * Get error message element
   * @returns {Cypress.Chainable} Error message element
   */
  get errorMessage() {
    return cy.get(this.selectors.ERROR_MESSAGE);
  }

  /**
   * Get success message element
   * @returns {Cypress.Chainable} Success message element
   */
  get successMessage() {
    return cy.get(this.selectors.SUCCESS_MESSAGE);
  }

  /**
   * Get loading spinner
   * @returns {Cypress.Chainable} Loading spinner element
   */
  get loadingSpinner() {
    return cy.get(this.selectors.LOADING_SPINNER);
  }

  // =================================
  // Action Methods
  // =================================

  /**
   * Enter email address
   * @param {string} email - Email to enter
   * @returns {LoginPage} This page instance for chaining
   */
  enterEmail(email) {
    this.emailInput.clear().type(email);
    return this;
  }

  /**
   * Enter password
   * @param {string} password - Password to enter
   * @param {Object} [options] - Type options
   * @returns {LoginPage} This page instance for chaining
   */
  enterPassword(password, options = {}) {
    this.passwordInput.clear().type(password, { log: false, ...options });
    return this;
  }

  /**
   * Check remember me option
   * @returns {LoginPage} This page instance for chaining
   */
  checkRememberMe() {
    this.rememberMeCheckbox.check();
    return this;
  }

  /**
   * Uncheck remember me option
   * @returns {LoginPage} This page instance for chaining
   */
  uncheckRememberMe() {
    this.rememberMeCheckbox.uncheck();
    return this;
  }

  /**
   * Click login button
   * @returns {LoginPage} This page instance for chaining
   */
  clickLogin() {
    this.loginButton.click();
    return this;
  }

  /**
   * Submit login form (using Enter key)
   * @returns {LoginPage} This page instance for chaining
   */
  submitForm() {
    this.passwordInput.type('{enter}');
    return this;
  }

  /**
   * Click forgot password link
   * @returns {LoginPage} This page instance for chaining
   */
  clickForgotPassword() {
    this.forgotPasswordLink.click();
    return this;
  }

  /**
   * Click register link
   * @returns {LoginPage} This page instance for chaining
   */
  clickRegister() {
    this.registerLink.click();
    return this;
  }

  // =================================
  // High-Level Actions
  // =================================

  /**
   * Perform complete login
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Object} [options] - Login options
   * @param {boolean} [options.rememberMe=false] - Check remember me
   * @param {boolean} [options.submit=true] - Submit the form
   * @returns {LoginPage} This page instance for chaining
   */
  login(email, password, options = {}) {
    const { rememberMe = false, submit = true } = options;

    this.enterEmail(email);
    this.enterPassword(password);

    if (rememberMe) {
      this.checkRememberMe();
    }

    if (submit) {
      this.clickLogin();
    }

    return this;
  }

  /**
   * Login with credentials from fixture
   * @param {string} userType - User type key from fixture
   * @returns {LoginPage} This page instance for chaining
   */
  loginWithFixture(userType = 'validUser') {
    cy.fixture('testdata/users.json').then((users) => {
      const user = users[userType];
      if (!user) {
        throw new Error(`User type '${userType}' not found in fixture`);
      }
      this.login(user.email, user.password);
    });
    return this;
  }

  /**
   * Login and wait for redirect
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} [expectedUrl='/dashboard'] - Expected URL after login
   * @returns {LoginPage} This page instance for chaining
   */
  loginAndWait(email, password, expectedUrl = '/dashboard') {
    this.login(email, password);
    this.waitForUrl(expectedUrl);
    return this;
  }

  // =================================
  // OAuth Methods
  // =================================

  /**
   * Click Google OAuth button
   * @returns {LoginPage} This page instance for chaining
   */
  clickGoogleLogin() {
    cy.get(this.selectors.OAUTH_GOOGLE).click();
    return this;
  }

  /**
   * Click GitHub OAuth button
   * @returns {LoginPage} This page instance for chaining
   */
  clickGitHubLogin() {
    cy.get(this.selectors.OAUTH_GITHUB).click();
    return this;
  }

  /**
   * Click Facebook OAuth button
   * @returns {LoginPage} This page instance for chaining
   */
  clickFacebookLogin() {
    cy.get(this.selectors.OAUTH_FACEBOOK).click();
    return this;
  }

  // =================================
  // Verification Methods
  // =================================

  /**
   * Verify page is loaded
   * @returns {LoginPage} This page instance for chaining
   */
  verifyPageLoaded() {
    this.verifyUrl(this.path);
    cy.get(this.selectors.PAGE).should('be.visible');
    this.emailInput.should('be.visible');
    this.passwordInput.should('be.visible');
    this.loginButton.should('be.visible');
    return this;
  }

  /**
   * Verify login form is displayed
   * @returns {LoginPage} This page instance for chaining
   */
  verifyFormDisplayed() {
    cy.get(this.selectors.FORM).should('be.visible');
    return this;
  }

  /**
   * Verify error message is displayed
   * @param {string} [expectedMessage] - Expected error message
   * @returns {LoginPage} This page instance for chaining
   */
  verifyErrorDisplayed(expectedMessage) {
    this.errorMessage.should('be.visible');
    if (expectedMessage) {
      this.errorMessage.should('contain.text', expectedMessage);
    }
    return this;
  }

  /**
   * Verify invalid credentials error
   * @returns {LoginPage} This page instance for chaining
   */
  verifyInvalidCredentialsError() {
    this.verifyErrorDisplayed(AUTH_MESSAGES.LOGIN.INVALID_CREDENTIALS);
    return this;
  }

  /**
   * Verify success message is displayed
   * @param {string} [expectedMessage] - Expected success message
   * @returns {LoginPage} This page instance for chaining
   */
  verifySuccessDisplayed(expectedMessage) {
    this.successMessage.should('be.visible');
    if (expectedMessage) {
      this.successMessage.should('contain.text', expectedMessage);
    }
    return this;
  }

  /**
   * Verify login button is disabled
   * @returns {LoginPage} This page instance for chaining
   */
  verifyLoginButtonDisabled() {
    this.loginButton.should('be.disabled');
    return this;
  }

  /**
   * Verify login button is enabled
   * @returns {LoginPage} This page instance for chaining
   */
  verifyLoginButtonEnabled() {
    this.loginButton.should('be.enabled');
    return this;
  }

  /**
   * Verify loading state
   * @returns {LoginPage} This page instance for chaining
   */
  verifyLoading() {
    this.loadingSpinner.should('be.visible');
    return this;
  }

  /**
   * Verify loading complete
   * @returns {LoginPage} This page instance for chaining
   */
  verifyLoadingComplete() {
    this.loadingSpinner.should('not.exist');
    return this;
  }

  /**
   * Verify email field has error
   * @param {string} [message] - Expected error message
   * @returns {LoginPage} This page instance for chaining
   */
  verifyEmailError(message) {
    this.emailInput.should('have.class', 'border-red-500');
    if (message) {
      // Find the error message in the nearest container
      this.emailInput.closest('div').find('[data-testid="field-error"]')
        .should('be.visible')
        .should('contain.text', message);
    }
    return this;
  }

  /**
   * Verify password field has error
   * @param {string} [message] - Expected error message
   * @returns {LoginPage} This page instance for chaining
   */
  verifyPasswordError(message) {
    this.passwordInput.should('have.class', 'border-red-500');
    if (message) {
      // Find error message - password has an extra div.relative wrapper
      this.passwordInput.closest('div').parent().find('[data-testid="field-error"]')
        .should('be.visible')
        .should('contain.text', message);
    }
    return this;
  }

  /**
   * Verify user is redirected after login
   * @param {string} [expectedPath='/dashboard'] - Expected redirect path
   * @returns {LoginPage} This page instance for chaining
   */
  verifyRedirectedTo(expectedPath = '/dashboard') {
    cy.url().should('include', expectedPath);
    return this;
  }

  /**
   * Verify remember me is checked
   * @returns {LoginPage} This page instance for chaining
   */
  verifyRememberMeChecked() {
    this.rememberMeCheckbox.should('be.checked');
    return this;
  }

  /**
   * Verify remember me is not checked
   * @returns {LoginPage} This page instance for chaining
   */
  verifyRememberMeNotChecked() {
    this.rememberMeCheckbox.should('not.be.checked');
    return this;
  }

  // =================================
  // API Interception Methods
  // =================================

  /**
   * Setup login API intercept
   * @param {string} [alias='loginRequest'] - Intercept alias
   * @returns {LoginPage} This page instance for chaining
   */
  interceptLoginRequest(alias = 'loginRequest') {
    cy.intercept('POST', '**/auth/login').as(alias);
    return this;
  }

  /**
   * Mock successful login response
   * @param {Object} [userData] - User data to return
   * @param {string} [alias='loginRequest'] - Intercept alias
   * @returns {LoginPage} This page instance for chaining
   */
  mockLoginSuccess(userData = {}, alias = 'loginRequest') {
    cy.intercept('POST', '**/auth/login', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          token: 'mock-jwt-token',
          user: {
            id: 1,
            email: 'testuser@example.com',
            firstName: 'Test',
            lastName: 'User',
            role: 'user',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...userData,
          },
        },
      },
    }).as(alias);
    return this;
  }

  /**
   * Mock failed login response
   * @param {string} [message] - Error message
   * @param {number} [statusCode=401] - HTTP status code
   * @param {string} [alias='loginRequest'] - Intercept alias
   * @returns {LoginPage} This page instance for chaining
   */
  mockLoginFailure(message = AUTH_MESSAGES.LOGIN.INVALID_CREDENTIALS, statusCode = 401, alias = 'loginRequest') {
    cy.intercept('POST', '**/auth/login', {
      statusCode,
      body: {
        success: false,
        error: {
          message: message,
          code: 'AUTH_ERROR',
        },
      },
    }).as(alias);
    return this;
  }

  /**
   * Wait for login request
   * @param {string} [alias='loginRequest'] - Intercept alias
   * @returns {Cypress.Chainable} Intercepted request
   */
  waitForLoginRequest(alias = 'loginRequest') {
    return cy.wait(`@${alias}`);
  }
}

export default LoginPage;
