import type { Context, Next } from 'hono';
import { errorResponse } from '../utils/response.js';

export async function errorMiddleware(c: Context, next: Next) {
  try {
    await next();
  } catch (err) {
    console.error('Error:', err);

    if (err instanceof Error) {
      return errorResponse(c, err.message, 500, 'INTERNAL_ERROR');
    }

    return errorResponse(c, 'An unexpected error occurred', 500, 'INTERNAL_ERROR');
  }
}
