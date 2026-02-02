import { Hono } from 'hono';
import { z } from 'zod';
import { db, schema } from '../db/index.js';
import { eq, like, or, sql } from 'drizzle-orm';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const users = new Hono();

// Apply auth middleware to all routes
users.use('*', authMiddleware);
users.use('*', requireRole('admin'));

const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  role: z.enum(['user', 'admin', 'moderator']).optional(),
});

const updateUserSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  role: z.enum(['user', 'admin', 'moderator']).optional(),
  status: z.enum(['active', 'inactive', 'pending', 'locked']).optional(),
});

// GET /users
users.get('/', async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const pageSize = parseInt(c.req.query('pageSize') || '10');
  const search = c.req.query('search');
  const role = c.req.query('role');
  const status = c.req.query('status');

  const offset = (page - 1) * pageSize;

  let query = db.select({
    id: schema.users.id,
    email: schema.users.email,
    firstName: schema.users.firstName,
    lastName: schema.users.lastName,
    avatar: schema.users.avatar,
    role: schema.users.role,
    status: schema.users.status,
    createdAt: schema.users.createdAt,
    updatedAt: schema.users.updatedAt,
  }).from(schema.users);

  const conditions = [];

  if (search) {
    conditions.push(
      or(
        like(schema.users.email, `%${search}%`),
        like(schema.users.firstName, `%${search}%`),
        like(schema.users.lastName, `%${search}%`)
      )
    );
  }

  if (role) {
    conditions.push(eq(schema.users.role, role as 'user' | 'admin' | 'moderator'));
  }

  if (status) {
    conditions.push(eq(schema.users.status, status as 'active' | 'inactive' | 'pending' | 'locked'));
  }

  if (conditions.length > 0) {
    query = query.where(conditions.length === 1 ? conditions[0] : sql`${conditions[0]} AND ${conditions.slice(1).map(c => c).join(' AND ')}`);
  }

  const allUsers = await query;
  const total = allUsers.length;
  const paginatedUsers = allUsers.slice(offset, offset + pageSize);

  return paginatedResponse(c, paginatedUsers, page, pageSize, total);
});

// GET /users/:id
users.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));

  const [user] = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      firstName: schema.users.firstName,
      lastName: schema.users.lastName,
      avatar: schema.users.avatar,
      role: schema.users.role,
      status: schema.users.status,
      createdAt: schema.users.createdAt,
      updatedAt: schema.users.updatedAt,
    })
    .from(schema.users)
    .where(eq(schema.users.id, id));

  if (!user) {
    return errorResponse(c, 'User not found', 404, 'NOT_FOUND');
  }

  return successResponse(c, { user });
});

// PUT /users/:id
users.put('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json();
  const result = updateUserSchema.safeParse(body);

  if (!result.success) {
    return errorResponse(c, 'Validation failed', 400, 'VALIDATION_ERROR',
      Object.fromEntries(result.error.errors.map(e => [e.path.join('.'), [e.message]]))
    );
  }

  const [existingUser] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, id));

  if (!existingUser) {
    return errorResponse(c, 'User not found', 404, 'NOT_FOUND');
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  if (result.data.firstName) updateData.firstName = result.data.firstName;
  if (result.data.lastName) updateData.lastName = result.data.lastName;
  if (result.data.role) updateData.role = result.data.role;
  if (result.data.status) updateData.status = result.data.status;

  const [updatedUser] = await db
    .update(schema.users)
    .set(updateData)
    .where(eq(schema.users.id, id))
    .returning();

  return successResponse(c, {
    user: {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
      status: updatedUser.status,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    },
  });
});

// POST /users
users.post('/', async (c) => {
  const body = await c.req.json();
  const result = createUserSchema.safeParse(body);

  if (!result.success) {
    return errorResponse(c, 'Validation failed', 400, 'VALIDATION_ERROR',
      Object.fromEntries(result.error.errors.map(e => [e.path.join('.'), [e.message]]))
    );
  }

  // Check if user already exists
  const [existingUser] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, result.data.email));

  if (existingUser) {
    return errorResponse(c, 'Email already exists', 400, 'EMAIL_EXISTS');
  }

  // Hash password (in a real app, use bcrypt)
  const hashedPassword = result.data.password; // Simplified for demo

  const [newUser] = await db
    .insert(schema.users)
    .values({
      email: result.data.email,
      password: hashedPassword,
      firstName: result.data.firstName,
      lastName: result.data.lastName,
      role: result.data.role || 'user',
      status: 'active',
    })
    .returning();

  return successResponse(c, {
    user: {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      role: newUser.role,
      status: newUser.status,
      createdAt: newUser.createdAt,
    },
  }, 201);
});

// DELETE /users/:id
users.delete('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const authUser = c.get('user');

  // Prevent self-deletion
  if (id === authUser.id) {
    return errorResponse(c, 'Cannot delete your own account', 400, 'SELF_DELETE');
  }

  const [existingUser] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, id));

  if (!existingUser) {
    return errorResponse(c, 'User not found', 404, 'NOT_FOUND');
  }

  await db.delete(schema.users).where(eq(schema.users.id, id));

  return successResponse(c, { message: 'User deleted successfully' });
});

// POST /users/:id/reset-password
users.post('/:id/reset-password', async (c) => {
  const id = parseInt(c.req.param('id'));

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, id));

  if (!user) {
    return errorResponse(c, 'User not found', 404, 'NOT_FOUND');
  }

  // In a real app, generate reset token and send email
  // For now, just return success
  return successResponse(c, {
    message: 'Password reset email sent successfully',
  });
});

// POST /users/:id/impersonate
users.post('/:id/impersonate', async (c) => {
  const id = parseInt(c.req.param('id'));
  const authUser = c.get('user');

  // Prevent self-impersonation
  if (id === authUser.id) {
    return errorResponse(c, 'Cannot impersonate yourself', 400, 'SELF_IMPERSONATE');
  }

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, id));

  if (!user) {
    return errorResponse(c, 'User not found', 404, 'NOT_FOUND');
  }

  // In a real app, create a temporary session for the impersonated user
  // For now, just return success
  return successResponse(c, {
    message: 'Impersonation started successfully',
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  });
});

// GET /users/:id/activity
users.get('/:id/activity', async (c) => {
  const id = parseInt(c.req.param('id'));

  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, id));

  if (!user) {
    return errorResponse(c, 'User not found', 404, 'NOT_FOUND');
  }

  // Get user's orders
  const orders = await db
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.userId, id));

  // Get user's reviews
  const reviews = await db
    .select()
    .from(schema.reviews)
    .where(eq(schema.reviews.userId, id));

  return successResponse(c, {
    activity: {
      ordersCount: orders.length,
      reviewsCount: reviews.length,
      recentOrders: orders.slice(0, 5),
      recentReviews: reviews.slice(0, 5),
    },
  });
});

export default users;
