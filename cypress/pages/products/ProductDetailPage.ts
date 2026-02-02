/**
 * ProductDetailPage - Page Object for Product Detail view
 * @description Handles all product detail page interactions and verifications
 * @extends BasePage
 */
import BasePage from '../base/BasePage';
const { PRODUCTS } = require('../../utils/constants/selectors');
const { APP } = require('../../utils/constants/routes');

class ProductDetailPage extends BasePage {
  /**
   * Creates a ProductDetailPage instance
   * @param {string} [productSlug] - Product slug for URL
   */
  constructor(productSlug = '') {
    super(productSlug ? APP.PRODUCTS.DETAIL(productSlug) : '/products');
    this.selectors = PRODUCTS;
    this.productSlug = productSlug;
  }

  // =================================
  // Page Elements
  // =================================

  get detailContainer() {
    return cy.get(this.selectors.DETAIL_PAGE);
  }

  get productName() {
    return cy.get(this.selectors.NAME);
  }

  get productPrice() {
    return cy.get(this.selectors.PRICE);
  }

  get originalPrice() {
    return cy.get(this.selectors.ORIGINAL_PRICE);
  }

  get productDescription() {
    return cy.get(this.selectors.DESCRIPTION);
  }

  get productRating() {
    return cy.get(this.selectors.RATING);
  }

  get stockStatus() {
    return cy.get(this.selectors.STOCK_STATUS);
  }

  get quantityInput() {
    return cy.get(this.selectors.QUANTITY_INPUT);
  }

  get quantityIncrease() {
    return cy.get(this.selectors.QUANTITY_INCREASE);
  }

  get quantityDecrease() {
    return cy.get(this.selectors.QUANTITY_DECREASE);
  }

  get addToCartButton() {
    return cy.get(this.selectors.ADD_TO_CART_BUTTON);
  }

  get galleryMainImage() {
    return cy.get(this.selectors.GALLERY_MAIN);
  }

  get galleryThumbnails() {
    return cy.get(this.selectors.GALLERY_THUMBNAIL);
  }

  // Reviews Elements
  get reviewsContainer() {
    return cy.get(this.selectors.REVIEWS.CONTAINER);
  }

  get reviewsList() {
    return cy.get(this.selectors.REVIEWS.LIST);
  }

  get reviewItems() {
    return cy.get(this.selectors.REVIEWS.ITEM);
  }

  get reviewForm() {
    return cy.get(this.selectors.REVIEWS.FORM);
  }

  // =================================
  // Navigation Methods
  // =================================

  /**
   * Open product detail by slug
   * @param {string} slug - Product slug
   * @returns {ProductDetailPage} This page instance for chaining
   */
  openProduct(slug) {
    this.productSlug = slug;
    cy.visit(APP.PRODUCTS.DETAIL(slug));
    this.waitForPageLoad();
    return this;
  }

  // =================================
  // Action Methods
  // =================================

  /**
   * Set quantity
   * @param {number} quantity - Quantity to set
   * @returns {ProductDetailPage} This page instance for chaining
   */
  setQuantity(quantity) {
    this.quantityInput.clear().type(quantity.toString());
    return this;
  }

  /**
   * Increase quantity
   * @param {number} [times=1] - Number of times to increase
   * @returns {ProductDetailPage} This page instance for chaining
   */
  increaseQuantity(times = 1) {
    for (let i = 0; i < times; i++) {
      this.quantityIncrease.click();
    }
    return this;
  }

  /**
   * Decrease quantity
   * @param {number} [times=1] - Number of times to decrease
   * @returns {ProductDetailPage} This page instance for chaining
   */
  decreaseQuantity(times = 1) {
    for (let i = 0; i < times; i++) {
      this.quantityDecrease.click();
    }
    return this;
  }

  /**
   * Add product to cart
   * @returns {ProductDetailPage} This page instance for chaining
   */
  addToCart() {
    this.addToCartButton.click();
    return this;
  }

  /**
   * Add product to cart with specific quantity
   * @param {number} quantity - Quantity to add
   * @returns {ProductDetailPage} This page instance for chaining
   */
  addToCartWithQuantity(quantity) {
    this.setQuantity(quantity);
    this.addToCart();
    return this;
  }

  /**
   * Click on gallery thumbnail
   * @param {number} index - Thumbnail index (0-based)
   * @returns {ProductDetailPage} This page instance for chaining
   */
  clickThumbnail(index) {
    this.galleryThumbnails.eq(index).click();
    return this;
  }

  /**
   * Scroll to reviews section
   * @returns {ProductDetailPage} This page instance for chaining
   */
  scrollToReviews() {
    this.reviewsContainer.scrollIntoView();
    return this;
  }

  // =================================
  // Review Methods
  // =================================

  /**
   * Submit a review
   * @param {Object} reviewData - Review data
   * @param {number} reviewData.rating - Rating (1-5)
   * @param {string} reviewData.title - Review title
   * @param {string} reviewData.comment - Review comment
   * @returns {ProductDetailPage} This page instance for chaining
   */
  submitReview(reviewData) {
    cy.get(this.selectors.REVIEWS.FORM_RATING).select(reviewData.rating.toString());
    cy.get(this.selectors.REVIEWS.FORM_TITLE).clear().type(reviewData.title);
    cy.get(this.selectors.REVIEWS.FORM_COMMENT).clear().type(reviewData.comment);
    cy.get(this.selectors.REVIEWS.FORM_SUBMIT).click();
    return this;
  }

  // =================================
  // Verification Methods
  // =================================

  /**
   * Verify page is loaded
   * @returns {ProductDetailPage} This page instance for chaining
   */
  verifyPageLoaded() {
    this.productName.should('be.visible');
    this.productPrice.should('be.visible');
    this.addToCartButton.should('be.visible');
    return this;
  }

  /**
   * Verify product details
   * @param {Object} expectedData - Expected product data
   * @returns {ProductDetailPage} This page instance for chaining
   */
  verifyProductDetails(expectedData) {
    if (expectedData.name) {
      this.productName.should('contain.text', expectedData.name);
    }
    if (expectedData.price) {
      this.productPrice.should('contain.text', expectedData.price);
    }
    if (expectedData.description) {
      this.productDescription.should('contain.text', expectedData.description);
    }
    return this;
  }

  /**
   * Verify product is in stock
   * @returns {ProductDetailPage} This page instance for chaining
   */
  verifyInStock() {
    this.stockStatus.should('contain.text', 'In Stock');
    this.addToCartButton.should('be.enabled');
    return this;
  }

  /**
   * Verify product is out of stock
   * @returns {ProductDetailPage} This page instance for chaining
   */
  verifyOutOfStock() {
    this.stockStatus.should('contain.text', 'Out of Stock');
    this.addToCartButton.should('be.disabled');
    return this;
  }

  /**
   * Verify quantity value
   * @param {number} expectedQuantity - Expected quantity
   * @returns {ProductDetailPage} This page instance for chaining
   */
  verifyQuantity(expectedQuantity) {
    this.quantityInput.should('have.value', expectedQuantity.toString());
    return this;
  }

  /**
   * Verify add to cart success message
   * @returns {ProductDetailPage} This page instance for chaining
   */
  verifyAddToCartSuccess() {
    cy.get('[data-testid="toast-success"]').should('be.visible');
    return this;
  }

  /**
   * Verify reviews count
   * @param {number} expectedCount - Expected reviews count
   * @returns {ProductDetailPage} This page instance for chaining
   */
  verifyReviewsCount(expectedCount) {
    this.reviewItems.should('have.length', expectedCount);
    return this;
  }

  /**
   * Verify product has discount
   * @returns {ProductDetailPage} This page instance for chaining
   */
  verifyHasDiscount() {
    this.originalPrice.should('be.visible');
    cy.get(this.selectors.DISCOUNT_BADGE).should('be.visible');
    return this;
  }

  /**
   * Get current price as number
   * @returns {Cypress.Chainable<number>} Product price
   */
  getPrice() {
    return this.productPrice.invoke('text').then((text) => {
      return parseFloat(text.replace(/[^0-9.]/g, ''));
    });
  }

  /**
   * Get current quantity
   * @returns {Cypress.Chainable<number>} Current quantity
   */
  getQuantity() {
    return this.quantityInput.invoke('val').then((val) => parseInt(val, 10));
  }

  // =================================
  // API Interception Methods
  // =================================

  /**
   * Intercept product detail request
   * @param {string} [alias='getProduct'] - Intercept alias
   * @returns {ProductDetailPage} This page instance for chaining
   */
  interceptProductRequest(alias = 'getProduct') {
    cy.intercept('GET', '**/products/*').as(alias);
    return this;
  }

  /**
   * Intercept add to cart request
   * @param {string} [alias='addToCart'] - Intercept alias
   * @returns {ProductDetailPage} This page instance for chaining
   */
  interceptAddToCartRequest(alias = 'addToCart') {
    cy.intercept('POST', '**/cart').as(alias);
    return this;
  }

  /**
   * Intercept reviews request
   * @param {string} [alias='getReviews'] - Intercept alias
   * @returns {ProductDetailPage} This page instance for chaining
   */
  interceptReviewsRequest(alias = 'getReviews') {
    cy.intercept('GET', '**/products/*/reviews').as(alias);
    return this;
  }

  /**
   * Mock product response
   * @param {Object} product - Product data
   * @param {string} [alias='getProduct'] - Intercept alias
   * @returns {ProductDetailPage} This page instance for chaining
   */
  mockProduct(product, alias = 'getProduct') {
    cy.intercept('GET', '**/products/*', {
      statusCode: 200,
      body: {
        success: true,
        data: product,
      },
    }).as(alias);
    return this;
  }

  /**
   * Wait for product request
   * @param {string} [alias='getProduct'] - Intercept alias
   * @returns {Cypress.Chainable} Intercepted request
   */
  waitForProductRequest(alias = 'getProduct') {
    return cy.wait(`@${alias}`);
  }
}

export default ProductDetailPage;
