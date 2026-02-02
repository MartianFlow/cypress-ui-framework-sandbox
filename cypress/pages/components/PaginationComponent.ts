/**
 * PaginationComponent - Component Object for Pagination
 * @description Handles all pagination interactions and verifications
 * @extends BaseComponent
 */
import BaseComponent from '../base/BaseComponent';
const { TABLE } = require('../../utils/constants/selectors');

class PaginationComponent extends BaseComponent {
  /**
   * Creates a PaginationComponent instance
   * @param {string} [selector] - Custom selector for pagination
   */
  constructor(selector = TABLE.PAGINATION) {
    super(selector);
    this.selectors = TABLE;
  }

  // =================================
  // Element Getters
  // =================================

  get prevButton() {
    return this.root.find(this.selectors.PREV_PAGE);
  }

  get nextButton() {
    return this.root.find(this.selectors.NEXT_PAGE);
  }

  get pageNumbers() {
    return this.root.find(this.selectors.PAGE_NUMBER);
  }

  get pageSize() {
    return this.root.find(this.selectors.PAGE_SIZE);
  }

  get totalCount() {
    return this.root.find(this.selectors.TOTAL_COUNT);
  }

  // =================================
  // Action Methods
  // =================================

  /**
   * Go to previous page
   * @returns {PaginationComponent} This component instance for chaining
   */
  previousPage() {
    this.prevButton.click();
    return this;
  }

  /**
   * Go to next page
   * @returns {PaginationComponent} This component instance for chaining
   */
  nextPage() {
    this.nextButton.click();
    return this;
  }

  /**
   * Go to specific page
   * @param {number} pageNumber - Page number
   * @returns {PaginationComponent} This component instance for chaining
   */
  goToPage(pageNumber) {
    this.pageNumbers.contains(pageNumber.toString()).click();
    return this;
  }

  /**
   * Go to first page
   * @returns {PaginationComponent} This component instance for chaining
   */
  goToFirstPage() {
    this.goToPage(1);
    return this;
  }

  /**
   * Go to last page
   * @returns {PaginationComponent} This component instance for chaining
   */
  goToLastPage() {
    this.pageNumbers.last().click();
    return this;
  }

  /**
   * Change page size
   * @param {number} size - Page size
   * @returns {PaginationComponent} This component instance for chaining
   */
  changePageSize(size) {
    this.pageSize.select(size.toString());
    return this;
  }

  // =================================
  // Verification Methods
  // =================================

  /**
   * Verify pagination is visible
   * @returns {PaginationComponent} This component instance for chaining
   */
  verifyVisible() {
    this.shouldBeVisible();
    return this;
  }

  /**
   * Verify current page
   * @param {number} expectedPage - Expected current page
   * @returns {PaginationComponent} This component instance for chaining
   */
  verifyCurrentPage(expectedPage) {
    this.pageNumbers
      .filter('.active, [aria-current="page"]')
      .should('contain.text', expectedPage.toString());
    return this;
  }

  /**
   * Verify previous button is disabled
   * @returns {PaginationComponent} This component instance for chaining
   */
  verifyPrevDisabled() {
    this.prevButton.should('be.disabled');
    return this;
  }

  /**
   * Verify previous button is enabled
   * @returns {PaginationComponent} This component instance for chaining
   */
  verifyPrevEnabled() {
    this.prevButton.should('be.enabled');
    return this;
  }

  /**
   * Verify next button is disabled
   * @returns {PaginationComponent} This component instance for chaining
   */
  verifyNextDisabled() {
    this.nextButton.should('be.disabled');
    return this;
  }

  /**
   * Verify next button is enabled
   * @returns {PaginationComponent} This component instance for chaining
   */
  verifyNextEnabled() {
    this.nextButton.should('be.enabled');
    return this;
  }

  /**
   * Verify total count
   * @param {number} expectedTotal - Expected total items
   * @returns {PaginationComponent} This component instance for chaining
   */
  verifyTotalCount(expectedTotal) {
    this.totalCount.should('contain.text', expectedTotal.toString());
    return this;
  }

  /**
   * Verify page size
   * @param {number} expectedSize - Expected page size
   * @returns {PaginationComponent} This component instance for chaining
   */
  verifyPageSize(expectedSize) {
    this.pageSize.should('have.value', expectedSize.toString());
    return this;
  }

  /**
   * Verify number of pages
   * @param {number} expectedPages - Expected number of pages
   * @returns {PaginationComponent} This component instance for chaining
   */
  verifyNumberOfPages(expectedPages) {
    this.pageNumbers.should('have.length', expectedPages);
    return this;
  }

  /**
   * Get current page number
   * @returns {Cypress.Chainable<number>} Current page number
   */
  getCurrentPage() {
    return this.pageNumbers
      .filter('.active, [aria-current="page"]')
      .invoke('text')
      .then((text) => parseInt(text, 10));
  }

  /**
   * Get total pages count
   * @returns {Cypress.Chainable<number>} Total pages
   */
  getTotalPages() {
    return this.pageNumbers.its('length');
  }
}

export default PaginationComponent;
