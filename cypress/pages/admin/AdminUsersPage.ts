/**
 * AdminUsersPage - Page Object for Admin Users Management
 * @description Handles all admin users page interactions and verifications
 * @extends BasePage
 */
import BasePage from '../base/BasePage';
const { ADMIN, TABLE } = require('../../utils/constants/selectors');
const { APP } = require('../../utils/constants/routes');

class AdminUsersPage extends BasePage {
  /**
   * Creates an AdminUsersPage instance
   */
  constructor() {
    super(APP.ADMIN.USERS);
    this.selectors = ADMIN.USERS;
    this.tableSelectors = TABLE;
  }

  // =================================
  // Page Elements
  // =================================

  get usersPage() {
    return cy.get(this.selectors.PAGE);
  }

  get addUserButton() {
    return cy.get(this.selectors.ADD_BUTTON);
  }

  get usersTable() {
    return cy.get(this.selectors.TABLE);
  }

  get userRows() {
    return cy.get(this.selectors.ROW);
  }

  get searchInput() {
    return cy.get(this.selectors.SEARCH);
  }

  get roleFilter() {
    return cy.get(this.selectors.FILTER_ROLE);
  }

  get statusFilter() {
    return cy.get(this.selectors.FILTER_STATUS);
  }

  // Form Elements
  get formModal() {
    return cy.get(this.selectors.FORM.MODAL);
  }

  get firstNameInput() {
    return cy.get(this.selectors.FORM.FIRST_NAME);
  }

  get lastNameInput() {
    return cy.get(this.selectors.FORM.LAST_NAME);
  }

  get emailInput() {
    return cy.get(this.selectors.FORM.EMAIL);
  }

  get passwordInput() {
    return cy.get(this.selectors.FORM.PASSWORD);
  }

  get roleSelect() {
    return cy.get(this.selectors.FORM.ROLE);
  }

  get statusSelect() {
    return cy.get(this.selectors.FORM.STATUS);
  }

  get submitButton() {
    return cy.get(this.selectors.FORM.SUBMIT);
  }

  get cancelButton() {
    return cy.get(this.selectors.FORM.CANCEL);
  }

  // =================================
  // Row Methods
  // =================================

  /**
   * Get user row by index
   * @param {number} index - Row index
   * @returns {Cypress.Chainable} User row
   */
  getUserRow(index) {
    return this.userRows.eq(index);
  }

  /**
   * Get user row by email
   * @param {string} email - User email
   * @returns {Cypress.Chainable} User row
   */
  getUserRowByEmail(email) {
    return cy.contains(this.selectors.ROW, email);
  }

  /**
   * Get user row by name
   * @param {string} name - User name
   * @returns {Cypress.Chainable} User row
   */
  getUserRowByName(name) {
    return cy.contains(this.selectors.ROW, name);
  }

  // =================================
  // Action Methods
  // =================================

  /**
   * Click add user button
   * @returns {AdminUsersPage} This page instance for chaining
   */
  clickAddUser() {
    this.addUserButton.click();
    return this;
  }

  /**
   * Search users
   * @param {string} query - Search query
   * @returns {AdminUsersPage} This page instance for chaining
   */
  searchUsers(query) {
    this.searchInput.clear().type(query);
    return this;
  }

  /**
   * Filter by role
   * @param {string} role - Role value
   * @returns {AdminUsersPage} This page instance for chaining
   */
  filterByRole(role) {
    this.roleFilter.select(role);
    return this;
  }

  /**
   * Filter by status
   * @param {string} status - Status value
   * @returns {AdminUsersPage} This page instance for chaining
   */
  filterByStatus(status) {
    this.statusFilter.select(status);
    return this;
  }

  /**
   * Edit user by index
   * @param {number} index - Row index
   * @returns {AdminUsersPage} This page instance for chaining
   */
  editUser(index) {
    this.getUserRow(index).find(this.selectors.EDIT_BUTTON).click();
    return this;
  }

  /**
   * Edit user by email
   * @param {string} email - User email
   * @returns {AdminUsersPage} This page instance for chaining
   */
  editUserByEmail(email) {
    this.getUserRowByEmail(email).find(this.selectors.EDIT_BUTTON).click();
    return this;
  }

  /**
   * Delete user by index
   * @param {number} index - Row index
   * @returns {AdminUsersPage} This page instance for chaining
   */
  deleteUser(index) {
    this.getUserRow(index).find(this.selectors.DELETE_BUTTON).click();
    cy.get('[data-testid="confirm-delete"]').click();
    return this;
  }

  /**
   * Delete user by email
   * @param {string} email - User email
   * @returns {AdminUsersPage} This page instance for chaining
   */
  deleteUserByEmail(email) {
    this.getUserRowByEmail(email).find(this.selectors.DELETE_BUTTON).click();
    cy.get('[data-testid="confirm-delete"]').click();
    return this;
  }

  /**
   * Fill user form
   * @param {Object} userData - User data
   * @returns {AdminUsersPage} This page instance for chaining
   */
  fillUserForm(userData) {
    if (userData.firstName) {
      this.firstNameInput.clear().type(userData.firstName);
    }
    if (userData.lastName) {
      this.lastNameInput.clear().type(userData.lastName);
    }
    if (userData.email) {
      this.emailInput.clear().type(userData.email);
    }
    if (userData.password) {
      this.passwordInput.clear().type(userData.password, { log: false });
    }
    if (userData.role) {
      this.roleSelect.select(userData.role);
    }
    if (userData.status) {
      this.statusSelect.select(userData.status);
    }
    return this;
  }

  /**
   * Submit user form
   * @returns {AdminUsersPage} This page instance for chaining
   */
  submitForm() {
    this.submitButton.click();
    return this;
  }

  /**
   * Cancel user form
   * @returns {AdminUsersPage} This page instance for chaining
   */
  cancelForm() {
    this.cancelButton.click();
    return this;
  }

  // =================================
  // High-Level Actions
  // =================================

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {AdminUsersPage} This page instance for chaining
   */
  createUser(userData) {
    this.clickAddUser();
    this.fillUserForm(userData);
    this.submitForm();
    return this;
  }

  /**
   * Update user
   * @param {string} email - User email to update
   * @param {Object} userData - New user data
   * @returns {AdminUsersPage} This page instance for chaining
   */
  updateUser(email, userData) {
    this.editUserByEmail(email);
    this.fillUserForm(userData);
    this.submitForm();
    return this;
  }

  // =================================
  // Verification Methods
  // =================================

  /**
   * Verify page is loaded
   * @returns {AdminUsersPage} This page instance for chaining
   */
  verifyPageLoaded() {
    this.verifyUrl('/admin/users');
    this.usersPage.should('be.visible');
    return this;
  }

  /**
   * Verify users are displayed
   * @param {number} [expectedCount] - Expected user count
   * @returns {AdminUsersPage} This page instance for chaining
   */
  verifyUsersDisplayed(expectedCount) {
    if (expectedCount !== undefined) {
      this.userRows.should('have.length', expectedCount);
    } else {
      this.userRows.should('have.length.at.least', 1);
    }
    return this;
  }

  /**
   * Verify user exists
   * @param {string} email - User email
   * @returns {AdminUsersPage} This page instance for chaining
   */
  verifyUserExists(email) {
    this.getUserRowByEmail(email).should('exist');
    return this;
  }

  /**
   * Verify user not exists
   * @param {string} email - User email
   * @returns {AdminUsersPage} This page instance for chaining
   */
  verifyUserNotExists(email) {
    cy.contains(this.selectors.ROW, email).should('not.exist');
    return this;
  }

  /**
   * Verify user details in row
   * @param {string} email - User email
   * @param {Object} expectedData - Expected user data
   * @returns {AdminUsersPage} This page instance for chaining
   */
  verifyUserDetails(email, expectedData) {
    const row = this.getUserRowByEmail(email);

    if (expectedData.name) {
      row.should('contain.text', expectedData.name);
    }
    if (expectedData.role) {
      row.should('contain.text', expectedData.role);
    }
    if (expectedData.status) {
      row.should('contain.text', expectedData.status);
    }

    return this;
  }

  /**
   * Verify form modal is visible
   * @returns {AdminUsersPage} This page instance for chaining
   */
  verifyFormModalVisible() {
    this.formModal.should('be.visible');
    return this;
  }

  /**
   * Verify success message
   * @param {string} [message] - Expected message
   * @returns {AdminUsersPage} This page instance for chaining
   */
  verifySuccessMessage(message) {
    cy.get('[data-testid="toast-success"]').should('be.visible');
    if (message) {
      cy.get('[data-testid="toast-success"]').should('contain.text', message);
    }
    return this;
  }

  /**
   * Get user count
   * @returns {Cypress.Chainable<number>} User count
   */
  getUserCount() {
    return this.userRows.its('length');
  }

  // =================================
  // API Interception Methods
  // =================================

  /**
   * Intercept get users request
   * @param {string} [alias='getUsers'] - Intercept alias
   * @returns {AdminUsersPage} This page instance for chaining
   */
  interceptGetUsersRequest(alias = 'getUsers') {
    cy.intercept('GET', '**/users*').as(alias);
    return this;
  }

  /**
   * Intercept create user request
   * @param {string} [alias='createUser'] - Intercept alias
   * @returns {AdminUsersPage} This page instance for chaining
   */
  interceptCreateUserRequest(alias = 'createUser') {
    cy.intercept('POST', '**/users').as(alias);
    return this;
  }

  /**
   * Intercept update user request
   * @param {string} [alias='updateUser'] - Intercept alias
   * @returns {AdminUsersPage} This page instance for chaining
   */
  interceptUpdateUserRequest(alias = 'updateUser') {
    cy.intercept('PUT', '**/users/*').as(alias);
    return this;
  }

  /**
   * Intercept delete user request
   * @param {string} [alias='deleteUser'] - Intercept alias
   * @returns {AdminUsersPage} This page instance for chaining
   */
  interceptDeleteUserRequest(alias = 'deleteUser') {
    cy.intercept('DELETE', '**/users/*').as(alias);
    return this;
  }

  /**
   * Mock users response
   * @param {Array} users - Users array
   * @param {string} [alias='getUsers'] - Intercept alias
   * @returns {AdminUsersPage} This page instance for chaining
   */
  mockUsers(users, alias = 'getUsers') {
    cy.intercept('GET', '**/users*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          data: users,
          pagination: {
            page: 1,
            pageSize: 10,
            total: users.length,
            totalPages: 1,
          },
        },
      },
    }).as(alias);
    return this;
  }

  /**
   * Wait for users request
   * @param {string} [alias='getUsers'] - Intercept alias
   * @returns {Cypress.Chainable} Intercepted request
   */
  waitForUsersRequest(alias = 'getUsers') {
    return cy.wait(`@${alias}`);
  }
}

export default AdminUsersPage;
