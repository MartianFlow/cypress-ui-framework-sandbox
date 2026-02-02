/**
 * ProductCardComponent - Component Object for Product Card
 * @description Handles all product card interactions and verifications
 * @extends BaseComponent
 */
import BaseComponent from '../base/BaseComponent';
const { PRODUCTS } = require('../../utils/constants/selectors');

class ProductCardComponent extends BaseComponent {
  /**
   * Creates a ProductCardComponent instance
   * @param {string} [selector] - Custom selector for the product card
   */
  constructor(selector = PRODUCTS.CARD) {
    super(selector);
    this.selectors = PRODUCTS;
  }

  // =================================
  // Element Getters
  // =================================

  get image() {
    return this.root.find(this.selectors.IMAGE);
  }

  get name() {
    return this.root.find(this.selectors.NAME);
  }

  get price() {
    return this.root.find(this.selectors.PRICE);
  }

  get originalPrice() {
    return this.root.find(this.selectors.ORIGINAL_PRICE);
  }

  get rating() {
    return this.root.find(this.selectors.RATING);
  }

  get addToCartButton() {
    return this.root.find(this.selectors.ADD_TO_CART_BUTTON);
  }

  get discountBadge() {
    return this.root.find(this.selectors.DISCOUNT_BADGE);
  }

  get quickViewButton() {
    return this.root.find(this.selectors.QUICK_VIEW_BUTTON);
  }

  get wishlistButton() {
    return this.root.find(this.selectors.WISHLIST_BUTTON);
  }

  // =================================
  // Action Methods
  // =================================

  /**
   * Click on product card to view details
   * @returns {ProductCardComponent} This component instance for chaining
   */
  clickCard() {
    this.root.click();
    return this;
  }

  /**
   * Click on product image
   * @returns {ProductCardComponent} This component instance for chaining
   */
  clickImage() {
    this.image.click();
    return this;
  }

  /**
   * Click on product name
   * @returns {ProductCardComponent} This component instance for chaining
   */
  clickName() {
    this.name.click();
    return this;
  }

  /**
   * Add product to cart
   * @returns {ProductCardComponent} This component instance for chaining
   */
  addToCart() {
    this.addToCartButton.click();
    return this;
  }

  /**
   * Quick view product
   * @returns {ProductCardComponent} This component instance for chaining
   */
  quickView() {
    this.root.trigger('mouseenter');
    this.quickViewButton.click();
    return this;
  }

  /**
   * Add to wishlist
   * @returns {ProductCardComponent} This component instance for chaining
   */
  addToWishlist() {
    this.wishlistButton.click();
    return this;
  }

  /**
   * Hover over product card
   * @returns {ProductCardComponent} This component instance for chaining
   */
  hover() {
    this.root.trigger('mouseenter');
    return this;
  }

  // =================================
  // Verification Methods
  // =================================

  /**
   * Verify product card is visible
   * @returns {ProductCardComponent} This component instance for chaining
   */
  verifyVisible() {
    this.shouldBeVisible();
    return this;
  }

  /**
   * Verify product name
   * @param {string} expectedName - Expected product name
   * @returns {ProductCardComponent} This component instance for chaining
   */
  verifyName(expectedName) {
    this.name.should('contain.text', expectedName);
    return this;
  }

  /**
   * Verify product price
   * @param {string} expectedPrice - Expected price
   * @returns {ProductCardComponent} This component instance for chaining
   */
  verifyPrice(expectedPrice) {
    this.price.should('contain.text', expectedPrice);
    return this;
  }

  /**
   * Verify product has discount
   * @returns {ProductCardComponent} This component instance for chaining
   */
  verifyHasDiscount() {
    this.originalPrice.should('be.visible');
    this.discountBadge.should('be.visible');
    return this;
  }

  /**
   * Verify product has no discount
   * @returns {ProductCardComponent} This component instance for chaining
   */
  verifyNoDiscount() {
    this.originalPrice.should('not.exist');
    return this;
  }

  /**
   * Verify add to cart button is enabled
   * @returns {ProductCardComponent} This component instance for chaining
   */
  verifyAddToCartEnabled() {
    this.addToCartButton.should('be.visible').and('be.enabled');
    return this;
  }

  /**
   * Verify add to cart button is disabled
   * @returns {ProductCardComponent} This component instance for chaining
   */
  verifyAddToCartDisabled() {
    this.addToCartButton.should('be.disabled');
    return this;
  }

  /**
   * Verify product image is loaded
   * @returns {ProductCardComponent} This component instance for chaining
   */
  verifyImageLoaded() {
    this.image.should('be.visible')
      .and('have.attr', 'src')
      .and('not.be.empty');
    return this;
  }

  /**
   * Verify rating is displayed
   * @returns {ProductCardComponent} This component instance for chaining
   */
  verifyRatingDisplayed() {
    this.rating.should('be.visible');
    return this;
  }

  /**
   * Get product name text
   * @returns {Cypress.Chainable<string>} Product name
   */
  getName() {
    return this.name.invoke('text');
  }

  /**
   * Get product price as number
   * @returns {Cypress.Chainable<number>} Product price
   */
  getPrice() {
    return this.price.invoke('text').then((text) => {
      return parseFloat(text.replace(/[^0-9.]/g, ''));
    });
  }

  /**
   * Verify all product card details
   * @param {Object} expectedData - Expected product data
   * @returns {ProductCardComponent} This component instance for chaining
   */
  verifyProductData(expectedData) {
    if (expectedData.name) {
      this.verifyName(expectedData.name);
    }
    if (expectedData.price) {
      this.verifyPrice(expectedData.price);
    }
    if (expectedData.hasDiscount) {
      this.verifyHasDiscount();
    }
    return this;
  }
}

export default ProductCardComponent;
