/**
 * Authentication Custom Commands
 * @description Commands for handling authentication with cy.session() caching
 * @module AuthCommands
 */

/**
 * Login via UI
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {Object} [options] - Login options
 * @param {boolean} [options.rememberMe=false] - Check remember me option
 * @param {boolean} [options.cached=true] - Use session caching
 * @example
 * cy.login('user@example.com', 'password123')
 * cy.login('user@example.com', 'password123', { rememberMe: true })
 */
Cypress.Commands.add('login', (email, password, options = {}) => {
  const { rememberMe = false, cached = true } = options;

  const loginAction = () => {
    cy.visit('/login');

    // Fill login form
    cy.getByTestId('email-input').clear().type(email);
    cy.getByTestId('password-input').clear().type(password, { log: false });

    if (rememberMe) {
      cy.getByTestId('remember-me').check();
    }

    // Submit form (be specific to the form button)
    cy.get('form[data-testid="login-form"]').find('button[data-testid="login-button"]').click();

    // Wait for successful login
    cy.url().should('not.include', '/login');
  };

  if (cached) {
    cy.session(
      ['login', email, rememberMe],
      loginAction,
      {
        validate: () => {
          // Validate session is still valid
          cy.visit('/');
          cy.getByTestId('user-menu-trigger', { timeout: 10000 }).should('exist');
        },
        cacheAcrossSpecs: true,
      }
    );
  } else {
    loginAction();
  }
});

/**
 * Login via API (faster, bypasses UI)
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {Object} [options] - Login options
 * @param {boolean} [options.cached=true] - Use session caching
 * @example
 * cy.loginByApi('user@example.com', 'password123')
 */
Cypress.Commands.add('loginByApi', (email, password, options = {}) => {
  const { cached = true } = options;

  const loginAction = () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/auth/login`,
      body: {
        email,
        password,
      },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(200);

      // Store auth state in Zustand's persisted storage
      const { token, user } = response.body.data || response.body;

      if (token) {
        const authData = {
          state: {
            token,
            user,
            isAuthenticated: true,
          },
          version: 0,
        };
        window.localStorage.setItem('auth-storage', JSON.stringify(authData));
      }

      // Set auth cookie if provided
      if (response.headers['set-cookie']) {
        // Cookies are automatically set
      }
    });
  };

  if (cached) {
    cy.session(
      ['loginByApi', email],
      loginAction,
      {
        validate: () => {
          cy.request({
            method: 'GET',
            url: `${Cypress.env('apiUrl')}/auth/me`,
            failOnStatusCode: false,
          }).its('status').should('eq', 200);
        },
        cacheAcrossSpecs: true,
      }
    );
  } else {
    loginAction();
  }
});

/**
 * Login as standard test user (from env vars)
 * @param {Object} [options] - Login options
 * @example
 * cy.loginAsTestUser()
 */
Cypress.Commands.add('loginAsTestUser', (options = {}) => {
  const email = Cypress.env('testUserEmail');
  const password = Cypress.env('testUserPassword');

  if (!email || !password) {
    throw new Error('Test user credentials not configured. Set CYPRESS_TEST_USER_EMAIL and CYPRESS_TEST_USER_PASSWORD');
  }

  cy.loginByApi(email, password, options);
});

/**
 * Login as admin user (from env vars)
 * @param {Object} [options] - Login options
 * @example
 * cy.loginAsAdmin()
 */
Cypress.Commands.add('loginAsAdmin', (options = {}) => {
  const email = Cypress.env('adminUserEmail');
  const password = Cypress.env('adminUserPassword');

  if (!email || !password) {
    throw new Error('Admin user credentials not configured. Set CYPRESS_ADMIN_USER_EMAIL and CYPRESS_ADMIN_USER_PASSWORD');
  }

  cy.loginByApi(email, password, options);
});

/**
 * Logout user
 * @param {Object} [options] - Logout options
 * @param {boolean} [options.viaApi=true] - Logout via API instead of UI
 * @example
 * cy.logout()
 * cy.logout({ viaApi: false })
 */
Cypress.Commands.add('logout', (options = {}) => {
  const { viaApi = true } = options;

  if (viaApi) {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('apiUrl')}/auth/logout`,
      failOnStatusCode: false,
    });
  } else {
    cy.getByTestId('user-menu-trigger').click();
    cy.getByTestId('logout-button').click();
    cy.url().should('include', '/login');
  }

  // Clear all auth data
  cy.clearLocalStorage();
  cy.clearAllSessionStorage();
  cy.clearCookies();
});

/**
 * Check if user is authenticated
 * @returns {Cypress.Chainable<boolean>} True if authenticated
 * @example
 * cy.isAuthenticated().then(isAuth => { ... })
 */
Cypress.Commands.add('isAuthenticated', () => {
  return cy.window().then((win) => {
    const storageStr = win.localStorage.getItem('auth-storage');
    if (!storageStr) {
      return false;
    }
    try {
      const storage = JSON.parse(storageStr);
      return !!storage.state.token;
    } catch (e) {
      return false;
    }
  });
});

/**
 * Get current user info
 * @returns {Cypress.Chainable<Object|null>} User object or null
 * @example
 * cy.getCurrentUser().then(user => { ... })
 */
Cypress.Commands.add('getCurrentUser', () => {
  return cy.window().then((win) => {
    const storageStr = win.localStorage.getItem('auth-storage');
    if (!storageStr) {
      return null;
    }
    try {
      const storage = JSON.parse(storageStr);
      return storage.state.user || null;
    } catch (e) {
      return null;
    }
  });
});

/**
 * Verify user is logged in
 * @param {string} [expectedEmail] - Optional expected email
 * @example
 * cy.verifyLoggedIn()
 * cy.verifyLoggedIn('user@example.com')
 */
Cypress.Commands.add('verifyLoggedIn', (expectedEmail) => {
  cy.getByTestId('user-menu-trigger').should('be.visible');

  if (expectedEmail) {
    cy.getCurrentUser().then((user) => {
      expect(user.email).to.eq(expectedEmail);
    });
  }
});

/**
 * Verify user is logged out
 * @example
 * cy.verifyLoggedOut()
 */
Cypress.Commands.add('verifyLoggedOut', () => {
  cy.getByTestId('login-button').should('be.visible');
});

/**
 * Clear all session data and authentication
 * @example
 * cy.clearAuth()
 */
Cypress.Commands.add('clearAuth', () => {
  cy.clearLocalStorage();
  cy.clearAllSessionStorage();
  cy.clearAllCookies();
  Cypress.session.clearAllSavedSessions();
});

/**
 * Setup authenticated state with token
 * @param {string} token - Auth token
 * @param {Object} [user] - User object
 * @example
 * cy.setAuthState('token123', { id: 1, email: 'test@example.com' })
 */
Cypress.Commands.add('setAuthState', (token, user = {}) => {
  cy.window().then((win) => {
    const authData = {
      state: {
        token,
        user,
        isAuthenticated: !!token,
      },
      version: 0,
    };
    win.localStorage.setItem('auth-storage', JSON.stringify(authData));
  });
});

/**
 * Login with OAuth provider (cross-origin handling)
 * @param {string} provider - OAuth provider (google, github, etc.)
 * @example
 * cy.loginWithOAuth('google')
 */
Cypress.Commands.add('loginWithOAuth', (provider) => {
  cy.visit('/login');
  cy.getByTestId(`oauth-${provider}`).click();

  // Handle cross-origin OAuth flow
  cy.origin(`https://${provider}.com`, () => {
    // Provider-specific login flow would go here
    // This is a placeholder - actual implementation depends on provider
    cy.log(`OAuth flow for ${provider}`);
  });
});

/**
 * Preserve auth cookies between tests
 * @deprecated Use cy.session() instead
 * @example
 * cy.preserveAuthCookies()
 */
Cypress.Commands.add('preserveAuthCookies', () => {
  cy.log('Warning: preserveAuthCookies is deprecated. Use cy.session() instead.');
  // In Cypress 12+, cookies are preserved by default within a spec
});
