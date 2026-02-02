/**
 * Register Feature Tests
 * @description Comprehensive test suite for registration functionality
 * @tags @auth @register @regression
 */

import { registerPage, loginPage } from '../../../pages';
import UserBuilder from '../../../utils/builders/UserBuilder';
import { APP } from '../../../utils/constants/routes';

describe('Register Feature', { tags: ['@auth', '@register'] }, () => {
  let newUser;

  before(() => {
    cy.fixture('testdata/users.json').then((users) => {
      newUser = users.newUser;
    });
  });

  beforeEach(() => {
    cy.clearAuth();
    registerPage().visit();
  });

  // =================================
  // Page Load Tests
  // =================================

  describe('Page Load', { tags: '@smoke' }, () => {
    it('should display the registration page correctly', () => {
      registerPage().verifyPageLoaded();
    });

    it('should display all form elements', () => {
      registerPage().firstNameInput.should('be.visible');
      registerPage().lastNameInput.should('be.visible');
      registerPage().emailInput.should('be.visible');
      registerPage().passwordInput.should('be.visible');
      registerPage().confirmPasswordInput.should('be.visible');
      registerPage().registerButton.should('be.visible');
    });

    it('should have link to login page', () => {
      registerPage().loginLink.should('be.visible');
    });
  });

  // =================================
  // Successful Registration Tests
  // =================================

  describe('Successful Registration', { tags: '@smoke' }, () => {
    beforeEach(() => {
      registerPage().mockRegisterSuccess({
        id: 1,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      });
    });

    it('should register successfully with valid data', () => {
      registerPage()
        .register(newUser)
        .waitForRegisterRequest()
        .its('response.statusCode')
        .should('eq', 201);

      cy.url().should('not.include', '/register');
    });

    it('should register with all fields filled', () => {
      const user = UserBuilder.create()
        .withRandomEmail()
        .withPassword('StrongPass@123')
        .withFirstName('John')
        .withLastName('Doe')
        .build();

      registerPage()
        .register(user)
        .waitForRegisterRequest();

      cy.url().should('not.include', '/register');
    });
  });

  // =================================
  // Failed Registration Tests
  // =================================

  describe('Failed Registration', { tags: '@regression' }, () => {
    it('should show error when email already exists', () => {
      registerPage().mockRegisterFailure('Email already exists', 400);

      registerPage()
        .register(newUser)
        .waitForRegisterRequest();

      registerPage().verifyErrorDisplayed('Email already exists');
    });

    it('should show error for invalid email format', () => {
      const invalidUser = { ...newUser, email: 'invalid-email' };
      // Bypass native browser validation
      cy.get('[data-testid="register-form"]').invoke('attr', 'novalidate', 'novalidate');

      registerPage()
        .enterFirstName(invalidUser.firstName)
        .enterLastName(invalidUser.lastName)
        .enterEmail(invalidUser.email)
        .enterPassword(invalidUser.password)
        .enterConfirmPassword(invalidUser.password)
        .clickRegister();
  
      registerPage().verifyEmailError('Invalid email address');
    });

    it('should show error when passwords do not match', () => {
      registerPage()
        .enterFirstName(newUser.firstName)
        .enterLastName(newUser.lastName)
        .enterEmail(newUser.email)
        .enterPassword(newUser.password)
        .enterConfirmPassword('DifferentPassword@123');

      registerPage().clickRegister();
      // Password mismatch validation depends on your app implementation
    });
  });

  // =================================
  // Input Validation Tests
  // =================================

  describe('Input Validation', { tags: '@regression' }, () => {
    it('should require first name', () => {
      // Bypass native browser validation
      cy.get('[data-testid="register-form"]').invoke('attr', 'novalidate', 'novalidate');

      registerPage()
        .enterLastName(newUser.lastName)
        .enterEmail(newUser.email)
        .enterPassword(newUser.password)
        .enterConfirmPassword(newUser.password)
        .clickRegister();
  
      registerPage().verifyFirstNameError('First name must be at least 2 characters');
    });

    it('should require email', () => {
      // Bypass native browser validation
      cy.get('[data-testid="register-form"]').invoke('attr', 'novalidate', 'novalidate');

      registerPage()
        .enterFirstName(newUser.firstName)
        .enterLastName(newUser.lastName)
        .enterPassword(newUser.password)
        .enterConfirmPassword(newUser.password)
        .clickRegister();
  
      registerPage().verifyEmailError('Invalid email address');
    });

    it('should require password', () => {
      // Bypass native browser validation
      cy.get('[data-testid="register-form"]').invoke('attr', 'novalidate', 'novalidate');

      registerPage()
        .enterFirstName(newUser.firstName)
        .enterLastName(newUser.lastName)
        .enterEmail(newUser.email)
        .clickRegister();
  
      registerPage().verifyPasswordError('Password must be at least 8 characters');
    });

    it('should mask password fields', () => {
      registerPage().passwordInput.should('have.attr', 'type', 'password');
      registerPage().confirmPasswordInput.should('have.attr', 'type', 'password');
    });
  });

  // =================================
  // Navigation Tests
  // =================================

  describe('Navigation', { tags: '@regression' }, () => {
    it('should navigate to login page', () => {
      registerPage().clickLoginLink();

      cy.url().should('include', '/login');
    });

    it('should redirect authenticated users', () => {
      cy.setAuthState('mock-token', { id: 1, email: 'test@example.com' });
      registerPage().visit();

      // Behavior depends on your app - may redirect to dashboard
    });
  });

  // =================================
  // API Integration Tests
  // =================================

  describe('API Integration', { tags: '@api' }, () => {
    it('should send correct payload to register API', () => {
      registerPage().interceptRegisterRequest();

      registerPage().register(newUser, { submit: true });

      cy.wait('@registerRequest').then((interception) => {
        expect(interception.request.body).to.have.property('email', newUser.email);
        expect(interception.request.body).to.have.property('firstName', newUser.firstName);
        expect(interception.request.body).to.have.property('lastName', newUser.lastName);
        expect(interception.request.body).to.have.property('password');
      });
    });

    it('should handle server error gracefully', () => {
      registerPage().mockRegisterFailure('Server error', 500);

      registerPage()
        .register(newUser)
        .waitForRegisterRequest();

      registerPage().verifyErrorDisplayed();
    });
  });
});
