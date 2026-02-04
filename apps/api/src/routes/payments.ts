import { Hono } from 'hono';
import { z } from 'zod';
import { db, schema } from '../db/index.js';
import { eq } from 'drizzle-orm';
import { successResponse, errorResponse } from '../utils/response.js';
import { authMiddleware } from '../middleware/auth.js';

const payments = new Hono();

const processPaymentSchema = z.object({
  orderId: z.number().int().positive(),
  paymentDetails: z.object({
    cardNumber: z.string().optional(),
    expiryMonth: z.string().optional(),
    expiryYear: z.string().optional(),
    cvv: z.string().optional(),
    paypalEmail: z.string().email().optional(),
  }).optional(),
});

// GET /payments/methods
payments.get('/methods', async (c) => {
  const methods = [
    {
      id: 'credit_card',
      name: 'Credit Card',
      description: 'Pay with Visa, Mastercard, or American Express',
      icon: 'credit-card',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: 'paypal',
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      description: 'Direct bank transfer',
      icon: 'building-bank',
    },
  ];

  return successResponse(c, { methods });
});

// POST /payments/process (auth required)
payments.post('/process', authMiddleware, async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const result = processPaymentSchema.safeParse(body);

  if (!result.success) {
    return errorResponse(c, 'Validation failed', 400, 'VALIDATION_ERROR',
      Object.fromEntries(result.error.errors.map(e => [e.path.join('.'), [e.message]]))
    );
  }

  const { orderId } = result.data;

  // Get order
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

  // Check payment status
  if (order.paymentStatus === 'completed') {
    return errorResponse(c, 'Order already paid', 400, 'ALREADY_PAID');
  }

  // Deterministic payment simulation based on card number.
  // Card 4000000000000002 is the designated test-decline card.
  const cardNumber = result.data.paymentDetails?.cardNumber;

  if (cardNumber === '4000000000000002') {
    await db
      .update(schema.orders)
      .set({ paymentStatus: 'failed', updatedAt: new Date().toISOString() })
      .where(eq(schema.orders.id, orderId));

    return errorResponse(c, 'Payment failed. Please try again.', 400, 'PAYMENT_FAILED');
  }

  // Update order
  const [updatedOrder] = await db
    .update(schema.orders)
    .set({
      paymentStatus: 'completed',
      status: 'processing',
      updatedAt: new Date().toISOString(),
    })
    .where(eq(schema.orders.id, orderId))
    .returning();

  return successResponse(c, {
    success: true,
    transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    order: {
      ...updatedOrder,
      shippingAddress: JSON.parse(updatedOrder.shippingAddress),
      billingAddress: JSON.parse(updatedOrder.billingAddress),
    },
  });
});

export default payments;
