/**
 * AdminProductsPage - Page Object for Admin Products Management
 * @description Handles all admin products page interactions and verifications
 * @extends BasePage
 */
import BasePage from '../base/BasePage';
const { ADMIN, TABLE } = require('../../utils/constants/selectors');
const { APP } = require('../../utils/constants/routes');

class AdminProductsPage extends BasePage {
  /**
   * Creates an AdminProductsPage instance
   */
  constructor() {
    super(APP.ADMIN.PRODUCTS);
    this.selectors = ADMIN.PRODUCTS;
    this.tableSelectors = TABLE;
  }

  // =================================
  // Page Elements
  // =================================

  get productsPage() {
    return cy.get(this.selectors.PAGE);
  }

  get addProductButton() {
    return cy.get(this.selectors.ADD_BUTTON);
  }

  get productsTable() {
    return cy.get(this.selectors.TABLE);
  }

  get productRows() {
    return cy.get(this.selectors.ROW);
  }

  get searchInput() {
    return cy.get(this.selectors.SEARCH);
  }

  get categoryFilter() {
    return cy.get(this.selectors.FILTER_CATEGORY);
  }

  get statusFilter() {
    return cy.get(this.selectors.FILTER_STATUS);
  }

  // Form Elements
  get formModal() {
    return cy.get(this.selectors.FORM.MODAL);
  }

  get nameInput() {
    return cy.get(this.selectors.FORM.NAME);
  }

  get descriptionInput() {
    return cy.get(this.selectors.FORM.DESCRIPTION);
  }

  get priceInput() {
    return cy.get(this.selectors.FORM.PRICE);
  }

  get categorySelect() {
    return cy.get(this.selectors.FORM.CATEGORY);
  }

  get stockInput() {
    return cy.get(this.selectors.FORM.STOCK);
  }

  get statusSelect() {
    return cy.get(this.selectors.FORM.STATUS);
  }

  get featuredCheckbox() {
    return cy.get(this.selectors.FORM.FEATURED);
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
   * Get product row by index
   * @param {number} index - Row index
   * @returns {Cypress.Chainable} Product row
   */
  getProductRow(index) {
    return this.productRows.eq(index);
  }

  /**
   * Get product row by name
   * @param {string} productName - Product name
   * @returns {Cypress.Chainable} Product row
   */
  getProductRowByName(productName) {
    return cy.contains(this.selectors.ROW, productName);
  }

  // =================================
  // Action Methods
  // =================================

  /**
   * Click add product button
   * @returns {AdminProductsPage} This page instance for chaining
   */
  clickAddProduct() {
    this.addProductButton.click();
    return this;
  }

  /**
   * Search products
   * @param {string} query - Search query
   * @returns {AdminProductsPage} This page instance for chaining
   */
  searchProducts(query) {
    this.searchInput.clear().type(query);
    return this;
  }

  /**
   * Filter by category
   * @param {string} category - Category value
   * @returns {AdminProductsPage} This page instance for chaining
   */
  filterByCategory(category) {
    this.categoryFilter.select(category);
    return this;
  }

  /**
   * Filter by status
   * @param {string} status - Status value
   * @returns {AdminProductsPage} This page instance for chaining
   */
  filterByStatus(status) {
    this.statusFilter.select(status);
    return this;
  }

  /**
   * Edit product by index
   * @param {number} index - Row index
   * @returns {AdminProductsPage} This page instance for chaining
   */
  editProduct(index) {
    this.getProductRow(index).find(this.selectors.EDIT_BUTTON).click();
    return this;
  }

  /**
   * Edit product by name
   * @param {string} productName - Product name
   * @returns {AdminProductsPage} This page instance for chaining
   */
  editProductByName(productName) {
    this.getProductRowByName(productName).find(this.selectors.EDIT_BUTTON).click();
    return this;
  }

  /**
   * Delete product by index
   * @param {number} index - Row index
   * @returns {AdminProductsPage} This page instance for chaining
   */
  deleteProduct(index) {
    this.getProductRow(index).find(this.selectors.DELETE_BUTTON).click();
    cy.get('[data-testid="confirm-delete"]').click();
    return this;
  }

  /**
   * Delete product by name
   * @param {string} productName - Product name
   * @returns {AdminProductsPage} This page instance for chaining
   */
  deleteProductByName(productName) {
    this.getProductRowByName(productName).find(this.selectors.DELETE_BUTTON).click();
    cy.get('[data-testid="confirm-delete"]').click();
    return this;
  }

  /**
   * Fill product form
   * @param {Object} productData - Product data
   * @returns {AdminProductsPage} This page instance for chaining
   */
  fillProductForm(productData) {
    if (productData.name) {
      this.nameInput.clear().type(productData.name);
    }
    if (productData.description) {
      this.descriptionInput.clear().type(productData.description);
    }
    if (productData.price) {
      this.priceInput.clear().type(productData.price.toString());
    }
    if (productData.category) {
      this.categorySelect.select(productData.category);
    }
    if (productData.stock !== undefined) {
      this.stockInput.clear().type(productData.stock.toString());
    }
    if (productData.status) {
      this.statusSelect.select(productData.status);
    }
    if (productData.featured) {
      this.featuredCheckbox.check();
    }
    return this;
  }

  /**
   * Submit product form
   * @returns {AdminProductsPage} This page instance for chaining
   */
  submitForm() {
    this.submitButton.click();
    return this;
  }

  /**
   * Cancel product form
   * @returns {AdminProductsPage} This page instance for chaining
   */
  cancelForm() {
    this.cancelButton.click();
    return this;
  }

  // =================================
  // High-Level Actions
  // =================================

  /**
   * Create new product
   * @param {Object} productData - Product data
   * @returns {AdminProductsPage} This page instance for chaining
   */
  createProduct(productData) {
    this.clickAddProduct();
    this.fillProductForm(productData);
    this.submitForm();
    return this;
  }

  /**
   * Update product
   * @param {string} productName - Product name to update
   * @param {Object} productData - New product data
   * @returns {AdminProductsPage} This page instance for chaining
   */
  updateProduct(productName, productData) {
    this.editProductByName(productName);
    this.fillProductForm(productData);
    this.submitForm();
    return this;
  }

  // =================================
  // Verification Methods
  // =================================

  /**
   * Verify page is loaded
   * @returns {AdminProductsPage} This page instance for chaining
   */
  verifyPageLoaded() {
    this.verifyUrl('/admin/products');
    this.productsPage.should('be.visible');
    return this;
  }

  /**
   * Verify products are displayed
   * @param {number} [expectedCount] - Expected product count
   * @returns {AdminProductsPage} This page instance for chaining
   */
  verifyProductsDisplayed(expectedCount) {
    if (expectedCount !== undefined) {
      this.productRows.should('have.length', expectedCount);
    } else {
      this.productRows.should('have.length.at.least', 1);
    }
    return this;
  }

  /**
   * Verify product exists
   * @param {string} productName - Product name
   * @returns {AdminProductsPage} This page instance for chaining
   */
  verifyProductExists(productName) {
    this.getProductRowByName(productName).should('exist');
    return this;
  }

  /**
   * Verify product not exists
   * @param {string} productName - Product name
   * @returns {AdminProductsPage} This page instance for chaining
   */
  verifyProductNotExists(productName) {
    cy.contains(this.selectors.ROW, productName).should('not.exist');
    return this;
  }

  /**
   * Verify form modal is visible
   * @returns {AdminProductsPage} This page instance for chaining
   */
  verifyFormModalVisible() {
    this.formModal.should('be.visible');
    return this;
  }

  /**
   * Verify success message
   * @param {string} [message] - Expected message
   * @returns {AdminProductsPage} This page instance for chaining
   */
  verifySuccessMessage(message) {
    cy.get('[data-testid="toast-success"]').should('be.visible');
    if (message) {
      cy.get('[data-testid="toast-success"]').should('contain.text', message);
    }
    return this;
  }

  /**
   * Get product count
   * @returns {Cypress.Chainable<number>} Product count
   */
  getProductCount() {
    return this.productRows.its('length');
  }

  // =================================
  // API Interception Methods
  // =================================

  /**
   * Intercept get products request
   * @param {string} [alias='getProducts'] - Intercept alias
   * @returns {AdminProductsPage} This page instance for chaining
   */
  interceptGetProductsRequest(alias = 'getProducts') {
    cy.intercept('GET', '**/products*').as(alias);
    return this;
  }

  /**
   * Intercept create product request
   * @param {string} [alias='createProduct'] - Intercept alias
   * @returns {AdminProductsPage} This page instance for chaining
   */
  interceptCreateProductRequest(alias = 'createProduct') {
    cy.intercept('POST', '**/products').as(alias);
    return this;
  }

  /**
   * Intercept update product request
   * @param {string} [alias='updateProduct'] - Intercept alias
   * @returns {AdminProductsPage} This page instance for chaining
   */
  interceptUpdateProductRequest(alias = 'updateProduct') {
    cy.intercept('PUT', '**/products/*').as(alias);
    return this;
  }

  /**
   * Intercept delete product request
   * @param {string} [alias='deleteProduct'] - Intercept alias
   * @returns {AdminProductsPage} This page instance for chaining
   */
  interceptDeleteProductRequest(alias = 'deleteProduct') {
    cy.intercept('DELETE', '**/products/*').as(alias);
    return this;
  }

  /**
   * Wait for products request
   * @param {string} [alias='getProducts'] - Intercept alias
   * @returns {Cypress.Chainable} Intercepted request
   */
  waitForProductsRequest(alias = 'getProducts') {
    return cy.wait(`@${alias}`);
  }
}

export default AdminProductsPage;
