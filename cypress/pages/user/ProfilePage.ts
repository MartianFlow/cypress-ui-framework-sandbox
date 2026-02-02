/**
 * ProfilePage - Page Object for User Profile
 * @description Handles all profile page interactions and verifications
 * @extends BasePage
 */
import BasePage from '../base/BasePage';
const { PROFILE } = require('../../utils/constants/selectors');
const { APP } = require('../../utils/constants/routes');

class ProfilePage extends BasePage {
  /**
   * Creates a ProfilePage instance
   */
  constructor() {
    super(APP.USER.PROFILE);
    this.selectors = PROFILE;
  }

  // =================================
  // Page Elements
  // =================================

  get profilePage() {
    return cy.get(this.selectors.PAGE);
  }

  get avatar() {
    return cy.get(this.selectors.AVATAR);
  }

  get profileName() {
    return cy.get(this.selectors.NAME);
  }

  get profileEmail() {
    return cy.get(this.selectors.EMAIL);
  }

  get editButton() {
    return cy.get(this.selectors.EDIT_BUTTON);
  }

  get saveButton() {
    return cy.get(this.selectors.SAVE_BUTTON);
  }

  get cancelButton() {
    return cy.get(this.selectors.CANCEL_BUTTON);
  }

  get firstNameInput() {
    return cy.get(this.selectors.FIRST_NAME_INPUT);
  }

  get lastNameInput() {
    return cy.get(this.selectors.LAST_NAME_INPUT);
  }

  get phoneInput() {
    return cy.get(this.selectors.PHONE_INPUT);
  }

  get bioInput() {
    return cy.get(this.selectors.BIO_INPUT);
  }

  get avatarUpload() {
    return cy.get(this.selectors.AVATAR_UPLOAD);
  }

  // =================================
  // Action Methods
  // =================================

  /**
   * Click edit profile button
   * @returns {ProfilePage} This page instance for chaining
   */
  clickEdit() {
    this.editButton.click();
    return this;
  }

  /**
   * Click save button
   * @returns {ProfilePage} This page instance for chaining
   */
  clickSave() {
    this.saveButton.click();
    return this;
  }

  /**
   * Click cancel button
   * @returns {ProfilePage} This page instance for chaining
   */
  clickCancel() {
    this.cancelButton.click();
    return this;
  }

  /**
   * Update first name
   * @param {string} firstName - New first name
   * @returns {ProfilePage} This page instance for chaining
   */
  updateFirstName(firstName) {
    this.firstNameInput.clear().type(firstName);
    return this;
  }

  /**
   * Update last name
   * @param {string} lastName - New last name
   * @returns {ProfilePage} This page instance for chaining
   */
  updateLastName(lastName) {
    this.lastNameInput.clear().type(lastName);
    return this;
  }

  /**
   * Update phone
   * @param {string} phone - New phone number
   * @returns {ProfilePage} This page instance for chaining
   */
  updatePhone(phone) {
    this.phoneInput.clear().type(phone);
    return this;
  }

  /**
   * Update bio
   * @param {string} bio - New bio
   * @returns {ProfilePage} This page instance for chaining
   */
  updateBio(bio) {
    this.bioInput.clear().type(bio);
    return this;
  }

  /**
   * Upload avatar
   * @param {string} filePath - Path to image file
   * @returns {ProfilePage} This page instance for chaining
   */
  uploadAvatar(filePath) {
    this.avatarUpload.selectFile(filePath);
    return this;
  }

  // =================================
  // High-Level Actions
  // =================================

  /**
   * Update profile
   * @param {Object} profileData - Profile data to update
   * @returns {ProfilePage} This page instance for chaining
   */
  updateProfile(profileData) {
    this.clickEdit();

    if (profileData.firstName) {
      this.updateFirstName(profileData.firstName);
    }
    if (profileData.lastName) {
      this.updateLastName(profileData.lastName);
    }
    if (profileData.phone) {
      this.updatePhone(profileData.phone);
    }
    if (profileData.bio) {
      this.updateBio(profileData.bio);
    }

    this.clickSave();
    return this;
  }

  // =================================
  // Verification Methods
  // =================================

  /**
   * Verify page is loaded
   * @returns {ProfilePage} This page instance for chaining
   */
  verifyPageLoaded() {
    this.verifyUrl('/profile');
    this.profilePage.should('be.visible');
    return this;
  }

  /**
   * Verify profile details
   * @param {Object} expectedData - Expected profile data
   * @returns {ProfilePage} This page instance for chaining
   */
  verifyProfileDetails(expectedData) {
    if (expectedData.name) {
      this.profileName.should('contain.text', expectedData.name);
    }
    if (expectedData.email) {
      this.profileEmail.should('contain.text', expectedData.email);
    }
    return this;
  }

  /**
   * Verify profile is in edit mode
   * @returns {ProfilePage} This page instance for chaining
   */
  verifyEditMode() {
    this.firstNameInput.should('be.visible');
    this.saveButton.should('be.visible');
    this.cancelButton.should('be.visible');
    return this;
  }

  /**
   * Verify profile is in view mode
   * @returns {ProfilePage} This page instance for chaining
   */
  verifyViewMode() {
    this.editButton.should('be.visible');
    this.saveButton.should('not.exist');
    return this;
  }

  /**
   * Verify save success message
   * @returns {ProfilePage} This page instance for chaining
   */
  verifySaveSuccess() {
    cy.get('[data-testid="toast-success"]').should('be.visible');
    return this;
  }

  /**
   * Verify avatar is displayed
   * @returns {ProfilePage} This page instance for chaining
   */
  verifyAvatarDisplayed() {
    this.avatar.should('be.visible');
    return this;
  }

  /**
   * Get displayed name
   * @returns {Cypress.Chainable<string>} Profile name
   */
  getDisplayedName() {
    return this.profileName.invoke('text');
  }

  /**
   * Get displayed email
   * @returns {Cypress.Chainable<string>} Profile email
   */
  getDisplayedEmail() {
    return this.profileEmail.invoke('text');
  }

  // =================================
  // API Interception Methods
  // =================================

  /**
   * Intercept get profile request
   * @param {string} [alias='getProfile'] - Intercept alias
   * @returns {ProfilePage} This page instance for chaining
   */
  interceptGetProfileRequest(alias = 'getProfile') {
    cy.intercept('GET', '**/auth/me').as(alias);
    return this;
  }

  /**
   * Intercept update profile request
   * @param {string} [alias='updateProfile'] - Intercept alias
   * @returns {ProfilePage} This page instance for chaining
   */
  interceptUpdateProfileRequest(alias = 'updateProfile') {
    cy.intercept('PUT', '**/auth/me').as(alias);
    return this;
  }

  /**
   * Mock profile response
   * @param {Object} profileData - Profile data
   * @param {string} [alias='getProfile'] - Intercept alias
   * @returns {ProfilePage} This page instance for chaining
   */
  mockProfile(profileData, alias = 'getProfile') {
    cy.intercept('GET', '**/auth/me', {
      statusCode: 200,
      body: {
        success: true,
        data: profileData,
      },
    }).as(alias);
    return this;
  }

  /**
   * Mock update profile success
   * @param {Object} updatedData - Updated profile data
   * @param {string} [alias='updateProfile'] - Intercept alias
   * @returns {ProfilePage} This page instance for chaining
   */
  mockUpdateProfileSuccess(updatedData = {}, alias = 'updateProfile') {
    cy.intercept('PUT', '**/auth/me', {
      statusCode: 200,
      body: {
        success: true,
        data: updatedData,
      },
    }).as(alias);
    return this;
  }

  /**
   * Wait for profile request
   * @param {string} [alias='getProfile'] - Intercept alias
   * @returns {Cypress.Chainable} Intercepted request
   */
  waitForProfileRequest(alias = 'getProfile') {
    return cy.wait(`@${alias}`);
  }
}

export default ProfilePage;
