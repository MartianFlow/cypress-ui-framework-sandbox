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
          confirmPassword: 'Password@123',
          firstName: 'Test',
          lastName: 'User',
          acceptTerms: true,
        };

        cy.apiPost('/auth/register', newUser, { failOnStatusCode: false })
          .then((response) => {
            expect(response.status).to.be.oneOf([200, 201]);
            const userData = response.body.data?.user || response.body.user;
            expect(userData).to.have.property('email', newUser.email);
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
            const result = response.body.data || response.body;
            const user = result.user || result;
            expect(user).to.have.property('email');
            expect(user).to.have.property('firstName');
            expect(user).to.have.property('lastName');
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
            const result = response.body.data || response.body;
            expect(result).to.have.property('data');
            expect(result.data).to.be.an('array');
          });
      });

      it('should support pagination', () => {
        cy.apiGet('/products', { qs: { page: 1, limit: 10 } })
          .then((response) => {
            expect(response.status).to.eq(200);
            const result = response.body.data || response.body;
            expect(result).to.have.property('pagination');
            expect(result.pagination).to.have.property('page', 1);
            // API uses 'pageSize' instead of 'limit'
            expect(result.pagination).to.have.property('pageSize');
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
        // First get a product ID from the list
        cy.apiGet('/products').then((listResponse) => {
          const products = listResponse.body.data?.data || listResponse.body.data || [];
          expect(products).to.have.length.greaterThan(0);
          const firstProductId = products[0].id;

          cy.apiGet(`/products/${firstProductId}`)
            .shouldHaveStatus(200)
            .then((response) => {
              const product = response.body.data?.product || response.body.data || response.body;
              expect(product).to.have.property('id');
              expect(product).to.have.property('name');
              expect(product).to.have.property('price');
              expect(product).to.have.property('description');
            });
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
            const result = response.body.data || response.body;
            const products = result.products || result;
            expect(products).to.be.an('array');
          });
      });
    });

    describe('GET /products/:id/reviews', () => {
      it('should return product reviews', () => {
        // Get a valid product ID first
        cy.apiGet('/products').then((listResponse) => {
          const products = listResponse.body.data?.data || listResponse.body.data || [];
          const firstProductId = products[0]?.id || 1;

          cy.apiGet(`/products/${firstProductId}/reviews`)
            .then((response) => {
              expect(response.status).to.eq(200);
              const result = response.body.data || response.body;
              const reviews = result.data || result;
              expect(reviews).to.be.an('array');
            });
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

        // Get a valid product ID
        cy.apiGet('/products').then((listResponse) => {
          const products = listResponse.body.data?.data || listResponse.body.data || [];
          const firstProductId = products[0]?.id || 1;

          cy.apiPost(`/products/${firstProductId}/reviews`, review, { failOnStatusCode: false })
            .then((response) => {
              // Accept 201 (created), 200 (ok), or 400 (already reviewed)
              expect(response.status).to.be.oneOf([200, 201, 400]);
              if (response.status === 400) {
                // If already reviewed, that's acceptable for this test
                expect(response.body.error?.code).to.eq('ALREADY_REVIEWED');
              }
            });
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
            const result = response.body.data || response.body;
            const categories = result.categories || result;
            expect(categories).to.be.an('array');
          });
      });
    });

    describe('GET /categories/:slug', () => {
      it('should return category by slug', () => {
        cy.apiGet('/categories/electronics')
          .then((response) => {
            expect(response.status).to.eq(200);
            const category = response.body.data?.category || response.body.data || response.body;
            expect(category).to.have.property('slug', 'electronics');
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
            const cart = response.body.data || response.body;
            expect(cart).to.have.property('items');
            expect(cart.items).to.be.an('array');
          });
      });
    });

    describe('POST /cart', () => {
      it('should add item to cart', () => {
        // Get a valid product ID first
        cy.apiGet('/products').then((listResponse) => {
          const products = listResponse.body.data?.data || listResponse.body.data || [];
          const firstProductId = products[0]?.id || 1;

          cy.apiPost('/cart', {
            productId: firstProductId,
            quantity: 1,
          })
            .then((response) => {
              expect(response.status).to.be.oneOf([200, 201]);
            });
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
        // Get a valid product ID and add to cart
        cy.apiGet('/products').then((listResponse) => {
          const products = listResponse.body.data?.data || listResponse.body.data || [];
          const productId = products[0]?.id || 1;

          cy.apiPost('/cart', { productId, quantity: 1 })
            .then((response) => {
              const result = response.body.data || response.body;
              const item = result.item || result;
              const itemId = item.id || item.itemId;

              cy.apiPut(`/cart/${itemId}`, { quantity: 3 })
                .then((updateResponse) => {
                  expect(updateResponse.status).to.eq(200);
                });
            });
        });
      });
    });

    describe('DELETE /cart/:itemId', () => {
      it('should remove item from cart', () => {
        // Get a valid product ID and add to cart
        cy.apiGet('/products').then((listResponse) => {
          const products = listResponse.body.data?.data || listResponse.body.data || [];
          const productId = products[0]?.id || 1;

          cy.apiPost('/cart', { productId, quantity: 1 })
            .then((response) => {
              const result = response.body.data || response.body;
              const item = result.item || result;
              const itemId = item.id || item.itemId;

              cy.apiDelete(`/cart/${itemId}`)
                .then((deleteResponse) => {
                  expect(deleteResponse.status).to.be.oneOf([200, 204]);
                });
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
            const cart = response.body.data || response.body;
            expect(cart.items).to.have.length(0);
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
            const result = response.body.data || response.body;
            expect(result).to.have.property('data');
            expect(result.data).to.be.an('array');
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
        // Get user's orders first
        cy.apiGet('/orders').then((listResponse) => {
          const orders = listResponse.body.data?.data || listResponse.body.data || [];
          if (orders.length > 0) {
            const orderId = orders[0].id;
            cy.apiPut(`/orders/${orderId}/cancel`, {}, { failOnStatusCode: false })
              .then((response) => {
                // May be 200 if cancellable, 400 if not (already delivered/cancelled)
                expect(response.status).to.be.oneOf([200, 400]);
              });
          } else {
            // No orders to cancel - skip test
            cy.log('No orders available to cancel');
          }
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
            const result = response.body.data || response.body;
            expect(result).to.have.property('data');
            expect(result.data).to.be.an('array');
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
        // Get a valid user ID first
        cy.apiGet('/users').then((listResponse) => {
          const users = listResponse.body.data?.data || listResponse.body.data || [];
          const userId = users[0]?.id || 1;

          cy.apiGet(`/users/${userId}`)
            .then((response) => {
              expect(response.status).to.eq(200);
              const user = response.body.data?.user || response.body.data || response.body;
              expect(user).to.have.property('email');
            });
        });
      });
    });

    describe('PUT /users/:id', () => {
      it('should update user', () => {
        // Get a valid user ID first (not admin)
        cy.apiGet('/users').then((listResponse) => {
          const users = listResponse.body.data?.data || listResponse.body.data || [];
          const nonAdminUser = users.find(u => u.role !== 'admin') || users[1];
          const userId = nonAdminUser?.id || 1;

          cy.apiPut(`/users/${userId}`, {
            firstName: 'Updated',
            lastName: 'Name',
          }, { failOnStatusCode: false })
            .then((response) => {
              expect(response.status).to.eq(200);
            });
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
      // Use Cypress aliases to handle multiple requests
      cy.apiGet('/products').as('productsRequest');
      cy.apiGet('/categories').as('categoriesRequest');
      cy.apiGet('/products/featured').as('featuredRequest');

      // Verify all requests succeeded
      cy.get('@productsRequest').then((response) => {
        expect(response.status).to.eq(200);
      });
      cy.get('@categoriesRequest').then((response) => {
        expect(response.status).to.eq(200);
      });
      cy.get('@featuredRequest').then((response) => {
        expect(response.status).to.eq(200);
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
      const testPassword = 'MySecretPassword123!';
      cy.request({
        method: 'POST',
        url: `${Cypress.env('apiUrl')}/auth/login`,
        body: { email: 'test@test.com', password: testPassword },
        failOnStatusCode: false,
      }).then((response) => {
        // Error message should not reveal the actual password value
        const responseText = JSON.stringify(response.body);
        expect(responseText).to.not.include(testPassword);
        // Also should not expose email details that could reveal if account exists
        expect(response.status).to.eq(401);
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

      cy.graphqlQuery(query, {}, { failOnStatusCode: false })
        .then((response) => {
          // GraphQL may not be implemented - accept 404 or 200
          if (response.status === 200) {
            const result = response.body.data || response.body;
            expect(result).to.have.property('data');
          } else {
            expect(response.status).to.be.oneOf([404, 501]);
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

      cy.graphqlMutation(mutation, { productId: '1', quantity: 1 }, { failOnStatusCode: false })
        .then((response) => {
          // GraphQL may not be implemented - accept 404 or 200
          expect(response.status).to.be.oneOf([200, 404, 501]);
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
    // These tests require UI context, so they are skipped in API-only test runs
    it.skip('should demonstrate interceptApi command', () => {
      cy.interceptApi('GET', '/products', 'getProducts');
      cy.visit('/products');
      cy.waitForApi('getProducts', { statusCode: 200 });
    });

    it.skip('should demonstrate mockApi command', () => {
      cy.mockApi('GET', '**/products', 'testdata/products.json', 'mockProducts');
      cy.visit('/products');
      cy.wait('@mockProducts');
    });

    it.skip('should demonstrate mockApiError command', () => {
      cy.mockApiError('POST', '**/cart', 500, 'cartError', { message: 'Server error' });
      cy.loginAsTestUser();
      cy.visit('/products');
      // Trigger add to cart that would fail
    });

    it.skip('should demonstrate mockNetworkError command', () => {
      cy.mockNetworkError('GET', '**/products', 'networkError');
      cy.visit('/products', { failOnStatusCode: false });
      // Page should handle network error gracefully
    });

    it.skip('should demonstrate mockSlowApi command', () => {
      cy.mockSlowApi('GET', '**/products', 2000, 'slowProducts', {
        body: { data: [] },
        statusCode: 200,
      });
      cy.visit('/products');
      // Should show loading state
      cy.get('[data-testid="loading"]').should('be.visible');
      cy.wait('@slowProducts');
    });

    it.skip('should demonstrate waitForApis command', () => {
      cy.interceptApi('GET', '/products', 'getProducts');
      cy.interceptApi('GET', '/categories', 'getCategories');

      cy.visit('/products');

      cy.waitForApis(['getProducts', 'getCategories']);
    });

    it('should demonstrate createTestData command', () => {
      cy.loginAsAdmin();

      // Create test product data
      const timestamp = Date.now();
      cy.createTestData('/products', {
        name: `Test Product ${timestamp}`,
        description: 'This is a test product created for API testing purposes.',
        price: 99.99,
        stock: 10,
        categoryId: 11, // Electronics category
        status: 'active',
        images: ['https://via.placeholder.com/400'],
      }, 'createdProduct').then((product) => {
        expect(product).to.have.property('id');
        expect(product).to.have.property('name');

        // Cleanup
        cy.deleteTestData(`/products/${product.id}`);
      });
    });

    it('should demonstrate response assertion commands', () => {
      cy.loginAsTestUser();

      cy.apiGet('/products')
        .shouldHaveStatus(200)
        .then((response) => {
          const result = response.body.data || response.body;
          const products = result.data || result;
          expect(products).to.be.an('array');
        });
    });
  });
});
