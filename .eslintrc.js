/**
 * ESLint Configuration for Cypress UI Framework
 * @description Linting rules optimized for Cypress testing with ES6+ support
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
    'cypress/globals': true,
  },
  extends: ['eslint:recommended', 'plugin:cypress/recommended'],
  plugins: ['cypress'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Cypress specific rules
    'cypress/no-assigning-return-values': 'error',
    'cypress/no-unnecessary-waiting': 'warn',
    'cypress/assertion-before-screenshot': 'warn',
    'cypress/no-force': 'warn',
    'cypress/no-async-tests': 'error',
    'cypress/no-pause': 'error',

    // General JavaScript rules
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
    'no-trailing-spaces': 'error',
    semi: ['error', 'always'],
    quotes: ['error', 'single', { avoidEscape: true }],

    // Best practices
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-return-await': 'error',
    'require-await': 'error',
    'no-throw-literal': 'error',

    // Code style
    'arrow-spacing': ['error', { before: true, after: true }],
    'comma-dangle': ['error', 'always-multiline'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
  },
  overrides: [
    {
      files: ['cypress/e2e/**/*.cy.js'],
      rules: {
        'no-unused-expressions': 'off',
      },
    },
    {
      files: ['cypress/support/**/*.js'],
      rules: {
        'no-unused-vars': 'off',
      },
    },
  ],
};
