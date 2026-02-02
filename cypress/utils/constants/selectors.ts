/**
 * Selectors Constants
 * @description Centralized data-testid selectors for all UI elements
 * @module Selectors
 */

/**
 * Authentication page selectors
 */
export const AUTH = {
  // Login page
  LOGIN: {
    PAGE: '[data-testid="login-page"]',
    FORM: '[data-testid="login-form"]',
    EMAIL_INPUT: '[data-testid="email-input"]',
    PASSWORD_INPUT: '[data-testid="password-input"]',
    SUBMIT_BUTTON: 'button[data-testid="login-button"]',
    REMEMBER_ME: '[data-testid="remember-me"]',
    FORGOT_PASSWORD_LINK: '[data-testid="forgot-password-link"]',
    REGISTER_LINK: '[data-testid="register-link"]',
    ERROR_MESSAGE: '[data-testid="login-error"]',
    SUCCESS_MESSAGE: '[data-testid="login-success"]',
    LOADING_SPINNER: '[data-testid="login-loading"]',
    OAUTH_GOOGLE: '[data-testid="oauth-google"]',
    OAUTH_GITHUB: '[data-testid="oauth-github"]',
    OAUTH_FACEBOOK: '[data-testid="oauth-facebook"]',
  },

  // Register page
  REGISTER: {
    PAGE: '[data-testid="register-page"]',
    FORM: '[data-testid="register-form"]',
    FIRST_NAME_INPUT: '[data-testid="first-name-input"]',
    LAST_NAME_INPUT: '[data-testid="last-name-input"]',
    EMAIL_INPUT: '[data-testid="register-email-input"]',
    PASSWORD_INPUT: '[data-testid="register-password-input"]',
    CONFIRM_PASSWORD_INPUT: '[data-testid="confirm-password-input"]',
    TERMS_CHECKBOX: '[data-testid="terms-checkbox"]',
    SUBMIT_BUTTON: '[data-testid="register-button"]',
    LOGIN_LINK: '[data-testid="login-link"]',
    ERROR_MESSAGE: '[data-testid="register-error"]',
    SUCCESS_MESSAGE: '[data-testid="register-success"]',
  },

  // Forgot password
  FORGOT_PASSWORD: {
    PAGE: '[data-testid="forgot-password-page"]',
    EMAIL_INPUT: '[data-testid="forgot-email-input"]',
    SUBMIT_BUTTON: '[data-testid="forgot-submit"]',
    BACK_LINK: '[data-testid="back-to-login"]',
    SUCCESS_MESSAGE: '[data-testid="forgot-success"]',
    ERROR_MESSAGE: '[data-testid="forgot-error"]',
  },

  // Reset password
  RESET_PASSWORD: {
    PAGE: '[data-testid="reset-password-page"]',
    PASSWORD_INPUT: '[data-testid="new-password-input"]',
    CONFIRM_INPUT: '[data-testid="confirm-new-password-input"]',
    SUBMIT_BUTTON: '[data-testid="reset-submit"]',
    SUCCESS_MESSAGE: '[data-testid="reset-success"]',
    ERROR_MESSAGE: '[data-testid="reset-error"]',
  },
};

/**
 * Header and navigation selectors
 */
export const HEADER = {
  ROOT: '[data-testid="header"]',
  LOGO: '[data-testid="header-logo"]',
  NAV_MENU: '[data-testid="nav-menu"]',
  NAV_ITEM: '[data-testid="nav-item"]',
  SEARCH_INPUT: '[data-testid="header-search"]',
  SEARCH_BUTTON: '[data-testid="search-button"]',
  USER_MENU: '[data-testid="user-menu"]',
  USER_MENU_TRIGGER: '[data-testid="user-menu-trigger"]',
  USER_AVATAR: '[data-testid="user-avatar"]',
  USER_NAME: '[data-testid="user-name"]',
  LOGIN_BUTTON: '[data-testid="login-button"]',
  LOGOUT_BUTTON: '[data-testid="logout-button"]',
  NOTIFICATION_BELL: '[data-testid="notification-bell"]',
  NOTIFICATION_BADGE: '[data-testid="notification-badge"]',
  MOBILE_MENU_TOGGLE: '[data-testid="mobile-menu-toggle"]',
  DROPDOWN: '[data-testid="header-dropdown"]',
  DROPDOWN_ITEM: '[data-testid="dropdown-item"]',
};

/**
 * Modal and dialog selectors
 */
export const MODAL = {
  ROOT: '[data-testid="modal"]',
  OVERLAY: '[data-testid="modal-overlay"]',
  CONTENT: '[data-testid="modal-content"]',
  HEADER: '[data-testid="modal-header"]',
  TITLE: '[data-testid="modal-title"]',
  BODY: '[data-testid="modal-body"]',
  FOOTER: '[data-testid="modal-footer"]',
  CLOSE_BUTTON: '[data-testid="modal-close"]',
  CONFIRM_BUTTON: '[data-testid="modal-confirm"]',
  CANCEL_BUTTON: '[data-testid="modal-cancel"]',
  SUBMIT_BUTTON: '[data-testid="modal-submit"]',
  INPUT: '[data-testid="modal-input"]',
  ERROR_MESSAGE: '[data-testid="modal-error"]',
  SUCCESS_MESSAGE: '[data-testid="modal-success"]',
  LOADING_SPINNER: '[data-testid="modal-loading"]',
};

/**
 * Table and data grid selectors
 */
export const TABLE = {
  ROOT: '[data-testid="table"]',
  HEADER: 'thead',
  HEADER_ROW: 'thead tr',
  HEADER_CELL: 'th',
  BODY: 'tbody',
  ROW: 'tbody tr',
  CELL: 'td',
  SORT_ICON: '[data-testid="sort-icon"]',
  CHECKBOX: '[data-testid="row-checkbox"]',
  SELECT_ALL: '[data-testid="select-all"]',
  ACTION_BUTTON: '[data-testid="row-action"]',
  EDIT_BUTTON: '[data-testid="edit-button"]',
  DELETE_BUTTON: '[data-testid="delete-button"]',
  VIEW_BUTTON: '[data-testid="view-button"]',
  PAGINATION: '[data-testid="table-pagination"]',
  PAGE_NUMBER: '[data-testid="page-number"]',
  NEXT_PAGE: '[data-testid="next-page"]',
  PREV_PAGE: '[data-testid="prev-page"]',
  PAGE_SIZE: '[data-testid="page-size"]',
  TOTAL_COUNT: '[data-testid="total-count"]',
  EMPTY_STATE: '[data-testid="table-empty"]',
  LOADING_STATE: '[data-testid="table-loading"]',
  SEARCH_INPUT: '[data-testid="table-search"]',
  FILTER_BUTTON: '[data-testid="table-filter"]',
};

/**
 * Form element selectors
 */
export const FORM = {
  INPUT: '[data-testid="form-input"]',
  TEXTAREA: '[data-testid="form-textarea"]',
  SELECT: '[data-testid="form-select"]',
  CHECKBOX: '[data-testid="form-checkbox"]',
  RADIO: '[data-testid="form-radio"]',
  SWITCH: '[data-testid="form-switch"]',
  DATE_PICKER: '[data-testid="form-date-picker"]',
  FILE_INPUT: '[data-testid="form-file-input"]',
  SUBMIT_BUTTON: '[data-testid="form-submit"]',
  CANCEL_BUTTON: '[data-testid="form-cancel"]',
  RESET_BUTTON: '[data-testid="form-reset"]',
  FIELD_ERROR: '[data-testid="field-error"]',
  FIELD_HINT: '[data-testid="field-hint"]',
  REQUIRED_INDICATOR: '[data-testid="required-indicator"]',
};

/**
 * Common UI component selectors
 */
export const COMMON = {
  LOADING: '[data-testid="loading"]',
  SPINNER: '[data-testid="spinner"]',
  SKELETON: '[data-testid="skeleton"]',
  TOAST: '[data-testid="toast"]',
  TOAST_SUCCESS: '[data-testid="toast-success"]',
  TOAST_ERROR: '[data-testid="toast-error"]',
  TOAST_WARNING: '[data-testid="toast-warning"]',
  TOAST_INFO: '[data-testid="toast-info"]',
  TOAST_CLOSE: '[data-testid="toast-close"]',
  ALERT: '[data-testid="alert"]',
  ALERT_SUCCESS: '[data-testid="alert-success"]',
  ALERT_ERROR: '[data-testid="alert-error"]',
  ALERT_WARNING: '[data-testid="alert-warning"]',
  ALERT_INFO: '[data-testid="alert-info"]',
  BADGE: '[data-testid="badge"]',
  CHIP: '[data-testid="chip"]',
  AVATAR: '[data-testid="avatar"]',
  TOOLTIP: '[data-testid="tooltip"]',
  POPOVER: '[data-testid="popover"]',
  DRAWER: '[data-testid="drawer"]',
  SIDEBAR: '[data-testid="sidebar"]',
  FOOTER: '[data-testid="footer"]',
  BREADCRUMB: '[data-testid="breadcrumb"]',
  TABS: '[data-testid="tabs"]',
  TAB: '[data-testid="tab"]',
  TAB_PANEL: '[data-testid="tab-panel"]',
  ACCORDION: '[data-testid="accordion"]',
  ACCORDION_ITEM: '[data-testid="accordion-item"]',
  CARD: '[data-testid="card"]',
  CARD_HEADER: '[data-testid="card-header"]',
  CARD_BODY: '[data-testid="card-body"]',
  CARD_FOOTER: '[data-testid="card-footer"]',
};

/**
 * Dashboard selectors
 */
export const DASHBOARD = {
  PAGE: '[data-testid="dashboard-page"]',
  WELCOME_MESSAGE: '[data-testid="welcome-message"]',
  STATS_CARD: '[data-testid="stats-card"]',
  CHART: '[data-testid="dashboard-chart"]',
  ACTIVITY_FEED: '[data-testid="activity-feed"]',
  QUICK_ACTIONS: '[data-testid="quick-actions"]',
  WIDGET: '[data-testid="dashboard-widget"]',
};

/**
 * Profile selectors
 */
export const PROFILE = {
  PAGE: '[data-testid="profile-page"]',
  AVATAR: '[data-testid="profile-avatar"]',
  NAME: '[data-testid="profile-name"]',
  EMAIL: '[data-testid="profile-email"]',
  EDIT_BUTTON: '[data-testid="profile-edit"]',
  SAVE_BUTTON: '[data-testid="profile-save"]',
  CANCEL_BUTTON: '[data-testid="profile-cancel"]',
  FIRST_NAME_INPUT: '[data-testid="profile-first-name"]',
  LAST_NAME_INPUT: '[data-testid="profile-last-name"]',
  PHONE_INPUT: '[data-testid="profile-phone"]',
  BIO_INPUT: '[data-testid="profile-bio"]',
  AVATAR_UPLOAD: '[data-testid="avatar-upload"]',
};

/**
 * Settings selectors
 */
export const SETTINGS = {
  PAGE: '[data-testid="settings-page"]',
  SECTION: '[data-testid="settings-section"]',
  THEME_TOGGLE: '[data-testid="theme-toggle"]',
  LANGUAGE_SELECT: '[data-testid="language-select"]',
  NOTIFICATIONS_TOGGLE: '[data-testid="notifications-toggle"]',
  EMAIL_NOTIFICATIONS: '[data-testid="email-notifications"]',
  PUSH_NOTIFICATIONS: '[data-testid="push-notifications"]',
  PRIVACY_SECTION: '[data-testid="privacy-settings"]',
  SECURITY_SECTION: '[data-testid="security-settings"]',
  CHANGE_PASSWORD_BUTTON: '[data-testid="change-password"]',
  DELETE_ACCOUNT_BUTTON: '[data-testid="delete-account"]',
  SAVE_BUTTON: '[data-testid="settings-save"]',
};

/**
 * E-Commerce Product selectors
 */
export const PRODUCTS = {
  // Product List
  LIST: '[data-testid="product-list"]',
  GRID: '[data-testid="products-grid"]',
  CARD: '[data-testid="product-card"]',
  IMAGE: '[data-testid="product-image"]',
  NAME: '[data-testid="product-name"]',
  PRICE: '[data-testid="product-price"]',
  ORIGINAL_PRICE: '[data-testid="product-original-price"]',
  DISCOUNT_BADGE: '[data-testid="discount-badge"]',
  RATING: '[data-testid="product-rating"]',
  RATING_COUNT: '[data-testid="rating-count"]',
  ADD_TO_CART_BUTTON: '[data-testid="add-to-cart"]',
  QUICK_VIEW_BUTTON: '[data-testid="quick-view"]',
  WISHLIST_BUTTON: '[data-testid="add-to-wishlist"]',

  // Product Detail
  DETAIL_PAGE: '[data-testid="product-detail"]',
  GALLERY: '[data-testid="product-gallery"]',
  GALLERY_MAIN: '[data-testid="gallery-main-image"]',
  GALLERY_THUMBNAILS: '[data-testid="gallery-thumbnails"]',
  GALLERY_THUMBNAIL: '[data-testid="gallery-thumbnail"]',
  DESCRIPTION: '[data-testid="product-description"]',
  SKU: '[data-testid="product-sku"]',
  STOCK_STATUS: '[data-testid="stock-status"]',
  QUANTITY_INPUT: '[data-testid="quantity-input"]',
  QUANTITY_INCREASE: '[data-testid="quantity-increase"]',
  QUANTITY_DECREASE: '[data-testid="quantity-decrease"]',

  // Product Filters
  FILTERS: {
    CONTAINER: '[data-testid="product-filters"]',
    CATEGORY: '[data-testid="filter-category"]',
    PRICE_MIN: '[data-testid="filter-price-min"]',
    PRICE_MAX: '[data-testid="filter-price-max"]',
    PRICE_APPLY: '[data-testid="filter-price-apply"]',
    RATING: '[data-testid="filter-rating"]',
    IN_STOCK: '[data-testid="filter-in-stock"]',
    CLEAR_ALL: '[data-testid="filter-clear-all"]',
  },

  // Product Sort
  SORT: {
    SELECT: '[data-testid="sort-select"]',
    PRICE_ASC: '[data-testid="sort-price-asc"]',
    PRICE_DESC: '[data-testid="sort-price-desc"]',
    NAME_ASC: '[data-testid="sort-name-asc"]',
    NAME_DESC: '[data-testid="sort-name-desc"]',
    NEWEST: '[data-testid="sort-newest"]',
    RATING: '[data-testid="sort-rating"]',
  },

  // Product Reviews
  REVIEWS: {
    CONTAINER: '[data-testid="product-reviews"]',
    LIST: '[data-testid="reviews-list"]',
    ITEM: '[data-testid="review-item"]',
    AUTHOR: '[data-testid="review-author"]',
    DATE: '[data-testid="review-date"]',
    RATING: '[data-testid="review-rating"]',
    TITLE: '[data-testid="review-title"]',
    COMMENT: '[data-testid="review-comment"]',
    FORM: '[data-testid="review-form"]',
    FORM_RATING: '[data-testid="review-form-rating"]',
    FORM_TITLE: '[data-testid="review-form-title"]',
    FORM_COMMENT: '[data-testid="review-form-comment"]',
    FORM_SUBMIT: '[data-testid="review-form-submit"]',
  },

  // Search
  SEARCH: {
    INPUT: '[data-testid="search-input"]',
    BUTTON: '[data-testid="search-button"]',
    RESULTS: '[data-testid="search-results"]',
    NO_RESULTS: '[data-testid="search-no-results"]',
    SUGGESTIONS: '[data-testid="search-suggestions"]',
    SUGGESTION_ITEM: '[data-testid="search-suggestion"]',
  },
};

/**
 * E-Commerce Category selectors
 */
export const CATEGORIES = {
  LIST: '[data-testid="categories-list"]',
  CARD: '[data-testid="category-card"]',
  IMAGE: '[data-testid="category-image"]',
  NAME: '[data-testid="category-name"]',
  COUNT: '[data-testid="category-count"]',
  SIDEBAR: '[data-testid="categories-sidebar"]',
  BREADCRUMB: '[data-testid="category-breadcrumb"]',
};

/**
 * E-Commerce Cart selectors
 */
export const CART = {
  // Cart Icon/Badge
  ICON: '[data-testid="cart-icon"]',
  BADGE: '[data-testid="cart-badge"]',
  COUNT: '[data-testid="cart-count"]',

  // Cart Drawer/Sidebar
  DRAWER: '[data-testid="cart-drawer"]',
  DRAWER_OPEN: '[data-testid="cart-drawer-open"]',
  DRAWER_CLOSE: '[data-testid="cart-drawer-close"]',

  // Cart Page
  PAGE: '[data-testid="cart-page"]',
  EMPTY_STATE: '[data-testid="cart-empty"]',
  CONTINUE_SHOPPING: '[data-testid="continue-shopping"]',

  // Cart Items
  ITEMS_LIST: '[data-testid="cart-items"]',
  ITEM: '[data-testid="cart-item"]',
  ITEM_IMAGE: '[data-testid="cart-item-image"]',
  ITEM_NAME: '[data-testid="cart-item-name"]',
  ITEM_PRICE: '[data-testid="cart-item-price"]',
  ITEM_QUANTITY: '[data-testid="cart-quantity"]',
  ITEM_QUANTITY_INCREASE: '[data-testid="cart-quantity-increase"]',
  ITEM_QUANTITY_DECREASE: '[data-testid="cart-quantity-decrease"]',
  ITEM_SUBTOTAL: '[data-testid="cart-item-subtotal"]',
  ITEM_REMOVE: '[data-testid="remove-from-cart"]',

  // Cart Summary
  SUMMARY: '[data-testid="cart-summary"]',
  SUBTOTAL: '[data-testid="cart-subtotal"]',
  TAX: '[data-testid="cart-tax"]',
  SHIPPING: '[data-testid="cart-shipping"]',
  DISCOUNT: '[data-testid="cart-discount"]',
  TOTAL: '[data-testid="cart-total"]',

  // Cart Actions
  CLEAR_CART: '[data-testid="clear-cart"]',
  UPDATE_CART: '[data-testid="update-cart"]',
  CHECKOUT_BUTTON: '[data-testid="checkout-button"]',

  // Coupon
  COUPON_INPUT: '[data-testid="coupon-input"]',
  COUPON_APPLY: '[data-testid="coupon-apply"]',
  COUPON_REMOVE: '[data-testid="coupon-remove"]',
  COUPON_ERROR: '[data-testid="coupon-error"]',
  COUPON_SUCCESS: '[data-testid="coupon-success"]',
};

/**
 * E-Commerce Checkout selectors
 */
export const CHECKOUT = {
  PAGE: '[data-testid="checkout-page"]',
  FORM: '[data-testid="checkout-form"]',

  // Steps
  STEPS: {
    CONTAINER: '[data-testid="checkout-steps"]',
    SHIPPING: '[data-testid="step-shipping"]',
    PAYMENT: '[data-testid="step-payment"]',
    REVIEW: '[data-testid="step-review"]',
    ACTIVE: '[data-testid="step-active"]',
    COMPLETED: '[data-testid="step-completed"]',
  },

  // Shipping Address
  SHIPPING: {
    FORM: '[data-testid="shipping-form"]',
    FIRST_NAME: '[data-testid="shipping-first-name"]',
    LAST_NAME: '[data-testid="shipping-last-name"]',
    EMAIL: '[data-testid="shipping-email"]',
    PHONE: '[data-testid="shipping-phone"]',
    ADDRESS: '[data-testid="shipping-address"]',
    ADDRESS2: '[data-testid="shipping-address2"]',
    CITY: '[data-testid="shipping-city"]',
    STATE: '[data-testid="shipping-state"]',
    ZIP: '[data-testid="shipping-zip"]',
    COUNTRY: '[data-testid="shipping-country"]',
    SAVE_ADDRESS: '[data-testid="save-shipping-address"]',
  },

  // Billing Address
  BILLING: {
    SAME_AS_SHIPPING: '[data-testid="billing-same-as-shipping"]',
    FORM: '[data-testid="billing-form"]',
    FIRST_NAME: '[data-testid="billing-first-name"]',
    LAST_NAME: '[data-testid="billing-last-name"]',
    ADDRESS: '[data-testid="billing-address"]',
    ADDRESS2: '[data-testid="billing-address2"]',
    CITY: '[data-testid="billing-city"]',
    STATE: '[data-testid="billing-state"]',
    ZIP: '[data-testid="billing-zip"]',
    COUNTRY: '[data-testid="billing-country"]',
  },

  // Payment
  PAYMENT: {
    FORM: '[data-testid="payment-form"]',
    METHOD_SELECT: '[data-testid="payment-method"]',
    CREDIT_CARD: '[data-testid="payment-credit-card"]',
    PAYPAL: '[data-testid="payment-paypal"]',
    CARD_NUMBER: '[data-testid="card-number"]',
    CARD_NAME: '[data-testid="card-name"]',
    CARD_EXPIRY: '[data-testid="card-expiry"]',
    CARD_CVV: '[data-testid="card-cvv"]',
  },

  // Order Summary
  ORDER_SUMMARY: {
    CONTAINER: '[data-testid="order-summary"]',
    ITEMS: '[data-testid="summary-items"]',
    ITEM: '[data-testid="summary-item"]',
    SUBTOTAL: '[data-testid="summary-subtotal"]',
    SHIPPING: '[data-testid="summary-shipping"]',
    TAX: '[data-testid="summary-tax"]',
    DISCOUNT: '[data-testid="summary-discount"]',
    TOTAL: '[data-testid="summary-total"]',
  },

  // Actions
  CONTINUE_BUTTON: '[data-testid="checkout-continue"]',
  BACK_BUTTON: '[data-testid="checkout-back"]',
  PLACE_ORDER: '[data-testid="place-order"]',

  // Messages
  ERROR: '[data-testid="checkout-error"]',
  LOADING: '[data-testid="checkout-loading"]',
};

/**
 * E-Commerce Orders selectors
 */
export const ORDERS = {
  // Orders List
  PAGE: '[data-testid="orders-page"]',
  LIST: '[data-testid="orders-list"]',
  EMPTY_STATE: '[data-testid="orders-empty"]',

  // Order Item in List
  ITEM: '[data-testid="order-item"]',
  ORDER_NUMBER: '[data-testid="order-number"]',
  ORDER_DATE: '[data-testid="order-date"]',
  ORDER_STATUS: '[data-testid="order-status"]',
  ORDER_TOTAL: '[data-testid="order-total"]',
  ORDER_ITEMS_COUNT: '[data-testid="order-items-count"]',
  VIEW_DETAILS: '[data-testid="view-order-details"]',

  // Order Detail
  DETAIL: {
    PAGE: '[data-testid="order-detail"]',
    HEADER: '[data-testid="order-header"]',
    NUMBER: '[data-testid="detail-order-number"]',
    DATE: '[data-testid="detail-order-date"]',
    STATUS: '[data-testid="detail-order-status"]',
    ITEMS: '[data-testid="detail-order-items"]',
    ITEM: '[data-testid="detail-order-item"]',
    SHIPPING_ADDRESS: '[data-testid="detail-shipping-address"]',
    BILLING_ADDRESS: '[data-testid="detail-billing-address"]',
    PAYMENT_METHOD: '[data-testid="detail-payment-method"]',
    SUBTOTAL: '[data-testid="detail-subtotal"]',
    SHIPPING: '[data-testid="detail-shipping"]',
    TAX: '[data-testid="detail-tax"]',
    TOTAL: '[data-testid="detail-total"]',
    CANCEL_BUTTON: '[data-testid="cancel-order"]',
    TRACK_BUTTON: '[data-testid="track-order"]',
    REORDER_BUTTON: '[data-testid="reorder"]',
  },

  // Order Confirmation
  CONFIRMATION: {
    PAGE: '[data-testid="order-confirmation"]',
    MESSAGE: '[data-testid="confirmation-message"]',
    ORDER_NUMBER: '[data-testid="confirmation-order-number"]',
    EMAIL_NOTICE: '[data-testid="confirmation-email-notice"]',
    CONTINUE_SHOPPING: '[data-testid="confirmation-continue-shopping"]',
    VIEW_ORDER: '[data-testid="confirmation-view-order"]',
  },

  // Filters
  FILTERS: {
    STATUS: '[data-testid="filter-order-status"]',
    DATE_FROM: '[data-testid="filter-date-from"]',
    DATE_TO: '[data-testid="filter-date-to"]',
    SEARCH: '[data-testid="filter-order-search"]',
  },
};

/**
 * E-Commerce Admin selectors
 */
export const ADMIN = {
  // Admin Layout
  SIDEBAR: '[data-testid="admin-sidebar"]',
  NAV_ITEM: '[data-testid="admin-nav-item"]',
  HEADER: '[data-testid="admin-header"]',
  CONTENT: '[data-testid="admin-content"]',

  // Dashboard
  DASHBOARD: {
    PAGE: '[data-testid="admin-dashboard"]',
    STATS: '[data-testid="admin-stats"]',
    STAT_CARD: '[data-testid="stat-card"]',
    REVENUE: '[data-testid="stat-revenue"]',
    ORDERS: '[data-testid="stat-orders"]',
    CUSTOMERS: '[data-testid="stat-customers"]',
    PRODUCTS: '[data-testid="stat-products"]',
    RECENT_ORDERS: '[data-testid="recent-orders"]',
    CHART: '[data-testid="admin-chart"]',
  },

  // Products Management
  PRODUCTS: {
    PAGE: '[data-testid="admin-products"]',
    ADD_BUTTON: '[data-testid="add-product"]',
    TABLE: '[data-testid="products-table"]',
    ROW: '[data-testid="product-row"]',
    EDIT_BUTTON: '[data-testid="edit-product"]',
    DELETE_BUTTON: '[data-testid="delete-product"]',
    SEARCH: '[data-testid="search-products"]',
    FILTER_CATEGORY: '[data-testid="filter-category"]',
    FILTER_STATUS: '[data-testid="filter-status"]',
    FORM: {
      MODAL: '[data-testid="product-form-modal"]',
      NAME: '[data-testid="product-form-name"]',
      DESCRIPTION: '[data-testid="product-form-description"]',
      PRICE: '[data-testid="product-form-price"]',
      ORIGINAL_PRICE: '[data-testid="product-form-original-price"]',
      CATEGORY: '[data-testid="product-form-category"]',
      STOCK: '[data-testid="product-form-stock"]',
      IMAGES: '[data-testid="product-form-images"]',
      STATUS: '[data-testid="product-form-status"]',
      FEATURED: '[data-testid="product-form-featured"]',
      SUBMIT: '[data-testid="product-form-submit"]',
      CANCEL: '[data-testid="product-form-cancel"]',
    },
  },

  // Orders Management
  ORDERS: {
    PAGE: '[data-testid="admin-orders"]',
    TABLE: '[data-testid="orders-table"]',
    ROW: '[data-testid="order-row"]',
    VIEW_BUTTON: '[data-testid="view-order"]',
    EDIT_STATUS: '[data-testid="edit-order-status"]',
    SEARCH: '[data-testid="search-orders"]',
    FILTER_STATUS: '[data-testid="filter-order-status"]',
    FILTER_DATE: '[data-testid="filter-order-date"]',
    STATUS_MODAL: {
      MODAL: '[data-testid="status-modal"]',
      SELECT: '[data-testid="status-select"]',
      NOTES: '[data-testid="status-notes"]',
      SUBMIT: '[data-testid="status-submit"]',
      CANCEL: '[data-testid="status-cancel"]',
    },
  },

  // Users Management
  USERS: {
    PAGE: '[data-testid="admin-users"]',
    ADD_BUTTON: '[data-testid="add-user"]',
    TABLE: '[data-testid="users-table"]',
    ROW: '[data-testid="user-row"]',
    EDIT_BUTTON: '[data-testid="edit-user"]',
    DELETE_BUTTON: '[data-testid="delete-user"]',
    SEARCH: '[data-testid="search-users"]',
    FILTER_ROLE: '[data-testid="filter-role"]',
    FILTER_STATUS: '[data-testid="filter-user-status"]',
    FORM: {
      MODAL: '[data-testid="user-form-modal"]',
      FIRST_NAME: '[data-testid="user-form-first-name"]',
      LAST_NAME: '[data-testid="user-form-last-name"]',
      EMAIL: '[data-testid="user-form-email"]',
      PASSWORD: '[data-testid="user-form-password"]',
      ROLE: '[data-testid="user-form-role"]',
      STATUS: '[data-testid="user-form-status"]',
      SUBMIT: '[data-testid="user-form-submit"]',
      CANCEL: '[data-testid="user-form-cancel"]',
    },
  },

  // Categories Management
  CATEGORIES: {
    PAGE: '[data-testid="admin-categories"]',
    ADD_BUTTON: '[data-testid="add-category"]',
    TABLE: '[data-testid="categories-table"]',
    ROW: '[data-testid="category-row"]',
    EDIT_BUTTON: '[data-testid="edit-category"]',
    DELETE_BUTTON: '[data-testid="delete-category"]',
  },
};

/**
 * Helper function to get selector by test ID
 * @param {string} testId - data-testid value
 * @returns {string} CSS selector
 */
const byTestId = (testId) => `[data-testid="${testId}"]`;

/**
 * Helper function to create dynamic selector
 * @param {string} prefix - Selector prefix
 * @param {string} suffix - Dynamic suffix
 * @returns {string} CSS selector
 */
const dynamicSelector = (prefix, suffix) => `[data-testid="${prefix}-${suffix}"]`;

// =================================
// Exports
// =================================

export {
  AUTH,
  HEADER,
  MODAL,
  TABLE,
  FORM,
  COMMON,
  DASHBOARD,
  PROFILE,
  SETTINGS,
  PRODUCTS,
  CATEGORIES,
  CART,
  CHECKOUT,
  ORDERS,
  ADMIN,
  byTestId,
  dynamicSelector,
};
