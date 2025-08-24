import { integer, sqliteTable, text, real, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Better Auth Schema
export const users = sqliteTable("user", {
	id: text("id").notNull().primaryKey(),
    name: text("name"),
    email: text("email"),
    role: text("role", { enum: ["ADMIN", "CUSTOMER"] }).default("CUSTOMER").notNull(),
});

export const sessions = sqliteTable("session", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id").notNull().references(() => users.id),
	expiresAt: integer("expires_at").notNull()
});

export const keys = sqliteTable("key", {
	id: text("id").notNull().primaryKey(),
	userId: text("user_id").notNull().references(() => users.id),
	hashedPassword: text("hashed_password")
});

// App-specific Schema
export const products = sqliteTable('product', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description').notNull(),
    longDescription: text('longDescription').notNull(),
    price: real('price').notNull(),
    salePrice: real('salePrice'),
    rating: real('rating').notNull().default(0),
    reviewCount: integer('reviewCount').notNull().default(0),
    category: text('category', { enum: ['Skincare', 'Makeup', 'Haircare', 'Fragrance'] }).notNull(),
    images: text('images', { mode: 'json' }).$type<string[]>().notNull(),
    tags: text('tags', { mode: 'json' }).$type<string[]>().notNull(),
    quantity: integer('quantity'),
    deliveryTime: text('deliveryTime').notNull(),
    brand: text('brand').notNull(),
    createdAt: text('createdAt').notNull(),
    updatedAt: text('updatedAt').notNull(),
});

export const orders = sqliteTable('order', {
    id: text('id').primaryKey(),
    userId: text('userId').notNull().references(() => users.id),
    total: real('total').notNull(),
    status: text('status').notNull(),
    shippingAddress: text('shippingAddress', { mode: 'json' }).notNull(),
    transactionId: text('transactionId'),
    createdAt: text('createdAt').notNull(),
    updatedAt: text('updatedAt').notNull(),
});

export const orderItems = sqliteTable('order_item', {
    id: text('id').primaryKey(),
    orderId: text('orderId').notNull().references(() => orders.id),
    productId: text('productId').notNull().references(() => products.id),
    quantity: integer('quantity').notNull(),
    price: real('price').notNull(),
});


// Relations
export const usersRelations = relations(users, ({ many }) => ({
    orders: many(orders),
    sessions: many(sessions),
    keys: many(keys),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
    items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    product: one(products, {
        fields: [orderItems.productId],
        references: [products.id],
    }),
}));
