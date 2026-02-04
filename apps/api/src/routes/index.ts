import { Hono } from 'hono';
import auth from './auth.js';
import users from './users.js';
import categories from './categories.js';
import products from './products.js';
import cart from './cart.js';
import orders from './orders.js';
import payments from './payments.js';
import coupons from './coupons.js';

const api = new Hono();

// Mount routes
api.route('/auth', auth);
api.route('/users', users);
api.route('/categories', categories);
api.route('/products', products);
api.route('/cart', cart);
api.route('/orders', orders);
api.route('/payments', payments);
api.route('/coupons', coupons);

// Health check
api.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default api;
