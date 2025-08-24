import { integer, text, real, pgTable, timestamp, serial, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Better Auth Schema
export const user = pgTable("user", {
	id: text("id").notNull().primaryKey(),
	name: text("name"),
	email: text("email").notNull(),
	emailVerified: timestamp("emailVerified", { mode: "date" }),
	image: text("image"),
  role: text('role', { enum: ['ADMIN', 'CUSTOMER'] }).notNull().default('CUSTOMER'),
});

export const authenticator = pgTable("authenticator", {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: integer("credentialBackedUp").notNull(),
    transports: text("transports"),
});

export const session = pgTable("session", {
	sessionToken: text("sessionToken").notNull().primaryKey(),
	userId: text("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	expires: timestamp("expires", { mode: "date" }).notNull(),
});

// App-specific schema
export const product = pgTable('product', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  longDescription: text('longDescription').notNull(),
  price: real('price').notNull(),
  salePrice: real('salePrice'),
  rating: real('rating').notNull().default(0),
  reviewCount: integer('reviewCount').notNull().default(0),
  category: text('category', { enum: ['Skincare', 'Makeup', 'Haircare', 'Fragrance'] }).notNull(),
  images: text('images').array().notNull(),
  tags: text('tags').array().notNull(),
  quantity: integer('quantity'),
  deliveryTime: text('deliveryTime').notNull(),
  brand: text('brand').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const order = pgTable('order', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  total: real('total').notNull(),
  status: text('status').notNull(),
  shippingAddress: text('shipping_address').notNull(),
  transactionId: text('transaction_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orderItem = pgTable('order_item', {
  id: varchar('id', { length: 255 }).primaryKey(),
  orderId: varchar('order_id', { length: 255 }).notNull().references(() => order.id, { onDelete: 'cascade' }),
  productId: varchar('product_id', { length: 255 }).notNull().references(() => product.id, { onDelete: 'set null' }),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
});

// Relations
export const orderRelations = relations(order, ({ many, one }) => ({
  items: many(orderItem),
  user: one(user, {
    fields: [order.userId],
    references: [user.id],
  }),
}));

export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(order, {
    fields: [orderItem.orderId],
    references: [order.id],
  }),
  product: one(product, {
    fields: [orderItem.productId],
    references: [product.id],
  }),
}));

export const userRelations = relations(user, ({ many }) => ({
  orders: many(order),
}));
