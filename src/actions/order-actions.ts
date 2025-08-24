'use server';

import type { Order, OrderItemInput } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function createOrder(
  firebaseUid: string,
  items: OrderItemInput[],
  total: number,
  shippingAddress: any,
  transactionId?: string,
  status: 'Processing' | 'Paid' | 'Failed' = 'Processing'
): Promise<Order | null> {
  try {
    const orderId = `ord_${Date.now()}`;
    
    await db.transaction(async (tx) => {
        await tx.insert(schema.order).values({
            id: orderId,
            userId: firebaseUid,
            total,
            status,
            shippingAddress: JSON.stringify(shippingAddress),
            transactionId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        
        await tx.insert(schema.orderItem).values(
            items.map(item => ({
                id: `item_${Date.now()}_${item.productId}`,
                orderId: orderId,
                productId: item.productId,
                quantity: item.quantity,
                price: item.price,
            }))
        );
    });

    revalidatePath('/account');
    
    const newOrder = await db.query.order.findFirst({
        where: eq(schema.order.id, orderId),
        with: { items: true, user: true },
    });
    
    return newOrder as Order;

  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

export async function getUserOrders(firebaseUid: string): Promise<any[]> {
    try {
        const userOrders = await db.query.order.findMany({
            where: eq(schema.order.userId, firebaseUid),
            with: { items: true },
            orderBy: (orders, { desc }) => [desc(orders.createdAt)],
        });
        return JSON.parse(JSON.stringify(userOrders.map(o => ({...o, date: o.createdAt}))));
    } catch (error) {
        console.error("Failed to fetch user orders:", error);
        return [];
    }
}

export async function getAllOrders() {
  try {
     const allOrders = await db.query.order.findMany({
        with: { user: true, items: true },
        orderBy: (orders, { desc }) => [desc(orders.createdAt)],
     });
     return JSON.parse(JSON.stringify(allOrders.map(o => ({...o, date: o.createdAt}))));
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
    return [];
  }
}
