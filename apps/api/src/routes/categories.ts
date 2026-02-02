import { Hono } from 'hono';
import { z } from 'zod';
import { db, schema } from '../db/index.js';
import { eq } from 'drizzle-orm';
import { successResponse, errorResponse } from '../utils/response.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { slugify } from '@ecommerce/shared';

const categories = new Hono();

const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).optional(),
  description: z.string().optional(),
  parentId: z.number().int().positive().nullable().optional(),
});

// GET /categories
categories.get('/', async (c) => {
  const allCategories = await db
    .select()
    .from(schema.categories);

  return successResponse(c, { categories: allCategories });
});

// GET /categories/:id
categories.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));

  const [category] = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.id, id));

  if (!category) {
    return errorResponse(c, 'Category not found', 404, 'NOT_FOUND');
  }

  return successResponse(c, { category });
});

// POST /categories (admin)
categories.post('/', authMiddleware, requireRole('admin'), async (c) => {
  const body = await c.req.json();
  const result = createCategorySchema.safeParse(body);

  if (!result.success) {
    return errorResponse(c, 'Validation failed', 400, 'VALIDATION_ERROR',
      Object.fromEntries(result.error.errors.map(e => [e.path.join('.'), [e.message]]))
    );
  }

  // Generate slug if not provided
  const slug = result.data.slug || slugify(result.data.name);

  // Check if slug exists
  const [existing] = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.slug, slug));

  if (existing) {
    return errorResponse(c, 'Category slug already exists', 400, 'SLUG_EXISTS');
  }

  const [category] = await db
    .insert(schema.categories)
    .values({
      name: result.data.name,
      slug,
      description: result.data.description || null,
      parentId: result.data.parentId || null,
    })
    .returning();

  return successResponse(c, { category }, 201);
});

// PUT /categories/:id (admin)
categories.put('/:id', authMiddleware, requireRole('admin'), async (c) => {
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json();
  const result = createCategorySchema.partial().safeParse(body);

  if (!result.success) {
    return errorResponse(c, 'Validation failed', 400, 'VALIDATION_ERROR',
      Object.fromEntries(result.error.errors.map(e => [e.path.join('.'), [e.message]]))
    );
  }

  const [existing] = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.id, id));

  if (!existing) {
    return errorResponse(c, 'Category not found', 404, 'NOT_FOUND');
  }

  const updateData: Record<string, unknown> = {};
  if (result.data.name) {
    updateData.name = result.data.name;
    updateData.slug = result.data.slug || slugify(result.data.name);
  }
  if (result.data.description !== undefined) updateData.description = result.data.description;
  if (result.data.parentId !== undefined) updateData.parentId = result.data.parentId;

  const [category] = await db
    .update(schema.categories)
    .set(updateData)
    .where(eq(schema.categories.id, id))
    .returning();

  return successResponse(c, { category });
});

// DELETE /categories/:id (admin)
categories.delete('/:id', authMiddleware, requireRole('admin'), async (c) => {
  const id = parseInt(c.req.param('id'));

  const [existing] = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.id, id));

  if (!existing) {
    return errorResponse(c, 'Category not found', 404, 'NOT_FOUND');
  }

  // Check if category has products
  const products = await db
    .select()
    .from(schema.products)
    .where(eq(schema.products.categoryId, id));

  if (products.length > 0) {
    return errorResponse(c, 'Cannot delete category with products', 400, 'HAS_PRODUCTS');
  }

  await db.delete(schema.categories).where(eq(schema.categories.id, id));

  return successResponse(c, { message: 'Category deleted successfully' });
});

export default categories;
