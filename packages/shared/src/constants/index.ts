// API Endpoints
export const API_BASE_URL = '/api/v1';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    ME: `${API_BASE_URL}/auth/me`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/me/password`,
  },
  // Users (Admin)
  USERS: {
    LIST: `${API_BASE_URL}/users`,
    DETAIL: (id: number) => `${API_BASE_URL}/users/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/users/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/users/${id}`,
  },
  // Products
  PRODUCTS: {
    LIST: `${API_BASE_URL}/products`,
    FEATURED: `${API_BASE_URL}/products/featured`,
    SEARCH: `${API_BASE_URL}/products/search`,
    DETAIL: (id: number) => `${API_BASE_URL}/products/${id}`,
    REVIEWS: (id: number) => `${API_BASE_URL}/products/${id}/reviews`,
    CREATE: `${API_BASE_URL}/products`,
    UPDATE: (id: number) => `${API_BASE_URL}/products/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/products/${id}`,
  },
  // Categories
  CATEGORIES: {
    LIST: `${API_BASE_URL}/categories`,
    DETAIL: (slug: string) => `${API_BASE_URL}/categories/${slug}`,
    PRODUCTS: (slug: string) => `${API_BASE_URL}/categories/${slug}/products`,
  },
  // Cart
  CART: {
    GET: `${API_BASE_URL}/cart`,
    ADD: `${API_BASE_URL}/cart`,
    UPDATE: (itemId: number) => `${API_BASE_URL}/cart/${itemId}`,
    REMOVE: (itemId: number) => `${API_BASE_URL}/cart/${itemId}`,
    CLEAR: `${API_BASE_URL}/cart`,
  },
  // Orders
  ORDERS: {
    LIST: `${API_BASE_URL}/orders`,
    DETAIL: (id: number) => `${API_BASE_URL}/orders/${id}`,
    CREATE: `${API_BASE_URL}/orders`,
    CANCEL: (id: number) => `${API_BASE_URL}/orders/${id}/cancel`,
    ADMIN_LIST: `${API_BASE_URL}/orders/admin`,
    ADMIN_UPDATE_STATUS: (id: number) => `${API_BASE_URL}/orders/admin/${id}/status`,
  },
  // Payments
  PAYMENTS: {
    PROCESS: `${API_BASE_URL}/payments/process`,
    METHODS: `${API_BASE_URL}/payments/methods`,
  },
} as const;

// User roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
} as const;

// User statuses
export const USER_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  LOCKED: 'locked',
} as const;

// Product statuses
export const PRODUCT_STATUSES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
} as const;

// Order statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

// Payment statuses
export const PAYMENT_STATUSES = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
} as const;

// Sort options
export const SORT_OPTIONS = {
  PRICE_ASC: 'price_asc',
  PRICE_DESC: 'price_desc',
  NAME: 'name',
  RATING: 'rating',
  NEWEST: 'newest',
} as const;

// Validation
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 100,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_MAX_LENGTH: 255,
} as const;
