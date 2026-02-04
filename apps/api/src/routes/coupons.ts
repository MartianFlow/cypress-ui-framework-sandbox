import { Hono } from 'hono';
import { z } from 'zod';
import { db, schema } from '../db/index.js';
import { eq, and } from 'drizzle-orm';
import { successResponse, errorResponse } from '../utils/response.js';
import { authMiddleware } from '../middleware/auth.js';

const coupons = new Hono();

coupons.use('*', authMiddleware);

const applyCouponSchema = z.object({
  code: z.string().trim().min(1),
});

// POST /coupons/apply
coupons.post('/apply', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const result = applyCouponSchema.safeParse(body);

  if (!result.success) {
    return errorResponse(c, 'Coupon code is required', 400, 'VALIDATION_ERROR');
  }

  const { code } = result.data;

  // Look up coupon (case-insensitive)
  const [coupon] = await db
    .select()
    .from(schema.coupons)
    .where(eq(schema.coupons.code, code.toUpperCase()));

  if (!coupon || !coupon.isActive) {
    return errorResponse(c, 'Invalid coupon code', 400, 'INVALID_COUPON');
  }

  // Check expiration
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return errorResponse(c, 'Coupon has expired', 400, 'COUPON_EXPIRED');
  }

  // Check max usages
  if (coupon.maxUsages !== null && coupon.usageCount >= coupon.maxUsages) {
    return errorResponse(c, 'Coupon has reached its usage limit', 400, 'COUPON_LIMIT_REACHED');
  }

  // Calculate cart subtotal for this user
  const cartItems = await db
    .select({
      quantity: schema.cartItems.quantity,
      price: schema.products.price,
    })
    .from(schema.cartItems)
    .leftJoin(schema.products, eq(schema.cartItems.productId, schema.products.id))
    .where(eq(schema.cartItems.userId, user.id));

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Check minimum order amount
  if (coupon.minOrderAmount !== null && subtotal < coupon.minOrderAmount) {
    return errorResponse(c, `Minimum order amount of $${coupon.minOrderAmount.toFixed(2)} required`, 400, 'MIN_ORDER_NOT_MET');
  }

  // Calculate discount
  let discount: number;
  if (coupon.type === 'percentage') {
    discount = Math.round((subtotal * coupon.discount / 100) * 100) / 100;
  } else {
    discount = Math.min(coupon.discount, subtotal);
  }

  // Increment usage count
  await db
    .update(schema.coupons)
    .set({ usageCount: coupon.usageCount + 1 })
    .where(eq(schema.coupons.id, coupon.id));

  return successResponse(c, { discount });
});

export default coupons;
