/**
 * Admin Dashboard Page Object
 * Represents the admin dashboard page and its interactions
 */

import BasePage from '../base/BasePage';

export default class AdminDashboardPage extends BasePage {
  constructor() {
    super('/admin');
  }
  // Selectors
  get dashboard() {
    return cy.get('[data-testid="admin-dashboard"]');
  }

  get sidebar() {
    return cy.get('[data-testid="admin-sidebar"]');
  }

  get navDashboard() {
    return cy.get('[data-testid="admin-nav-dashboard"]');
  }

  get navProducts() {
    return cy.get('[data-testid="admin-nav-products"]');
  }

  get navOrders() {
    return cy.get('[data-testid="admin-nav-orders"]');
  }

  get navUsers() {
    return cy.get('[data-testid="admin-nav-users"]');
  }

  get statsTotalRevenue() {
    return cy.get('[data-testid="stats-total-revenue"]');
  }

  get statsTotalOrders() {
    return cy.get('[data-testid="stats-total-orders"]');
  }

  get statsTotalUsers() {
    return cy.get('[data-testid="stats-total-users"]');
  }

  get statsTotalProducts() {
    return cy.get('[data-testid="stats-total-products"]');
  }

  get recentOrders() {
    return cy.get('[data-testid="recent-orders"]');
  }

  get recentActivity() {
    return cy.get('[data-testid="recent-activity"]');
  }

  // Actions
  mockOrders(orders: any[], alias = 'getAdminOrders') {
    cy.intercept('GET', '/api/**/orders/admin*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          data: orders,
          pagination: {
            page: 1,
            pageSize: 5,
            total: orders.length,
            totalPages: Math.ceil(orders.length / 5),
          },
        },
      },
    }).as(alias);
    return this;
  }

  mockUsers(users: any[], alias = 'getAdminUsers') {
    cy.intercept('GET', '/api/**/users*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          data: users,
          pagination: {
            page: 1,
            pageSize: 5,
            total: users.length,
            totalPages: Math.ceil(users.length / 5),
          },
        },
      },
    }).as(alias);
    return this;
  }

  mockDashboardData(orders: any[] = [], users: any[] = []) {
    this.mockOrders(orders);
    this.mockUsers(users);
    return this;
  }

  // Verifications
  verifyPageLoaded() {
    this.dashboard.should('be.visible');
    return this;
  }

  verifySidebarVisible() {
    this.sidebar.should('be.visible');
    this.navDashboard.should('be.visible');
    this.navProducts.should('be.visible');
    this.navOrders.should('be.visible');
    this.navUsers.should('be.visible');
    return this;
  }

  verifyStatsCards() {
    this.statsTotalRevenue.should('be.visible');
    this.statsTotalOrders.should('be.visible');
    this.statsTotalUsers.should('be.visible');
    this.statsTotalProducts.should('be.visible');
    return this;
  }
}
