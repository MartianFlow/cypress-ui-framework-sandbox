# Cypress UI Automation Framework

Enterprise-grade Cypress UI automation framework implementing industry best practices, design patterns, and modern Cypress features.

## Features

- **Cypress 14+** with all modern features
- **Page Object Model (POM)** with base classes
- **Component Pattern** for reusable UI components
- **Builder Pattern** for test data generation
- **Factory Pattern** for page instantiation
- **Multi-environment** configuration (dev, qa, staging, prod)
- **Custom Commands** for authentication, UI, and API
- **cy.session()** for authentication caching
- **cy.intercept()** for API mocking/stubbing
- **Tag-based filtering** with @bahmutov/cy-grep
- **Multiple reporters** (Mochawesome, Allure)
- **GitHub Actions CI/CD** with multi-browser support
- **ESLint + Prettier** for code quality

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ or yarn
- Git

## Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd cypress-ui-framework-sandbox

# Install dependencies
npm install

# Open Cypress Test Runner
npm run cy:open

# Run tests in headless mode
npm run cy:run
```

## Project Structure

```
cypress-ui-framework-sandbox/
├── .github/workflows/          # GitHub Actions CI/CD
├── .husky/                     # Git hooks
├── cypress/
│   ├── config/environments/    # Environment configurations
│   ├── e2e/                    # Test files
│   │   ├── features/           # Feature tests
│   │   └── smoke/              # Smoke tests
│   ├── fixtures/               # Test data
│   ├── pages/                  # Page Objects
│   │   ├── base/               # Base classes
│   │   ├── components/         # Reusable components
│   │   └── auth/               # Auth page objects
│   ├── support/                # Support files
│   │   └── commands/           # Custom commands
│   └── utils/                  # Utilities
│       ├── builders/           # Data builders
│       ├── constants/          # Constants
│       └── api/                # API client
├── docs/                       # Documentation
├── scripts/                    # Utility scripts
├── cypress.config.js           # Main Cypress config
└── package.json
```

## Available Scripts

### Running Tests

```bash
# Open Cypress GUI
npm run cy:open
npm run cy:open:dev      # With dev config
npm run cy:open:qa       # With QA config
npm run cy:open:staging  # With staging config
npm run cy:open:prod     # With prod config

# Run tests headlessly
npm run cy:run
npm run cy:run:dev       # Against dev environment
npm run cy:run:qa        # Against QA environment
npm run cy:run:staging   # Against staging environment
npm run cy:run:prod      # Against production (smoke only)

# Run specific test types
npm run cy:run:smoke       # Run smoke tests only
npm run cy:run:regression  # Run regression tests only

# Run in specific browsers
npm run cy:run:chrome    # Chrome
npm run cy:run:firefox   # Firefox
npm run cy:run:edge      # Edge
npm run cy:run:headed    # Headed mode
```

### Code Quality

```bash
# Lint code
npm run lint          # Fix lint issues
npm run lint:check    # Check only

# Format code
npm run format        # Format files
npm run format:check  # Check formatting
```

### Reporting

```bash
# Generate merged HTML report
npm run report:generate

# Generate and open Allure report
npm run report:allure
```

### Cleanup

```bash
# Clean all generated files
npm run clean

# Clean reports only
npm run clean:reports
```

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Environment
CYPRESS_ENV=dev

# URLs
CYPRESS_BASE_URL=https://your-app.com
CYPRESS_API_URL=https://api.your-app.com

# Test User Credentials
CYPRESS_TEST_USER_EMAIL=testuser@example.com
CYPRESS_TEST_USER_PASSWORD=password123

# Admin Credentials
CYPRESS_ADMIN_USER_EMAIL=admin@example.com
CYPRESS_ADMIN_USER_PASSWORD=adminpass123
```

### Multi-Environment Support

Tests can run against different environments:

| Environment | Config File | URL |
|-------------|-------------|-----|
| Development | `dev.config.js` | https://dev.example.com |
| QA | `qa.config.js` | https://qa.example.com |
| Staging | `staging.config.js` | https://staging.example.com |
| Production | `prod.config.js` | https://www.example.com |

## Writing Tests

### Using Page Objects

```javascript
import { loginPage } from '../../pages';

describe('Login', () => {
  it('should login successfully', () => {
    loginPage()
      .visit()
      .enterEmail('user@example.com')
      .enterPassword('password123')
      .clickLogin()
      .verifyRedirectedTo('/dashboard');
  });
});
```

### Using Components

```javascript
import { header, modal, table } from '../../pages';

it('should interact with components', () => {
  header().clickNavItem('Products');
  table().verifyRowCount(10);
  modal().confirm();
});
```

### Using Builder Pattern

```javascript
import UserBuilder from '../../utils/builders/UserBuilder';

const user = UserBuilder.create()
  .withRandomEmail()
  .withPassword('Test@123')
  .asAdmin()
  .build();
```

### Using Custom Commands

```javascript
// Authentication
cy.login('user@example.com', 'password');
cy.loginByApi('user@example.com', 'password');
cy.loginAsTestUser();
cy.logout();

// UI
cy.getByTestId('submit-button').click();
cy.waitForLoading();
cy.uploadFile('input[type="file"]', 'document.pdf');

// API
cy.apiGet('/users');
cy.apiPost('/users', { name: 'John' });
cy.interceptApi('GET', '/users', 'getUsers');
cy.mockApi('GET', '/users', 'fixtures/users.json', 'getUsers');
```

### Using Tags

```javascript
describe('Feature', { tags: ['@smoke', '@regression'] }, () => {
  it('smoke test', { tags: '@smoke' }, () => {
    // ...
  });
});
```

Run tagged tests:

```bash
npm run cy:run -- --env grepTags=@smoke
npm run cy:run -- --env grepTags="@smoke+@auth"
```

## CI/CD

### GitHub Actions

Two workflows are included:

1. **cypress-ci.yml** - Runs on push/PR
   - Multi-browser matrix (Chrome, Firefox, Edge)
   - Smoke tests on PRs
   - Full suite on main/develop

2. **cypress-nightly.yml** - Scheduled nightly runs
   - Full regression suite
   - Performance tests
   - Allure report generation

### Required Secrets

Configure these in GitHub repository settings:

- `CYPRESS_BASE_URL`
- `CYPRESS_API_URL`
- `CYPRESS_TEST_USER_EMAIL`
- `CYPRESS_TEST_USER_PASSWORD`
- `SLACK_WEBHOOK_URL` (optional)

## Reporting

### Mochawesome

HTML reports are generated automatically after test runs:

```bash
npm run report:generate
open cypress/reports/combined/index.html
```

### Allure

For detailed Allure reports:

```bash
npm run report:allure
```

## Best Practices

### Selectors

Always use `data-testid` attributes:

```javascript
// Good
cy.getByTestId('submit-button');

// Avoid
cy.get('.btn-primary');
cy.get('#submit');
```

### Test Independence

Each test should be independent:

```javascript
beforeEach(() => {
  cy.clearAuth();
  cy.visit('/');
});
```

### API Mocking

Mock APIs for consistent, fast tests:

```javascript
beforeEach(() => {
  cy.mockApi('GET', '/users', 'users.json', 'getUsers');
});
```

### Session Caching

Use `cy.session()` for authentication:

```javascript
cy.session('user', () => {
  cy.loginByApi('user@example.com', 'password');
});
```

## Troubleshooting

See [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) for common issues.

## Contributing

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for contribution guidelines.

## Architecture

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture documentation.

## License

MIT
