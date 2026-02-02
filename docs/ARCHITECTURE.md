# Architecture Documentation

This document describes the architecture and design patterns used in the Cypress UI Automation Framework.

## Table of Contents

- [Overview](#overview)
- [Design Patterns](#design-patterns)
- [Directory Structure](#directory-structure)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [Configuration Management](#configuration-management)
- [Extending the Framework](#extending-the-framework)

## Overview

The framework follows a layered architecture that separates concerns and promotes maintainability:

```
┌─────────────────────────────────────────────────────────────┐
│                        Test Layer                           │
│                   (cypress/e2e/*.cy.js)                     │
├─────────────────────────────────────────────────────────────┤
│                    Page Object Layer                        │
│                     (cypress/pages/)                        │
├───────────────────────┬─────────────────────────────────────┤
│    Component Layer    │         Utility Layer               │
│ (cypress/pages/       │    (cypress/utils/)                 │
│      components/)     │                                     │
├───────────────────────┴─────────────────────────────────────┤
│                   Custom Commands Layer                     │
│                 (cypress/support/commands/)                 │
├─────────────────────────────────────────────────────────────┤
│                      Cypress Core                           │
└─────────────────────────────────────────────────────────────┘
```

## Design Patterns

### 1. Page Object Model (POM)

Encapsulates page-specific elements and actions.

```javascript
// cypress/pages/auth/LoginPage.js
class LoginPage extends BasePage {
  constructor() {
    super('/login');
  }

  get emailInput() {
    return cy.getByTestId('email-input');
  }

  login(email, password) {
    this.enterEmail(email);
    this.enterPassword(password);
    this.clickLogin();
    return this;
  }
}
```

**Benefits:**
- Single source of truth for page elements
- Easy maintenance when UI changes
- Readable, fluent test syntax

### 2. Component Pattern

Reusable UI components that appear across pages.

```javascript
// cypress/pages/components/HeaderComponent.js
class HeaderComponent extends BaseComponent {
  constructor(rootSelector = '[data-testid="header"]') {
    super(rootSelector);
  }

  clickNavItem(text) {
    this.find('[data-testid="nav-menu"]').contains(text).click();
    return this;
  }
}
```

**Benefits:**
- DRY principle for common UI elements
- Consistent interaction patterns
- Isolated component testing

### 3. Factory Pattern

Centralized creation of page and component instances.

```javascript
// cypress/pages/index.js
class PageFactory {
  get loginPage() {
    return this._getPage(LoginPage);
  }

  getModal(selector) {
    return new ModalComponent(selector);
  }
}

// Usage in tests
import { loginPage, modal } from '../../pages';

loginPage().login(email, password);
modal().confirm();
```

**Benefits:**
- Centralized page management
- Instance caching
- Easy page discovery

### 4. Builder Pattern

Fluent API for constructing test data.

```javascript
// cypress/utils/builders/UserBuilder.js
class UserBuilder {
  withEmail(email) {
    this._user.email = email;
    return this;
  }

  asAdmin() {
    this._user.role = 'admin';
    return this;
  }

  build() {
    return { ...this._user };
  }
}

// Usage
const user = UserBuilder.create()
  .withRandomEmail()
  .asAdmin()
  .build();
```

**Benefits:**
- Readable data construction
- Default values with overrides
- Complex object creation

### 5. Command Pattern

Custom Cypress commands for common operations.

```javascript
// cypress/support/commands/auth.commands.js
Cypress.Commands.add('login', (email, password) => {
  cy.session(['login', email], () => {
    cy.visit('/login');
    cy.getByTestId('email-input').type(email);
    cy.getByTestId('password-input').type(password);
    cy.getByTestId('login-button').click();
  });
});
```

**Benefits:**
- Reusable operations
- Consistent behavior
- Session caching

## Directory Structure

```
cypress/
├── config/
│   └── environments/           # Environment-specific configs
│       ├── dev.config.js
│       ├── qa.config.js
│       ├── staging.config.js
│       └── prod.config.js
│
├── e2e/                        # Test specifications
│   ├── features/               # Feature tests (by domain)
│   │   └── auth/
│   │       └── login.cy.js
│   └── smoke/                  # Smoke test suite
│       └── smoke.cy.js
│
├── fixtures/                   # Static test data
│   ├── testdata/
│   │   └── users.json
│   └── api/
│       └── responses.json
│
├── pages/                      # Page Objects
│   ├── base/                   # Abstract base classes
│   │   ├── BasePage.js
│   │   └── BaseComponent.js
│   ├── components/             # Reusable UI components
│   │   ├── HeaderComponent.js
│   │   ├── ModalComponent.js
│   │   └── TableComponent.js
│   ├── auth/                   # Domain-specific pages
│   │   └── LoginPage.js
│   └── index.js                # Page Factory
│
├── support/                    # Support files
│   ├── commands/               # Custom commands
│   │   ├── auth.commands.js
│   │   ├── ui.commands.js
│   │   └── api.commands.js
│   └── e2e.js                  # Entry point
│
└── utils/                      # Utilities
    ├── builders/               # Data builders
    │   └── UserBuilder.js
    ├── constants/              # Constants
    │   ├── selectors.js
    │   ├── messages.js
    │   └── routes.js
    └── api/                    # API utilities
        └── ApiClient.js
```

## Core Components

### BasePage

Abstract base class providing common page functionality:

```javascript
class BasePage {
  constructor(path) {
    this.path = path;
  }

  visit() { /* Navigate to page */ }
  getByTestId(testId) { /* Get element by data-testid */ }
  waitForPageLoad() { /* Wait for page ready */ }
  verifyUrl(expected) { /* Assert URL */ }
}
```

### BaseComponent

Abstract base class for UI components:

```javascript
class BaseComponent {
  constructor(rootSelector) {
    this.rootSelector = rootSelector;
  }

  getRoot() { /* Get component root */ }
  find(selector) { /* Find within component */ }
  shouldBeVisible() { /* Assert visibility */ }
}
```

### PageFactory

Singleton factory for page management:

```javascript
class PageFactory {
  _getPage(PageClass, cached = true) {
    if (cached && this._pageCache.has(PageClass.name)) {
      return this._pageCache.get(PageClass.name);
    }
    return new PageClass();
  }
}
```

## Data Flow

### Test Execution Flow

```
Test File
    │
    ▼
Page Factory ──────► Page Object
    │                    │
    │                    ▼
    │               Base Page
    │                    │
    │                    ▼
    │               Components
    │                    │
    ▼                    ▼
Custom Commands ◄────────┘
    │
    ▼
Cypress Core
    │
    ▼
Browser
```

### Authentication Flow

```
cy.login()
    │
    ▼
cy.session() ──► Cache Hit? ──► Yes ──► Restore Session
    │                │
    │                ▼ No
    │                │
    │                ▼
    │           Login Actions
    │                │
    │                ▼
    │           Save Session
    │                │
    └────────────────┘
    │
    ▼
Continue Test
```

## Configuration Management

### Hierarchy

```
cypress.config.js (base)
    │
    ├── dev.config.js (extends base)
    ├── qa.config.js (extends base)
    ├── staging.config.js (extends base)
    └── prod.config.js (extends base)
```

### Environment Variables

```
.env.example (template)
    │
    ▼
.env (local, gitignored)
    │
    ▼
cypress.config.js (loads via dotenv)
    │
    ▼
Cypress.env() (runtime access)
```

## Extending the Framework

### Adding a New Page

1. Create page class in `cypress/pages/{domain}/`:

```javascript
// cypress/pages/products/ProductPage.js
const BasePage = require('../base/BasePage');

class ProductPage extends BasePage {
  constructor() {
    super('/products');
  }

  // Add page-specific methods
}

module.exports = ProductPage;
```

2. Export from PageFactory:

```javascript
// cypress/pages/index.js
const ProductPage = require('./products/ProductPage');

// In PageFactory class
get productPage() {
  return this._getPage(ProductPage);
}

// Export convenience function
function productPage() {
  return pageFactory.productPage;
}

module.exports = {
  // ...
  ProductPage,
  productPage,
};
```

### Adding a New Component

1. Create component in `cypress/pages/components/`:

```javascript
// cypress/pages/components/FilterComponent.js
const BaseComponent = require('../base/BaseComponent');

class FilterComponent extends BaseComponent {
  constructor(rootSelector = '[data-testid="filter"]') {
    super(rootSelector);
  }

  // Add component methods
}

module.exports = FilterComponent;
```

2. Export from index:

```javascript
// cypress/pages/index.js
const FilterComponent = require('./components/FilterComponent');

// Add to PageFactory
getFilter(selector) {
  return new FilterComponent(selector);
}

module.exports = {
  // ...
  FilterComponent,
};
```

### Adding Custom Commands

1. Create or update command file:

```javascript
// cypress/support/commands/custom.commands.js
Cypress.Commands.add('customAction', (param) => {
  // Implementation
});
```

2. Import in e2e.js:

```javascript
// cypress/support/e2e.js
import './commands/custom.commands';
```

### Adding a New Builder

1. Create builder in `cypress/utils/builders/`:

```javascript
// cypress/utils/builders/ProductBuilder.js
class ProductBuilder {
  constructor() {
    this._reset();
  }

  _reset() {
    this._product = {
      name: 'Test Product',
      price: 9.99,
    };
    return this;
  }

  withName(name) {
    this._product.name = name;
    return this;
  }

  build() {
    const product = { ...this._product };
    this._reset();
    return product;
  }

  static create() {
    return new ProductBuilder();
  }
}

module.exports = ProductBuilder;
```

## Testing Guidelines

### Test Organization

```
cypress/e2e/
├── features/          # Feature tests by domain
│   ├── auth/
│   ├── products/
│   └── checkout/
├── smoke/             # Critical path smoke tests
├── regression/        # Full regression suite
└── performance/       # Performance tests
```

### Naming Conventions

- Test files: `{feature}.cy.js`
- Page objects: `{Feature}Page.js`
- Components: `{Name}Component.js`
- Builders: `{Name}Builder.js`
- Commands: `{category}.commands.js`

### Tagging Strategy

```javascript
describe('Feature', { tags: ['@smoke', '@auth'] }, () => {
  it('critical test', { tags: '@critical' }, () => {});
  it('regression test', { tags: '@regression' }, () => {});
});
```

Run by tag:
```bash
npm run cy:run -- --env grepTags=@smoke
npm run cy:run -- --env grepTags="@smoke+@auth"
```
