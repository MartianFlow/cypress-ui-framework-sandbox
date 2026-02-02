/**
 * TableComponent - Reusable data table component
 * @description Handles interactions with data tables and grids
 * @extends BaseComponent
 */
import BaseComponent from '../base/BaseComponent';

class TableComponent extends BaseComponent {
  /**
   * Creates a TableComponent instance
   * @param {string} [rootSelector='[data-testid="table"]'] - Table root selector
   */
  constructor(rootSelector = '[data-testid="table"]') {
    super(rootSelector);

    // Define component selectors
    this.selectors = {
      header: 'thead',
      headerRow: 'thead tr',
      headerCell: 'th',
      body: 'tbody',
      row: 'tbody tr',
      cell: 'td',
      sortIcon: '[data-testid="sort-icon"]',
      checkbox: '[data-testid="row-checkbox"]',
      selectAll: '[data-testid="select-all"]',
      actionButton: '[data-testid="row-action"]',
      editButton: '[data-testid="edit-button"]',
      deleteButton: '[data-testid="delete-button"]',
      viewButton: '[data-testid="view-button"]',
      pagination: '[data-testid="table-pagination"]',
      pageNumber: '[data-testid="page-number"]',
      nextPage: '[data-testid="next-page"]',
      prevPage: '[data-testid="prev-page"]',
      pageSize: '[data-testid="page-size"]',
      totalCount: '[data-testid="total-count"]',
      emptyState: '[data-testid="table-empty"]',
      loadingState: '[data-testid="table-loading"]',
      searchInput: '[data-testid="table-search"]',
      filterButton: '[data-testid="table-filter"]',
    };
  }

  // =================================
  // Header Methods
  // =================================

  /**
   * Get all header cells
   * @returns {Cypress.Chainable} Header cells
   */
  getHeaders() {
    return this.find(`${this.selectors.headerRow} ${this.selectors.headerCell}`);
  }

  /**
   * Get header cell by index
   * @param {number} index - Column index (0-based)
   * @returns {Cypress.Chainable} Header cell
   */
  getHeader(index) {
    return this.getHeaders().eq(index);
  }

  /**
   * Get header cell by text
   * @param {string} text - Header text
   * @returns {Cypress.Chainable} Header cell
   */
  getHeaderByText(text) {
    return this.find(this.selectors.headerCell).contains(text);
  }

  /**
   * Click header to sort
   * @param {number|string} column - Column index or header text
   * @returns {TableComponent} This component instance for chaining
   */
  sortByColumn(column) {
    if (typeof column === 'number') {
      this.getHeader(column).click();
    } else {
      this.getHeaderByText(column).click();
    }
    return this;
  }

  /**
   * Verify column header text
   * @param {number} index - Column index
   * @param {string} expectedText - Expected header text
   * @returns {TableComponent} This component instance for chaining
   */
  verifyHeaderText(index, expectedText) {
    this.getHeader(index).should('contain.text', expectedText);
    return this;
  }

  /**
   * Verify column is sorted ascending
   * @param {number} columnIndex - Column index
   * @returns {TableComponent} This component instance for chaining
   */
  verifySortedAscending(columnIndex) {
    this.getHeader(columnIndex)
      .find(this.selectors.sortIcon)
      .should('have.class', 'asc');
    return this;
  }

  /**
   * Verify column is sorted descending
   * @param {number} columnIndex - Column index
   * @returns {TableComponent} This component instance for chaining
   */
  verifySortedDescending(columnIndex) {
    this.getHeader(columnIndex)
      .find(this.selectors.sortIcon)
      .should('have.class', 'desc');
    return this;
  }

  // =================================
  // Row Methods
  // =================================

  /**
   * Get all rows
   * @returns {Cypress.Chainable} Table rows
   */
  getRows() {
    return this.find(this.selectors.row);
  }

  /**
   * Get row by index
   * @param {number} index - Row index (0-based)
   * @returns {Cypress.Chainable} Table row
   */
  getRow(index) {
    return this.getRows().eq(index);
  }

  /**
   * Get row containing specific text
   * @param {string} text - Text to find in row
   * @returns {Cypress.Chainable} Table row
   */
  getRowByText(text) {
    return this.find(this.selectors.row).contains(text).closest('tr');
  }

  /**
   * Get row by cell value in specific column
   * @param {number} columnIndex - Column index
   * @param {string} value - Cell value
   * @returns {Cypress.Chainable} Table row
   */
  getRowByCellValue(columnIndex, value) {
    return this.getRows().filter((index, row) => {
      return Cypress.$(row).find('td').eq(columnIndex).text().includes(value);
    });
  }

  /**
   * Get row count
   * @returns {Cypress.Chainable<number>} Number of rows
   */
  getRowCount() {
    return this.getRows().its('length');
  }

  /**
   * Verify row count
   * @param {number} expectedCount - Expected number of rows
   * @returns {TableComponent} This component instance for chaining
   */
  verifyRowCount(expectedCount) {
    this.getRows().should('have.length', expectedCount);
    return this;
  }

  /**
   * Verify row exists with text
   * @param {string} text - Text that should exist in a row
   * @returns {TableComponent} This component instance for chaining
   */
  verifyRowExists(text) {
    this.getRowByText(text).should('exist');
    return this;
  }

  /**
   * Verify row does not exist with text
   * @param {string} text - Text that should not exist in any row
   * @returns {TableComponent} This component instance for chaining
   */
  verifyRowNotExists(text) {
    this.find(this.selectors.body).should('not.contain.text', text);
    return this;
  }

  /**
   * Click on a row
   * @param {number} index - Row index
   * @returns {TableComponent} This component instance for chaining
   */
  clickRow(index) {
    this.getRow(index).click();
    return this;
  }

  /**
   * Double click on a row
   * @param {number} index - Row index
   * @returns {TableComponent} This component instance for chaining
   */
  doubleClickRow(index) {
    this.getRow(index).dblclick();
    return this;
  }

  // =================================
  // Cell Methods
  // =================================

  /**
   * Get cell by row and column index
   * @param {number} rowIndex - Row index (0-based)
   * @param {number} colIndex - Column index (0-based)
   * @returns {Cypress.Chainable} Table cell
   */
  getCell(rowIndex, colIndex) {
    return this.getRow(rowIndex).find(this.selectors.cell).eq(colIndex);
  }

  /**
   * Get cell text
   * @param {number} rowIndex - Row index
   * @param {number} colIndex - Column index
   * @returns {Cypress.Chainable<string>} Cell text
   */
  getCellText(rowIndex, colIndex) {
    return this.getCell(rowIndex, colIndex).invoke('text');
  }

  /**
   * Verify cell text
   * @param {number} rowIndex - Row index
   * @param {number} colIndex - Column index
   * @param {string} expectedText - Expected text
   * @returns {TableComponent} This component instance for chaining
   */
  verifyCellText(rowIndex, colIndex, expectedText) {
    this.getCell(rowIndex, colIndex).should('contain.text', expectedText);
    return this;
  }

  /**
   * Click cell
   * @param {number} rowIndex - Row index
   * @param {number} colIndex - Column index
   * @returns {TableComponent} This component instance for chaining
   */
  clickCell(rowIndex, colIndex) {
    this.getCell(rowIndex, colIndex).click();
    return this;
  }

  /**
   * Get all cells in a column
   * @param {number} colIndex - Column index
   * @returns {Cypress.Chainable} Column cells
   */
  getColumnCells(colIndex) {
    return this.getRows().find(`${this.selectors.cell}:nth-child(${colIndex + 1})`);
  }

  /**
   * Get column values as array
   * @param {number} colIndex - Column index
   * @returns {Cypress.Chainable<string[]>} Array of cell values
   */
  getColumnValues(colIndex) {
    const values = [];
    return this.getColumnCells(colIndex).each(($cell) => {
      values.push($cell.text().trim());
    }).then(() => values);
  }

  // =================================
  // Selection Methods
  // =================================

  /**
   * Select row by checkbox
   * @param {number} index - Row index
   * @returns {TableComponent} This component instance for chaining
   */
  selectRow(index) {
    this.getRow(index).find(this.selectors.checkbox).check();
    return this;
  }

  /**
   * Deselect row
   * @param {number} index - Row index
   * @returns {TableComponent} This component instance for chaining
   */
  deselectRow(index) {
    this.getRow(index).find(this.selectors.checkbox).uncheck();
    return this;
  }

  /**
   * Select all rows
   * @returns {TableComponent} This component instance for chaining
   */
  selectAll() {
    this.find(this.selectors.selectAll).check();
    return this;
  }

  /**
   * Deselect all rows
   * @returns {TableComponent} This component instance for chaining
   */
  deselectAll() {
    this.find(this.selectors.selectAll).uncheck();
    return this;
  }

  /**
   * Get selected rows
   * @returns {Cypress.Chainable} Selected rows
   */
  getSelectedRows() {
    return this.getRows().filter(':has(input:checked)');
  }

  /**
   * Get selected row count
   * @returns {Cypress.Chainable<number>} Number of selected rows
   */
  getSelectedCount() {
    return this.getSelectedRows().its('length');
  }

  /**
   * Verify row is selected
   * @param {number} index - Row index
   * @returns {TableComponent} This component instance for chaining
   */
  verifyRowSelected(index) {
    this.getRow(index).find(this.selectors.checkbox).should('be.checked');
    return this;
  }

  /**
   * Verify row is not selected
   * @param {number} index - Row index
   * @returns {TableComponent} This component instance for chaining
   */
  verifyRowNotSelected(index) {
    this.getRow(index).find(this.selectors.checkbox).should('not.be.checked');
    return this;
  }

  // =================================
  // Action Methods
  // =================================

  /**
   * Click edit button for row
   * @param {number} index - Row index
   * @returns {TableComponent} This component instance for chaining
   */
  editRow(index) {
    this.getRow(index).find(this.selectors.editButton).click();
    return this;
  }

  /**
   * Click delete button for row
   * @param {number} index - Row index
   * @returns {TableComponent} This component instance for chaining
   */
  deleteRow(index) {
    this.getRow(index).find(this.selectors.deleteButton).click();
    return this;
  }

  /**
   * Click view button for row
   * @param {number} index - Row index
   * @returns {TableComponent} This component instance for chaining
   */
  viewRow(index) {
    this.getRow(index).find(this.selectors.viewButton).click();
    return this;
  }

  /**
   * Click action button by name for row
   * @param {number} index - Row index
   * @param {string} action - Action button text or testid
   * @returns {TableComponent} This component instance for chaining
   */
  clickRowAction(index, action) {
    this.getRow(index).contains('button', action).click();
    return this;
  }

  // =================================
  // Pagination Methods
  // =================================

  /**
   * Go to next page
   * @returns {TableComponent} This component instance for chaining
   */
  nextPage() {
    this.find(this.selectors.nextPage).click();
    return this;
  }

  /**
   * Go to previous page
   * @returns {TableComponent} This component instance for chaining
   */
  previousPage() {
    this.find(this.selectors.prevPage).click();
    return this;
  }

  /**
   * Go to specific page
   * @param {number} page - Page number
   * @returns {TableComponent} This component instance for chaining
   */
  goToPage(page) {
    this.find(this.selectors.pageNumber).contains(page.toString()).click();
    return this;
  }

  /**
   * Change page size
   * @param {number} size - Number of items per page
   * @returns {TableComponent} This component instance for chaining
   */
  changePageSize(size) {
    this.find(this.selectors.pageSize).select(size.toString());
    return this;
  }

  /**
   * Get current page number
   * @returns {Cypress.Chainable<number>} Current page
   */
  getCurrentPage() {
    return this.find(`${this.selectors.pageNumber}.active`)
      .invoke('text')
      .then((text) => parseInt(text, 10));
  }

  /**
   * Get total item count
   * @returns {Cypress.Chainable<number>} Total count
   */
  getTotalCount() {
    return this.find(this.selectors.totalCount)
      .invoke('text')
      .then((text) => parseInt(text.replace(/\D/g, ''), 10));
  }

  /**
   * Verify pagination exists
   * @returns {TableComponent} This component instance for chaining
   */
  verifyPaginationExists() {
    this.find(this.selectors.pagination).should('exist');
    return this;
  }

  /**
   * Verify next page is disabled
   * @returns {TableComponent} This component instance for chaining
   */
  verifyNextPageDisabled() {
    this.find(this.selectors.nextPage).should('be.disabled');
    return this;
  }

  /**
   * Verify previous page is disabled
   * @returns {TableComponent} This component instance for chaining
   */
  verifyPrevPageDisabled() {
    this.find(this.selectors.prevPage).should('be.disabled');
    return this;
  }

  // =================================
  // Search & Filter Methods
  // =================================

  /**
   * Search in table
   * @param {string} query - Search query
   * @returns {TableComponent} This component instance for chaining
   */
  search(query) {
    this.find(this.selectors.searchInput).clear().type(query);
    return this;
  }

  /**
   * Clear search
   * @returns {TableComponent} This component instance for chaining
   */
  clearSearch() {
    this.find(this.selectors.searchInput).clear();
    return this;
  }

  /**
   * Open filter panel
   * @returns {TableComponent} This component instance for chaining
   */
  openFilters() {
    this.find(this.selectors.filterButton).click();
    return this;
  }

  // =================================
  // State Methods
  // =================================

  /**
   * Verify table is empty
   * @returns {TableComponent} This component instance for chaining
   */
  verifyEmpty() {
    this.find(this.selectors.emptyState).should('be.visible');
    return this;
  }

  /**
   * Verify table is not empty
   * @returns {TableComponent} This component instance for chaining
   */
  verifyNotEmpty() {
    this.getRows().should('have.length.at.least', 1);
    return this;
  }

  /**
   * Verify table is loading
   * @returns {TableComponent} This component instance for chaining
   */
  verifyLoading() {
    this.find(this.selectors.loadingState).should('be.visible');
    return this;
  }

  /**
   * Wait for table to load
   * @param {number} [timeout] - Custom timeout
   * @returns {TableComponent} This component instance for chaining
   */
  waitForLoad(timeout = this.timeout) {
    cy.get('body').then(($body) => {
      if ($body.find(`${this.rootSelector} ${this.selectors.loadingState}`).length > 0) {
        this.find(this.selectors.loadingState, { timeout }).should('not.exist');
      }
    });
    return this;
  }

  /**
   * Verify table structure is valid
   * @returns {TableComponent} This component instance for chaining
   */
  verifyStructure() {
    this.find(this.selectors.header).should('exist');
    this.find(this.selectors.body).should('exist');
    return this;
  }
}

export default TableComponent;
