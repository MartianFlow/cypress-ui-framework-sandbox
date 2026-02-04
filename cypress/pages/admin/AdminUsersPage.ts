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
  get userModal() {
    return cy.get('[data-testid="user-modal"]');
  }

  get formModal() {
    return cy.get('[data-testid="user-modal"]');
  }

  get firstNameInput() {
    return cy.get('[data-testid="user-first-name"]');
  }

  get lastNameInput() {
    return cy.get('[data-testid="user-last-name"]');
  }

  get emailInput() {
    return cy.get('[data-testid="user-email-input"]');
  }

  get passwordInput() {
    return cy.get('[data-testid="user-password"]');
  }

  get roleSelect() {
    return cy.get('[data-testid="user-role-select"]');
  }

  get statusSelect() {
    return cy.get('[data-testid="user-status-select"]');
  }

  get submitButton() {
    return cy.get('[data-testid="submit-user"]');
  }

  get cancelButton() {
    return cy.get('[data-testid="cancel-user"]');
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

  submitUserForm() {
    return this.submitForm();
  }

  /**
   * Cancel user form
   * @returns {AdminUsersPage} This page instance for chaining
   */
  cancelForm() {
    this.cancelButton.click();
    return this;
  }

  /**
   * Click edit user
   * @param {number} index - User index
   * @returns {AdminUsersPage} This page instance for chaining
   */
  clickEditUser(index) {
    this.getUserRow(index).find(this.selectors.EDIT_BUTTON).click();
    return this;
  }

  /**
   * Click delete user
   * @param {number} index - User index
   * @returns {AdminUsersPage} This page instance for chaining
   */
  clickDeleteUser(index) {
    this.getUserRow(index).find(this.selectors.DELETE_BUTTON).click();
    return this;
  }

  /**
   * Select role
   * @param {string} role - Role to select
   * @returns {AdminUsersPage} This page instance for chaining
   */
  selectRole(role) {
    this.roleSelect.select(role);
    return this;
  }

  /**
   * Select status
   * @param {string} status - Status to select
   * @returns {AdminUsersPage} This page instance for chaining
   */
  selectStatus(status) {
    this.statusSelect.select(status);
    return this;
  }

  /**
   * Send password reset
   * @param {number} index - User index
   * @returns {AdminUsersPage} This page instance for chaining
   */
  sendPasswordReset(index) {
    this.getUserRow(index).find('[data-testid="reset-password"]').click();
    return this;
  }

  /**
   * Impersonate user
   * @param {number} index - User index
   * @returns {AdminUsersPage} This page instance for chaining
   */
  impersonateUser(index) {
    this.getUserRow(index).find('[data-testid="impersonate-user"]').click();
    return this;
  }

  /**
   * View user activity
   * @param {number} index - User index
   * @returns {AdminUsersPage} This page instance for chaining
   */
  viewUserActivity(index) {
    this.getUserRow(index).find('[data-testid="view-activity"]').click();
    return this;
  }

  /**
   * Mock create user error
   * @param {string} errorMessage - Error message
   * @returns {AdminUsersPage} This page instance for chaining
   */
  mockCreateUserError(errorMessage) {
    cy.intercept('POST', '**/api/v1/users', {
      statusCode: 400,
      body: {
        success: false,
        error: {
          message: errorMessage,
        },
      },
    }).as('createUserError');
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
    cy.intercept('GET', '**/api/v1/users*').as(alias);
    return this;
  }

  /**
   * Intercept create user request
   * @param {string} [alias='createUser'] - Intercept alias
   * @returns {AdminUsersPage} This page instance for chaining
   */
  interceptCreateUser(alias = 'createUser') {
    cy.intercept('POST', '**/api/v1/users', { statusCode: 201, body: { success: true, data: {} } }).as(alias);
    return this;
  }

  interceptCreateUserRequest(alias = 'createUser') {
    return this.interceptCreateUser(alias);
  }

  /**
   * Intercept update user request
   * @param {string} [alias='updateUser'] - Intercept alias
   * @returns {AdminUsersPage} This page instance for chaining
   */
  interceptUpdateUser(alias = 'updateUser') {
    cy.intercept('PUT', '**/api/v1/users/*', { statusCode: 200, body: { success: true, data: {} } }).as(alias);
    return this;
  }

  interceptUpdateUserRequest(alias = 'updateUser') {
    return this.interceptUpdateUser(alias);
  }

  /**
   * Intercept delete user request
   * @param {string} [alias='deleteUser'] - Intercept alias
   * @returns {AdminUsersPage} This page instance for chaining
   */
  interceptDeleteUser(alias = 'deleteUser') {
    cy.intercept('DELETE', '**/api/v1/users/*', { statusCode: 200, body: { success: true } }).as(alias);
    return this;
  }

  interceptDeleteUserRequest(alias = 'deleteUser') {
    return this.interceptDeleteUser(alias);
  }

  /**
   * Mock users response
   * @param {Array} users - Users array
   * @param {string} [alias='getUsers'] - Intercept alias
   * @returns {AdminUsersPage} This page instance for chaining
   */
  mockUsers(users, alias = 'getUsers') {
    cy.intercept('GET', /\/api\/v1\/users/, (req) => {
      const url = new URL(req.url);
      const search = url.searchParams.get('search');
      const role = url.searchParams.get('role');
      const status = url.searchParams.get('status');

      let filtered = [...users];

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(u =>
          u.email.toLowerCase().includes(q) ||
          (u.firstName || '').toLowerCase().includes(q) ||
          (u.lastName || '').toLowerCase().includes(q)
        );
      }

      if (role) {
        filtered = filtered.filter(u => u.role === role);
      }

      if (status) {
        filtered = filtered.filter(u => u.status === status);
      }

      req.reply({
        statusCode: 200,
        body: {
          success: true,
          data: {
            data: filtered,
            pagination: {
              page: 1,
              pageSize: 10,
              total: filtered.length,
              totalPages: 1,
            },
          },
        },
      });
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
