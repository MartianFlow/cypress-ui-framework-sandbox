# Troubleshooting Guide

This guide helps resolve common issues when working with the Cypress UI Automation Framework.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Test Execution Issues](#test-execution-issues)
- [Authentication Issues](#authentication-issues)
- [Element Interaction Issues](#element-interaction-issues)
- [API/Network Issues](#apinetwork-issues)
- [CI/CD Issues](#cicd-issues)
- [Performance Issues](#performance-issues)
- [Reporting Issues](#reporting-issues)

## Installation Issues

### Cypress Binary Not Found

**Error:**
```
The cypress npm package is installed, but the Cypress binary is missing.
```

**Solution:**
```bash
# Clear Cypress cache and reinstall
npx cypress cache clear
npm ci
npx cypress install
npx cypress verify
```

### Node Version Mismatch

**Error:**
```
The engine "node" is incompatible with this module.
```

**Solution:**
```bash
# Check Node version
node --version

# Use Node 18+ (recommended: use nvm)
nvm install 18
nvm use 18
npm ci
```

### Permission Errors on macOS/Linux

**Error:**
```
EACCES: permission denied
```

**Solution:**
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) ~/.cache

# Or use nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### npm Install Fails

**Error:**
```
npm ERR! code ERESOLVE
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Test Execution Issues

### Tests Not Found

**Error:**
```
No specs found
```

**Solution:**
1. Check spec pattern in `cypress.config.js`:
```javascript
e2e: {
  specPattern: 'cypress/e2e/**/*.cy.js',
}
```

2. Verify file naming (must end with `.cy.js`)

3. Check file exists in correct directory

### Test Timeout

**Error:**
```
Timed out retrying after 4000ms
```

**Solution:**
1. Increase timeout for specific command:
```javascript
cy.get('[data-testid="slow-element"]', { timeout: 10000 });
```

2. Or globally in config:
```javascript
// cypress.config.js
defaultCommandTimeout: 10000,
```

3. Wait for specific condition:
```javascript
cy.get('[data-testid="loading"]').should('not.exist');
cy.get('[data-testid="content"]').should('be.visible');
```

### Browser Crashes

**Error:**
```
Browser closed unexpectedly
```

**Solution:**
1. Increase memory:
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run cy:run
```

2. Disable video recording:
```javascript
// cypress.config.js
video: false,
```

3. Run in different browser:
```bash
npm run cy:run -- --browser firefox
```

### Cross-Origin Errors

**Error:**
```
Blocked a frame with origin from accessing a cross-origin frame
```

**Solution:**
1. Use `cy.origin()`:
```javascript
cy.origin('https://external-site.com', () => {
  cy.get('#external-element').click();
});
```

2. Or disable web security (not recommended for production):
```javascript
// cypress.config.js
chromeWebSecurity: false,
```

## Authentication Issues

### Session Not Persisting

**Error:**
```
Session validation failed
```

**Solution:**
1. Check session validation:
```javascript
cy.session('user',
  () => { /* setup */ },
  {
    validate: () => {
      // Verify session is still valid
      cy.request('/api/auth/me').its('status').should('eq', 200);
    },
    cacheAcrossSpecs: true,
  }
);
```

2. Clear cached sessions:
```javascript
beforeEach(() => {
  Cypress.session.clearAllSavedSessions();
});
```

### Login Redirect Loop

**Problem:** Test keeps redirecting between login and protected page.

**Solution:**
1. Wait for login to complete:
```javascript
cy.login(email, password);
cy.url().should('not.include', '/login');
cy.getByTestId('user-menu').should('be.visible');
```

2. Mock authentication:
```javascript
cy.intercept('POST', '/auth/login', {
  statusCode: 200,
  body: { token: 'mock-token' },
});
```

### Token Expiration

**Problem:** Tests fail due to expired tokens.

**Solution:**
```javascript
// Refresh token before test
beforeEach(() => {
  cy.request('POST', '/auth/refresh').then((response) => {
    cy.setLocalStorage('authToken', response.body.token);
  });
});
```

## Element Interaction Issues

### Element Not Visible

**Error:**
```
element is not visible
```

**Solution:**
1. Scroll element into view:
```javascript
cy.getByTestId('hidden-element').scrollIntoView().click();
```

2. Wait for animations:
```javascript
cy.getByTestId('animated-element')
  .should('be.visible')
  .and('not.have.class', 'animating');
```

3. Check for overlays:
```javascript
cy.get('[data-testid="overlay"]').should('not.exist');
cy.getByTestId('button').click();
```

### Element Detached

**Error:**
```
element has become detached from the DOM
```

**Solution:**
```javascript
// Re-query the element
cy.getByTestId('dynamic-element').should('exist').click();

// Or use alias
cy.getByTestId('element').as('myElement');
cy.get('@myElement').click();
```

### Cannot Type in Input

**Error:**
```
element must be visible to type
```

**Solution:**
1. Clear and type:
```javascript
cy.getByTestId('input').clear().type('text');
```

2. Force type:
```javascript
cy.getByTestId('input').type('text', { force: true });
```

3. Check for disabled state:
```javascript
cy.getByTestId('input').should('be.enabled').type('text');
```

### Click Intercepted

**Error:**
```
element is being covered by another element
```

**Solution:**
1. Wait for overlay to disappear:
```javascript
cy.get('.loading-overlay').should('not.exist');
cy.getByTestId('button').click();
```

2. Scroll into view:
```javascript
cy.getByTestId('button').scrollIntoView().click();
```

3. Force click (use cautiously):
```javascript
cy.getByTestId('button').click({ force: true });
```

## API/Network Issues

### Request Timeout

**Error:**
```
ESOCKETTIMEDOUT
```

**Solution:**
1. Increase request timeout:
```javascript
cy.request({
  url: '/api/slow-endpoint',
  timeout: 60000,
});
```

2. Or globally:
```javascript
// cypress.config.js
requestTimeout: 30000,
responseTimeout: 30000,
```

### Intercept Not Working

**Problem:** `cy.intercept()` doesn't catch requests.

**Solution:**
1. Register intercept before action:
```javascript
// Correct order
cy.intercept('GET', '/api/users').as('getUsers');
cy.visit('/users');
cy.wait('@getUsers');
```

2. Check URL pattern:
```javascript
// Use regex for dynamic parts
cy.intercept('GET', /\/api\/users\/\d+/).as('getUser');
```

3. Check HTTP method:
```javascript
// POST not GET
cy.intercept('POST', '/api/users').as('createUser');
```

### CORS Errors

**Error:**
```
Access-Control-Allow-Origin
```

**Solution:**
1. Disable web security:
```javascript
// cypress.config.js
chromeWebSecurity: false,
```

2. Or mock the API:
```javascript
cy.intercept('GET', '/external-api/*', { fixture: 'mock-data.json' });
```

## CI/CD Issues

### Tests Pass Locally, Fail in CI

**Common causes and solutions:**

1. **Timing differences:**
```javascript
// Add explicit waits
cy.waitForLoading();
cy.getByTestId('element').should('be.visible');
```

2. **Environment differences:**
```yaml
# Ensure consistent environment
env:
  CYPRESS_BASE_URL: ${{ secrets.BASE_URL }}
```

3. **Missing dependencies:**
```yaml
# Install all browsers
- name: Install browsers
  run: npx cypress install --force
```

### Parallel Execution Failures

**Problem:** Tests interfere with each other.

**Solution:**
1. Ensure test isolation:
```javascript
beforeEach(() => {
  cy.clearAuth();
  cy.clearLocalStorage();
});
```

2. Use unique test data:
```javascript
const user = UserBuilder.create().withRandomEmail().build();
```

### Artifacts Not Uploaded

**Problem:** Screenshots/videos missing in CI.

**Solution:**
```yaml
- name: Upload artifacts
  uses: actions/upload-artifact@v4
  if: always()  # Run even if tests fail
  with:
    name: cypress-artifacts
    path: |
      cypress/screenshots
      cypress/videos
```

## Performance Issues

### Slow Test Execution

**Solutions:**

1. **Use API for setup:**
```javascript
// Instead of UI login
cy.loginByApi(email, password);
```

2. **Mock external services:**
```javascript
cy.intercept('GET', '/slow-api', { fixture: 'data.json' });
```

3. **Disable unnecessary features:**
```javascript
// cypress.config.js
video: false,
screenshotOnRunFailure: false,
```

4. **Use session caching:**
```javascript
cy.session('user', () => {
  cy.loginByApi(email, password);
}, {
  cacheAcrossSpecs: true,
});
```

### High Memory Usage

**Solutions:**

1. **Increase Node memory:**
```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run cy:run
```

2. **Run fewer parallel processes:**
```bash
npm run cy:run -- --parallel --record --group "my-tests"
```

3. **Clean up after tests:**
```javascript
afterEach(() => {
  cy.clearLocalStorage();
  cy.clearCookies();
});
```

## Reporting Issues

### Reports Not Generated

**Problem:** Mochawesome reports missing.

**Solution:**
1. Check reporter config:
```javascript
// cypress.config.js
reporter: 'mochawesome',
reporterOptions: {
  reportDir: 'cypress/reports/mochawesome',
  overwrite: false,
  html: false,
  json: true,
},
```

2. Run merge script:
```bash
npm run report:generate
```

### Allure Reports Empty

**Problem:** Allure report shows no data.

**Solution:**
1. Check plugin setup:
```javascript
// cypress/support/e2e.js
import '@shelex/cypress-allure-plugin';
```

2. Verify results path:
```javascript
// cypress.config.js
env: {
  allure: true,
  allureResultsPath: 'cypress/reports/allure-results',
},
```

3. Generate report:
```bash
npx allure generate cypress/reports/allure-results --clean
npx allure open
```

## Getting More Help

If you're still stuck:

1. Check [Cypress Documentation](https://docs.cypress.io)
2. Search [Cypress GitHub Issues](https://github.com/cypress-io/cypress/issues)
3. Ask in team Slack channel
4. Create a detailed issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Relevant code snippets
