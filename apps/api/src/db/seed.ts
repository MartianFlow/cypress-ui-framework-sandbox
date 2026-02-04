import { db, schema } from './index.js';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

const { users, categories, products, orders, orderItems, reviews, cartItems, coupons } = schema;

async function seed() {
  console.log('Seeding database...');

  // Clear existing data
  console.log('Clearing existing data...');
  await db.delete(reviews);
  await db.delete(orderItems);
  await db.delete(orders);
  await db.delete(cartItems);
  await db.delete(coupons);
  await db.delete(products);
  await db.delete(categories);
  await db.delete(users);

  // Create users
  console.log('Creating users...');
  const hashedAdminPassword = await bcrypt.hash('Admin@123456', 10);
  const hashedUserPassword = await bcrypt.hash('Test@123456', 10);
  const hashedInactivePassword = await bcrypt.hash('Inactive@123456', 10);
  const hashedPendingPassword = await bcrypt.hash('Pending@123456', 10);
  const hashedLockedPassword = await bcrypt.hash('Locked@123456', 10);

  const usersData = [
    { email: 'admin@example.com', password: hashedAdminPassword, firstName: 'Admin', lastName: 'User', role: 'admin' as const, status: 'active' as const },
    { email: 'testuser@example.com', password: hashedUserPassword, firstName: 'Test', lastName: 'User', role: 'user' as const, status: 'active' as const },
    { email: 'inactive@example.com', password: hashedInactivePassword, firstName: 'Inactive', lastName: 'User', role: 'user' as const, status: 'inactive' as const },
    { email: 'pending@example.com', password: hashedPendingPassword, firstName: 'Pending', lastName: 'User', role: 'user' as const, status: 'pending' as const },
    { email: 'locked@example.com', password: hashedLockedPassword, firstName: 'Locked', lastName: 'User', role: 'user' as const, status: 'locked' as const },
    { email: 'john.doe@example.com', password: hashedUserPassword, firstName: 'John', lastName: 'Doe', role: 'user' as const, status: 'active' as const },
    { email: 'jane.smith@example.com', password: hashedUserPassword, firstName: 'Jane', lastName: 'Smith', role: 'user' as const, status: 'active' as const },
    { email: 'bob.wilson@example.com', password: hashedUserPassword, firstName: 'Bob', lastName: 'Wilson', role: 'moderator' as const, status: 'active' as const },
  ];

  for (const userData of usersData) {
    await db.insert(users).values(userData);
  }

  // Create categories
  console.log('Creating categories...');
  const categoriesData = [
    { name: 'Electronics', slug: 'electronics', description: 'Latest gadgets and electronic devices', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
    { name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel for all styles', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
    { name: 'Home & Garden', slug: 'home-garden', description: 'Everything for your home and garden', image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400' },
    { name: 'Sports', slug: 'sports', description: 'Sports equipment and athletic gear', image: 'https://images.unsplash.com/photo-1461896836934- voices-gab-4?w=400' },
    { name: 'Books', slug: 'books', description: 'Books, e-books, and reading materials', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400' },
  ];

  for (const categoryData of categoriesData) {
    await db.insert(categories).values(categoryData);
  }

  // Get category IDs
  const allCategories = await db.select().from(categories);
  const categoryMap = new Map(allCategories.map(c => [c.slug, c.id]));

  // Create products
  console.log('Creating products...');
  const productsData = [
    // Electronics
    { name: 'Wireless Bluetooth Headphones', slug: 'wireless-bluetooth-headphones', description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.', price: 149.99, originalPrice: 199.99, categoryId: categoryMap.get('electronics')!, stock: 50, images: JSON.stringify(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400']), rating: 4.5, reviewCount: 128, featured: true, status: 'active' as const },
    { name: 'Smart Watch Pro', slug: 'smart-watch-pro', description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery.', price: 299.99, originalPrice: 349.99, categoryId: categoryMap.get('electronics')!, stock: 35, images: JSON.stringify(['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400']), rating: 4.7, reviewCount: 89, featured: true, status: 'active' as const },
    { name: 'Portable Bluetooth Speaker', slug: 'portable-bluetooth-speaker', description: 'Waterproof speaker with 360-degree sound and 12-hour playtime.', price: 79.99, originalPrice: null, categoryId: categoryMap.get('electronics')!, stock: 100, images: JSON.stringify(['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400']), rating: 4.3, reviewCount: 256, featured: false, status: 'active' as const },
    { name: 'Wireless Charging Pad', slug: 'wireless-charging-pad', description: 'Fast wireless charger compatible with all Qi-enabled devices.', price: 29.99, originalPrice: 39.99, categoryId: categoryMap.get('electronics')!, stock: 200, images: JSON.stringify(['https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=400']), rating: 4.1, reviewCount: 342, featured: false, status: 'active' as const },
    { name: '4K Ultra HD Monitor', slug: '4k-ultra-hd-monitor', description: '27-inch 4K monitor with HDR support and adjustable stand.', price: 449.99, originalPrice: 549.99, categoryId: categoryMap.get('electronics')!, stock: 25, images: JSON.stringify(['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400']), rating: 4.8, reviewCount: 67, featured: true, status: 'active' as const },
    { name: 'Mechanical Gaming Keyboard', slug: 'mechanical-gaming-keyboard', description: 'RGB backlit mechanical keyboard with Cherry MX switches.', price: 129.99, originalPrice: null, categoryId: categoryMap.get('electronics')!, stock: 75, images: JSON.stringify(['https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400']), rating: 4.6, reviewCount: 189, featured: false, status: 'active' as const },

    // Clothing
    { name: 'Classic Cotton T-Shirt', slug: 'classic-cotton-tshirt', description: 'Comfortable 100% cotton t-shirt available in multiple colors.', price: 24.99, originalPrice: null, categoryId: categoryMap.get('clothing')!, stock: 500, images: JSON.stringify(['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400']), rating: 4.2, reviewCount: 567, featured: false, status: 'active' as const },
    { name: 'Slim Fit Jeans', slug: 'slim-fit-jeans', description: 'Modern slim fit jeans with stretch comfort.', price: 59.99, originalPrice: 79.99, categoryId: categoryMap.get('clothing')!, stock: 150, images: JSON.stringify(['https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400']), rating: 4.4, reviewCount: 234, featured: true, status: 'active' as const },
    { name: 'Hooded Sweatshirt', slug: 'hooded-sweatshirt', description: 'Cozy fleece hoodie with front pocket and adjustable hood.', price: 44.99, originalPrice: null, categoryId: categoryMap.get('clothing')!, stock: 200, images: JSON.stringify(['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400']), rating: 4.5, reviewCount: 178, featured: false, status: 'active' as const },
    { name: 'Running Sneakers', slug: 'running-sneakers', description: 'Lightweight running shoes with responsive cushioning.', price: 89.99, originalPrice: 119.99, categoryId: categoryMap.get('clothing')!, stock: 80, images: JSON.stringify(['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400']), rating: 4.7, reviewCount: 445, featured: true, status: 'active' as const },
    { name: 'Leather Belt', slug: 'leather-belt', description: 'Genuine leather belt with classic buckle.', price: 34.99, originalPrice: null, categoryId: categoryMap.get('clothing')!, stock: 120, images: JSON.stringify(['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400']), rating: 4.3, reviewCount: 89, featured: false, status: 'active' as const },

    // Home & Garden
    { name: 'Ceramic Plant Pot Set', slug: 'ceramic-plant-pot-set', description: 'Set of 3 minimalist ceramic pots with drainage holes.', price: 39.99, originalPrice: 49.99, categoryId: categoryMap.get('home-garden')!, stock: 60, images: JSON.stringify(['https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400']), rating: 4.6, reviewCount: 156, featured: true, status: 'active' as const },
    { name: 'LED Desk Lamp', slug: 'led-desk-lamp', description: 'Adjustable LED lamp with multiple brightness levels and USB charging.', price: 49.99, originalPrice: null, categoryId: categoryMap.get('home-garden')!, stock: 90, images: JSON.stringify(['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400']), rating: 4.4, reviewCount: 234, featured: false, status: 'active' as const },
    { name: 'Throw Blanket', slug: 'throw-blanket', description: 'Soft and cozy throw blanket for sofa or bed.', price: 29.99, originalPrice: null, categoryId: categoryMap.get('home-garden')!, stock: 150, images: JSON.stringify(['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400']), rating: 4.8, reviewCount: 312, featured: false, status: 'active' as const },
    { name: 'Garden Tool Set', slug: 'garden-tool-set', description: 'Complete 5-piece garden tool set with carrying bag.', price: 54.99, originalPrice: 69.99, categoryId: categoryMap.get('home-garden')!, stock: 40, images: JSON.stringify(['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400']), rating: 4.5, reviewCount: 78, featured: true, status: 'active' as const },
    { name: 'Scented Candle Collection', slug: 'scented-candle-collection', description: 'Set of 4 soy wax candles with natural fragrances.', price: 34.99, originalPrice: null, categoryId: categoryMap.get('home-garden')!, stock: 200, images: JSON.stringify(['https://images.unsplash.com/photo-1602607077478-76b42d4d7ce3?w=400']), rating: 4.7, reviewCount: 423, featured: false, status: 'active' as const },

    // Sports
    { name: 'Yoga Mat Pro', slug: 'yoga-mat-pro', description: 'Non-slip yoga mat with alignment marks and carrying strap.', price: 44.99, originalPrice: 59.99, categoryId: categoryMap.get('sports')!, stock: 100, images: JSON.stringify(['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400']), rating: 4.6, reviewCount: 289, featured: true, status: 'active' as const },
    { name: 'Resistance Bands Set', slug: 'resistance-bands-set', description: 'Set of 5 resistance bands with different strength levels.', price: 24.99, originalPrice: null, categoryId: categoryMap.get('sports')!, stock: 150, images: JSON.stringify(['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400']), rating: 4.4, reviewCount: 567, featured: false, status: 'active' as const },
    { name: 'Insulated Water Bottle', slug: 'insulated-water-bottle', description: '32oz stainless steel bottle keeps drinks cold for 24 hours.', price: 29.99, originalPrice: null, categoryId: categoryMap.get('sports')!, stock: 200, images: JSON.stringify(['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400']), rating: 4.8, reviewCount: 678, featured: true, status: 'active' as const },
    { name: 'Dumbbell Set', slug: 'dumbbell-set', description: 'Adjustable dumbbell set from 5 to 25 lbs.', price: 149.99, originalPrice: 199.99, categoryId: categoryMap.get('sports')!, stock: 30, images: JSON.stringify(['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400']), rating: 4.7, reviewCount: 145, featured: true, status: 'active' as const },
    { name: 'Jump Rope', slug: 'jump-rope', description: 'Speed jump rope with ball bearings and adjustable length.', price: 14.99, originalPrice: null, categoryId: categoryMap.get('sports')!, stock: 250, images: JSON.stringify(['https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400']), rating: 4.3, reviewCount: 234, featured: false, status: 'active' as const },

    // Books
    { name: 'The Art of Programming', slug: 'art-of-programming', description: 'Comprehensive guide to software development best practices.', price: 49.99, originalPrice: null, categoryId: categoryMap.get('books')!, stock: 100, images: JSON.stringify(['https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400']), rating: 4.9, reviewCount: 456, featured: true, status: 'active' as const },
    { name: 'Mindfulness for Beginners', slug: 'mindfulness-beginners', description: 'Introduction to meditation and mindful living.', price: 19.99, originalPrice: 24.99, categoryId: categoryMap.get('books')!, stock: 80, images: JSON.stringify(['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400']), rating: 4.5, reviewCount: 234, featured: false, status: 'active' as const },
    { name: 'Cooking Made Simple', slug: 'cooking-made-simple', description: '100 easy recipes for everyday meals.', price: 29.99, originalPrice: null, categoryId: categoryMap.get('books')!, stock: 120, images: JSON.stringify(['https://images.unsplash.com/photo-1589998059171-988d887df646?w=400']), rating: 4.6, reviewCount: 345, featured: true, status: 'active' as const },
    { name: 'Financial Freedom', slug: 'financial-freedom', description: 'Your guide to achieving financial independence.', price: 24.99, originalPrice: null, categoryId: categoryMap.get('books')!, stock: 90, images: JSON.stringify(['https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400']), rating: 4.4, reviewCount: 189, featured: false, status: 'active' as const },
    { name: 'Photography Essentials', slug: 'photography-essentials', description: 'Master the basics of digital photography.', price: 34.99, originalPrice: 44.99, categoryId: categoryMap.get('books')!, stock: 60, images: JSON.stringify(['https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400']), rating: 4.7, reviewCount: 267, featured: false, status: 'active' as const },
  ];

  for (const productData of productsData) {
    await db.insert(products).values(productData);
  }

  // Get test user ID
  const testUser = await db.select().from(users).where(eq(users.email, 'testuser@example.com'));
  const testUserId = testUser[0].id;

  // Get some products for orders
  const allProducts = await db.select().from(products);

  // Create sample orders for test user
  console.log('Creating sample orders...');
  const ordersData = [
    {
      userId: testUserId,
      status: 'delivered' as const,
      subtotal: 229.97,
      tax: 18.40,
      shipping: 9.99,
      total: 258.36,
      shippingAddress: JSON.stringify({ street: '123 Test Street', city: 'Test City', state: 'CA', zipCode: '12345', country: 'USA' }),
      billingAddress: JSON.stringify({ street: '123 Test Street', city: 'Test City', state: 'CA', zipCode: '12345', country: 'USA' }),
      paymentMethod: 'credit_card',
      paymentStatus: 'completed' as const,
    },
    {
      userId: testUserId,
      status: 'shipped' as const,
      subtotal: 149.99,
      tax: 12.00,
      shipping: 0,
      total: 161.99,
      shippingAddress: JSON.stringify({ street: '123 Test Street', city: 'Test City', state: 'CA', zipCode: '12345', country: 'USA' }),
      billingAddress: JSON.stringify({ street: '123 Test Street', city: 'Test City', state: 'CA', zipCode: '12345', country: 'USA' }),
      paymentMethod: 'paypal',
      paymentStatus: 'completed' as const,
    },
    {
      userId: testUserId,
      status: 'processing' as const,
      subtotal: 79.98,
      tax: 6.40,
      shipping: 5.99,
      total: 92.37,
      shippingAddress: JSON.stringify({ street: '123 Test Street', city: 'Test City', state: 'CA', zipCode: '12345', country: 'USA' }),
      billingAddress: JSON.stringify({ street: '123 Test Street', city: 'Test City', state: 'CA', zipCode: '12345', country: 'USA' }),
      paymentMethod: 'credit_card',
      paymentStatus: 'completed' as const,
    },
  ];

  for (const orderData of ordersData) {
    const [order] = await db.insert(orders).values(orderData).returning();

    // Add order items
    const orderItemsData = [
      { orderId: order.id, productId: allProducts[0].id, name: allProducts[0].name, price: allProducts[0].price, quantity: 1 },
      { orderId: order.id, productId: allProducts[1].id, name: allProducts[1].name, price: allProducts[1].price, quantity: 1 },
    ];

    for (const itemData of orderItemsData) {
      await db.insert(orderItems).values(itemData);
    }
  }

  // Create sample reviews
  console.log('Creating sample reviews...');
  const reviewsData = [
    { userId: testUserId, productId: allProducts[0].id, rating: 5, title: 'Amazing headphones!', comment: 'Best noise cancellation I have ever experienced. Worth every penny.' },
    { userId: testUserId, productId: allProducts[1].id, rating: 4, title: 'Great smartwatch', comment: 'Love the health features. Battery could be better.' },
    { userId: testUserId, productId: allProducts[4].id, rating: 5, title: 'Perfect monitor', comment: 'Crystal clear display. Perfect for work and gaming.' },
  ];

  for (const reviewData of reviewsData) {
    await db.insert(reviews).values(reviewData);
  }

  // Add some items to cart for test user
  console.log('Adding cart items...');
  await db.insert(cartItems).values({ userId: testUserId, productId: allProducts[2].id, quantity: 2 });
  await db.insert(cartItems).values({ userId: testUserId, productId: allProducts[5].id, quantity: 1 });

  // Create coupons
  console.log('Creating coupons...');
  const couponsData = [
    { code: 'SAVE10', type: 'percentage' as const, discount: 10, minOrderAmount: 50, maxUsages: 100, isActive: true },
    { code: 'SAVE20', type: 'percentage' as const, discount: 20, minOrderAmount: 100, maxUsages: 50, isActive: true },
    { code: 'FLAT5', type: 'fixed' as const, discount: 5, minOrderAmount: null, maxUsages: null, isActive: true },
    { code: 'SUMMER', type: 'percentage' as const, discount: 15, minOrderAmount: 75, maxUsages: 200, isActive: true },
    { code: 'EXPIRED10', type: 'percentage' as const, discount: 10, minOrderAmount: null, maxUsages: null, isActive: true, expiresAt: '2020-01-01T00:00:00.000Z' },
  ];

  for (const couponData of couponsData) {
    await db.insert(coupons).values(couponData);
  }

  console.log('Database seeded successfully!');
}

seed().catch(console.error);
