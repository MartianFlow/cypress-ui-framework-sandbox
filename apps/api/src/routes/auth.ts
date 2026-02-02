import { Hono } from 'hono';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db, schema } from '../db/index.js';
import { eq } from 'drizzle-orm';
import { signToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { authMiddleware } from '../middleware/auth.js';
import { randomBytes } from 'crypto';

const auth = new Hono();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email address').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  acceptTerms: z.boolean().refine((val) => val === true, 'You must accept the terms'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const updateProfileSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  avatar: z.string().nullable().optional(),
});

// POST /auth/login
auth.post('/login', async (c) => {
  const body = await c.req.json();
  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return errorResponse(c, 'Validation failed', 400, 'VALIDATION_ERROR',
      Object.fromEntries(result.error.errors.map(e => [e.path.join('.'), [e.message]]))
    );
  }

  const { email, password } = result.data;

  // Find user
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email));

  if (!user) {
    return errorResponse(c, 'Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Check password
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return errorResponse(c, 'Invalid email or password', 401, 'INVALID_CREDENTIALS');
  }

  // Check status
  if (user.status !== 'active') {
    return errorResponse(c, `Your account is ${user.status}`, 403, 'ACCOUNT_NOT_ACTIVE');
  }

  // Generate token
  const token = await signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return successResponse(c, {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token,
  });
});

// POST /auth/register
auth.post('/register', async (c) => {
  const body = await c.req.json();
  const result = registerSchema.safeParse(body);

  if (!result.success) {
    return errorResponse(c, 'Validation failed', 400, 'VALIDATION_ERROR',
      Object.fromEntries(result.error.errors.map(e => [e.path.join('.'), [e.message]]))
    );
  }

  const { email, password, firstName, lastName } = result.data;

  // Check if email exists
  const [existingUser] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email));

  if (existingUser) {
    return errorResponse(c, 'Email already registered', 409, 'EMAIL_EXISTS');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const [newUser] = await db
    .insert(schema.users)
    .values({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: 'user',
      status: 'active',
    })
    .returning();

  // Generate token
  const token = await signToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });

  return successResponse(c, {
    user: {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      avatar: newUser.avatar,
      role: newUser.role,
      status: newUser.status,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    },
    token,
  }, 201);
});

// POST /auth/logout
auth.post('/logout', authMiddleware, async (c) => {
  // In a real app, you might invalidate the token here
  return successResponse(c, { message: 'Logged out successfully' });
});

// POST /auth/forgot-password
auth.post('/forgot-password', async (c) => {
  const body = await c.req.json();
  const result = forgotPasswordSchema.safeParse(body);

  if (!result.success) {
    return errorResponse(c, 'Validation failed', 400, 'VALIDATION_ERROR',
      Object.fromEntries(result.error.errors.map(e => [e.path.join('.'), [e.message]]))
    );
  }

  const { email } = result.data;

  // Find user
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email));

  // Always return success to prevent email enumeration
  if (!user) {
    return successResponse(c, { message: 'If an account exists, a reset link has been sent' });
  }

  // Delete existing tokens
  await db
    .delete(schema.passwordResetTokens)
    .where(eq(schema.passwordResetTokens.userId, user.id));

  // Create reset token
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  await db.insert(schema.passwordResetTokens).values({
    userId: user.id,
    token,
    expiresAt,
  });

  // In a real app, you would send an email here
  console.log(`Password reset token for ${email}: ${token}`);

  return successResponse(c, { message: 'If an account exists, a reset link has been sent' });
});

// POST /auth/reset-password
auth.post('/reset-password', async (c) => {
  const body = await c.req.json();
  const result = resetPasswordSchema.safeParse(body);

  if (!result.success) {
    return errorResponse(c, 'Validation failed', 400, 'VALIDATION_ERROR',
      Object.fromEntries(result.error.errors.map(e => [e.path.join('.'), [e.message]]))
    );
  }

  const { token, password } = result.data;

  // Find token
  const [resetToken] = await db
    .select()
    .from(schema.passwordResetTokens)
    .where(eq(schema.passwordResetTokens.token, token));

  if (!resetToken) {
    return errorResponse(c, 'Invalid or expired reset token', 400, 'INVALID_TOKEN');
  }

  // Check expiration
  if (new Date(resetToken.expiresAt) < new Date()) {
    await db
      .delete(schema.passwordResetTokens)
      .where(eq(schema.passwordResetTokens.id, resetToken.id));
    return errorResponse(c, 'Reset token has expired', 400, 'TOKEN_EXPIRED');
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update password
  await db
    .update(schema.users)
    .set({ password: hashedPassword, updatedAt: new Date().toISOString() })
    .where(eq(schema.users.id, resetToken.userId));

  // Delete token
  await db
    .delete(schema.passwordResetTokens)
    .where(eq(schema.passwordResetTokens.id, resetToken.id));

  return successResponse(c, { message: 'Password reset successfully' });
});

// GET /auth/me
auth.get('/me', authMiddleware, async (c) => {
  const authUser = c.get('user');

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
    .where(eq(schema.users.id, authUser.id));

  return successResponse(c, { user });
});

// PUT /auth/me
auth.put('/me', authMiddleware, async (c) => {
  const authUser = c.get('user');
  const body = await c.req.json();
  const result = updateProfileSchema.safeParse(body);

  if (!result.success) {
    return errorResponse(c, 'Validation failed', 400, 'VALIDATION_ERROR',
      Object.fromEntries(result.error.errors.map(e => [e.path.join('.'), [e.message]]))
    );
  }

  const updateData: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  if (result.data.firstName) updateData.firstName = result.data.firstName;
  if (result.data.lastName) updateData.lastName = result.data.lastName;
  if (result.data.avatar !== undefined) updateData.avatar = result.data.avatar;

  const [updatedUser] = await db
    .update(schema.users)
    .set(updateData)
    .where(eq(schema.users.id, authUser.id))
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

// PUT /auth/me/password
auth.put('/me/password', authMiddleware, async (c) => {
  const authUser = c.get('user');
  const body = await c.req.json();
  const result = changePasswordSchema.safeParse(body);

  if (!result.success) {
    return errorResponse(c, 'Validation failed', 400, 'VALIDATION_ERROR',
      Object.fromEntries(result.error.errors.map(e => [e.path.join('.'), [e.message]]))
    );
  }

  const { currentPassword, newPassword } = result.data;

  // Get user with password
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, authUser.id));

  // Verify current password
  const passwordMatch = await bcrypt.compare(currentPassword, user.password);
  if (!passwordMatch) {
    return errorResponse(c, 'Current password is incorrect', 400, 'INVALID_PASSWORD');
  }

  // Hash and update password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db
    .update(schema.users)
    .set({ password: hashedPassword, updatedAt: new Date().toISOString() })
    .where(eq(schema.users.id, authUser.id));

  return successResponse(c, { message: 'Password changed successfully' });
});

export default auth;
