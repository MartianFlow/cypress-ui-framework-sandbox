import type { Context, Next } from 'hono';
import { verifyToken } from '../utils/jwt.js';
import { errorResponse } from '../utils/response.js';
import { db, schema } from '../db/index.js';
import { eq } from 'drizzle-orm';

export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
}

declare module 'hono' {
  interface ContextVariableMap {
    user: AuthUser;
  }
}

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(c, 'Authorization required', 401, 'UNAUTHORIZED');
  }

  const token = authHeader.substring(7);
  const payload = await verifyToken(token);

  if (!payload) {
    return errorResponse(c, 'Invalid or expired token', 401, 'INVALID_TOKEN');
  }

  // Get user from database
  const [user] = await db
    .select({
      id: schema.users.id,
      email: schema.users.email,
      firstName: schema.users.firstName,
      lastName: schema.users.lastName,
      role: schema.users.role,
      status: schema.users.status,
    })
    .from(schema.users)
    .where(eq(schema.users.id, payload.userId));

  if (!user) {
    return errorResponse(c, 'User not found', 401, 'USER_NOT_FOUND');
  }

  if (user.status !== 'active') {
    return errorResponse(c, `Account is ${user.status}`, 403, 'ACCOUNT_NOT_ACTIVE');
  }

  c.set('user', user);
  await next();
}

export async function optionalAuthMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = await verifyToken(token);

    if (payload) {
      const [user] = await db
        .select({
          id: schema.users.id,
          email: schema.users.email,
          firstName: schema.users.firstName,
          lastName: schema.users.lastName,
          role: schema.users.role,
          status: schema.users.status,
        })
        .from(schema.users)
        .where(eq(schema.users.id, payload.userId));

      if (user && user.status === 'active') {
        c.set('user', user);
      }
    }
  }

  await next();
}

export function requireRole(...roles: string[]) {
  return async (c: Context, next: Next) => {
    const user = c.get('user');

    if (!user) {
      return errorResponse(c, 'Authorization required', 401, 'UNAUTHORIZED');
    }

    if (!roles.includes(user.role)) {
      return errorResponse(c, 'Insufficient permissions', 403, 'FORBIDDEN');
    }

    await next();
  };
}
