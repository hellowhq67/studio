import { pgTable, text, varchar, timestamp, integer, decimal, jsonb, pgEnum } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const categoryEnum = pgEnum('category', ['Skincare', 'Makeup', 'Haircare', 'Fragrance']);
export const roleEnum = pgEnum('role', ['ADMIN', 'CUSTOMER']);
export const orderStatusEnum = pgEnum('order_status', ['Processing', 'Paid', 'Failed', 'Shipped', 'Delivered']);

export const users = pgTable('users', {
  id: varchar('id').primaryKey(), // Firebase UID
  name: text('name'),
  email: text('email').notNull().unique(),
  role: roleEnum('role').default('CUSTOMER').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

export const products = pgTable('products', {
  id: varchar('id').primaryKey().$defaultFn(() => `prod_${crypto.randomUUID()}`),
  name: text('name').notNull(),
  description: text('description').notNull(),
  longDescription: text('long_description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal('sale_price', { precision: 10, scale: 2 }),
  rating: decimal('rating', { precision: 2, scale: 1 }).default('0').notNull(),
  reviewCount: integer('review_count').default(0).notNull(),
  category: categoryEnum('category').notNull(),
  images: text('images').array().notNull().default([]),
  tags: text('tags').array().notNull().default([]),
  quantity: integer('quantity').default(0),
  deliveryTime: text('delivery_time').notNull(),
  brand: text('brand').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

export const orders = pgTable('orders', {
  id: varchar('id').primaryKey().$defaultFn(() => `ord_${crypto.randomUUID()}`),
  userId: varchar('user_id').notNull().references(() => users.id),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum('status').default('Processing').notNull(),
  shippingAddress: jsonb('shipping_address').notNull(),
  transactionId: text('transaction_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
});

export const orderItems = pgTable('order_items', {
  id: varchar('id').primaryKey().$defaultFn(() => `item_${crypto.randomUUID()}`),
  orderId: varchar('order_id').notNull().references(() => orders.id),
  productId: varchar('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
});

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);

export const insertProductSchema = createInsertSchema(products);
export const selectProductSchema = createSelectSchema(products);

export const insertOrderSchema = createInsertSchema(orders);
export const selectOrderSchema = createSelectSchema(orders);

export const insertOrderItemSchema = createInsertSchema(orderItems);
export const selectOrderItemSchema = createSelectSchema(orderItems);

export type User = z.infer<typeof selectUserSchema>;
export type NewUser = z.infer<typeof insertUserSchema>;

export type Product = z.infer<typeof selectProductSchema>;
export type NewProduct = z.infer<typeof insertProductSchema>;

export type Order = z.infer<typeof selectOrderSchema>;
export type NewOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = z.infer<typeof selectOrderItemSchema>;
export type NewOrderItem = z.infer<typeof insertOrderItemSchema>;
