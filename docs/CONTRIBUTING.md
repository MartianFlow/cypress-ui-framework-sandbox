# Contributing Guide

Thank you for your interest in contributing to the Cypress UI Automation Framework! This guide will help you get started.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Writing Tests](#writing-tests)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the issue, not the person
- Help others learn and grow

## Getting Started

### Prerequisites

- Node.js 18+ (LTS)
- npm 9+
- Git
- A code editor (VS Code recommended)

### Initial Setup

```bash
# Fork the repository on GitHub

# Clone your fork
git clone https://github.com/YOUR_USERNAME/cypress-ui-framework-sandbox.git
cd cypress-ui-framework-sandbox

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/cypress-ui-framework-sandbox.git

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Verify setup
npm run cy:open
```

### VS Code Extensions (Recommended)

- ESLint
- Prettier
- Cypress Snippets
- GitLens

## Development Workflow

### Branch Strategy

```
main                 # Production-ready code
├── develop          # Integration branch
│   ├── feature/*    # New features
│   ├── bugfix/*     # Bug fixes
│   ├── refactor/*   # Code refactoring
│   └── docs/*       # Documentation updates
```

### Creating a Branch

```bash
# Sync with upstream
git fetch upstream
git checkout develop
git merge upstream/develop

# Create feature branch
git checkout -b feature/add-new-component

# Work on your changes...

# Commit changes
git add .
git commit -m "feat: add new component"

# Push to your fork
git push origin feature/add-new-component
```

### Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add OAuth login support
fix(login): handle empty email validation
docs(readme): update installation steps
test(smoke): add new smoke test cases
refactor(pages): extract common methods to BasePage
```

## Coding Standards

### JavaScript Style

We use ESLint and Prettier for code formatting:

```bash
# Check linting
npm run lint:check

# Fix linting issues
npm run lint

# Check formatting
npm run format:check

# Fix formatting
npm run format
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | PascalCase (classes), camelCase (others) | `LoginPage.js`, `auth.commands.js` |
| Classes | PascalCase | `LoginPage`, `UserBuilder` |
| Functions | camelCase | `clickLogin()`, `verifyError()` |
| Variables | camelCase | `emailInput`, `validUser` |
| Constants | UPPER_SNAKE_CASE | `MAX_TIMEOUT`, `AUTH_SELECTORS` |
| Test IDs | kebab-case | `data-testid="login-button"` |

### Code Documentation

Use JSDoc comments for all public methods:

```javascript
/**
 * Login with email and password
 * @param {string} email - User email address
 * @param {string} password - User password
 * @param {Object} [options] - Login options
 * @param {boolean} [options.rememberMe=false] - Remember login
 * @returns {LoginPage} This page instance for chaining
 * @example
 * loginPage.login('user@example.com', 'password');
 */
login(email, password, options = {}) {
  // Implementation
}
```

### Selector Best Practices

1. **Always use data-testid:**
```javascript
// Good
cy.getByTestId('submit-button');

// Avoid
cy.get('.btn-primary');
cy.get('#submit');
cy.get('button[type="submit"]');
```

2. **Store selectors in constants:**
```javascript
// cypress/utils/constants/selectors.js
const LOGIN = {
  EMAIL_INPUT: '[data-testid="email-input"]',
  PASSWORD_INPUT: '[data-testid="password-input"]',
};
```

3. **Use page object properties:**
```javascript
class LoginPage extends BasePage {
  get emailInput() {
    return cy.get(SELECTORS.LOGIN.EMAIL_INPUT);
  }
}
```

## Writing Tests

### Test Structure

```javascript
/**
 * Feature/Component Name Tests
 * @description What this test suite covers
 * @tags @smoke @feature
 */
describe('Feature Name', { tags: ['@feature'] }, () => {
  // Setup
  before(() => {
    // One-time setup
  });

  beforeEach(() => {
    // Reset state before each test
    cy.clearAuth();
    loginPage().visit();
  });

  afterEach(() => {
    // Cleanup after each test
  });

  // Group related tests
  describe('Sub-feature', () => {
    it('should do something specific', () => {
      // Arrange
      const user = UserBuilder.standardUser();

      // Act
      loginPage().login(user.email, user.password);

      // Assert
      cy.url().should('include', '/dashboard');
    });
  });
});
```

### Test Guidelines

1. **One assertion focus per test:**
```javascript
// Good
it('should show error for invalid email', () => {
  loginPage().enterEmail('invalid').clickLogin();
  loginPage().verifyEmailError();
});

// Avoid
it('should validate form', () => {
  // Tests email, password, and terms all in one
});
```

2. **Use descriptive test names:**
```javascript
// Good
it('should display error message when password is empty');

// Avoid
it('test password');
```

3. **Keep tests independent:**
```javascript
// Each test should work in isolation
beforeEach(() => {
  cy.clearAuth();
  cy.visit('/');
});
```

4. **Mock external dependencies:**
```javascript
beforeEach(() => {
  cy.mockApi('GET', '/users', 'users.json', 'getUsers');
});
```

### Adding New Tests

1. Create test file in appropriate directory:
```
cypress/e2e/features/{domain}/{feature}.cy.js
```

2. Follow existing patterns and import conventions

3. Add appropriate tags:
```javascript
describe('New Feature', { tags: ['@smoke', '@new-feature'] }, () => {
```

4. Run tests locally before submitting:
```bash
npm run cy:run -- --spec "cypress/e2e/features/domain/feature.cy.js"
```

## Pull Request Process

### Before Submitting

1. **Sync with upstream:**
```bash
git fetch upstream
git rebase upstream/develop
```

2. **Run all checks:**
```bash
npm run lint:check
npm run format:check
npm run cy:run:smoke
```

3. **Update documentation** if needed

### PR Template

When creating a PR, include:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactoring
- [ ] Tests

## Testing Done
- [ ] All existing tests pass
- [ ] Added new tests for changes
- [ ] Tested manually

## Checklist
- [ ] Code follows style guidelines
- [ ] JSDoc comments added
- [ ] No console.logs or debugger statements
- [ ] Self-reviewed the code

## Screenshots (if applicable)

## Related Issues
Closes #123
```

### Review Process

1. Create PR against `develop` branch
2. CI checks must pass
3. At least one approval required
4. Address review comments
5. Squash and merge

## Reporting Issues

### Bug Reports

Include:
- Cypress version
- Node.js version
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos
- Error messages

### Feature Requests

Include:
- Use case description
- Proposed solution
- Alternative solutions considered
- Additional context

### Issue Template

```markdown
## Description
Clear description of the issue

## Environment
- Cypress: x.x.x
- Node: x.x.x
- OS: macOS/Windows/Linux
- Browser: Chrome x.x

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots/Logs
Include if applicable

## Additional Context
Any other relevant information
```

## Questions?

- Check existing issues and discussions
- Review the documentation
- Ask in the team channel

Thank you for contributing!
