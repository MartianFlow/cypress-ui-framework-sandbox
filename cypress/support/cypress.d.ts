/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to login as test user
     * @example cy.loginAsTestUser()
     */
    loginAsTestUser(): Chainable<void>;

    /**
     * Custom command to login as admin user
     * @example cy.loginAsAdminUser()
     */
    loginAsAdminUser(): Chainable<void>;

    /**
     * Custom command to login as admin user
     * @example cy.loginAsAdmin()
     */
    loginAsAdmin(options?: { cached?: boolean }): Chainable<void>;

    /**
     * Custom command to login via UI
     * @example cy.login('email@test.com', 'password123')
     */
    login(email: string, password: string, options?: { rememberMe?: boolean; cached?: boolean }): Chainable<void>;

    /**
     * Custom command to login via API
     * @example cy.loginByApi('email@test.com', 'password123')
     */
    loginByApi(email: string, password: string, options?: { cached?: boolean }): Chainable<void>;

    /**
     * Custom command to login with credentials
     * @example cy.loginWithCredentials('email@test.com', 'password')
     */
    loginWithCredentials(email: string, password: string): Chainable<void>;

    /**
     * Custom command to get current user info
     * @example cy.getCurrentUser()
     */
    getCurrentUser(): Chainable<any>;

    /**
     * Custom command to verify user is logged in
     * @example cy.verifyLoggedIn('user@example.com')
     */
    verifyLoggedIn(expectedEmail?: string): Chainable<void>;

    /**
     * Custom command to verify user is logged out
     * @example cy.verifyLoggedOut()
     */
    verifyLoggedOut(): Chainable<void>;

    /**
     * Custom command to set auth state
     * @example cy.setAuthState('token123', { id: 1, email: 'test@example.com' })
     */
    setAuthState(token: string, user?: any): Chainable<void>;

    /**
     * Custom command to login with OAuth
     * @example cy.loginWithOAuth('google')
     */
    loginWithOAuth(provider: string): Chainable<void>;

    /**
     * Custom command to preserve auth cookies
     * @deprecated Use cy.session() instead
     * @example cy.preserveAuthCookies()
     */
    preserveAuthCookies(): Chainable<void>;

    /**
     * Custom command to clear authentication
     * @example cy.clearAuth()
     */
    clearAuth(): Chainable<void>;

    /**
     * Custom command to get auth token
     * @example cy.getAuthToken()
     */
    getAuthToken(): Chainable<string>;

    /**
     * Custom command to set auth token
     * @example cy.setAuthToken('token')
     */
    setAuthToken(token: string): Chainable<void>;

    /**
     * Custom command to check if user is authenticated
     * @example cy.isAuthenticated()
     */
    isAuthenticated(): Chainable<boolean>;

    /**
     * Custom command to logout
     * @example cy.logout()
     */
    logout(): Chainable<void>;

    /**
     * Custom command to make API GET request
     * @example cy.apiGet('/products')
     */
    apiGet(url: string, options?: Partial<Cypress.RequestOptions>): Chainable<Cypress.Response<any>>;

    /**
     * Custom command to make API POST request
     * @example cy.apiPost('/products', { name: 'Product' })
     */
    apiPost(url: string, body?: any, options?: Partial<Cypress.RequestOptions>): Chainable<Cypress.Response<any>>;

    /**
     * Custom command to make API PUT request
     * @example cy.apiPut('/products/1', { name: 'Updated' })
     */
    apiPut(url: string, body?: any, options?: Partial<Cypress.RequestOptions>): Chainable<Cypress.Response<any>>;

    /**
     * Custom command to make API PATCH request
     * @example cy.apiPatch('/products/1', { name: 'Updated' })
     */
    apiPatch(url: string, body?: any, options?: Partial<Cypress.RequestOptions>): Chainable<Cypress.Response<any>>;

    /**
     * Custom command to make API DELETE request
     * @example cy.apiDelete('/products/1')
     */
    apiDelete(url: string, options?: Partial<Cypress.RequestOptions>): Chainable<Cypress.Response<any>>;

    /**
     * Custom command to wait for element to be visible
     * @example cy.waitForVisible('[data-testid="element"]')
     */
    waitForVisible(selector: string, timeout?: number): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to wait for element to disappear
     * @example cy.waitForDisappear('[data-testid="loading"]')
     */
    waitForDisappear(selector: string, timeout?: number): Chainable<void>;

    /**
     * Custom command to click element with force
     * @example cy.clickForce('[data-testid="button"]')
     */
    clickForce(selector: string): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to type with delay
     * @example cy.typeWithDelay('[data-testid="input"]', 'text', 100)
     */
    typeWithDelay(selector: string, text: string, delay?: number): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to scroll to element
     * @example cy.scrollToElement('[data-testid="element"]')
     */
    scrollToElement(selector: string): Chainable<JQuery<HTMLElement>>;

    /**
     * Custom command to check if element is in viewport
     * @example cy.isInViewport('[data-testid="element"]')
     */
    isInViewport(selector: string): Chainable<boolean>;

    /**
     * Custom command to wait for network idle
     * @example cy.waitForNetworkIdle(500)
     */
    waitForNetworkIdle(timeout?: number): Chainable<void>;

    /**
     * Custom command to intercept and mock API response
     * @example cy.mockApiResponse('/products', { fixture: 'products.json' })
     */
    mockApiResponse(url: string, response: any): Chainable<void>;

    /**
     * Custom command to clear all cookies and local storage
     * @example cy.clearAll()
     */
    clearAll(): Chainable<void>;

    /**
     * Custom command to take screenshot with timestamp
     * @example cy.screenshotWithTimestamp('test-name')
     */
    screenshotWithTimestamp(name: string): Chainable<void>;

    /**
     * Custom command to set local storage item
     * @example cy.setLocalStorage('key', 'value')
     */
    setLocalStorage(key: string, value: string): Chainable<void>;

    /**
     * Custom command to get local storage item
     * @example cy.getLocalStorage('key')
     */
    getLocalStorage(key: string): Chainable<string | null>;
  }

  interface Cypress {
    testUtils: {
      randomString(length?: number): string;
      randomEmail(domain?: string): string;
      randomNumber(min?: number, max?: number): number;
      formatDate(date?: Date, format?: string): string;
    };
  }
}
