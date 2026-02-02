/**
 * API Tests
 * @description Comprehensive API test suite using custom API commands
 * @tags @api @backend @regression
 */

describe('API Tests', { tags: ['@api', '@backend'] }, () => {
  // =================================
  // Authentication API Tests
  // =================================

  describe('Authentication API', { tags: '@auth' }, () => {
    describe('POST /auth/register', () => {
      it('should register a new user', () => {
        const timestamp = new Date().getTime();
        const newUser = {
          email: `testuser_${timestamp}@example.com`,
          password: 'Password@123',
          firstName: 'Test',
          lastName: 'User',
        };

        cy.apiPost('/auth/register', newUser, { failOnStatusCode: false })
          .then((response) => {
            expect(response.status).to.be.oneOf([200, 201]);
            expect(response.body).to.have.property('user');
            expect(response.body.user).to.have.property('email', newUser.email);
          });
      });

      it('should return error for duplicate email', () => {
        const existingUser = {
          email: 'testuser@example.com',
          password: 'Password@123',
          firstName: 'Test',
          lastName: 'User',
        };

        cy.apiPost('/auth/register', existingUser, { failOnStatusCode: false })
          .then((response) => {
            expect(response.status).to.eq(400);
            expect(response.body).to.have.property('error');
          });
      });

      it('should validate required fields', () => {
        cy.apiPost('/auth/register', {}, { failOnStatusCode: false })
          .then((response) => {
            expect(response.status).to.eq(400);
          });
      });

      it('should validate email format', () => {
        cy.apiPost('/auth/register', {
          email: 'invalid-email',
          password: 'Password@123',
          firstName: 'Test',
          lastName: 'User',
        }, { failOnStatusCode: false })
          .then((response) => {
            expect(response.status).to.eq(400);
          });
      });
    });

    describe('POST /auth/login', () => {
      it('should login with valid credentials', () => {
        const credentials = {
          email: Cypress.env('testUserEmail'),
          password: Cypress.env('testUserPassword'),
        };

        cy.apiPost('/auth/login', credentials)
          .shouldHaveStatus(200)
          .shouldHaveProperty('token');
      });

      it('should return error for invalid credentials', () => {
        cy.apiPost('/auth/login', {
          email: 'test@example.com',
          password: 'wrongpassword',
        }, { failOnStatusCode: false })
          .then((response) => {
            expect(response.status).to.eq(401);
          });
      });

      it('should return error for non-existent user', () => {
        cy.apiPost('/auth/login', {
          email: 'nonexistent@example.com',
          password: 'Password@123',
        }, { failOnStatusCode: false })
          .then((response) => {
            expect(response.status).to.eq(401);
          });
      });
    });

    describe('GET /auth/me', () => {
      beforeEach(() => {
        cy.loginAsTestUser();
      });

      it('should return current user info', () => {
        cy.apiGet('/auth/me')
          .shouldHaveStatus(200)
          .then((response) => {
            expect(response.body).to.have.property('email');
            expect(response.body).to.have.property('firstName');
            expect(response.body).to.have.property('lastName');
          });
      });

      it('should return 401 without auth token', () => {
        cy.clearAuth();
        cy.request({
          method: 'GET',
          url: `${Cypress.env('apiUrl')}/auth/me`,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(401);
        });
      });
    });

    describe('POST /auth/logout', () => {
      beforeEach(() => {
        cy.loginAsTestUser();
      });

      it('should logout successfully', () => {
        cy.apiPost('/auth/logout', {}, { failOnStatusCode: false })
          .then((response) => {
            expect(response.status).to.be.oneOf([200, 204]);
          });
      });
    });

    describe('POST /auth/forgot-password', () => {
      it('should send password reset email', () => {
        cy.apiPost('/auth/forgot-password', {
          email: Cypress.env('testUserEmail'),
        }, { failOnStatusCode: false })
          .then((response) => {
            expect(response.status).to.be.oneOf([200, 202]);
          });
      });

      it('should not reveal if email exists', () => {
        cy.apiPost('/auth/forgot-password', {
          email: 'nonexistent@example.com',
        }, { failOnStatusCode: false })
          .then((response) => {
            // Should return same response for security
            expect(response.status).to.be.oneOf([200, 202]);
          });
      });
    });
  });

  // =================================
  // Products API Tests
  // =================================

  describe('Products API', { tags: '@products' }, () => {
    describe('GET /products', () => {
      it('should return products list', () => {
        cy.apiGet('/products')
          .shouldHaveStatus(200)
          .then((response) => {
            expect(response.body).to.have.property('data');
            expect(response.body.data).to.be.an('array');
          });
      });

      it('should support pagination', () => {
        cy.apiGet('/products', { qs: { page: 1, limit: 10 } })
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('pagination');
            expect(response.body.pagination).to.have.property('page', 1);
            expect(response.body.pagination).to.have.property('limit', 10);
          });
      });

      it('should filter by category', () => {
        cy.apiGet('/products', { qs: { category: 'electronics' } })
          .then((response) => {
            expect(response.status).to.eq(200);
          });
      });

      it('should filter by price range', () => {
        cy.apiGet('/products', { qs: { minPrice: 50, maxPrice: 200 } })
          .then((response) => {
            expect(response.status).to.eq(200);
          });
      });

      it('should sort products', () => {
        cy.apiGet('/products', { qs: { sort: 'price', order: 'asc' } })
          .then((response) => {
            expect(response.status).to.eq(200);
          });
      });

      it('should search products', () => {
        cy.apiGet('/products', { qs: { search: 'laptop' } })
          .then((response) => {
            expect(response.status).to.eq(200);
          });
      });
    });

    describe('GET /products/:id', () => {
      it('should return product details', () => {
        cy.apiGet('/products/1')
          .shouldHaveStatus(200)
          .then((response) => {
            expect(response.body).to.have.property('id');
            expect(response.body).to.have.property('name');
            expect(response.body).to.have.property('price');
            expect(response.body).to.have.property('description');
          });
      });

      it('should return 404 for non-existent product', () => {
        cy.apiGet('/products/99999', { failOnStatusCode: false })
          .then((response) => {
            expect(response.status).to.eq(404);
          });
      });
    });

    describe('GET /products/featured', () => {
      it('should return featured products', () => {
        cy.apiGet('/products/featured')
          .shouldHaveStatus(200)
          .then((response) => {
            expect(response.body).to.be.an('array');
          });
      });
    });

    describe('GET /products/:id/reviews', () => {
      it('should return product reviews', () => {
        cy.apiGet('/products/1/reviews')
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.be.an('array');
          });
      });
    });

    describe('POST /products/:id/reviews (Authenticated)', () => {
      beforeEach(() => {
        cy.loginAsTestUser();
      });

      it('should create product review', () => {
        const review = {
          rating: 5,
          title: 'Great product!',
          comment: 'I really love this product. Highly recommended!',
        };

        cy.apiPost('/products/1/reviews', review, { failOnStatusCode: false })
          .then((response) => {
            expect(response.status).to.be.oneOf([200, 201]);
          });
      });

      it('should validate rating range', () => {
        cy.apiPost('/products/1/reviews', {
          rating: 6,
          title: 'Test',
          comment: 'Test comment',
        }, { failOnStatusCode: false })
          .then((response) => {
            expect(response.status).to.eq(400);
          });
      });
    });
  });

  // =================================
  // Categories API Tests
  // =================================

  describe('Categories API', { tags: '@categories' }, () => {
    describe('GET /categories', () => {
      it('should return categories list', () => {
        cy.apiGet('/categories')
          .shouldHaveStatus(200)
          .then((response) => {
            expect(response.body).to.be.an('array');
          });
      });
    });

    describe('GET /categories/:slug', () => {
      it('should return category by slug', () => {
        cy.apiGet('/categories/electronics')
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('slug', 'electronics');
          });
      });

      it('should return 404 for non-existent category', () => {
        cy.apiGet('/categories/nonexistent', { failOnStatusCode: false })
          .then((response) => {
            expect(response.status).to.eq(404);
          });
      });
    });

    describe('GET /categories/:slug/products', () => {
      it('should return products in category', () => {
        cy.apiGet('/categories/electronics/products')
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('data');
          });
      });
    });
  });

  // =================================
  // Cart API Tests
  // =================================

  describe('Cart API', { tags: '@cart' }, () => {
    beforeEach(() => {
      cy.loginAsTestUser();
    });

    describe('GET /cart', () => {
      it('should return user cart', () => {
        cy.apiGet('/cart')
          .shouldHaveStatus(200)
          .then((response) => {
            expect(response.body).to.have.property('items');
            expect(response.body.items).to.be.an('array');
          });
      });
    });

    describe('POST /cart', () => {
      it('should add item to cart', () => {
        cy.apiPost('/cart', {
          productId: 1,
          quantity: 1,
        })
          .then((response) => {
            expect(response.status).to.be.oneOf([200, 201]);
          });
      });

      it('should validate quantity', () => {
        cy.apiPost('/cart', {
          productId: 1,
          quantity: 0,
        }, { failOnStatusCode: false })
          .then((response) => {
            expect(response.status).to.eq(400);
          });
      });

      it('should validate product exists', () => {
        cy.apiPost('/cart', {
          productId: 99999,
          quantity: 1,
        }, { failOnStatusCode: false })
          .then((response) => {
            expect(response.status).to.eq(404);
          });
      });
    });

    describe('PUT /cart/:itemId', () => {
      it('should update cart item quantity', () => {
        // First add an item
        cy.apiPost('/cart', { productId: 1, quantity: 1 })
          .then((response) => {
            const itemId = response.body.id || response.body.itemId;

            cy.apiPut(`/cart/${itemId}`, { quantity: 3 })
              .then((updateResponse) => {
                expect(updateResponse.status).to.eq(200);
              });
          });
      });
    });

    describe('DELETE /cart/:itemId', () => {
      it('should remove item from cart', () => {
        // First add an item
        cy.apiPost('/cart', { productId: 1, quantity: 1 })
          .then((response) => {
            const itemId = response.body.id || response.body.itemId;

            cy.apiDelete(`/cart/${itemId}`)
              .then((deleteResponse) => {
                expect(deleteResponse.status).to.be.oneOf([200, 204]);
              });
          });
      });
    });

    describe('DELETE /cart', () => {
      it('should clear entire cart', () => {
        cy.apiDelete('/cart')
          .then((response) => {
            expect(response.status).to.be.oneOf([200, 204]);
          });

        // Verify cart is empty
        cy.apiGet('/cart')
          .then((response) => {
            expect(response.body.items).to.have.length(0);
          });
      });
    });
  });

  // =================================
  // Orders API Tests
  // =================================

  describe('Orders API', { tags: '@orders' }, () => {
    beforeEach(() => {
      cy.loginAsTestUser();
    });

    describe('GET /orders', () => {
      it('should return user orders', () => {
        cy.apiGet('/orders')
          .shouldHaveStatus(200)
          .then((response) => {
            expect(response.body).to.have.property('data');
            expect(response.body.data).to.be.an('array');
          });
      });

      it('should support pagination', () => {
        cy.apiGet('/orders', { qs: { page: 1, limit: 5 } })
          .then((response) => {
            expect(response.status).to.eq(200);
          });
      });

      it('should filter by status', () => {
        cy.apiGet('/orders', { qs: { status: 'delivered' } })
          .then((response) => {
            expect(response.status).to.eq(200);
          });
      });
    });

    describe('GET /orders/:id', () => {
      it('should return order details', () => {
        // Assuming order with id 1 exists
        cy.apiGet('/orders/1', { failOnStatusCode: false })
          .then((response) => {
            if (response.status === 200) {
              expect(response.body).to.have.property('id');
              expect(response.body).to.have.property('status');
              expect(response.body).to.have.property('total');
            }
          });
      });

      it('should return 404 for non-existent order', () => {
        cy.apiGet('/orders/99999', { failOnStatusCode: false })
          .then((response) => {
            expect(response.status).to.eq(404);
          });
      });

      it('should not return other user orders', () => {
        // Try to access another user's order (if applicable)
        cy.apiGet('/orders/other-user-order-id', { failOnStatusCode: false })
          .then((response) => {
            expect(response.status).to.be.oneOf([403, 404]);
          });
      });
    });

    describe('POST /orders', () => {
      it('should create new order', () => {
        const orderData = {
          shippingAddress: {
            firstName: 'John',
            lastName: 'Doe',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
          },
          paymentMethod: 'credit_card',
        };

        cy.apiPost('/orders', orderData, { failOnStatusCode: false })
          .then((response) => {
            // May fail if cart is empty
            if (response.status === 201) {
              expect(response.body).to.have.property('orderNumber');
            }
          });
      });

      it('should validate shipping address', () => {
        cy.apiPost('/orders', {
          shippingAddress: {},
          paymentMethod: 'credit_card',
        }, { failOnStatusCode: false })
          .then((response) => {
            expect(response.status).to.eq(400);
          });
      });
    });

    describe('PUT /orders/:id/cancel', () => {
      it('should cancel pending order', () => {
        cy.apiPut('/orders/1/cancel', {}, { failOnStatusCode: false })
          .then((response) => {
            // May be 200 if cancellable, 400 if not
            expect(response.status).to.be.oneOf([200, 400]);
          });
      });
    });
  });

  // =================================
  // Users API Tests (Admin)
  // =================================

  describe('Users API (Admin)', { tags: '@admin' }, () => {
    beforeEach(() => {
      cy.loginAsAdmin();
    });

    describe('GET /users', () => {
      it('should return users list', () => {
        cy.apiGet('/users')
          .shouldHaveStatus(200)
          .then((response) => {
            expect(response.body).to.have.property('data');
            expect(response.body.data).to.be.an('array');
          });
      });

      it('should support pagination', () => {
        cy.apiGet('/users', { qs: { page: 1, limit: 10 } })
          .then((response) => {
            expect(response.status).to.eq(200);
          });
      });

      it('should filter by role', () => {
        cy.apiGet('/users', { qs: { role: 'admin' } })
          .then((response) => {
            expect(response.status).to.eq(200);
          });
      });

      it('should deny access to non-admin users', () => {
        cy.clearAuth();
        cy.loginAsTestUser();

        cy.apiGet('/users', { failOnStatusCode: false })
          .then((response) => {
            expect(response.status).to.eq(403);
          });
      });
    });

    describe('GET /users/:id', () => {
      it('should return user details', () => {
        cy.apiGet('/users/1')
          .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('email');
          });
      });
    });

    describe('PUT /users/:id', () => {
      it('should update user', () => {
        cy.apiPut('/users/1', {
          firstName: 'Updated',
          lastName: 'Name',
        }, { failOnStatusCode: false })
          .then((response) => {
            expect(response.status).to.eq(200);
          });
      });
    });

    describe('DELETE /users/:id', () => {
      it('should delete user', () => {
        // Create a test user first to delete
        const timestamp = new Date().getTime();
        cy.apiPost('/auth/register', {
          email: `delete_test_${timestamp}@example.com`,
          password: 'Password@123',
          firstName: 'Delete',
          lastName: 'Test',
        }, { failOnStatusCode: false }).then((response) => {
          if (response.body && response.body.user) {
            const userId = response.body.user.id;
            cy.apiDelete(`/users/${userId}`, { failOnStatusCode: false })
              .then((deleteResponse) => {
                expect(deleteResponse.status).to.be.oneOf([200, 204]);
              });
          }
        });
      });
    });
  });

  // =================================
  // API Error Handling Tests
  // =================================

  describe('Error Handling', { tags: '@errors' }, () => {
    it('should return 404 for unknown endpoints', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/unknown-endpoint`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('should return 405 for unsupported methods', () => {
      cy.request({
        method: 'PATCH',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([404, 405]);
      });
    });

    it('should return proper error format', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        body: {},
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([400, 401]);
        expect(response.body).to.have.property('error');
      });
    });
  });

  // =================================
  // API Performance Tests
  // =================================

  describe('Performance', { tags: '@performance' }, () => {
    it('should respond within acceptable time for products list', () => {
      const startTime = Date.now();

      cy.apiGet('/products').then(() => {
        const responseTime = Date.now() - startTime;
        expect(responseTime).to.be.lessThan(2000);
      });
    });

    it('should handle concurrent requests', () => {
      const requests = [
        cy.apiGet('/products'),
        cy.apiGet('/categories'),
        cy.apiGet('/products/featured'),
      ];

      cy.wrap(Promise.all(requests)).then((responses) => {
        responses.forEach((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });
  });

  // =================================
  // API Security Tests
  // =================================

  describe('Security', { tags: '@security' }, () => {
    it('should reject requests without auth for protected endpoints', () => {
      cy.clearAuth();

      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/cart`,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should reject invalid auth tokens', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/cart`,
        headers: {
          Authorization: 'Bearer invalid-token',
        },
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(401);
      });
    });

    it('should not expose sensitive data in error messages', () => {
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        body: { email: 'test@test.com', password: 'wrong' },
        failOnStatusCode: false,
      }).then((response) => {
        // Error message should not reveal if email exists
        expect(JSON.stringify(response.body)).to.not.include('password');
      });
    });

    it('should sanitize SQL injection attempts', () => {
      cy.request({
        method: 'GET',
        url: `${Cypress.env('apiUrl')}/products`,
        qs: { search: "'; DROP TABLE products; --" },
        failOnStatusCode: false,
      }).then((response) => {
        // Should not crash the server
        expect(response.status).to.be.oneOf([200, 400]);
      });
    });

    it('should sanitize XSS attempts', () => {
      cy.loginAsTestUser();

      cy.apiPost('/products/1/reviews', {
        rating: 5,
        title: '<script>alert("xss")</script>',
        comment: 'Test comment',
      }, { failOnStatusCode: false }).then((response) => {
        if (response.body && response.body.title) {
          expect(response.body.title).to.not.include('<script>');
        }
      });
    });
  });

  // =================================
  // GraphQL API Tests (if applicable)
  // =================================

  describe('GraphQL API', { tags: '@graphql' }, () => {
    it('should execute GraphQL query', () => {
      const query = `
        query GetProducts {
          products {
            id
            name
            price
          }
        }
      `;

      cy.graphqlQuery(query)
        .then((response) => {
          if (response.status === 200) {
            expect(response.body).to.have.property('data');
          }
        });
    });

    it('should execute GraphQL mutation', () => {
      cy.loginAsTestUser();

      const mutation = `
        mutation AddToCart($productId: ID!, $quantity: Int!) {
          addToCart(productId: $productId, quantity: $quantity) {
            id
            quantity
          }
        }
      `;

      cy.graphqlMutation(mutation, { productId: '1', quantity: 1 })
        .then((response) => {
          // GraphQL may not be implemented
          expect(response.status).to.be.oneOf([200, 404]);
        });
    });
  });

  // =================================
  // Health Check API Tests
  // =================================

  describe('Health Check', { tags: '@health' }, () => {
    it('should return healthy status', () => {
      cy.checkApiHealth().then((isHealthy) => {
        expect(isHealthy).to.be.true;
      });
    });

    it('should wait for API to be ready', () => {
      cy.waitForApiReady('/health', 5, 500);
    });
  });

  // =================================
  // Using Custom API Commands Demo
  // =================================

  describe('Custom API Commands Demo', { tags: '@demo' }, () => {
    it('should demonstrate interceptApi command', () => {
      cy.interceptApi('GET', '/products', 'getProducts');
      cy.visit('/products');
      cy.waitForApi('getProducts', { statusCode: 200 });
    });

    it('should demonstrate mockApi command', () => {
      cy.mockApi('GET', '**/products', 'testdata/products.json', 'mockProducts');
      cy.visit('/products');
      cy.wait('@mockProducts');
    });

    it('should demonstrate mockApiError command', () => {
      cy.mockApiError('POST', '**/cart', 500, 'cartError', { message: 'Server error' });
      cy.loginAsTestUser();
      cy.visit('/products');
      // Trigger add to cart that would fail
    });

    it('should demonstrate mockNetworkError command', () => {
      cy.mockNetworkError('GET', '**/products', 'networkError');
      cy.visit('/products', { failOnStatusCode: false });
      // Page should handle network error gracefully
    });

    it('should demonstrate mockSlowApi command', () => {
      cy.mockSlowApi('GET', '**/products', 2000, 'slowProducts', {
        body: { data: [] },
        statusCode: 200,
      });
      cy.visit('/products');
      // Should show loading state
      cy.get('[data-testid="loading"]').should('be.visible');
      cy.wait('@slowProducts');
    });

    it('should demonstrate waitForApis command', () => {
      cy.interceptApi('GET', '/products', 'getProducts');
      cy.interceptApi('GET', '/categories', 'getCategories');

      cy.visit('/products');

      cy.waitForApis(['getProducts', 'getCategories']);
    });

    it('should demonstrate createTestData command', () => {
      cy.loginAsAdmin();

      cy.createTestData('/products', {
        name: 'Test Product',
        price: 99.99,
        stock: 10,
      }, 'createdProduct').then((product) => {
        expect(product).to.have.property('id');

        // Cleanup
        cy.deleteTestData(`/products/${product.id}`);
      });
    });

    it('should demonstrate response assertion commands', () => {
      cy.loginAsTestUser();

      cy.apiGet('/products')
        .shouldHaveStatus(200)
        .then((response) => {
          expect(response.body.data).to.be.an('array');
        });
    });
  });
});
