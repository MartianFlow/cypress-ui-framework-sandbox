import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import api from './routes/index.js';
import { errorMiddleware } from './middleware/error.js';

const app = new Hono();

// Middlewares
app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use('*', errorMiddleware);

// Mount API routes
app.route('/api/v1', api);

// Root endpoint
app.get('/', (c) => {
  return c.json({
    name: 'E-commerce API',
    version: '1.0.0',
    documentation: '/api/v1/health',
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ success: false, error: { message: 'Not found', code: 'NOT_FOUND' } }, 404);
});

const port = parseInt(process.env.PORT || '3001');

console.log(`Server starting on port ${port}...`);

serve({
  fetch: app.fetch,
  port,
});

console.log(`Server running at http://localhost:${port}`);
