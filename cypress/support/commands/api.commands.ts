/**
 * API Custom Commands
 * @description Commands for API interactions, mocking, and intercepts
 * @module APICommands
 */

// =================================
// Request Commands
// =================================

/**
 * Make authenticated API request
 * @param {Object} options - Request options
 * @param {string} options.method - HTTP method
 * @param {string} options.url - Request URL (relative to apiUrl or absolute)
 * @param {Object} [options.body] - Request body
 * @param {Object} [options.headers] - Additional headers
 * @param {Object} [options.qs] - Query string parameters
 * @returns {Cypress.Chainable} Response
 * @example
 * cy.apiRequest({ method: 'GET', url: '/users' })
 * cy.apiRequest({ method: 'POST', url: '/users', body: { name: 'John' } })
 */
Cypress.Commands.add('apiRequest', (options) => {
  const {
    method,
    url,
    body,
    headers = {},
    qs,
    failOnStatusCode = true,
  } = options;

  // Build full URL
  const baseUrl = Cypress.env('apiUrl');
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

  // Get auth token from Cypress env (set by loginByApi)
  const token = Cypress.env('authToken');
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  return cy.request({
    method,
    url: fullUrl,
    body,
    qs,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
    failOnStatusCode,
  });
});

/**
 * Make GET request
 * @param {string} url - Request URL
 * @param {Object} [options] - Additional options
 * @returns {Cypress.Chainable} Response
 * @example
 * cy.apiGet('/users')
 * cy.apiGet('/users', { qs: { page: 1 } })
 */
Cypress.Commands.add('apiGet', (url, options = {}) => {
  return cy.apiRequest({ method: 'GET', url, ...options });
});

/**
 * Make POST request
 * @param {string} url - Request URL
 * @param {Object} body - Request body
 * @param {Object} [options] - Additional options
 * @returns {Cypress.Chainable} Response
 * @example
 * cy.apiPost('/users', { name: 'John' })
 */
Cypress.Commands.add('apiPost', (url, body, options = {}) => {
  return cy.apiRequest({ method: 'POST', url, body, ...options });
});

/**
 * Make PUT request
 * @param {string} url - Request URL
 * @param {Object} body - Request body
 * @param {Object} [options] - Additional options
 * @returns {Cypress.Chainable} Response
 * @example
 * cy.apiPut('/users/1', { name: 'Jane' })
 */
Cypress.Commands.add('apiPut', (url, body, options = {}) => {
  return cy.apiRequest({ method: 'PUT', url, body, ...options });
});

/**
 * Make PATCH request
 * @param {string} url - Request URL
 * @param {Object} body - Request body
 * @param {Object} [options] - Additional options
 * @returns {Cypress.Chainable} Response
 * @example
 * cy.apiPatch('/users/1', { status: 'active' })
 */
Cypress.Commands.add('apiPatch', (url, body, options = {}) => {
  return cy.apiRequest({ method: 'PATCH', url, body, ...options });
});

/**
 * Make DELETE request
 * @param {string} url - Request URL
 * @param {Object} [options] - Additional options
 * @returns {Cypress.Chainable} Response
 * @example
 * cy.apiDelete('/users/1')
 */
Cypress.Commands.add('apiDelete', (url, options = {}) => {
  return cy.apiRequest({ method: 'DELETE', url, ...options });
});

// =================================
// Intercept Commands
// =================================

/**
 * Intercept API request with alias
 * @param {string} method - HTTP method
 * @param {string|RegExp} url - URL pattern to match
 * @param {string} alias - Alias name (without @)
 * @param {Object} [response] - Optional mock response
 * @example
 * cy.interceptApi('GET', '/users', 'getUsers')
 * cy.interceptApi('POST', '/users', 'createUser', { statusCode: 201, body: { id: 1 } })
 */
Cypress.Commands.add('interceptApi', (method, url, alias, response) => {
  const routeMatcher = {
    method,
    url: typeof url === 'string' && !url.startsWith('http')
      ? new RegExp(`${Cypress.env('apiUrl').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}${url}`)
      : url,
  };

  if (response) {
    cy.intercept(routeMatcher, response).as(alias);
  } else {
    cy.intercept(routeMatcher).as(alias);
  }
});

/**
 * Mock API response with fixture
 * @param {string} method - HTTP method
 * @param {string|RegExp} url - URL pattern
 * @param {string} fixturePath - Path to fixture file
 * @param {string} alias - Alias name
 * @param {Object} [options] - Additional options
 * @example
 * cy.mockApi('GET', '/users', 'api/users.json', 'getUsers')
 */
Cypress.Commands.add('mockApi', (method, url, fixturePath, alias, options = {}) => {
  const { statusCode = 200, delay = 0, headers = {} } = options;

  cy.intercept(
    { method, url },
    {
      statusCode,
      fixture: fixturePath,
      delay,
      headers,
    }
  ).as(alias);
});

/**
 * Mock API error response
 * @param {string} method - HTTP method
 * @param {string|RegExp} url - URL pattern
 * @param {number} statusCode - Error status code
 * @param {string} alias - Alias name
 * @param {Object} [body] - Error response body
 * @example
 * cy.mockApiError('POST', '/users', 400, 'createUserError', { message: 'Validation failed' })
 */
Cypress.Commands.add('mockApiError', (method, url, statusCode, alias, body = {}) => {
  cy.intercept(
    { method, url },
    {
      statusCode,
      body: {
        error: true,
        ...body,
      },
    }
  ).as(alias);
});

/**
 * Mock network error
 * @param {string} method - HTTP method
 * @param {string|RegExp} url - URL pattern
 * @param {string} alias - Alias name
 * @example
 * cy.mockNetworkError('GET', '/users', 'networkError')
 */
Cypress.Commands.add('mockNetworkError', (method, url, alias) => {
  cy.intercept({ method, url }, { forceNetworkError: true }).as(alias);
});

/**
 * Mock slow API response
 * @param {string} method - HTTP method
 * @param {string|RegExp} url - URL pattern
 * @param {number} delay - Delay in milliseconds
 * @param {string} alias - Alias name
 * @param {Object} [response] - Response to return after delay
 * @example
 * cy.mockSlowApi('GET', '/users', 3000, 'slowUsers')
 */
Cypress.Commands.add('mockSlowApi', (method, url, delay, alias, response = {}) => {
  cy.intercept(
    { method, url },
    {
      delay,
      body: response.body || {},
      statusCode: response.statusCode || 200,
    }
  ).as(alias);
});

// =================================
// Wait Commands
// =================================

/**
 * Wait for API request and verify response
 * @param {string} alias - Request alias (without @)
 * @param {Object} [expectations] - Response expectations
 * @returns {Cypress.Chainable} Intercepted request
 * @example
 * cy.waitForApi('getUsers', { statusCode: 200 })
 * cy.waitForApi('createUser').its('response.body').should('have.property', 'id')
 */
Cypress.Commands.add('waitForApi', (alias, expectations = {}) => {
  const { statusCode, timeout = Cypress.config('defaultCommandTimeout') } = expectations;

  const chain = cy.wait(`@${alias}`, { timeout });

  if (statusCode) {
    chain.its('response.statusCode').should('eq', statusCode);
  }

  return chain;
});

/**
 * Wait for multiple API requests
 * @param {string[]} aliases - Array of aliases (without @)
 * @param {number} [timeout] - Custom timeout
 * @returns {Cypress.Chainable} Intercepted requests
 * @example
 * cy.waitForApis(['getUsers', 'getProducts', 'getOrders'])
 */
Cypress.Commands.add('waitForApis', (aliases, timeout = Cypress.config('defaultCommandTimeout')) => {
  const prefixedAliases = aliases.map(alias => `@${alias}`);
  return cy.wait(prefixedAliases, { timeout });
});

// =================================
// Response Assertion Commands
// =================================

/**
 * Verify API response status
 * @param {number} expectedStatus - Expected status code
 * @returns {Cypress.Chainable} Response
 * @example
 * cy.apiGet('/users').shouldHaveStatus(200)
 */
Cypress.Commands.add('shouldHaveStatus', { prevSubject: true }, (subject, expectedStatus) => {
  expect(subject.status).to.eq(expectedStatus);
  return cy.wrap(subject);
});

/**
 * Verify API response contains property
 * @param {string} property - Property name
 * @param {*} [value] - Optional expected value
 * @returns {Cypress.Chainable} Response
 * @example
 * cy.apiGet('/users/1').shouldHaveProperty('name')
 * cy.apiGet('/users/1').shouldHaveProperty('name', 'John')
 */
Cypress.Commands.add('shouldHaveProperty', { prevSubject: true }, (subject, property, value) => {
  // Check if response has a 'data' wrapper (common API pattern)
  const bodyToCheck = subject.body.data !== undefined ? subject.body.data : subject.body;

  if (value !== undefined) {
    expect(bodyToCheck).to.have.property(property, value);
  } else {
    expect(bodyToCheck).to.have.property(property);
  }
  return cy.wrap(subject);
});

/**
 * Verify API response array length
 * @param {number} length - Expected array length
 * @returns {Cypress.Chainable} Response
 * @example
 * cy.apiGet('/users').shouldHaveLength(10)
 */
Cypress.Commands.add('shouldHaveLength', { prevSubject: true }, (subject, length) => {
  expect(subject.body).to.have.length(length);
  return cy.wrap(subject);
});

// =================================
// Data Setup Commands
// =================================

/**
 * Create test data via API
 * @param {string} endpoint - API endpoint
 * @param {Object} data - Data to create
 * @param {string} [alias] - Optional alias for created data
 * @returns {Cypress.Chainable} Created data
 * @example
 * cy.createTestData('/users', { name: 'John' }, 'testUser')
 */
Cypress.Commands.add('createTestData', (endpoint, data, alias) => {
  return cy.apiPost(endpoint, data).then((response) => {
    expect(response.status).to.be.oneOf([200, 201]);

    // Extract data from response (handle both { data: ... } and direct response)
    const result = response.body.data !== undefined ? response.body.data : response.body;

    // Handle nested entity keys (e.g., { product: {...} }, { user: {...} }, { item: {...} })
    const finalResult = result.product || result.user || result.item || result.order || result;

    if (alias) {
      cy.wrap(finalResult).as(alias);
    }

    return cy.wrap(finalResult);
  });
});

/**
 * Delete test data via API
 * @param {string} endpoint - API endpoint with ID
 * @returns {Cypress.Chainable} Response
 * @example
 * cy.deleteTestData('/users/123')
 */
Cypress.Commands.add('deleteTestData', (endpoint) => {
  return cy.apiDelete(endpoint, { failOnStatusCode: false });
});

/**
 * Clean up test data
 * @param {string} endpoint - API endpoint
 * @param {string} idField - Field name containing ID
 * @param {string|string[]} ids - ID(s) to delete
 * @example
 * cy.cleanupTestData('/users', 'id', ['1', '2', '3'])
 */
Cypress.Commands.add('cleanupTestData', (endpoint, idField, ids) => {
  const idsArray = Array.isArray(ids) ? ids : [ids];

  idsArray.forEach((id) => {
    cy.apiDelete(`${endpoint}/${id}`, { failOnStatusCode: false });
  });
});

// =================================
// GraphQL Commands
// =================================

/**
 * Make GraphQL query
 * @param {string} query - GraphQL query string
 * @param {Object} [variables] - Query variables
 * @returns {Cypress.Chainable} Response
 * @example
 * cy.graphqlQuery('query GetUser($id: ID!) { user(id: $id) { name } }', { id: 1 })
 */
Cypress.Commands.add('graphqlQuery', (query, variables = {}, options = {}) => {
  return cy.apiPost('/graphql', { query, variables }, options);
});

/**
 * Make GraphQL mutation
 * @param {string} mutation - GraphQL mutation string
 * @param {Object} [variables] - Mutation variables
 * @param {Object} [options] - Request options
 * @returns {Cypress.Chainable} Response
 * @example
 * cy.graphqlMutation('mutation CreateUser($input: UserInput!) { createUser(input: $input) { id } }', { input: { name: 'John' } })
 */
Cypress.Commands.add('graphqlMutation', (mutation, variables = {}, options = {}) => {
  return cy.apiPost('/graphql', { query: mutation, variables }, options);
});

/**
 * Intercept GraphQL operation
 * @param {string} operationName - GraphQL operation name
 * @param {string} alias - Alias name
 * @param {Object} [response] - Mock response
 * @example
 * cy.interceptGraphql('GetUsers', 'getUsers')
 * cy.interceptGraphql('CreateUser', 'createUser', { data: { createUser: { id: 1 } } })
 */
Cypress.Commands.add('interceptGraphql', (operationName, alias, response) => {
  const interceptOptions = {
    method: 'POST',
    url: '**/graphql',
  };

  if (response) {
    cy.intercept(interceptOptions, (req) => {
      if (req.body.operationName === operationName) {
        req.reply({ body: response });
      }
    }).as(alias);
  } else {
    cy.intercept(interceptOptions, (req) => {
      if (req.body.operationName === operationName) {
        req.alias = alias;
      }
    });
  }
});

// =================================
// Health Check Commands
// =================================

/**
 * Check API health
 * @param {string} [endpoint='/health'] - Health check endpoint
 * @returns {Cypress.Chainable<boolean>} True if healthy
 * @example
 * cy.checkApiHealth().then(isHealthy => { ... })
 */
Cypress.Commands.add('checkApiHealth', (endpoint = '/health') => {
  return cy.apiGet(endpoint, { failOnStatusCode: false }).then((response) => {
    return response.status === 200;
  });
});

/**
 * Wait for API to be ready
 * @param {string} [endpoint='/health'] - Health check endpoint
 * @param {number} [maxAttempts=10] - Max retry attempts
 * @param {number} [interval=1000] - Retry interval in ms
 * @example
 * cy.waitForApiReady()
 */
Cypress.Commands.add('waitForApiReady', (endpoint = '/health', maxAttempts = 10, interval = 1000) => {
  let attempts = 0;

  const checkHealth = () => {
    attempts++;
    return cy.request({
      method: 'GET',
      url: `${Cypress.env('apiUrl')}${endpoint}`,
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 200) {
        return true;
      }

      if (attempts < maxAttempts) {
        cy.wait(interval);
        return checkHealth();
      }

      throw new Error(`API not ready after ${maxAttempts} attempts`);
    });
  };

  return checkHealth();
});
