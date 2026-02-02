import { Hono } from 'hono';
import { z } from 'zod';
import { db, schema } from '../db/index.js';
import { eq, and } from 'drizzle-orm';
import { successResponse, errorResponse } from '../utils/response.js';
import { authMiddleware } from '../middleware/auth.js';

const cart = new Hono();

// Apply auth middleware to all routes
cart.use('*', authMiddleware);

const addToCartSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive().default(1),
});

const updateCartItemSchema = z.object({
  quantity: z.number().int().positive(),
});

// GET /cart
cart.get('/', async (c) => {
  const user = c.get('user');

  const cartItemsWithProducts = await db
    .select({
      id: schema.cartItems.id,
      productId: schema.cartItems.productId,
      quantity: schema.cartItems.quantity,
      createdAt: schema.cartItems.createdAt,
      product: schema.products,
    })
    .from(schema.cartItems)
    .leftJoin(schema.products, eq(schema.cartItems.productId, schema.products.id))
    .where(eq(schema.cartItems.userId, user.id));

  const items = cartItemsWithProducts.map(item => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    createdAt: item.createdAt,
    product: item.product ? {
      ...item.product,
      images: JSON.parse(item.product.images),
    } : null,
  }));

  const subtotal = items.reduce((total, item) => {
    if (item.product) {
      return total + (item.product.price * item.quantity);
    }
    return total;
  }, 0);

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return successResponse(c, {
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    itemCount,
  });
});

// POST /cart
cart.post('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const result = addToCartSchema.safeParse(body);

  if (!result.success) {
    return errorResponse(c, 'Validation failed', 400, 'VALIDATION_ERROR',
      Object.fromEntries(result.error.errors.map(e => [e.path.join('.'), [e.message]]))
    );
  }

  const { productId, quantity } = result.data;

  // Check product exists and is active
  const [product] = await db
    .select()
    .from(schema.products)
    .where(and(
      eq(schema.products.id, productId),
      eq(schema.products.status, 'active')
    ));

  if (!product) {
    return errorResponse(c, 'Product not found', 404, 'NOT_FOUND');
  }

  // Check stock
  if (product.stock < quantity) {
    return errorResponse(c, 'Insufficient stock', 400, 'INSUFFICIENT_STOCK');
  }

  // Check if item already in cart
  const [existingItem] = await db
    .select()
    .from(schema.cartItems)
    .where(and(
      eq(schema.cartItems.userId, user.id),
      eq(schema.cartItems.productId, productId)
    ));

  if (existingItem) {
    // Update quantity
    const newQuantity = existingItem.quantity + quantity;

    if (product.stock < newQuantity) {
      return errorResponse(c, 'Insufficient stock', 400, 'INSUFFICIENT_STOCK');
    }

    const [updatedItem] = await db
      .update(schema.cartItems)
      .set({ quantity: newQuantity })
      .where(eq(schema.cartItems.id, existingItem.id))
      .returning();

    return successResponse(c, {
      item: {
        ...updatedItem,
        product: {
          ...product,
          images: JSON.parse(product.images),
        },
      },
    });
  }

  // Create new cart item
  const [newItem] = await db
    .insert(schema.cartItems)
    .values({
      userId: user.id,
      productId,
      quantity,
    })
    .returning();

  return successResponse(c, {
    item: {
      ...newItem,
      product: {
        ...product,
        images: JSON.parse(product.images),
      },
    },
  }, 201);
});

// PUT /cart/:itemId
cart.put('/:itemId', async (c) => {
  const user = c.get('user');
  const itemId = parseInt(c.req.param('itemId'));
  const body = await c.req.json();
  const result = updateCartItemSchema.safeParse(body);

  if (!result.success) {
    return errorResponse(c, 'Validation failed', 400, 'VALIDATION_ERROR',
      Object.fromEntries(result.error.errors.map(e => [e.path.join('.'), [e.message]]))
    );
  }

  const { quantity } = result.data;

  // Get cart item
  const [cartItem] = await db
    .select()
    .from(schema.cartItems)
    .where(and(
      eq(schema.cartItems.id, itemId),
      eq(schema.cartItems.userId, user.id)
    ));

  if (!cartItem) {
    return errorResponse(c, 'Cart item not found', 404, 'NOT_FOUND');
  }

  // Check product stock
  const [product] = await db
    .select()
    .from(schema.products)
    .where(eq(schema.products.id, cartItem.productId));

  if (!product || product.stock < quantity) {
    return errorResponse(c, 'Insufficient stock', 400, 'INSUFFICIENT_STOCK');
  }

  // Update quantity
  const [updatedItem] = await db
    .update(schema.cartItems)
    .set({ quantity })
    .where(eq(schema.cartItems.id, itemId))
    .returning();

  return successResponse(c, {
    item: {
      ...updatedItem,
      product: {
        ...product,
        images: JSON.parse(product.images),
      },
    },
  });
});

// DELETE /cart/:itemId
cart.delete('/:itemId', async (c) => {
  const user = c.get('user');
  const itemId = parseInt(c.req.param('itemId'));

  // Get cart item
  const [cartItem] = await db
    .select()
    .from(schema.cartItems)
    .where(and(
      eq(schema.cartItems.id, itemId),
      eq(schema.cartItems.userId, user.id)
    ));

  if (!cartItem) {
    return errorResponse(c, 'Cart item not found', 404, 'NOT_FOUND');
  }

  await db.delete(schema.cartItems).where(eq(schema.cartItems.id, itemId));

  return successResponse(c, { message: 'Item removed from cart' });
});

// DELETE /cart (clear cart)
cart.delete('/', async (c) => {
  const user = c.get('user');

  await db.delete(schema.cartItems).where(eq(schema.cartItems.userId, user.id));

  return successResponse(c, { message: 'Cart cleared' });
});

export default cart;
