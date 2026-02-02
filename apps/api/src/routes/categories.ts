import { Hono } from 'hono';
import { db, schema } from '../db/index.js';
import { eq, like, and } from 'drizzle-orm';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';

const categories = new Hono();

// GET /categories
categories.get('/', async (c) => {
  const allCategories = await db
    .select()
    .from(schema.categories);

  return successResponse(c, { categories: allCategories });
});

// GET /categories/:slug
categories.get('/:slug', async (c) => {
  const slug = c.req.param('slug');

  const [category] = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.slug, slug));

  if (!category) {
    return errorResponse(c, 'Category not found', 404, 'NOT_FOUND');
  }

  return successResponse(c, { category });
});

// GET /categories/:slug/products
categories.get('/:slug/products', async (c) => {
  const slug = c.req.param('slug');
  const page = parseInt(c.req.query('page') || '1');
  const pageSize = parseInt(c.req.query('pageSize') || '12');
  const minPrice = c.req.query('minPrice') ? parseFloat(c.req.query('minPrice')!) : undefined;
  const maxPrice = c.req.query('maxPrice') ? parseFloat(c.req.query('maxPrice')!) : undefined;
  const search = c.req.query('search');
  const sortBy = c.req.query('sortBy') || 'newest';

  // Get category
  const [category] = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.slug, slug));

  if (!category) {
    return errorResponse(c, 'Category not found', 404, 'NOT_FOUND');
  }

  // Build query
  let allProducts = await db
    .select()
    .from(schema.products)
    .where(
      and(
        eq(schema.products.categoryId, category.id),
        eq(schema.products.status, 'active')
      )
    );

  // Apply filters
  if (minPrice !== undefined) {
    allProducts = allProducts.filter(p => p.price >= minPrice);
  }
  if (maxPrice !== undefined) {
    allProducts = allProducts.filter(p => p.price <= maxPrice);
  }
  if (search) {
    const searchLower = search.toLowerCase();
    allProducts = allProducts.filter(p =>
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }

  // Sort
  switch (sortBy) {
    case 'price_asc':
      allProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      allProducts.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      allProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'rating':
      allProducts.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
    default:
      allProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  const total = allProducts.length;
  const offset = (page - 1) * pageSize;
  const paginatedProducts = allProducts.slice(offset, offset + pageSize);

  // Parse images JSON
  const products = paginatedProducts.map(p => ({
    ...p,
    images: JSON.parse(p.images),
    category,
  }));

  return paginatedResponse(c, products, page, pageSize, total);
});

export default categories;
