/**
 * ApiClient - Base class for API interactions
 * @description Provides a structured approach to API testing with reusable methods
 * @class
 */
class ApiClient {
  /**
   * Creates an ApiClient instance
   * @param {string} [baseUrl] - Base URL for API (defaults to env apiUrl)
   */
  constructor(baseUrl) {
    this.baseUrl = baseUrl || Cypress.env('apiUrl');
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    this.authToken = null;
  }

  // =================================
  // Configuration Methods
  // =================================

  /**
   * Set authorization token
   * @param {string} token - Auth token
   * @returns {ApiClient} This client instance
   */
  setAuthToken(token) {
    this.authToken = token;
    return this;
  }

  /**
   * Get auth token from local storage
   * @returns {ApiClient} This client instance
   */
  useStoredAuth() {
    cy.window().then((win) => {
      this.authToken = win.localStorage.getItem('authToken');
    });
    return this;
  }

  /**
   * Set default headers
   * @param {Object} headers - Headers to set
   * @returns {ApiClient} This client instance
   */
  setDefaultHeaders(headers) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
    return this;
  }

  /**
   * Get request headers
   * @param {Object} [customHeaders] - Additional headers
   * @returns {Object} Merged headers
   * @private
   */
  _getHeaders(customHeaders = {}) {
    const headers = { ...this.defaultHeaders, ...customHeaders };

    if (this.authToken) {
      headers.Authorization = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Build full URL
   * @param {string} endpoint - API endpoint
   * @returns {string} Full URL
   * @private
   */
  _buildUrl(endpoint) {
    if (endpoint.startsWith('http')) {
      return endpoint;
    }
    return `${this.baseUrl}${endpoint}`;
  }

  // =================================
  // Request Methods
  // =================================

  /**
   * Make HTTP request
   * @param {Object} options - Request options
   * @returns {Cypress.Chainable} Response
   */
  request(options) {
    const {
      method,
      endpoint,
      body,
      headers = {},
      qs,
      failOnStatusCode = true,
      timeout,
    } = options;

    const requestOptions = {
      method,
      url: this._buildUrl(endpoint),
      headers: this._getHeaders(headers),
      failOnStatusCode,
    };

    if (body) {
      requestOptions.body = body;
    }

    if (qs) {
      requestOptions.qs = qs;
    }

    if (timeout) {
      requestOptions.timeout = timeout;
    }

    return cy.request(requestOptions);
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} [options] - Request options
   * @returns {Cypress.Chainable} Response
   */
  get(endpoint, options = {}) {
    return this.request({ method: 'GET', endpoint, ...options });
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} [options] - Request options
   * @returns {Cypress.Chainable} Response
   */
  post(endpoint, body, options = {}) {
    return this.request({ method: 'POST', endpoint, body, ...options });
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} [options] - Request options
   * @returns {Cypress.Chainable} Response
   */
  put(endpoint, body, options = {}) {
    return this.request({ method: 'PUT', endpoint, body, ...options });
  }

  /**
   * PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} body - Request body
   * @param {Object} [options] - Request options
   * @returns {Cypress.Chainable} Response
   */
  patch(endpoint, body, options = {}) {
    return this.request({ method: 'PATCH', endpoint, body, ...options });
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} [options] - Request options
   * @returns {Cypress.Chainable} Response
   */
  delete(endpoint, options = {}) {
    return this.request({ method: 'DELETE', endpoint, ...options });
  }

  // =================================
  // Resource Methods
  // =================================

  /**
   * Get all resources
   * @param {string} resource - Resource name (e.g., 'users')
   * @param {Object} [params] - Query parameters
   * @returns {Cypress.Chainable} Response
   */
  getAll(resource, params = {}) {
    return this.get(`/${resource}`, { qs: params });
  }

  /**
   * Get single resource by ID
   * @param {string} resource - Resource name
   * @param {string|number} id - Resource ID
   * @returns {Cypress.Chainable} Response
   */
  getById(resource, id) {
    return this.get(`/${resource}/${id}`);
  }

  /**
   * Create resource
   * @param {string} resource - Resource name
   * @param {Object} data - Resource data
   * @returns {Cypress.Chainable} Response
   */
  create(resource, data) {
    return this.post(`/${resource}`, data);
  }

  /**
   * Update resource
   * @param {string} resource - Resource name
   * @param {string|number} id - Resource ID
   * @param {Object} data - Update data
   * @returns {Cypress.Chainable} Response
   */
  update(resource, id, data) {
    return this.put(`/${resource}/${id}`, data);
  }

  /**
   * Partial update resource
   * @param {string} resource - Resource name
   * @param {string|number} id - Resource ID
   * @param {Object} data - Update data
   * @returns {Cypress.Chainable} Response
   */
  partialUpdate(resource, id, data) {
    return this.patch(`/${resource}/${id}`, data);
  }

  /**
   * Delete resource
   * @param {string} resource - Resource name
   * @param {string|number} id - Resource ID
   * @returns {Cypress.Chainable} Response
   */
  remove(resource, id) {
    return this.delete(`/${resource}/${id}`);
  }

  // =================================
  // Auth Methods
  // =================================

  /**
   * Login and store token
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Cypress.Chainable} Response
   */
  login(email, password) {
    return this.post('/auth/login', { email, password }).then((response) => {
      if (response.body.token) {
        this.authToken = response.body.token;
      }
      return response;
    });
  }

  /**
   * Logout
   * @returns {Cypress.Chainable} Response
   */
  logout() {
    return this.post('/auth/logout', {}).then((response) => {
      this.authToken = null;
      return response;
    });
  }

  /**
   * Get current user
   * @returns {Cypress.Chainable} Response
   */
  getCurrentUser() {
    return this.get('/auth/me');
  }

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Cypress.Chainable} Response
   */
  register(userData) {
    return this.post('/auth/register', userData);
  }

  // =================================
  // Assertion Helpers
  // =================================

  /**
   * Assert response status
   * @param {Cypress.Chainable} response - Cypress response
   * @param {number} expectedStatus - Expected status code
   * @returns {Cypress.Chainable} Response
   */
  expectStatus(response, expectedStatus) {
    return response.then((res) => {
      expect(res.status).to.eq(expectedStatus);
      return res;
    });
  }

  /**
   * Assert response body has property
   * @param {Cypress.Chainable} response - Cypress response
   * @param {string} property - Property name
   * @param {*} [value] - Expected value
   * @returns {Cypress.Chainable} Response
   */
  expectProperty(response, property, value) {
    return response.then((res) => {
      if (value !== undefined) {
        expect(res.body).to.have.property(property, value);
      } else {
        expect(res.body).to.have.property(property);
      }
      return res;
    });
  }

  /**
   * Assert response body matches schema
   * @param {Cypress.Chainable} response - Cypress response
   * @param {string[]} requiredFields - Required field names
   * @returns {Cypress.Chainable} Response
   */
  expectSchema(response, requiredFields) {
    return response.then((res) => {
      requiredFields.forEach((field) => {
        expect(res.body).to.have.property(field);
      });
      return res;
    });
  }

  // =================================
  // Batch Operations
  // =================================

  /**
   * Create multiple resources
   * @param {string} resource - Resource name
   * @param {Object[]} items - Array of items to create
   * @returns {Cypress.Chainable} Array of created items
   */
  createMany(resource, items) {
    const results = [];

    items.forEach((item) => {
      this.create(resource, item).then((response) => {
        results.push(response.body);
      });
    });

    return cy.wrap(results);
  }

  /**
   * Delete multiple resources
   * @param {string} resource - Resource name
   * @param {Array<string|number>} ids - Array of IDs to delete
   * @returns {Cypress.Chainable} Completion indicator
   */
  deleteMany(resource, ids) {
    ids.forEach((id) => {
      this.remove(resource, id);
    });

    return cy.wrap(true);
  }

  // =================================
  // Static Factory
  // =================================

  /**
   * Create new API client instance
   * @param {string} [baseUrl] - Base URL
   * @returns {ApiClient} New client instance
   */
  static create(baseUrl) {
    return new ApiClient(baseUrl);
  }

  /**
   * Create authenticated client
   * @param {string} token - Auth token
   * @param {string} [baseUrl] - Base URL
   * @returns {ApiClient} Authenticated client
   */
  static withAuth(token, baseUrl) {
    return new ApiClient(baseUrl).setAuthToken(token);
  }
}

// =================================
// Resource-Specific Clients
// =================================

/**
 * UsersApiClient - Client for user-related API operations
 * @extends ApiClient
 */
class UsersApiClient extends ApiClient {
  constructor(baseUrl) {
    super(baseUrl);
    this.resource = 'users';
  }

  getAll(params) {
    return super.getAll(this.resource, params);
  }

  getById(id) {
    return super.getById(this.resource, id);
  }

  create(userData) {
    return super.create(this.resource, userData);
  }

  update(id, userData) {
    return super.update(this.resource, id, userData);
  }

  delete(id) {
    return super.remove(this.resource, id);
  }

  search(query) {
    return this.get(`/${this.resource}/search`, { qs: { q: query } });
  }

  getByEmail(email) {
    return this.get(`/${this.resource}`, { qs: { email } });
  }
}

// =================================
// Exports
// =================================

export {
  ApiClient,
  UsersApiClient,
};
