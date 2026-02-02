/**
 * HeaderComponent - Reusable header/navigation component
 * @description Handles interactions with the site header and navigation
 * @extends BaseComponent
 */
import BaseComponent from '../base/BaseComponent';

class HeaderComponent extends BaseComponent {
  /**
   * Creates a HeaderComponent instance
   * @param {string} [rootSelector='[data-testid="header"]'] - Header root selector
   */
  constructor(rootSelector = '[data-testid="header"]') {
    super(rootSelector);

    // Define component selectors
    this.selectors = {
      logo: '[data-testid="header-logo"]',
      navMenu: '[data-testid="nav-menu"]',
      navItem: '[data-testid="nav-item"]',
      searchInput: '[data-testid="header-search"]',
      searchButton: '[data-testid="search-button"]',
      userMenu: '[data-testid="user-menu"]',
      userMenuTrigger: '[data-testid="user-menu-trigger"]',
      userAvatar: '[data-testid="user-avatar"]',
      userName: '[data-testid="user-name"]',
      loginButton: '[data-testid="login-button"]',
      logoutButton: '[data-testid="logout-button"]',
      notificationBell: '[data-testid="notification-bell"]',
      notificationBadge: '[data-testid="notification-badge"]',
      mobileMenuToggle: '[data-testid="mobile-menu-toggle"]',
      dropdown: '[data-testid="header-dropdown"]',
      dropdownItem: '[data-testid="dropdown-item"]',
    };
  }

  // =================================
  // Logo Methods
  // =================================

  /**
   * Click on the logo
   * @returns {HeaderComponent} This component instance for chaining
   */
  clickLogo() {
    this.find(this.selectors.logo).click();
    return this;
  }

  /**
   * Verify logo is displayed
   * @returns {HeaderComponent} This component instance for chaining
   */
  verifyLogoVisible() {
    this.find(this.selectors.logo).should('be.visible');
    return this;
  }

  // =================================
  // Navigation Methods
  // =================================

  /**
   * Get all navigation items
   * @returns {Cypress.Chainable} Navigation items
   */
  getNavItems() {
    return this.findAll(this.selectors.navItem);
  }

  /**
   * Click navigation item by text
   * @param {string} text - Navigation item text
   * @returns {HeaderComponent} This component instance for chaining
   */
  clickNavItem(text) {
    this.find(this.selectors.navMenu).contains(text).click();
    return this;
  }

  /**
   * Click navigation item by index
   * @param {number} index - Navigation item index (0-based)
   * @returns {HeaderComponent} This component instance for chaining
   */
  clickNavItemByIndex(index) {
    this.findAll(this.selectors.navItem).eq(index).click();
    return this;
  }

  /**
   * Verify navigation item is active
   * @param {string} text - Navigation item text
   * @returns {HeaderComponent} This component instance for chaining
   */
  verifyNavItemActive(text) {
    this.find(this.selectors.navMenu)
      .contains(text)
      .should('have.class', 'active');
    return this;
  }

  /**
   * Verify navigation has specific number of items
   * @param {number} count - Expected item count
   * @returns {HeaderComponent} This component instance for chaining
   */
  verifyNavItemCount(count) {
    this.shouldHaveElementCount(this.selectors.navItem, count);
    return this;
  }

  // =================================
  // Search Methods
  // =================================

  /**
   * Perform search
   * @param {string} query - Search query
   * @returns {HeaderComponent} This component instance for chaining
   */
  search(query) {
    this.find(this.selectors.searchInput).clear().type(query);
    this.find(this.selectors.searchButton).click();
    return this;
  }

  /**
   * Type in search input
   * @param {string} query - Search query
   * @returns {HeaderComponent} This component instance for chaining
   */
  typeInSearch(query) {
    this.find(this.selectors.searchInput).clear().type(query);
    return this;
  }

  /**
   * Submit search with Enter key
   * @returns {HeaderComponent} This component instance for chaining
   */
  submitSearch() {
    this.find(this.selectors.searchInput).type('{enter}');
    return this;
  }

  /**
   * Clear search input
   * @returns {HeaderComponent} This component instance for chaining
   */
  clearSearch() {
    this.find(this.selectors.searchInput).clear();
    return this;
  }

  // =================================
  // User Menu Methods
  // =================================

  /**
   * Open user menu dropdown
   * @returns {HeaderComponent} This component instance for chaining
   */
  openUserMenu() {
    this.find(this.selectors.userMenuTrigger).click();
    this.find(this.selectors.userMenu).should('be.visible');
    return this;
  }

  /**
   * Close user menu dropdown
   * @returns {HeaderComponent} This component instance for chaining
   */
  closeUserMenu() {
    // Click outside to close
    cy.get('body').click(0, 0);
    return this;
  }

  /**
   * Get displayed username
   * @returns {Cypress.Chainable<string>} Username text
   */
  getUserName() {
    return this.find(this.selectors.userName).invoke('text');
  }

  /**
   * Verify user is logged in
   * @param {string} [username] - Optional expected username
   * @returns {HeaderComponent} This component instance for chaining
   */
  verifyUserLoggedIn(username) {
    this.find(this.selectors.userMenuTrigger).should('be.visible');
    if (username) {
      this.find(this.selectors.userName).should('contain.text', username);
    }
    return this;
  }

  /**
   * Verify user is logged out
   * @returns {HeaderComponent} This component instance for chaining
   */
  verifyUserLoggedOut() {
    this.find(this.selectors.loginButton).should('be.visible');
    return this;
  }

  /**
   * Click login button
   * @returns {HeaderComponent} This component instance for chaining
   */
  clickLogin() {
    this.find(this.selectors.loginButton).click();
    return this;
  }

  /**
   * Click logout button (opens user menu first)
   * @returns {HeaderComponent} This component instance for chaining
   */
  clickLogout() {
    this.openUserMenu();
    this.find(this.selectors.logoutButton).click();
    return this;
  }

  // =================================
  // Notification Methods
  // =================================

  /**
   * Click notification bell
   * @returns {HeaderComponent} This component instance for chaining
   */
  clickNotifications() {
    this.find(this.selectors.notificationBell).click();
    return this;
  }

  /**
   * Get notification count
   * @returns {Cypress.Chainable<number>} Notification count
   */
  getNotificationCount() {
    return this.find(this.selectors.notificationBadge)
      .invoke('text')
      .then((text) => parseInt(text, 10) || 0);
  }

  /**
   * Verify notification count
   * @param {number} count - Expected notification count
   * @returns {HeaderComponent} This component instance for chaining
   */
  verifyNotificationCount(count) {
    if (count === 0) {
      this.find(this.selectors.notificationBadge).should('not.exist');
    } else {
      this.find(this.selectors.notificationBadge).should('contain.text', count.toString());
    }
    return this;
  }

  /**
   * Verify notification badge is visible
   * @returns {HeaderComponent} This component instance for chaining
   */
  verifyHasNotifications() {
    this.find(this.selectors.notificationBadge).should('be.visible');
    return this;
  }

  // =================================
  // Mobile Menu Methods
  // =================================

  /**
   * Toggle mobile menu
   * @returns {HeaderComponent} This component instance for chaining
   */
  toggleMobileMenu() {
    this.find(this.selectors.mobileMenuToggle).click();
    return this;
  }

  /**
   * Verify mobile menu is open
   * @returns {HeaderComponent} This component instance for chaining
   */
  verifyMobileMenuOpen() {
    this.find(this.selectors.navMenu).should('be.visible');
    return this;
  }

  /**
   * Verify mobile menu is closed
   * @returns {HeaderComponent} This component instance for chaining
   */
  verifyMobileMenuClosed() {
    this.find(this.selectors.navMenu).should('not.be.visible');
    return this;
  }

  // =================================
  // Dropdown Methods
  // =================================

  /**
   * Hover over dropdown trigger
   * @param {string} triggerText - Dropdown trigger text
   * @returns {HeaderComponent} This component instance for chaining
   */
  hoverDropdown(triggerText) {
    this.findByText(triggerText).trigger('mouseover');
    return this;
  }

  /**
   * Click dropdown item
   * @param {string} itemText - Dropdown item text
   * @returns {HeaderComponent} This component instance for chaining
   */
  clickDropdownItem(itemText) {
    this.find(this.selectors.dropdown).contains(itemText).click();
    return this;
  }

  /**
   * Verify dropdown is visible
   * @returns {HeaderComponent} This component instance for chaining
   */
  verifyDropdownVisible() {
    this.find(this.selectors.dropdown).should('be.visible');
    return this;
  }

  // =================================
  // Verification Methods
  // =================================

  /**
   * Verify header is fully loaded
   * @returns {HeaderComponent} This component instance for chaining
   */
  verifyLoaded() {
    this.shouldBeVisible();
    this.find(this.selectors.logo).should('be.visible');
    return this;
  }

  /**
   * Verify header structure
   * @returns {HeaderComponent} This component instance for chaining
   */
  verifyStructure() {
    this.find(this.selectors.logo).should('exist');
    this.find(this.selectors.navMenu).should('exist');
    return this;
  }
}

export default HeaderComponent;
