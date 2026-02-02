import type { Context } from 'hono';

export function successResponse<T>(c: Context, data: T, status = 200) {
  return c.json({ success: true, data }, status);
}

export function errorResponse(c: Context, message: string, status = 400, code?: string, details?: Record<string, string[]>) {
  return c.json(
    {
      success: false,
      error: {
        message,
        code,
        details,
      },
    },
    status
  );
}

export function paginatedResponse<T>(
  c: Context,
  data: T[],
  page: number,
  pageSize: number,
  total: number
) {
  return c.json({
    success: true,
    data: {
      data,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    },
  });
}
