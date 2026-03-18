import { pgTable, serial, text, varchar, integer, decimal, timestamp, boolean, pgEnum, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['admin', 'buyer', 'seller', 'guest']);
export const userStatusEnum = pgEnum('user_status', ['active', 'suspended', 'blocked', 'deleted']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded']);
export const paymentMethodEnum = pgEnum('payment_method', ['cash_on_delivery']);

// Tables
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  role: userRoleEnum('role').default('buyer').notNull(),
  status: userStatusEnum('status').default('active').notNull(),
  suspendedAt: timestamp('suspended_at'),
  suspendReason: text('suspend_reason'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  emailIdx: index('idx_users_email').on(table.email),
  roleIdx: index('idx_users_role').on(table.role),
  statusIdx: index('idx_users_status').on(table.status),
}));

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: integer('price').notNull(),
  image: varchar('image', { length: 255 }),
  category: varchar('category', { length: 100 }),
  stock: integer('stock').default(0),
  colors: text('colors'), // JSON array of colors
  sizes: text('sizes'), // JSON array of sizes
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  categoryIdx: index('idx_products_category').on(table.category),
  stockIdx: index('idx_products_stock').on(table.stock),
  createdAtIdx: index('idx_products_created_at').on(table.createdAt),
}));

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  guestEmail: varchar('guest_email', { length: 255 }),
  guestName: varchar('guest_name', { length: 255 }),
  status: orderStatusEnum('status').default('pending'),
  totalAmount: integer('total_amount').notNull(),
  paymentStatus: paymentStatusEnum('payment_status').default('pending'),
  paymentMethod: paymentMethodEnum('payment_method').default('cash_on_delivery'),
  deliveryAddress: text('delivery_address'),
  phoneNumber: varchar('phone_number', { length: 20 }),
  deliveryZoneId: integer('delivery_zone_id').references(() => deliveryZones.id),
  adminNotes: text('admin_notes'),
  rejectionReason: text('rejection_reason'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_orders_user_id').on(table.userId),
  statusIdx: index('idx_orders_status').on(table.status),
  createdAtIdx: index('idx_orders_created_at').on(table.createdAt),
  guestEmailIdx: index('idx_orders_guest_email').on(table.guestEmail),
  deliveryZoneIdIdx: index('idx_orders_delivery_zone_id').on(table.deliveryZoneId),
}));

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id),
  productId: integer('product_id').references(() => products.id),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
});

export const cart = pgTable('cart', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  productId: integer('product_id').references(() => products.id),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const wishlist = pgTable('wishlist', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  key: varchar('key', { length: 255 }).unique().notNull(),
  value: text('value').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const logoHistory = pgTable('logo_history', {
  id: serial('id').primaryKey(),
  logoUrl: varchar('logo_url', { length: 500 }).notNull(),
  siteName: varchar('site_name', { length: 255 }).notNull(),
  tagline: varchar('tagline', { length: 255 }),
  faviconUrl: varchar('favicon_url', { length: 500 }),
  userId: integer('user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const deliveryZones = pgTable('delivery_zones', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  price: integer('price').notNull(), // Delivery price in GNF
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  nameIdx: index('idx_delivery_zones_name').on(table.name),
  activeIdx: index('idx_delivery_zones_active').on(table.isActive),
}));

// Marketing campaign enums
export const campaignStatusEnum = pgEnum('campaign_status', ['draft', 'scheduled', 'sending', 'sent', 'cancelled']);
export const campaignTypeEnum = pgEnum('campaign_type', ['newsletter', 'promotion', 'reactivation', 'announcement']);

// Brand ambassadors table - Profils détaillés des ambassadeurs
export const brandAmbassadors = pgTable('brand_ambassadors', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  profileImage: varchar('profile_image', { length: 500 }).notNull(),
  bio: text('bio'), // Biographie complète
  role: varchar('role', { length: 255 }), // Ex: "Influenceur Mode", "Artiste"
  instagram: varchar('instagram', { length: 255 }),
  facebook: varchar('facebook', { length: 255 }),
  twitter: varchar('twitter', { length: 255 }),
  tiktok: varchar('tiktok', { length: 255 }),
  website: varchar('website', { length: 255 }),
  isActive: boolean('is_active').default(true),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  activeIdx: index('idx_ambassadors_active').on(table.isActive),
  orderIdx: index('idx_ambassadors_order').on(table.displayOrder),
}));

// Customer gallery - Photos des clients portant la marque
export const customerGallery = pgTable('customer_gallery', {
  id: serial('id').primaryKey(),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  customerName: varchar('customer_name', { length: 255 }),
  caption: text('caption'), // Légende de la photo
  productId: integer('product_id').references(() => products.id),
  isApproved: boolean('is_approved').default(false), // Modération
  isActive: boolean('is_active').default(true),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  approvedIdx: index('idx_gallery_approved').on(table.isApproved),
  activeIdx: index('idx_gallery_active').on(table.isActive),
  orderIdx: index('idx_gallery_order').on(table.displayOrder),
}));

// Hero images table
export const heroImages = pgTable('hero_images', {
  id: serial('id').primaryKey(),
  imageUrl: varchar('image_url', { length: 500 }).notNull(),
  title: varchar('title', { length: 255 }),
  subtitle: varchar('subtitle', { length: 255 }),
  ctaText: varchar('cta_text', { length: 100 }),
  ctaLink: varchar('cta_link', { length: 500 }),
  isActive: boolean('is_active').default(true),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  activeIdx: index('idx_hero_images_active').on(table.isActive),
  orderIdx: index('idx_hero_images_order').on(table.displayOrder),
}));

// Notifications table
export const notificationTypeEnum = pgEnum('notification_type', [
  'order_created',
  'order_processing',
  'order_shipped',
  'order_delivered',
  'order_cancelled',
  'payment_received',
  'new_order_admin',
  'low_stock_admin',
  'product_review',
]);

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  adminId: integer('admin_id').references(() => users.id),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  orderId: integer('order_id').references(() => orders.id),
  productId: integer('product_id').references(() => products.id),
  isRead: boolean('is_read').default(false),
  actionUrl: varchar('action_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
  readAt: timestamp('read_at'),
}, (table) => ({
  userIdIdx: index('idx_notifications_user_id').on(table.userId),
  adminIdIdx: index('idx_notifications_admin_id').on(table.adminId),
  isReadIdx: index('idx_notifications_is_read').on(table.isRead),
  createdAtIdx: index('idx_notifications_created_at').on(table.createdAt),
  typeIdx: index('idx_notifications_type').on(table.type),
}));

// Marketing campaigns table
export const marketingCampaigns = pgTable('marketing_campaigns', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  content: text('content').notNull(),
  type: campaignTypeEnum('type').notNull(),
  status: campaignStatusEnum('status').default('draft').notNull(),
  targetSegment: varchar('target_segment', { length: 100 }), // 'all', 'vip', 'inactive', 'new', etc.
  scheduledAt: timestamp('scheduled_at'),
  sentAt: timestamp('sent_at'),
  recipientCount: integer('recipient_count').default(0),
  openedCount: integer('opened_count').default(0),
  clickedCount: integer('clicked_count').default(0),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => ({
  statusIdx: index('idx_campaigns_status').on(table.status),
  typeIdx: index('idx_campaigns_type').on(table.type),
  scheduledAtIdx: index('idx_campaigns_scheduled_at').on(table.scheduledAt),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  cartItems: many(cart),
  reviews: many(reviews),
  wishlistItems: many(wishlist),
  notifications: many(notifications),
  adminNotifications: many(notifications, { relationName: 'adminNotifications' }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  deliveryZone: one(deliveryZones, { fields: [orders.deliveryZoneId], references: [deliveryZones.id] }),
  items: many(orderItems),
  notifications: many(notifications),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export const cartRelations = relations(cart, ({ one }) => ({
  user: one(users, { fields: [cart.userId], references: [users.id] }),
  product: one(products, { fields: [cart.productId], references: [products.id] }),
}));

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
  cartItems: many(cart),
  reviews: many(reviews),
  wishlistItems: many(wishlist),
  notifications: many(notifications),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}));

export const wishlistRelations = relations(wishlist, ({ one }) => ({
  user: one(users, { fields: [wishlist.userId], references: [users.id] }),
  product: one(products, { fields: [wishlist.productId], references: [products.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
  admin: one(users, { fields: [notifications.adminId], references: [users.id], relationName: 'adminNotifications' }),
  order: one(orders, { fields: [notifications.orderId], references: [orders.id] }),
  product: one(products, { fields: [notifications.productId], references: [products.id] }),
}));
