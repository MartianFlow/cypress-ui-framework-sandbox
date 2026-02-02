# E-Commerce Monorepo with Cypress E2E Testing

> **Full-stack e-commerce application with enterprise-grade Cypress testing framework**

A comprehensive monorepo featuring a modern e-commerce platform built with TypeScript, Hono, React, and SQLite, alongside a production-ready Cypress automation framework implementing industry best practices and design patterns.

## 🎯 Overview

This monorepo contains:

- **API Backend** - RESTful API built with Hono and TypeScript
- **Web Frontend** - React 19 SPA with TypeScript and Tailwind CSS
- **E2E Tests** - Enterprise Cypress framework with Page Object Model
- **Shared Package** - Common types and utilities

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Testing](#-testing)
- [Configuration](#-configuration)
- [CI/CD](#-cicd)
- [Best Practices](#-best-practices)
- [Documentation](#-documentation)

## ✨ Features

### Application Features
- 🛍️ Full e-commerce functionality (products, cart, checkout, orders)
- 🔐 JWT-based authentication with bcrypt password hashing
- 📦 Category-based product organization
- 💳 Payment processing integration
- 👤 User profile management
- 📊 Admin dashboard for product/order management
- 🎨 Modern, responsive UI with Tailwind CSS
- ⚡ Real-time state management with Zustand
- 🔄 Optimistic updates with React Query

### Testing Framework Features
- 🧪 **Cypress 14+** with latest features and TypeScript support
- 📐 **Page Object Model (POM)** with base classes and inheritance
- 🧩 **Component Pattern** for reusable UI components
- 🏗️ **Builder Pattern** for test data generation
- 🏭 **Factory Pattern** for page object instantiation
- 🌍 **Multi-environment** configuration (dev, qa, staging, prod)
- 🎯 **Custom Commands** for auth, UI interactions, and API calls
- 💾 **cy.session()** for authentication caching
- 🔌 **cy.intercept()** for API mocking and stubbing
- 🏷️ **Tag-based filtering** with @bahmutov/cy-grep
- 📊 **Multiple reporters** (Mochawesome, Allure)
- 🔄 **GitHub Actions CI/CD** with multi-browser support
- ✨ **ESLint + Prettier** for code quality
- 📝 **TypeScript** definitions for full IntelliSense support

## 🛠 Tech Stack

### Backend API
- **Runtime:** Node.js 18+
- **Framework:** [Hono](https://hono.dev/) - Fast, lightweight web framework
- **Language:** TypeScript
- **Database:** SQLite with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** JWT (Jose library)
- **Validation:** Zod

### Frontend Web
- **Framework:** React 19
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4.0
- **Routing:** React Router v7
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Form Handling:** React Hook Form + Zod
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Notifications:** Sonner

### Testing & Quality
- **E2E Testing:** Cypress 14
- **Type Checking:** TypeScript 5.7
- **Linting:** ESLint
- **Formatting:** Prettier
- **Git Hooks:** Husky + lint-staged

### Monorepo Management
- **Package Manager:** pnpm with workspaces
- **Build System:** Turborepo support

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ (LTS recommended)
  ```bash
  node --version  # Should be >= 18.0.0
  ```
- **pnpm** 9+ (Package manager)
  ```bash
  npm install -g pnpm
  pnpm --version  # Should be >= 9.0.0
  ```
- **Git**
  ```bash
  git --version
  ```

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd cypress-ui-framework-sandbox
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install dependencies for all workspaces (root, API, web, and shared packages).

### 3. Set Up Environment Variables

```bash
# Copy environment example file
cp .env.example .env

# Edit .env with your configuration
```

### 4. Initialize Database

```bash
# Push database schema
pnpm db:push

# Seed database with sample data
pnpm db:seed
```

### 5. Start Development Servers

```bash
# Start all services (API + Web)
pnpm dev

# OR start individually:
pnpm dev:api  # API server on http://localhost:3000
pnpm dev:web  # Web app on http://localhost:5173
```

### 6. Run Cypress Tests

```bash
# Open Cypress Test Runner (GUI)
pnpm cy:open

# Run tests in headless mode
pnpm cy:run
```

## 📁 Project Structure

```
cypress-ui-framework-sandbox/
├── apps/
│   ├── api/                    # Backend API
│   │   ├── src/
│   │   │   ├── db/            # Database configuration & migrations
│   │   │   │   ├── schema.ts  # Drizzle schema definitions
│   │   │   │   ├── seed.ts    # Database seeding
│   │   │   │   └── index.ts   # DB connection
│   │   │   ├── routes/        # API route handlers
│   │   │   │   ├── auth.ts    # Authentication endpoints
│   │   │   │   ├── products.ts
│   │   │   │   ├── cart.ts
│   │   │   │   ├── orders.ts
│   │   │   │   └── users.ts
│   │   │   ├── middleware/    # Custom middleware
│   │   │   │   ├── auth.ts    # JWT authentication
│   │   │   │   └── error.ts   # Error handling
│   │   │   ├── services/      # Business logic
│   │   │   ├── utils/         # Utility functions
│   │   │   └── index.ts       # API entry point
│   │   ├── data/              # SQLite database file
│   │   ├── drizzle.config.ts  # Drizzle ORM configuration
│   │   └── package.json
│   │
│   └── web/                   # Frontend application
│       ├── src/
│       │   ├── components/    # React components
│       │   │   ├── auth/      # Login, Register forms
│       │   │   ├── cart/      # Shopping cart components
│       │   │   ├── checkout/  # Checkout flow
│       │   │   ├── products/  # Product listings & details
│       │   │   ├── common/    # Shared UI components
│       │   │   └── layout/    # Layout components
│       │   ├── pages/         # Route pages
│       │   ├── hooks/         # Custom React hooks
│       │   ├── services/      # API client services
│       │   ├── stores/        # Zustand stores
│       │   │   ├── auth.ts    # Authentication state
│       │   │   └── cart.ts    # Cart state
│       │   ├── types/         # TypeScript type definitions
│       │   ├── utils/         # Utility functions
│       │   ├── styles/        # Global styles
│       │   ├── App.tsx        # Main app component
│       │   └── main.tsx       # Application entry point
│       ├── public/            # Static assets
│       ├── index.html         # HTML entry point
│       ├── vite.config.ts     # Vite configuration
│       └── package.json
│
├── packages/
│   └── shared/                # Shared code between API and Web
│       ├── src/
│       │   ├── types/         # Shared TypeScript types
│       │   ├── constants/     # Shared constants
│       │   └── utils/         # Shared utilities
│       └── package.json
│
├── cypress/                   # Cypress E2E Testing
│   ├── config/
│   │   └── environments/      # Environment-specific configs
│   │       ├── dev.config.js
│   │       ├── qa.config.js
│   │       ├── staging.config.js
│   │       └── prod.config.js
│   ├── e2e/                   # Test specifications
│   │   ├── features/          # Feature-based tests
│   │   │   ├── auth/          # Authentication tests
│   │   │   │   ├── login.cy.ts
│   │   │   │   └── register.cy.ts
│   │   │   ├── products/      # Product tests
│   │   │   ├── cart/          # Cart tests
│   │   │   ├── checkout/      # Checkout tests
│   │   │   └── orders/        # Order tests
│   │   ├── api/               # API tests
│   │   └── smoke/             # Smoke tests
│   ├── fixtures/              # Test data
│   │   └── testdata/
│   │       ├── users.json
│   │       ├── products.json
│   │       └── checkout.json
│   ├── pages/                 # Page Object Model
│   │   ├── base/              # Base classes
│   │   │   ├── BasePage.ts    # Base page class
│   │   │   └── BaseComponent.ts
│   │   ├── components/        # Reusable components
│   │   │   ├── HeaderComponent.ts
│   │   │   ├── ModalComponent.ts
│   │   │   ├── TableComponent.ts
│   │   │   └── CartDrawerComponent.ts
│   │   ├── auth/              # Auth pages
│   │   │   ├── LoginPage.ts
│   │   │   └── RegisterPage.ts
│   │   ├── products/          # Product pages
│   │   ├── cart/              # Cart pages
│   │   └── index.js           # Page factory
│   ├── support/               # Support files
│   │   ├── commands/          # Custom commands
│   │   │   ├── auth.commands.ts
│   │   │   ├── ui.commands.ts
│   │   │   └── api.commands.ts
│   │   ├── cypress.d.ts       # TypeScript definitions
│   │   └── e2e.ts             # Support entry point
│   ├── utils/                 # Test utilities
│   │   ├── builders/          # Builder pattern
│   │   │   └── UserBuilder.ts
│   │   ├── constants/         # Test constants
│   │   │   ├── routes.js
│   │   │   ├── selectors.js
│   │   │   └── messages.js
│   │   └── api/               # API utilities
│   │       └── ApiClient.js
│   ├── reports/               # Generated reports
│   ├── screenshots/           # Test screenshots
│   └── videos/                # Test recordings
│
├── .github/
│   └── workflows/             # GitHub Actions CI/CD
│       ├── cypress-ci.yml     # Main CI workflow
│       └── cypress-nightly.yml # Nightly regression
│
├── docs/                      # Documentation
│   ├── ARCHITECTURE.md        # Architecture details
│   ├── CONTRIBUTING.md        # Contribution guide
│   └── TROUBLESHOOTING.md     # Common issues
│
├── scripts/                   # Utility scripts
│   └── merge-reports.js       # Report merging script
│
├── cypress.config.js          # Cypress configuration
├── tsconfig.json              # TypeScript config
├── .eslintrc.js               # ESLint configuration
├── .prettierrc                # Prettier configuration
├── .env.example               # Environment variables template
├── pnpm-workspace.yaml        # pnpm workspace config
└── package.json               # Root package.json
```

## 💻 Development

### Running the Application

#### Start All Services

```bash
# Starts both API and Web in parallel
pnpm dev
```

- **API:** http://localhost:3000
- **Web:** http://localhost:5173

#### Start Individual Services

```bash
# Start API only
pnpm dev:api

# Start Web only
pnpm dev:web
```

### Database Management

```bash
# Push schema changes to database
pnpm db:push

# Seed database with sample data
pnpm db:seed

# Open Drizzle Studio (visual database browser)
pnpm db:studio
```

### Building for Production

```bash
# Build all packages
pnpm build

# Build API only
pnpm build:api

# Build Web only
pnpm build:web
```

### Code Quality

```bash
# Lint and fix code
pnpm lint

# Check linting without fixing
pnpm lint:check

# Format code with Prettier
pnpm format

# Check formatting
pnpm format:check

# Type checking
pnpm type-check

# Watch mode for type checking
pnpm type-check:watch
```

## 🧪 Testing

### Cypress E2E Tests

#### Interactive Mode (GUI)

```bash
# Open Cypress Test Runner
pnpm cy:open

# Open with specific environment
pnpm cy:open:dev       # Development
pnpm cy:open:qa        # QA
pnpm cy:open:staging   # Staging
pnpm cy:open:prod      # Production
```

#### Headless Mode (CLI)

```bash
# Run all tests
pnpm cy:run

# Run with specific environment
pnpm cy:run:dev        # Against dev environment
pnpm cy:run:qa         # Against QA environment
pnpm cy:run:staging    # Against staging environment
pnpm cy:run:prod       # Against production (smoke only)
```

#### Test Types

```bash
# Run smoke tests only
pnpm cy:run:smoke

# Run regression tests only
pnpm cy:run:regression
```

#### Browser Selection

```bash
# Run in Chrome
pnpm cy:run:chrome

# Run in Firefox
pnpm cy:run:firefox

# Run in Edge
pnpm cy:run:edge

# Run in headed mode (visible browser)
pnpm cy:run:headed
```

#### Parallel Execution

```bash
# Run tests in parallel (requires Cypress Dashboard)
pnpm cy:run:parallel
```

### Writing Tests

#### Using Page Objects

```typescript
import { loginPage } from '../../pages';

describe('Login Feature', () => {
  it('should login successfully with valid credentials', () => {
    loginPage()
      .visit()
      .enterEmail('user@example.com')
      .enterPassword('password123')
      .clickLogin()
      .waitForLoginRequest();
    
    cy.url().should('include', '/dashboard');
  });
});
```

#### Using Components

```typescript
import { header, modal, table } from '../../pages';

it('should interact with reusable components', () => {
  // Navigate using header component
  header().clickNavItem('Products');
  
  // Verify table data
  table().verifyRowCount(10);
  table().clickRow(1);
  
  // Interact with modal
  modal().verifyIsOpen();
  modal().clickConfirm();
});
```

#### Using Builder Pattern

```typescript
import UserBuilder from '../../utils/builders/UserBuilder';

it('should create user with builder pattern', () => {
  const user = UserBuilder.create()
    .withRandomEmail()
    .withPassword('SecurePass@123')
    .withFirstName('John')
    .withLastName('Doe')
    .asStandardUser()
    .build();
  
  cy.registerUser(user);
});
```

#### Using Custom Commands

```typescript
// Authentication
cy.loginAsTestUser();
cy.loginAsAdminUser();
cy.clearAuth();

// API Requests
cy.apiGet('/products').then((response) => {
  expect(response.status).to.eq(200);
});

cy.apiPost('/cart', { productId: 1, quantity: 2 });

// UI Utilities
cy.waitForVisible('[data-testid="product-card"]');
cy.clickForce('[data-testid="submit-btn"]');
cy.typeWithDelay('[data-testid="search"]', 'laptop', 100);
```

### Test Organization

Tests are organized by feature:

- **`auth/`** - Login, registration, password reset
- **`products/`** - Product listing, filtering, search, details
- **`cart/`** - Add/remove items, quantity updates
- **`checkout/`** - Payment flow, order confirmation
- **`orders/`** - Order history, order details
- **`admin/`** - Admin dashboard tests

### Test Reports

#### Mochawesome Report

```bash
# Tests automatically generate Mochawesome reports
pnpm cy:run

# View report (generated after test run)
open cypress/reports/mochawesome-report/mochawesome.html
```

#### Allure Report

```bash
# Generate and open Allure report
pnpm report:allure
```

## ⚙️ Configuration

### Environment Configuration

Environment-specific configurations are in `cypress/config/environments/`:

```javascript
// dev.config.js
module.exports = {
  e2e: {
    baseUrl: 'http://localhost:5173',
    env: {
      apiUrl: 'http://localhost:3000',
      environment: 'development',
    },
  },
};
```

Switch environments using:

```bash
pnpm cy:open:qa     # Use QA environment
pnpm cy:run:staging # Run against staging
```

### Custom Environment Variables

Create a `.env` file:

```env
# API Configuration
API_PORT=3000
API_HOST=localhost

# Database
DATABASE_URL=./data/ecommerce.db

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRY=7d

# Frontend
VITE_API_URL=http://localhost:3000
```

### TypeScript Configuration

The project uses TypeScript with path aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@pages/*": ["./cypress/pages/*"],
      "@support/*": ["./cypress/support/*"],
      "@utils/*": ["./cypress/utils/*"],
      "@fixtures/*": ["./cypress/fixtures/*"]
    }
  }
}
```

Usage in tests:

```typescript
import { loginPage } from '@pages';
import UserBuilder from '@utils/builders/UserBuilder';
import users from '@fixtures/testdata/users.json';
```

## 🔄 CI/CD

### GitHub Actions

The project includes pre-configured GitHub Actions workflows:

#### Main CI Workflow (`.github/workflows/cypress-ci.yml`)

Runs on every push and pull request:

- ✅ Installs dependencies
- ✅ Starts API and Web servers
- ✅ Runs Cypress tests
- ✅ Multi-browser testing (Chrome, Firefox, Edge)
- ✅ Generates test reports
- ✅ Uploads artifacts (videos, screenshots)
- ✅ Comments test results on PRs

#### Nightly Regression (`.github/workflows/cypress-nightly.yml`)

Runs full regression suite every night:

- ✅ Comprehensive test coverage
- ✅ All browser combinations
- ✅ Performance monitoring
- ✅ Slack/email notifications

### Running in CI

```yaml
# Example GitHub Actions step
- name: Run Cypress tests
  run: pnpm cy:run:qa
  env:
    CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
```

### Test Artifacts

After test runs, the following artifacts are available:

- 📹 **Videos** - Full test execution recordings
- 📸 **Screenshots** - Failure screenshots
- 📊 **Reports** - HTML test reports
- 📝 **Logs** - Detailed execution logs

## 🎯 Best Practices

### Page Object Model

```typescript
// BasePage.ts - Inherit from base class
class BasePage {
  constructor(path = '/') {
    this.path = path;
  }
  
  visit() {
    cy.visit(this.path);
    return this;
  }
  
  waitForPageLoad() {
    cy.document().its('readyState').should('eq', 'complete');
    return this;
  }
}

// LoginPage.ts - Extend base class
class LoginPage extends BasePage {
  constructor() {
    super('/login');
  }
  
  get emailInput() {
    return cy.get('[data-testid="email-input"]');
  }
  
  enterEmail(email) {
    this.emailInput.type(email);
    return this;
  }
  
  login(email, password) {
    return this
      .enterEmail(email)
      .enterPassword(password)
      .clickLogin();
  }
}
```

### Component Reusability

```typescript
// Create reusable components for common UI elements
class HeaderComponent extends BaseComponent {
  clickCartIcon() {
    this.getElement('[data-testid="cart-icon"]').click();
    return this;
  }
  
  verifyUserLoggedIn(username) {
    this.getElement('[data-testid="user-menu"]')
      .should('contain', username);
    return this;
  }
}
```

### Test Data Management

```typescript
// Use fixtures for static data
cy.fixture('testdata/users.json').then((users) => {
  const validUser = users.validUser;
});

// Use builders for dynamic data
const user = UserBuilder.create()
  .withRandomEmail()
  .withPassword('Test@123')
  .build();
```

### API Mocking

```typescript
// Mock API responses for consistent testing
cy.intercept('GET', '/api/products', {
  fixture: 'api/products.json',
}).as('getProducts');

cy.visit('/products');
cy.wait('@getProducts');
```

### Authentication Caching

```typescript
// Use cy.session to cache authentication
cy.session('testUser', () => {
  cy.loginAsTestUser();
});

// Session is restored on subsequent tests
```

## 📚 Documentation

### Additional Resources

- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Detailed architecture overview
- **[CONTRIBUTING.md](./docs/CONTRIBUTING.md)** - Contribution guidelines
- **[TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** - Common issues and solutions

### External Documentation

- [Cypress Documentation](https://docs.cypress.io/)
- [Hono Documentation](https://hono.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

## 🧹 Maintenance

### Cleaning Up

```bash
# Remove all generated files
pnpm clean

# Remove only test reports
pnpm clean:reports

# Remove node_modules and reinstall
rm -rf node_modules apps/*/node_modules packages/*/node_modules
pnpm install
```

### Updating Dependencies

```bash
# Update all dependencies
pnpm update

# Update specific package
pnpm update cypress

# Check for outdated packages
pnpm outdated
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for details on:

- Code of Conduct
- Development workflow
- Commit message conventions
- Pull request process
- Testing requirements

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **QA Team** - Initial work and maintenance

## 🙏 Acknowledgments

- Built with [Cypress](https://www.cypress.io/)
- Powered by [Hono](https://hono.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- State management by [Zustand](https://zustand-demo.pmnd.rs/)

## 📞 Support

For issues and questions:

- 🐛 **Bug Reports**: Open an issue on GitHub
- 💬 **Discussions**: Use GitHub Discussions
- 📧 **Email**: [contact email]

## 🗺️ Roadmap

- [ ] Add visual regression testing with Percy/Applitools
- [ ] Implement API contract testing with Pact
- [ ] Add performance testing with Lighthouse CI
- [ ] Integrate with BrowserStack for cross-browser testing
- [ ] Add accessibility testing with axe-core
- [ ] Implement test data generation with Faker.js
- [ ] Add component testing for React components
- [ ] Integrate with TestRail for test management

---

**Happy Testing! 🚀**
