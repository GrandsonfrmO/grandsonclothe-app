import { db } from './index';
import { users, products, orders, orderItems, cart } from './schema';
import { eq, and, desc, asc } from 'drizzle-orm';

// Users
export async function createUser(email: string, name: string, password: string) {
  return db.insert(users).values({ email, name, password }).returning();
}

export async function getUserByEmail(email: string) {
  return db.select().from(users).where(eq(users.email, email)).limit(1);
}

// Products
export async function getAllProducts() {
  return db.select().from(products);
}

// Optimized: Get products with pagination and sorting at DB level
export async function getProductsPaginated(options: {
  page?: number;
  limit?: number;
  sort?: 'recent' | 'popular' | 'top-rated' | 'random';
  category?: string;
}) {
  const { page = 1, limit = 12, sort = 'recent', category } = options;
  const offset = (page - 1) * limit;

  let query = db.select().from(products);

  // Filter by category if provided
  if (category) {
    query = query.where(eq(products.category, category)) as any;
  }

  // Apply sorting at database level
  switch (sort) {
    case 'recent':
      query = query.orderBy(products.createdAt) as any;
      break;
    case 'popular':
      query = query.orderBy(products.stock) as any; // Lower stock = more popular
      break;
    case 'top-rated':
      query = query.orderBy(products.id) as any; // Placeholder until reviews
      break;
    case 'random':
      // Random sorting - keep in memory for now
      break;
  }

  // Get total count for pagination
  const totalResult = await db.select({ count: products.id }).from(products);
  const total = totalResult.length;

  // Apply pagination
  const items = await query.limit(limit).offset(offset);

  return {
    items: sort === 'random' ? items.sort(() => Math.random() - 0.5) : items,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
    hasMore: offset + limit < total,
  };
}

export async function getProductById(id: number) {
  return db.select().from(products).where(eq(products.id, id)).limit(1);
}

export async function createProduct(name: string, description: string, price: number, image: string, category: string, stock: number) {
  return db.insert(products).values({ name, description, price, image, category, stock }).returning();
}

// Orders
export async function createOrder(userId: number, totalAmount: number, paymentMethod: 'cash_on_delivery' = 'cash_on_delivery', deliveryAddress?: string, phoneNumber?: string) {
  return db.insert(orders).values({ userId, totalAmount, paymentMethod, deliveryAddress, phoneNumber }).returning();
}

export async function getOrdersByUserId(userId: number) {
  return db.select().from(orders).where(eq(orders.userId, userId));
}

export async function getOrderById(id: number) {
  return db.select().from(orders).where(eq(orders.id, id)).limit(1);
}

// Order Items
export async function addOrderItem(orderId: number, productId: number, quantity: number, price: number) {
  return db.insert(orderItems).values({ orderId, productId, quantity, price }).returning();
}

export async function getOrderItems(orderId: number) {
  return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

export async function getOrderWithItems(orderId: number) {
  const order = await getOrderById(orderId);
  if (!order || order.length === 0) return null;

  const items = await db
    .select({
      id: orderItems.id,
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      price: orderItems.price,
      productName: products.name,
    })
    .from(orderItems)
    .innerJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, orderId));

  return { ...order[0], items };
}

// Cart
export async function addToCart(userId: number, productId: number, quantity: number) {
  return db.insert(cart).values({ userId, productId, quantity }).returning();
}

export async function getCartItems(userId: number) {
  return db.select().from(cart).where(eq(cart.userId, userId));
}

export async function removeFromCart(userId: number, productId: number) {
  return db.delete(cart).where(and(eq(cart.userId, userId), eq(cart.productId, productId)));
}

export async function updateCartQuantity(userId: number, productId: number, quantity: number) {
  return db.update(cart).set({ quantity }).where(and(eq(cart.userId, userId), eq(cart.productId, productId))).returning();
}

export async function clearCart(userId: number) {
  return db.delete(cart).where(eq(cart.userId, userId));
}
