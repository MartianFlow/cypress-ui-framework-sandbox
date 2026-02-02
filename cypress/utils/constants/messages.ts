/**
 * Messages Constants
 * @description Centralized expected messages for assertions
 * @module Messages
 */

/**
 * Authentication messages
 */
export const AUTH = {
  // Login messages
  LOGIN: {
    SUCCESS: 'Login successful',
    WELCOME: 'Welcome back',
    INVALID_CREDENTIALS: 'Invalid email or password',
    ACCOUNT_LOCKED: 'Your account has been locked',
    ACCOUNT_DISABLED: 'Your account has been disabled',
    EMAIL_NOT_VERIFIED: 'Please verify your email address',
    SESSION_EXPIRED: 'Your session has expired. Please login again',
    TOO_MANY_ATTEMPTS: 'Too many login attempts. Please try again later',
  },

  // Logout messages
  LOGOUT: {
    SUCCESS: 'You have been logged out successfully',
    CONFIRM: 'Are you sure you want to logout?',
  },

  // Registration messages
  REGISTER: {
    SUCCESS: 'Registration successful! Please check your email to verify your account',
    EMAIL_EXISTS: 'An account with this email already exists',
    PASSWORD_WEAK: 'Password is too weak',
    TERMS_REQUIRED: 'You must accept the terms and conditions',
    VERIFICATION_SENT: 'A verification email has been sent to your address',
  },

  // Password messages
  PASSWORD: {
    RESET_LINK_SENT: 'Password reset link has been sent to your email',
    RESET_SUCCESS: 'Your password has been reset successfully',
    RESET_EXPIRED: 'Password reset link has expired',
    CHANGE_SUCCESS: 'Your password has been changed successfully',
    MISMATCH: 'Passwords do not match',
    CURRENT_INCORRECT: 'Current password is incorrect',
    REQUIREMENTS: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  },
};

/**
 * Validation messages
 */
export const VALIDATION = {
  // Required fields
  REQUIRED: {
    FIELD: 'This field is required',
    EMAIL: 'Email is required',
    PASSWORD: 'Password is required',
    NAME: 'Name is required',
    USERNAME: 'Username is required',
  },

  REGISTER: {
    FIRST_NAME_MIN: 'First name must be at least 2 characters',
    LAST_NAME_MIN: 'Last name must be at least 2 characters',
    PASSWORD_MIN: 'Password must be at least 8 characters',
    PASSWORDS_DONT_MATCH: 'Passwords do not match',
    TERMS_REQUIRED: 'You must accept the terms',
  },

  // Format validation
  FORMAT: {
    EMAIL_INVALID: 'Invalid email address',
    PHONE_INVALID: 'Please enter a valid phone number',
    URL_INVALID: 'Please enter a valid URL',
    DATE_INVALID: 'Please enter a valid date',
    NUMBER_INVALID: 'Please enter a valid number',
  },

  // Length validation
  LENGTH: {
    TOO_SHORT: 'This field is too short',
    TOO_LONG: 'This field is too long',
    MIN_LENGTH: (min) => `Must be at least ${min} characters`,
    MAX_LENGTH: (max) => `Must be no more than ${max} characters`,
    EXACT_LENGTH: (length) => `Must be exactly ${length} characters`,
  },

  // Range validation
  RANGE: {
    MIN: (min) => `Must be at least ${min}`,
    MAX: (max) => `Must be no more than ${max}`,
    BETWEEN: (min, max) => `Must be between ${min} and ${max}`,
  },

  // Pattern validation
  PATTERN: {
    ALPHANUMERIC: 'Only letters and numbers are allowed',
    LETTERS_ONLY: 'Only letters are allowed',
    NUMBERS_ONLY: 'Only numbers are allowed',
    NO_SPACES: 'Spaces are not allowed',
    NO_SPECIAL_CHARS: 'Special characters are not allowed',
  },
};

/**
 * Success messages
 */
export const SUCCESS = {
  // CRUD operations
  CREATE: 'Created successfully',
  UPDATE: 'Updated successfully',
  DELETE: 'Deleted successfully',
  SAVE: 'Saved successfully',

  // File operations
  UPLOAD: 'File uploaded successfully',
  DOWNLOAD: 'File downloaded successfully',
  EXPORT: 'Export completed successfully',
  IMPORT: 'Import completed successfully',

  // User actions
  PROFILE_UPDATE: 'Profile updated successfully',
  SETTINGS_SAVED: 'Settings saved successfully',
  EMAIL_SENT: 'Email sent successfully',
  INVITATION_SENT: 'Invitation sent successfully',

  // Generic
  OPERATION_COMPLETE: 'Operation completed successfully',
  CHANGES_SAVED: 'Your changes have been saved',
};

/**
 * Error messages
 */
export const ERROR = {
  // Generic errors
  GENERIC: 'Something went wrong. Please try again',
  UNEXPECTED: 'An unexpected error occurred',
  SERVER: 'Server error. Please try again later',
  NETWORK: 'Network error. Please check your connection',
  TIMEOUT: 'Request timed out. Please try again',

  // Permission errors
  UNAUTHORIZED: 'You are not authorized to perform this action',
  FORBIDDEN: 'Access denied',
  SESSION_EXPIRED: 'Your session has expired',

  // Resource errors
  NOT_FOUND: 'The requested resource was not found',
  ALREADY_EXISTS: 'This item already exists',
  CONFLICT: 'There was a conflict with the current state',

  // Validation errors
  VALIDATION_FAILED: 'Please correct the errors below',
  INVALID_DATA: 'Invalid data provided',
  MISSING_REQUIRED: 'Please fill in all required fields',

  // File errors
  FILE_TOO_LARGE: 'File is too large',
  INVALID_FILE_TYPE: 'Invalid file type',
  UPLOAD_FAILED: 'File upload failed',

  // Rate limiting
  RATE_LIMIT: 'Too many requests. Please slow down',
};

/**
 * Warning messages
 */
export const WARNING = {
  UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',
  DELETE_CONFIRM: 'Are you sure you want to delete this item? This action cannot be undone.',
  PERMANENT_ACTION: 'This action is permanent and cannot be undone.',
  DATA_LOSS: 'You may lose your data if you continue.',
  SESSION_EXPIRING: 'Your session will expire soon.',
  MAINTENANCE: 'The system will undergo maintenance soon.',
};

/**
 * Info messages
 */
export const INFO = {
  LOADING: 'Loading...',
  PROCESSING: 'Processing...',
  PLEASE_WAIT: 'Please wait...',
  NO_RESULTS: 'No results found',
  NO_DATA: 'No data available',
  EMPTY_LIST: 'The list is empty',
  SEARCH_HINT: 'Type to search...',
  DRAG_DROP_HINT: 'Drag and drop files here',
  OPTIONAL: 'Optional',
};

/**
 * Confirmation messages
 */
export const CONFIRM = {
  DELETE: 'Are you sure you want to delete this?',
  DISCARD: 'Are you sure you want to discard your changes?',
  SUBMIT: 'Are you sure you want to submit?',
  CANCEL: 'Are you sure you want to cancel?',
  PROCEED: 'Do you want to proceed?',
  LOGOUT: 'Are you sure you want to logout?',
};

/**
 * Placeholder text
 */
export const PLACEHOLDER = {
  EMAIL: 'Enter your email',
  PASSWORD: 'Enter your password',
  SEARCH: 'Search...',
  NAME: 'Enter your name',
  PHONE: 'Enter your phone number',
  MESSAGE: 'Type your message...',
  SELECT: 'Select an option',
  DATE: 'Select a date',
  FILE: 'Choose a file',
};

/**
 * Button text
 */
export const BUTTON = {
  SUBMIT: 'Submit',
  CANCEL: 'Cancel',
  SAVE: 'Save',
  DELETE: 'Delete',
  EDIT: 'Edit',
  UPDATE: 'Update',
  CREATE: 'Create',
  ADD: 'Add',
  REMOVE: 'Remove',
  CONFIRM: 'Confirm',
  CONTINUE: 'Continue',
  BACK: 'Back',
  NEXT: 'Next',
  PREVIOUS: 'Previous',
  CLOSE: 'Close',
  DONE: 'Done',
  APPLY: 'Apply',
  RESET: 'Reset',
  CLEAR: 'Clear',
  SEARCH: 'Search',
  FILTER: 'Filter',
  EXPORT: 'Export',
  IMPORT: 'Import',
  DOWNLOAD: 'Download',
  UPLOAD: 'Upload',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  REGISTER: 'Register',
  SIGN_UP: 'Sign Up',
  SIGN_IN: 'Sign In',
};

/**
 * Page titles
 */
export const PAGE_TITLE = {
  HOME: 'Home',
  DASHBOARD: 'Dashboard',
  LOGIN: 'Login',
  REGISTER: 'Register',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  NOT_FOUND: 'Page Not Found',
  ERROR: 'Error',
};

// =================================
// Exports
// =================================

export {
  AUTH,
  VALIDATION,
  SUCCESS,
  ERROR,
  WARNING,
  INFO,
  CONFIRM,
  PLACEHOLDER,
  BUTTON,
  PAGE_TITLE,
};
