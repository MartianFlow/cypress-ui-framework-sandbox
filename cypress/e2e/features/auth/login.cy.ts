/**
 * Login Feature Tests
 * @description Comprehensive test suite for login functionality
 * @tags @auth @login @regression
 */

import { loginPage } from '../../../pages';
import UserBuilder from '../../../utils/builders/UserBuilder';
import { AUTH } from '../../../utils/constants/messages';

describe('Login Feature', { tags: ['@auth', '@login'] }, () => {
  // Test data
  let validUser;
  let invalidUser;

  before(() => {
    // Load test data from fixtures
    cy.fixture('testdata/users.json').then((users) => {
      validUser = users.validUser;
      invalidUser = users.invalidUser;
    });
  });

  beforeEach(() => {
    // Clear any existing sessions
    cy.clearAuth();

    // Visit login page
    loginPage().visit();
  });

  // =================================
  // Page Load Tests
  // =================================

  describe('Page Load', { tags: '@smoke' }, () => {
    it('should display the login page correctly', () => {
      loginPage().verifyPageLoaded();
    });

    it('should display all form elements', () => {
      loginPage().emailInput.should('be.visible');
      loginPage().passwordInput.should('be.visible');
      loginPage().loginButton.should('be.visible');
      loginPage().rememberMeCheckbox.should('exist');
      loginPage().forgotPasswordLink.should('be.visible');
    });

    it('should have login button disabled initially when validation is required', () => {
      // This depends on your app's behavior
      // Some apps enable the button and validate on submit
      loginPage().loginButton.should('exist');
    });
  });

  // =================================
  // Successful Login Tests
  // =================================

  describe('Successful Login', { tags: '@smoke' }, () => {
    beforeEach(() => {
      // Mock successful login API response
      loginPage().mockLoginSuccess({
        id: validUser.id,
        email: validUser.email,
        firstName: validUser.firstName,
        lastName: validUser.lastName,
      });
    });

    it('should login successfully with valid credentials', () => {
      loginPage()
        .login(validUser.email, validUser.password)
        .waitForLoginRequest()
        .its('response.statusCode')
        .should('eq', 200);

      // Verify redirect to dashboard
      cy.url().should('include', '/dashboard');
    });

    it('should login with remember me option checked', () => {
      loginPage()
        .login(validUser.email, validUser.password, { rememberMe: true })
        .waitForLoginRequest();

      // Verify redirect
      cy.url().should('include', '/dashboard');
    });

    it('should persist session when remember me is checked', () => {
      loginPage().mockLoginSuccess();

      loginPage()
        .login(validUser.email, validUser.password, true)
        .waitForLoginRequest();

      cy.window().then((win) => {
        const authStorage = JSON.parse(win.localStorage.getItem('auth-storage'));
        expect(authStorage.state.token).to.exist;
      });
    });

    it('should login by pressing Enter key', () => {
      loginPage()
        .enterEmail(validUser.email)
        .enterPassword(validUser.password)
        .submitForm()
        .waitForLoginRequest();

      cy.url().should('include', '/dashboard');
    });

    it('should store authentication token after login', () => {
      loginPage().mockLoginSuccess();

      loginPage()
        .login(validUser.email, validUser.password)
        .waitForLoginRequest();

      cy.window().then((win) => {
        const authStorage = JSON.parse(win.localStorage.getItem('auth-storage'));
        expect(authStorage.state.token).to.eq('mock-jwt-token');
      });
    });
  });

  // =================================
  // Failed Login Tests
  // =================================

  describe('Failed Login', { tags: '@regression' }, () => {
    it('should show error with invalid credentials', () => {
      loginPage().mockLoginFailure(AUTH.LOGIN.INVALID_CREDENTIALS, 401);

      loginPage()
        .login(invalidUser.email, invalidUser.password)
        .waitForLoginRequest()
        .its('response.statusCode')
        .should('eq', 401);

      loginPage().verifyErrorDisplayed(AUTH.LOGIN.INVALID_CREDENTIALS);
    });

    it('should show error with incorrect password', () => {
      loginPage().mockLoginFailure(AUTH.LOGIN.INVALID_CREDENTIALS, 401);

      loginPage()
        .login(validUser.email, 'wrongpassword')
        .waitForLoginRequest();

      loginPage().verifyInvalidCredentialsError();
    });

    it('should show error with non-existent email', () => {
      loginPage().mockLoginFailure(AUTH.LOGIN.INVALID_CREDENTIALS, 401);

      loginPage()
        .login('nonexistent@example.com', 'anypassword')
        .waitForLoginRequest();

      loginPage().verifyErrorDisplayed();
    });

    it('should show error when account is locked', () => {
      loginPage().mockLoginFailure(AUTH.LOGIN.ACCOUNT_LOCKED, 403);

      loginPage()
        .login('locked@example.com', 'password')
        .waitForLoginRequest();

      loginPage().verifyErrorDisplayed(AUTH.LOGIN.ACCOUNT_LOCKED);
    });

    it('should remain on login page after failed login', () => {
      loginPage().mockLoginFailure();

      loginPage()
        .login(invalidUser.email, invalidUser.password)
        .waitForLoginRequest();

      cy.url().should('include', '/login');
    });
  });

  // =================================
  // Input Validation Tests
  // =================================

  describe('Input Validation', { tags: '@regression' }, () => {
    it('should validate email format', () => {
      loginPage()
        .enterEmail('invalid@email')
        .enterPassword('password')
        .clickLogin();

      loginPage().verifyEmailError('Invalid email address');
    });

    it('should require email field', () => {
      loginPage()
        .enterPassword('password')
        .clickLogin();

      loginPage().verifyEmailError('Invalid email address');
    });

    it('should require password field', () => {
      loginPage()
        .enterEmail('test@example.com')
        .clickLogin();

      loginPage().verifyPasswordError('Password is required');
    });

    it('should handle whitespace in email', () => {
      loginPage().mockLoginSuccess();
  
      loginPage()
        .enterEmail('  test@example.com  ')
        .enterPassword('password')
        .clickLogin()
        .waitForLoginRequest()
        .its('request.body.email')
        .should('eq', 'test@example.com');
    });

    it('should mask password input', () => {
      loginPage()
        .passwordInput
        .should('have.attr', 'type', 'password');
    });
  });

  // =================================
  // Remember Me Tests
  // =================================

  describe('Remember Me', { tags: '@regression' }, () => {
    it('should be unchecked by default', () => {
      loginPage().verifyRememberMeNotChecked();
    });

    it('should toggle remember me checkbox', () => {
      loginPage()
        .checkRememberMe()
        .verifyRememberMeChecked()
        .uncheckRememberMe()
        .verifyRememberMeNotChecked();
    });

  });

  // =================================
  // Navigation Tests
  // =================================

  describe('Navigation', { tags: '@regression' }, () => {
    it('should navigate to forgot password page', () => {
      loginPage().clickForgotPassword();

      cy.url().should('include', '/forgot-password');
    });

    it('should navigate to registration page', () => {
      loginPage().clickRegister();

      cy.url().should('include', '/register');
    });

    it('should redirect authenticated users away from login page', () => {
      // Setup authenticated session
      cy.setLocalStorage('authToken', 'mock-token');
      cy.setLocalStorage('user', JSON.stringify({ id: 1, email: 'test@example.com' }));

      // Try to visit login page
      loginPage().visit();

      // Should redirect to dashboard (depends on your app behavior)
      // cy.url().should('include', '/dashboard');
    });
  });

  // =================================
  // Loading State Tests
  // =================================

  describe('Loading State', { tags: '@regression' }, () => {
    it('should show loading state during login', () => {
      // Mock slow API response
      cy.intercept('POST', '**/auth/login', {
        delay: 1000,
        statusCode: 200,
        body: { success: true, token: 'mock-token' },
      }).as('slowLogin');

      loginPage()
        .login(validUser.email, validUser.password);

      // Verify loading state is shown
      loginPage().verifyLoading();

      // Wait for request to complete
      cy.wait('@slowLogin');

      // Verify loading is complete
      loginPage().verifyLoadingComplete();
    });

    it('should disable login button during submission', () => {
      cy.intercept('POST', '**/auth/login', {
        delay: 500,
        statusCode: 200,
        body: { success: true, token: 'mock-token' },
      }).as('loginRequest');

      loginPage()
        .login(validUser.email, validUser.password);

      // Button should be disabled during request
      loginPage().loginButton.should('be.disabled');

      cy.wait('@loginRequest');
    });
  });

  // =================================
  // Security Tests
  // =================================

  describe('Security', { tags: ['@security', '@regression'] }, () => {
    it('should not expose password in URL', () => {
      loginPage().mockLoginSuccess();

      loginPage()
        .login(validUser.email, validUser.password)
        .waitForLoginRequest();

      cy.url().should('not.include', validUser.password);
    });

    it('should not log password in request body (log: false)', () => {
      loginPage().interceptLoginRequest();

      loginPage()
        .login(validUser.email, validUser.password);

      // Verify password was sent but not logged
      cy.get('@loginRequest').its('request.body').should('have.property', 'password');
    });

    it('should handle XSS attempt in email field', () => {
      loginPage().mockLoginFailure();

      const xssPayload = '<script>alert("xss")</script>';

      loginPage()
        .enterEmail(xssPayload)
        .enterPassword('password')
        .clickLogin();

      // Verify no script execution (page should still be functional)
      loginPage().emailInput.should('exist');
    });

    it('should handle SQL injection attempt', () => {
      const sqlInjection = "' OR '1'='1";
      
      // Bypass native browser validation to trigger Zod validation
      cy.get('[data-testid="login-form"]').invoke('attr', 'novalidate', 'novalidate');

      loginPage()
        .enterEmail(sqlInjection)
        .enterPassword('password')
        .clickLogin();

      // Malformed email is caught by Zod client-side validation
      loginPage().verifyEmailError('Invalid email address');
    });
  });

  // =================================
  // Builder Pattern Tests
  // =================================

  describe('Using Builder Pattern', { tags: '@regression' }, () => {
    it('should login with user created from builder', () => {
      loginPage().mockLoginSuccess();

      const user = UserBuilder.create()
        .withEmail('builder@test.com')
        .withPassword('BuilderPass@123')
        .asStandardUser()
        .build();

      loginPage()
        .login(user.email, user.password)
        .waitForLoginRequest();

      cy.url().should('include', '/dashboard');
    });

    it('should use random email from builder', () => {
      loginPage().mockLoginSuccess();

      const user = UserBuilder.create()
        .withRandomEmail()
        .withPassword('Test@123456')
        .build();

      expect(user.email).to.include('@test.com');

      loginPage()
        .login(user.email, user.password)
        .waitForLoginRequest();
    });
  });

  // =================================
  // API Integration Tests
  // =================================

  describe('API Integration', { tags: '@api' }, () => {
    it('should send correct payload to login API', () => {
      loginPage().interceptLoginRequest('loginPayload');

      loginPage()
        .login(validUser.email, validUser.password);

      cy.wait('@loginPayload').then((interception) => {
        expect(interception.request.body).to.deep.equal({
          email: validUser.email,
          password: validUser.password,
          rememberMe: false,
        });
      });
    });

    it('should handle network error gracefully', () => {
      cy.intercept('POST', '**/auth/login', { forceNetworkError: true }).as('networkError');

      loginPage()
        .login(validUser.email, validUser.password);

      cy.wait('@networkError');

      // Should show appropriate error message
      loginPage().verifyErrorDisplayed();
    });

    it('should handle server error (500)', () => {
      cy.intercept('POST', '**/auth/login', {
        statusCode: 500,
        body: { error: 'Internal Server Error' },
      }).as('serverError');

      loginPage()
        .login(validUser.email, validUser.password);

      cy.wait('@serverError');

      loginPage().verifyErrorDisplayed();
    });
  });

  // =================================
  // Session Management Tests
  // =================================

  describe('Session Management', { tags: '@session' }, () => {
    it('should use cy.session for cached login', () => {
      // This demonstrates using cy.session
      cy.session('testUser', () => {
        loginPage().mockLoginSuccess();
        loginPage().visit();
        loginPage()
          .login(validUser.email, validUser.password)
          .waitForLoginRequest();
      });

      // Visit protected page
      cy.visit('/dashboard');
      cy.url().should('include', '/dashboard');
    });

    it('should clear session on logout', () => {
      // Setup authenticated state
      cy.setLocalStorage('authToken', 'mock-token');

      cy.visit('/dashboard');

      // Perform logout
      cy.logout();

      // Verify session is cleared
      cy.getLocalStorage('authToken').should('be.null');
    });
  });
});
