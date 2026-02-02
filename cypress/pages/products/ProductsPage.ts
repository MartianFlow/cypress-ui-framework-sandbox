/**
 * ProductsPage - Page Object for Products listing
 * @description Handles all products page interactions and verifications
 * @extends BasePage
 */
import BasePage from '../base/BasePage';
const { PRODUCTS, CATEGORIES } = require('../../utils/constants/selectors');
const { APP } = require('../../utils/constants/routes');

class ProductsPage extends BasePage {
  /**
   * Creates a ProductsPage instance
   */
  constructor() {
    super(APP.PRODUCTS.LIST);
    this.selectors = PRODUCTS;
    this.categorySelectors = CATEGORIES;
  }

  // =================================
  // Page Elements
  // =================================

  get productGrid() {
    return cy.get(this.selectors.GRID);
  }

  get productList() {
    return cy.get(this.selectors.LIST);
  }

  get productCards() {
    return cy.get(this.selectors.CARD);
  }

  get filtersContainer() {
    return cy.get(this.selectors.FILTERS.CONTAINER);
  }

  get sortSelect() {
    return cy.get(this.selectors.SORT.SELECT);
  }

  get searchInput() {
    return cy.get(this.selectors.SEARCH.INPUT);
  }

  get searchButton() {
    return cy.get(this.selectors.SEARCH.BUTTON);
  }

  get categoryFilter() {
    return cy.get(this.selectors.FILTERS.CATEGORY);
  }

  get priceMinInput() {
    return cy.get(this.selectors.FILTERS.PRICE_MIN);
  }

  get priceMaxInput() {
    return cy.get(this.selectors.FILTERS.PRICE_MAX);
  }

  get clearFiltersButton() {
    return cy.get(this.selectors.FILTERS.CLEAR_ALL);
  }

  // =================================
  // Action Methods
  // =================================

  /**
   * Search for products
   * @param {string} query - Search query
   * @returns {ProductsPage} This page instance for chaining
   */
  search(query) {
    this.searchInput.clear().type(query);
    this.searchButton.click();
    return this;
  }

  /**
   * Filter by category
   * @param {string} category - Category name or value
   * @returns {ProductsPage} This page instance for chaining
   */
  filterByCategory(category) {
    this.categoryFilter.select(category);
    return this;
  }

  /**
   * Filter by price range
   * @param {number} min - Minimum price
   * @param {number} max - Maximum price
   * @returns {ProductsPage} This page instance for chaining
   */
  filterByPriceRange(min, max) {
    if (min !== undefined) {
      this.priceMinInput.clear().type(min.toString());
    }
    if (max !== undefined) {
      this.priceMaxInput.clear().type(max.toString());
    }
    cy.get(this.selectors.FILTERS.PRICE_APPLY).click();
    return this;
  }

  /**
   * Sort products
   * @param {string} sortOption - Sort option value
   * @returns {ProductsPage} This page instance for chaining
   */
  sortBy(sortOption) {
    this.sortSelect.select(sortOption);
    return this;
  }

  /**
   * Clear all filters
   * @returns {ProductsPage} This page instance for chaining
   */
  clearFilters() {
    this.clearFiltersButton.click();
    return this;
  }

  /**
   * Click on a product card by index
   * @param {number} index - Product card index (0-based)
   * @returns {ProductsPage} This page instance for chaining
   */
  clickProductByIndex(index) {
    this.productCards.eq(index).click();
    return this;
  }

  /**
   * Click on a product card by name
   * @param {string} productName - Product name
   * @returns {ProductsPage} This page instance for chaining
   */
  clickProductByName(productName) {
    cy.contains(this.selectors.CARD, productName).click();
    return this;
  }

  /**
   * Add product to cart by index
   * @param {number} index - Product card index (0-based)
   * @returns {ProductsPage} This page instance for chaining
   */
  addToCartByIndex(index) {
    this.productCards
      .eq(index)
      .find(this.selectors.ADD_TO_CART_BUTTON)
      .click();
    return this;
  }

  /**
   * Add product to cart by name
   * @param {string} productName - Product name
   * @returns {ProductsPage} This page instance for chaining
   */
  addToCartByName(productName) {
    cy.contains(this.selectors.CARD, productName)
      .find(this.selectors.ADD_TO_CART_BUTTON)
      .click();
    return this;
  }

  /**
   * Navigate to a specific page
   * @param {number} pageNumber - Page number
   * @returns {ProductsPage} This page instance for chaining
   */
  goToPage(pageNumber) {
    cy.get(`[data-testid="page-${pageNumber}"]`).click();
    return this;
  }

  /**
   * Go to next page
   * @returns {ProductsPage} This page instance for chaining
   */
  nextPage() {
    cy.get('[data-testid="next-page"]').click();
    return this;
  }

  /**
   * Go to previous page
   * @returns {ProductsPage} This page instance for chaining
   */
  previousPage() {
    cy.get('[data-testid="prev-page"]').click();
    return this;
  }

  // =================================
  // High-Level Actions
  // =================================

  /**
   * Search and filter products
   * @param {Object} options - Search/filter options
   * @param {string} [options.query] - Search query
   * @param {string} [options.category] - Category filter
   * @param {number} [options.minPrice] - Minimum price
   * @param {number} [options.maxPrice] - Maximum price
   * @param {string} [options.sortBy] - Sort option
   * @returns {ProductsPage} This page instance for chaining
   */
  searchAndFilter(options = {}) {
    const { query, category, minPrice, maxPrice, sortBy } = options;

    if (query) {
      this.search(query);
    }

    if (category) {
      this.filterByCategory(category);
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      this.filterByPriceRange(minPrice, maxPrice);
    }

    if (sortBy) {
      this.sortBy(sortBy);
    }

    return this;
  }

  // =================================
  // Verification Methods
  // =================================

  /**
   * Verify page is loaded
   * @returns {ProductsPage} This page instance for chaining
   */
  verifyPageLoaded() {
    this.verifyUrl('/products');
    this.productCards.should('have.length.at.least', 1);
    return this;
  }

  /**
   * Verify products are displayed
   * @param {number} [expectedCount] - Expected number of products
   * @returns {ProductsPage} This page instance for chaining
   */
  verifyProductsDisplayed(expectedCount) {
    if (expectedCount !== undefined) {
      this.productCards.should('have.length', expectedCount);
    } else {
      this.productCards.should('have.length.at.least', 1);
    }
    return this;
  }

  /**
   * Verify no products found message
   * @returns {ProductsPage} This page instance for chaining
   */
  verifyNoProductsFound() {
    cy.get(this.selectors.SEARCH.NO_RESULTS).should('be.visible');
    return this;
  }

  /**
   * Verify product card contains expected data
   * @param {number} index - Product card index
   * @param {Object} expectedData - Expected product data
   * @returns {ProductsPage} This page instance for chaining
   */
  verifyProductCard(index, expectedData) {
    const card = this.productCards.eq(index);

    if (expectedData.name) {
      card.find(this.selectors.NAME).should('contain.text', expectedData.name);
    }

    if (expectedData.price) {
      card.find(this.selectors.PRICE).should('contain.text', expectedData.price);
    }

    return this;
  }

  /**
   * Verify products are sorted by price ascending
   * @returns {ProductsPage} This page instance for chaining
   */
  verifyPriceSortedAscending() {
    const prices = [];
    this.productCards.find(this.selectors.PRICE).each(($el) => {
      const priceText = $el.text().replace(/[^0-9.]/g, '');
      prices.push(parseFloat(priceText));
    }).then(() => {
      const sortedPrices = [...prices].sort((a, b) => a - b);
      expect(prices).to.deep.equal(sortedPrices);
    });
    return this;
  }

  /**
   * Verify products are sorted by price descending
   * @returns {ProductsPage} This page instance for chaining
   */
  verifyPriceSortedDescending() {
    const prices = [];
    this.productCards.find(this.selectors.PRICE).each(($el) => {
      const priceText = $el.text().replace(/[^0-9.]/g, '');
      prices.push(parseFloat(priceText));
    }).then(() => {
      const sortedPrices = [...prices].sort((a, b) => b - a);
      expect(prices).to.deep.equal(sortedPrices);
    });
    return this;
  }

  /**
   * Verify filter is applied
   * @param {string} filterName - Filter name
   * @param {string} value - Filter value
   * @returns {ProductsPage} This page instance for chaining
   */
  verifyFilterApplied(filterName, value) {
    cy.url().should('include', `${filterName}=${value}`);
    return this;
  }

  /**
   * Verify current page
   * @param {number} pageNumber - Expected page number
   * @returns {ProductsPage} This page instance for chaining
   */
  verifyCurrentPage(pageNumber) {
    cy.get(`[data-testid="page-${pageNumber}"]`).should('have.class', 'active');
    return this;
  }

  /**
   * Get product count
   * @returns {Cypress.Chainable<number>} Product count
   */
  getProductCount() {
    return this.productCards.its('length');
  }

  /**
   * Get product data by index
   * @param {number} index - Product index
   * @returns {Cypress.Chainable<Object>} Product data
   */
  getProductData(index) {
    return this.productCards.eq(index).then(($card) => {
      return {
        name: $card.find(this.selectors.NAME).text(),
        price: $card.find(this.selectors.PRICE).text(),
      };
    });
  }

  // =================================
  // API Interception Methods
  // =================================

  /**
   * Setup products API intercept
   * @param {string} [alias='getProducts'] - Intercept alias
   * @returns {ProductsPage} This page instance for chaining
   */
  interceptProductsRequest(alias = 'getProducts') {
    cy.intercept('GET', '**/products*').as(alias);
    return this;
  }

  /**
   * Mock products response
   * @param {Array} products - Products array
   * @param {string} [alias='getProducts'] - Intercept alias
   * @returns {ProductsPage} This page instance for chaining
   */
  mockProducts(products, alias = 'getProducts') {
    cy.intercept('GET', '**/products*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          data: products,
          pagination: {
            page: 1,
            pageSize: 12,
            total: products.length,
            totalPages: 1,
          },
        },
      },
    }).as(alias);
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

export default ProductsPage;
