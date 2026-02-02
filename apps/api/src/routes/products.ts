import { Hono } from 'hono';
import { z } from 'zod';
import { db, schema } from '../db/index.js';
import { eq, and, desc, asc, sql, like, or } from 'drizzle-orm';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { authMiddleware, requireRole, optionalAuthMiddleware } from '../middleware/auth.js';
import { slugify } from '@ecommerce/shared';

const products = new Hono();

const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  price: z.number().positive(),
  originalPrice: z.number().positive().nullable().optional(),
  categoryId: z.number().int().positive(),
  stock: z.number().int().min(0),
  images: z.array(z.string().url()).min(1),
  featured: z.boolean().optional(),
  status: z.enum(['active', 'inactive', 'draft']).optional(),
});

const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().min(2).max(100),
  comment: z.string().min(10).max(1000),
});

// GET /products
products.get('/', async (c) => {
  const page = parseInt(c.req.query('page') || '1');
  const pageSize = parseInt(c.req.query('pageSize') || '12');
  const categoryId = c.req.query('categoryId') ? parseInt(c.req.query('categoryId')!) : undefined;
  const minPrice = c.req.query('minPrice') ? parseFloat(c.req.query('minPrice')!) : undefined;
  const maxPrice = c.req.query('maxPrice') ? parseFloat(c.req.query('maxPrice')!) : undefined;
  const search = c.req.query('search');
  const featured = c.req.query('featured');
  const inStock = c.req.query('inStock');
  const sortBy = c.req.query('sortBy') || 'newest';

  // Get all active products with categories
  let allProducts = await db
    .select({
      id: schema.products.id,
      name: schema.products.name,
      slug: schema.products.slug,
      description: schema.products.description,
      price: schema.products.price,
      originalPrice: schema.products.originalPrice,
      categoryId: schema.products.categoryId,
      stock: schema.products.stock,
      images: schema.products.images,
      rating: schema.products.rating,
      reviewCount: schema.products.reviewCount,
      featured: schema.products.featured,
      status: schema.products.status,
      createdAt: schema.products.createdAt,
      category: schema.categories,
    })
    .from(schema.products)
    .leftJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
    .where(eq(schema.products.status, 'active'));

  // Apply filters
  if (categoryId !== undefined) {
    allProducts = allProducts.filter(p => p.categoryId === categoryId);
  }
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
  if (featured === 'true') {
    allProducts = allProducts.filter(p => p.featured);
  }
  if (inStock === 'true') {
    allProducts = allProducts.filter(p => p.stock > 0);
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
  const productsWithParsedImages = paginatedProducts.map(p => ({
    ...p,
    images: JSON.parse(p.images),
  }));

  return paginatedResponse(c, productsWithParsedImages, page, pageSize, total);
});

// GET /products/featured
products.get('/featured', async (c) => {
  const limit = parseInt(c.req.query('limit') || '8');

  const featuredProducts = await db
    .select({
      id: schema.products.id,
      name: schema.products.name,
      slug: schema.products.slug,
      description: schema.products.description,
      price: schema.products.price,
      originalPrice: schema.products.originalPrice,
      categoryId: schema.products.categoryId,
      stock: schema.products.stock,
      images: schema.products.images,
      rating: schema.products.rating,
      reviewCount: schema.products.reviewCount,
      featured: schema.products.featured,
      status: schema.products.status,
      createdAt: schema.products.createdAt,
      category: schema.categories,
    })
    .from(schema.products)
    .leftJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
    .where(and(
      eq(schema.products.status, 'active'),
      eq(schema.products.featured, true)
    ))
    .limit(limit);

  const productsWithParsedImages = featuredProducts.map(p => ({
    ...p,
    images: JSON.parse(p.images),
  }));

  return successResponse(c, { products: productsWithParsedImages });
});

// GET /products/search
products.get('/search', async (c) => {
  const query = c.req.query('q');
  const page = parseInt(c.req.query('page') || '1');
  const pageSize = parseInt(c.req.query('pageSize') || '12');

  if (!query || query.length < 2) {
    return errorResponse(c, 'Search query must be at least 2 characters', 400, 'INVALID_QUERY');
  }

  const searchLower = query.toLowerCase();

  let allProducts = await db
    .select({
      id: schema.products.id,
      name: schema.products.name,
      slug: schema.products.slug,
      description: schema.products.description,
      price: schema.products.price,
      originalPrice: schema.products.originalPrice,
      categoryId: schema.products.categoryId,
      stock: schema.products.stock,
      images: schema.products.images,
      rating: schema.products.rating,
      reviewCount: schema.products.reviewCount,
      featured: schema.products.featured,
      status: schema.products.status,
      createdAt: schema.products.createdAt,
      category: schema.categories,
    })
    .from(schema.products)
    .leftJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
    .where(eq(schema.products.status, 'active'));

  // Filter by search
  allProducts = allProducts.filter(p =>
    p.name.toLowerCase().includes(searchLower) ||
    p.description.toLowerCase().includes(searchLower)
  );

  const total = allProducts.length;
  const offset = (page - 1) * pageSize;
  const paginatedProducts = allProducts.slice(offset, offset + pageSize);

  const productsWithParsedImages = paginatedProducts.map(p => ({
    ...p,
    images: JSON.parse(p.images),
  }));

  return paginatedResponse(c, productsWithParsedImages, page, pageSize, total);
});

// GET /products/:id
products.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));

  const [product] = await db
    .select({
      id: schema.products.id,
      name: schema.products.name,
      slug: schema.products.slug,
      description: schema.products.description,
      price: schema.products.price,
      originalPrice: schema.products.originalPrice,
      categoryId: schema.products.categoryId,
      stock: schema.products.stock,
      images: schema.products.images,
      rating: schema.products.rating,
      reviewCount: schema.products.reviewCount,
      featured: schema.products.featured,
      status: schema.products.status,
      createdAt: schema.products.createdAt,
      category: schema.categories,
    })
    .from(schema.products)
    .leftJoin(schema.categories, eq(schema.products.categoryId, schema.categories.id))
    .where(eq(schema.products.id, id));

  if (!product) {
    return errorResponse(c, 'Product not found', 404, 'NOT_FOUND');
  }

  return successResponse(c, {
    product: {
      ...product,
      images: JSON.parse(product.images),
    }
  });
});

// GET /products/:id/reviews
products.get('/:id/reviews', async (c) => {
  const id = parseInt(c.req.param('id'));
  const page = parseInt(c.req.query('page') || '1');
  const pageSize = parseInt(c.req.query('pageSize') || '10');

  // Check product exists
  const [product] = await db
    .select({ id: schema.products.id })
    .from(schema.products)
    .where(eq(schema.products.id, id));

  if (!product) {
    return errorResponse(c, 'Product not found', 404, 'NOT_FOUND');
  }

  const allReviews = await db
    .select({
      id: schema.reviews.id,
      userId: schema.reviews.userId,
      productId: schema.reviews.productId,
      rating: schema.reviews.rating,
      title: schema.reviews.title,
      comment: schema.reviews.comment,
      createdAt: schema.reviews.createdAt,
      userFirstName: schema.users.firstName,
      userLastName: schema.users.lastName,
      userAvatar: schema.users.avatar,
    })
    .from(schema.reviews)
    .leftJoin(schema.users, eq(schema.reviews.userId, schema.users.id))
    .where(eq(schema.reviews.productId, id))
    .orderBy(desc(schema.reviews.createdAt));

  const total = allReviews.length;
  const offset = (page - 1) * pageSize;
  const paginatedReviews = allReviews.slice(offset, offset + pageSize);

  const reviews = paginatedReviews.map(r => ({
    id: r.id,
    userId: r.userId,
    productId: r.productId,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    createdAt: r.createdAt,
    user: {
      firstName: r.userFirstName,
      lastName: r.userLastName,
      avatar: r.userAvatar,
    },
  }));

  return paginatedResponse(c, reviews, page, pageSize, total);
});

// POST /products/:id/reviews (auth required)
products.post('/:id/reviews', authMiddleware, async (c) => {
  const id = parseInt(c.req.param('id'));
  const user = c.get('user');
  const body = await c.req.json();

  const result = createReviewSchema.safeParse(body);
  if (!result.success) {
    return errorResponse(c, 'Validation failed', 400, 'VALIDATION_ERROR',
      Object.fromEntries(result.error.errors.map(e => [e.path.join('.'), [e.message]]))
    );
  }

  // Check product exists
  const [product] = await db
    .select()
    .from(schema.products)
    .where(eq(schema.products.id, id));

  if (!product) {
    return errorResponse(c, 'Product not found', 404, 'NOT_FOUND');
  }

  // Check if user already reviewed this product
  const [existingReview] = await db
    .select()
    .from(schema.reviews)
    .where(and(
      eq(schema.reviews.userId, user.id),
      eq(schema.reviews.productId, id)
    ));

  if (existingReview) {
    return errorResponse(c, 'You have already reviewed this product', 400, 'ALREADY_REVIEWED');
  }

  // Create review
  const [review] = await db
    .insert(schema.reviews)
    .values({
      userId: user.id,
      productId: id,
      rating: result.data.rating,
      title: result.data.title,
      comment: result.data.comment,
    })
    .returning();

  // Update product rating
  const allReviews = await db
    .select({ rating: schema.reviews.rating })
    .from(schema.reviews)
    .where(eq(schema.reviews.productId, id));

  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await db
    .update(schema.products)
    .set({
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    })
    .where(eq(schema.products.id, id));

  return successResponse(c, {
    review: {
      ...review,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    },
  }, 201);
});

// POST /products (admin)
products.post('/', authMiddleware, requireRole('admin'), async (c) => {
  const body = await c.req.json();
  const result = createProductSchema.safeParse(body);

  if (!result.success) {
    return errorResponse(c, 'Validation failed', 400, 'VALIDATION_ERROR',
      Object.fromEntries(result.error.errors.map(e => [e.path.join('.'), [e.message]]))
    );
  }

  // Check category exists
  const [category] = await db
    .select()
    .from(schema.categories)
    .where(eq(schema.categories.id, result.data.categoryId));

  if (!category) {
    return errorResponse(c, 'Category not found', 400, 'INVALID_CATEGORY');
  }

  // Generate slug
  let baseSlug = slugify(result.data.name);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const [existing] = await db
      .select()
      .from(schema.products)
      .where(eq(schema.products.slug, slug));

    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const [product] = await db
    .insert(schema.products)
    .values({
      name: result.data.name,
      slug,
      description: result.data.description,
      price: result.data.price,
      originalPrice: result.data.originalPrice ?? null,
      categoryId: result.data.categoryId,
      stock: result.data.stock,
      images: JSON.stringify(result.data.images),
      featured: result.data.featured ?? false,
      status: result.data.status ?? 'active',
    })
    .returning();

  return successResponse(c, {
    product: {
      ...product,
      images: JSON.parse(product.images),
      category,
    }
  }, 201);
});

// PUT /products/:id (admin)
products.put('/:id', authMiddleware, requireRole('admin'), async (c) => {
  const id = parseInt(c.req.param('id'));
  const body = await c.req.json();
  const result = createProductSchema.partial().safeParse(body);

  if (!result.success) {
    return errorResponse(c, 'Validation failed', 400, 'VALIDATION_ERROR',
      Object.fromEntries(result.error.errors.map(e => [e.path.join('.'), [e.message]]))
    );
  }

  const [existing] = await db
    .select()
    .from(schema.products)
    .where(eq(schema.products.id, id));

  if (!existing) {
    return errorResponse(c, 'Product not found', 404, 'NOT_FOUND');
  }

  const updateData: Record<string, unknown> = {};
  if (result.data.name) {
    updateData.name = result.data.name;
    updateData.slug = slugify(result.data.name);
  }
  if (result.data.description) updateData.description = result.data.description;
  if (result.data.price !== undefined) updateData.price = result.data.price;
  if (result.data.originalPrice !== undefined) updateData.originalPrice = result.data.originalPrice;
  if (result.data.categoryId) updateData.categoryId = result.data.categoryId;
  if (result.data.stock !== undefined) updateData.stock = result.data.stock;
  if (result.data.images) updateData.images = JSON.stringify(result.data.images);
  if (result.data.featured !== undefined) updateData.featured = result.data.featured;
  if (result.data.status) updateData.status = result.data.status;

  const [product] = await db
    .update(schema.products)
    .set(updateData)
    .where(eq(schema.products.id, id))
    .returning();

  return successResponse(c, {
    product: {
      ...product,
      images: JSON.parse(product.images),
    }
  });
});

// DELETE /products/:id (admin)
products.delete('/:id', authMiddleware, requireRole('admin'), async (c) => {
  const id = parseInt(c.req.param('id'));

  const [existing] = await db
    .select()
    .from(schema.products)
    .where(eq(schema.products.id, id));

  if (!existing) {
    return errorResponse(c, 'Product not found', 404, 'NOT_FOUND');
  }

  await db.delete(schema.products).where(eq(schema.products.id, id));

  return successResponse(c, { message: 'Product deleted successfully' });
});

export default products;
