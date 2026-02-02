/**
 * Routes Constants
 * @description Centralized URL paths for application navigation
 * @module Routes
 */

/**
 * Application routes (frontend paths)
 */
export const APP = {
  // Home
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',

  // Authentication
  AUTH: {
    LOGIN: '/login',
    LOGOUT: '/logout',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    RESET_PASSWORD_TOKEN: (token) => `/reset-password/${token}`,
    VERIFY_EMAIL: '/verify-email',
    TWO_FACTOR: '/two-factor',
  },

  // Dashboard
  DASHBOARD: {
    HOME: '/dashboard',
    ANALYTICS: '/dashboard/analytics',
    REPORTS: '/dashboard/reports',
    WIDGETS: '/dashboard/widgets',
  },

  // User
  USER: {
    PROFILE: '/profile',
    SETTINGS: '/settings',
    PREFERENCES: '/settings/preferences',
    SECURITY: '/settings/security',
    NOTIFICATIONS: '/settings/notifications',
  },

  // E-Commerce Products
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (slug) => `/products/${slug}`,
    SEARCH: '/search',
  },

  // E-Commerce Categories
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (slug) => `/category/${slug}`,
  },

  // E-Commerce Cart
  CART: '/cart',

  // E-Commerce Checkout
  CHECKOUT: '/checkout',

  // E-Commerce Orders
  ORDERS: {
    LIST: '/orders',
    DETAIL: (id) => `/orders/${id}`,
    CONFIRMATION: (id) => `/orders/${id}/confirmation`,
  },

  // Admin
  ADMIN: {
    HOME: '/admin',
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    USERS: '/admin/users',
    CATEGORIES: '/admin/categories',
    SETTINGS: '/admin/settings',
    LOGS: '/admin/logs',
    SYSTEM: '/admin/system',
  },

  // Legacy Users routes (for admin)
  USERS: {
    LIST: '/users',
    CREATE: '/users/new',
    DETAIL: (id) => `/users/${id}`,
    EDIT: (id) => `/users/${id}/edit`,
  },

  // Error pages
  ERROR: {
    NOT_FOUND: '/404',
    SERVER_ERROR: '/500',
    UNAUTHORIZED: '/401',
    FORBIDDEN: '/403',
  },

  // Help
  HELP: {
    HOME: '/help',
    FAQ: '/help/faq',
    DOCS: '/help/docs',
    SUPPORT: '/help/support',
  },
};

/**
 * API routes (backend endpoints)
 */
export const API = {
  // Version prefix
  PREFIX: '/api/v1',

  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    ME_UPDATE: '/auth/me',
    ME_PASSWORD: '/auth/me/password',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
    CHANGE_PASSWORD: '/auth/change-password',
    TWO_FACTOR: {
      SETUP: '/auth/2fa/setup',
      VERIFY: '/auth/2fa/verify',
      DISABLE: '/auth/2fa/disable',
    },
  },

  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
    SEARCH: '/users/search',
    PROFILE: (id) => `/users/${id}/profile`,
    AVATAR: (id) => `/users/${id}/avatar`,
    PREFERENCES: (id) => `/users/${id}/preferences`,
  },

  // Products
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id) => `/products/${id}`,
    BY_SLUG: (slug) => `/products/${slug}`,
    FEATURED: '/products/featured',
    SEARCH: '/products/search',
    REVIEWS: (id) => `/products/${id}/reviews`,
    ADD_REVIEW: (id) => `/products/${id}/reviews`,
  },

  // Categories
  CATEGORIES: {
    BASE: '/categories',
    BY_ID: (id) => `/categories/${id}`,
    BY_SLUG: (slug) => `/categories/${slug}`,
    PRODUCTS: (slug) => `/categories/${slug}/products`,
  },

  // Cart
  CART: {
    BASE: '/cart',
    ADD: '/cart',
    UPDATE: (itemId) => `/cart/${itemId}`,
    REMOVE: (itemId) => `/cart/${itemId}`,
    CLEAR: '/cart',
  },

  // Orders
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id) => `/orders/${id}`,
    CREATE: '/orders',
    CANCEL: (id) => `/orders/${id}/cancel`,
    USER_ORDERS: (userId) => `/users/${userId}/orders`,
    STATUS: (id) => `/orders/${id}/status`,
    ADMIN: '/orders/admin',
    ADMIN_UPDATE_STATUS: (id) => `/orders/admin/${id}/status`,
  },

  // Payments
  PAYMENTS: {
    PROCESS: '/payments/process',
    METHODS: '/payments/methods',
  },

  // Common endpoints
  COMMON: {
    HEALTH: '/health',
    STATUS: '/status',
    VERSION: '/version',
    CONFIG: '/config',
  },

  // File operations
  FILES: {
    UPLOAD: '/files/upload',
    DOWNLOAD: (id) => `/files/${id}/download`,
    DELETE: (id) => `/files/${id}`,
  },

  // Notifications
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id) => `/notifications/${id}`,
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
  },

  // Admin
  ADMIN: {
    USERS: '/admin/users',
    PRODUCTS: '/admin/products',
    ORDERS: '/admin/orders',
    CATEGORIES: '/admin/categories',
    SETTINGS: '/admin/settings',
    LOGS: '/admin/logs',
    STATS: '/admin/stats',
  },
};

/**
 * External URLs
 */
export const EXTERNAL = {
  DOCUMENTATION: 'https://docs.example.com',
  SUPPORT: 'https://support.example.com',
  PRIVACY_POLICY: 'https://example.com/privacy',
  TERMS_OF_SERVICE: 'https://example.com/terms',
  STATUS_PAGE: 'https://status.example.com',
  GITHUB: 'https://github.com/example',
  TWITTER: 'https://twitter.com/example',
};

/**
 * OAuth callback routes
 */
export const OAUTH = {
  CALLBACK: {
    GOOGLE: '/auth/callback/google',
    GITHUB: '/auth/callback/github',
    FACEBOOK: '/auth/callback/facebook',
    LINKEDIN: '/auth/callback/linkedin',
  },
  PROVIDERS: {
    GOOGLE: 'https://accounts.google.com/o/oauth2/v2/auth',
    GITHUB: 'https://github.com/login/oauth/authorize',
    FACEBOOK: 'https://www.facebook.com/v12.0/dialog/oauth',
  },
};

/**
 * Helper function to build URL with query params
 * @param {string} path - Base path
 * @param {Object} params - Query parameters
 * @returns {string} Complete URL with query string
 */
const withParams = (path, params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return queryString ? `${path}?${queryString}` : path;
};

/**
 * Helper function to build API URL
 * @param {string} endpoint - API endpoint
 * @returns {string} Complete API URL
 */
const apiUrl = (endpoint) => {
  return `${API.PREFIX}${endpoint}`;
};

/**
 * Helper to check if path matches route
 * @param {string} currentPath - Current URL path
 * @param {string} route - Route to check against
 * @returns {boolean} True if paths match
 */
const matchesRoute = (currentPath, route) => {
  const routePattern = route.replace(/:\w+/g, '[^/]+');
  const regex = new RegExp(`^${routePattern}$`);
  return regex.test(currentPath);
};

// =================================
// Exports
// =================================

export {
  APP,
  API,
  EXTERNAL,
  OAUTH,
  withParams,
  apiUrl,
  matchesRoute,
};
