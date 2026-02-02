import { Hono } from 'hono';
import { z } from 'zod';
import { db, schema } from '../db/index.js';
import { eq, desc } from 'drizzle-orm';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const orders = new Hono();

// Apply auth middleware to all routes
orders.use('*', authMiddleware);

const addressSchema = z.object({
  street: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().min(5),
  country: z.string().min(2),
});

const createOrderSchema = z.object({
  shippingAddress: addressSchema,
  billingAddress: addressSchema,
  paymentMethod: z.string().min(1),
  notes: z.string().optional(),
});

const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
});

// GET /orders
orders.get('/', async (c) => {
  const user = c.get('user');
  const page = parseInt(c.req.query('page') || '1');
  const pageSize = parseInt(c.req.query('pageSize') || '10');

  const allOrders = await db
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.userId, user.id))
    .orderBy(desc(schema.orders.createdAt));

  const total = allOrders.length;
  const offset = (page - 1) * pageSize;
  const paginatedOrders = allOrders.slice(offset, offset + pageSize);

  // Get order items for each order
  const ordersWithItems = await Promise.all(
    paginatedOrders.map(async (order) => {
      const items = await db
        .select()
        .from(schema.orderItems)
        .where(eq(schema.orderItems.orderId, order.id));

      return {
        ...order,
        shippingAddress: JSON.parse(order.shippingAddress),
        billingAddress: JSON.parse(order.billingAddress),
        items,
      };
    })
  );

  return paginatedResponse(c, ordersWithItems, page, pageSize, total);
});

// GET /orders/:id
orders.get('/:id', async (c) => {
  const user = c.get('user');
  const orderId = parseInt(c.req.param('id'));

  const [order] = await db
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.id, orderId));

  if (!order) {
    return errorResponse(c, 'Order not found', 404, 'NOT_FOUND');
  }

  // Check ownership (unless admin)
  if (order.userId !== user.id && user.role !== 'admin') {
    return errorResponse(c, 'Order not found', 404, 'NOT_FOUND');
  }

  const items = await db
    .select()
    .from(schema.orderItems)
    .where(eq(schema.orderItems.orderId, orderId));

  return successResponse(c, {
    order: {
      ...order,
      shippingAddress: JSON.parse(order.shippingAddress),
      billingAddress: JSON.parse(order.billingAddress),
      items,
    },
  });
});

// POST /orders
orders.post('/', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const result = createOrderSchema.safeParse(body);

  if (!result.success) {
    return errorResponse(c, 'Validation failed', 400, 'VALIDATION_ERROR',
      Object.fromEntries(result.error.errors.map(e => [e.path.join('.'), [e.message]]))
    );
  }

  // Get cart items
  const cartItemsWithProducts = await db
    .select({
      id: schema.cartItems.id,
      productId: schema.cartItems.productId,
      quantity: schema.cartItems.quantity,
      product: schema.products,
    })
    .from(schema.cartItems)
    .leftJoin(schema.products, eq(schema.cartItems.productId, schema.products.id))
    .where(eq(schema.cartItems.userId, user.id));

  if (cartItemsWithProducts.length === 0) {
    return errorResponse(c, 'Cart is empty', 400, 'EMPTY_CART');
  }

  // Verify stock for all items
  for (const item of cartItemsWithProducts) {
    if (!item.product || item.product.stock < item.quantity) {
      return errorResponse(c, `Insufficient stock for ${item.product?.name || 'product'}`, 400, 'INSUFFICIENT_STOCK');
    }
  }

  // Calculate totals
  const subtotal = cartItemsWithProducts.reduce((total, item) => {
    return total + (item.product!.price * item.quantity);
  }, 0);

  const taxRate = 0.08; // 8% tax
  const tax = subtotal * taxRate;
  const shipping = subtotal >= 100 ? 0 : 9.99; // Free shipping over $100
  const total = subtotal + tax + shipping;

  // Create order
  const [order] = await db
    .insert(schema.orders)
    .values({
      userId: user.id,
      status: 'pending',
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      total: Math.round(total * 100) / 100,
      shippingAddress: JSON.stringify(result.data.shippingAddress),
      billingAddress: JSON.stringify(result.data.billingAddress),
      paymentMethod: result.data.paymentMethod,
      paymentStatus: 'pending',
      notes: result.data.notes || null,
    })
    .returning();

  // Create order items and update stock
  const orderItemsData = cartItemsWithProducts.map(item => ({
    orderId: order.id,
    productId: item.productId,
    name: item.product!.name,
    price: item.product!.price,
    quantity: item.quantity,
  }));

  await db.insert(schema.orderItems).values(orderItemsData);

  // Update product stock
  for (const item of cartItemsWithProducts) {
    await db
      .update(schema.products)
      .set({ stock: item.product!.stock - item.quantity })
      .where(eq(schema.products.id, item.productId));
  }

  // Clear cart
  await db.delete(schema.cartItems).where(eq(schema.cartItems.userId, user.id));

  // Get order items
  const items = await db
    .select()
    .from(schema.orderItems)
    .where(eq(schema.orderItems.orderId, order.id));

  return successResponse(c, {
    order: {
      ...order,
      shippingAddress: result.data.shippingAddress,
      billingAddress: result.data.billingAddress,
      items,
    },
  }, 201);
});

// PUT /orders/:id/cancel
orders.put('/:id/cancel', async (c) => {
  const user = c.get('user');
  const orderId = parseInt(c.req.param('id'));

  const [order] = await db
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.id, orderId));

  if (!order) {
    return errorResponse(c, 'Order not found', 404, 'NOT_FOUND');
  }

  // Check ownership
  if (order.userId !== user.id) {
    return errorResponse(c, 'Order not found', 404, 'NOT_FOUND');
  }

  // Check if can be cancelled
  if (!['pending', 'processing'].includes(order.status)) {
    return errorResponse(c, 'Order cannot be cancelled', 400, 'CANNOT_CANCEL');
  }

  // Restore stock
  const orderItems = await db
    .select()
    .from(schema.orderItems)
    .where(eq(schema.orderItems.orderId, orderId));

  for (const item of orderItems) {
    const [product] = await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.id, item.productId));

    if (product) {
      await db
        .update(schema.products)
        .set({ stock: product.stock + item.quantity })
        .where(eq(schema.products.id, item.productId));
    }
  }

  // Update order status
  const [updatedOrder] = await db
    .update(schema.orders)
    .set({ status: 'cancelled', updatedAt: new Date().toISOString() })
    .where(eq(schema.orders.id, orderId))
    .returning();

  return successResponse(c, {
    order: {
      ...updatedOrder,
      shippingAddress: JSON.parse(updatedOrder.shippingAddress),
      billingAddress: JSON.parse(updatedOrder.billingAddress),
      items: orderItems,
    },
  });
});

// GET /orders/admin (admin only)
orders.get('/admin', requireRole('admin'), async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const pageSize = parseInt(c.req.query('pageSize') || '10');
  const status = c.req.query('status');

  let allOrders = await db
    .select({
      id: schema.orders.id,
      userId: schema.orders.userId,
      status: schema.orders.status,
      subtotal: schema.orders.subtotal,
      tax: schema.orders.tax,
      shipping: schema.orders.shipping,
      total: schema.orders.total,
      shippingAddress: schema.orders.shippingAddress,
      billingAddress: schema.orders.billingAddress,
      paymentMethod: schema.orders.paymentMethod,
      paymentStatus: schema.orders.paymentStatus,
      notes: schema.orders.notes,
      createdAt: schema.orders.createdAt,
      updatedAt: schema.orders.updatedAt,
      userEmail: schema.users.email,
      userFirstName: schema.users.firstName,
      userLastName: schema.users.lastName,
    })
    .from(schema.orders)
    .leftJoin(schema.users, eq(schema.orders.userId, schema.users.id))
    .orderBy(desc(schema.orders.createdAt));

  if (status) {
    allOrders = allOrders.filter(o => o.status === status);
  }

  const total = allOrders.length;
  const offset = (page - 1) * pageSize;
  const paginatedOrders = allOrders.slice(offset, offset + pageSize);

  const ordersWithItems = await Promise.all(
    paginatedOrders.map(async (order) => {
      const items = await db
        .select()
        .from(schema.orderItems)
        .where(eq(schema.orderItems.orderId, order.id));

      return {
        ...order,
        shippingAddress: JSON.parse(order.shippingAddress),
        billingAddress: JSON.parse(order.billingAddress),
        user: {
          email: order.userEmail,
          firstName: order.userFirstName,
          lastName: order.userLastName,
        },
        items,
      };
    })
  );

  return paginatedResponse(c, ordersWithItems, page, pageSize, total);
});

// PUT /orders/admin/:id/status (admin only)
orders.put('/admin/:id/status', requireRole('admin'), async (c) => {
  const orderId = parseInt(c.req.param('id'));
  const body = await c.req.json();
  const result = updateOrderStatusSchema.safeParse(body);

  if (!result.success) {
    return errorResponse(c, 'Validation failed', 400, 'VALIDATION_ERROR',
      Object.fromEntries(result.error.errors.map(e => [e.path.join('.'), [e.message]]))
    );
  }

  const [order] = await db
    .select()
    .from(schema.orders)
    .where(eq(schema.orders.id, orderId));

  if (!order) {
    return errorResponse(c, 'Order not found', 404, 'NOT_FOUND');
  }

  const [updatedOrder] = await db
    .update(schema.orders)
    .set({ status: result.data.status, updatedAt: new Date().toISOString() })
    .where(eq(schema.orders.id, orderId))
    .returning();

  const items = await db
    .select()
    .from(schema.orderItems)
    .where(eq(schema.orderItems.orderId, orderId));

  return successResponse(c, {
    order: {
      ...updatedOrder,
      shippingAddress: JSON.parse(updatedOrder.shippingAddress),
      billingAddress: JSON.parse(updatedOrder.billingAddress),
      items,
    },
  });
});

export default orders;
