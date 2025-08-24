'use server';

import type { Order, OrderItemInput } from '@/lib/types';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import { and, desc, eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

export async function createOrder(
  firebaseUid: string,
  items: OrderItemInput[],
  total: number,
  shippingAddress: any,
  transactionId?: string,
  status: 'Processing' | 'Paid' | 'Failed' = 'Processing'
): Promise<Order | null> {
  try {
    const orderId = randomUUID();
    const newOrder = {
        id: orderId,
        userId: firebaseUid,
        total,
        status,
        shippingAddress: JSON.stringify(shippingAddress),
        transactionId: transactionId || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    await db.insert(schema.orders).values(newOrder);
    
    if (items.length > 0) {
      const orderItems = items.map(item => ({
        id: randomUUID(),
        orderId: orderId,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
      }));
      await db.insert(schema.orderItems).values(orderItems);
    }
    
    revalidatePath('/account');
    
    const createdOrder = await db.query.orders.findFirst({
        where: eq(schema.orders.id, orderId),
        with: {
            items: true
        }
    })

    return JSON.parse(JSON.stringify(createdOrder));

  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

export async function getUserOrders(firebaseUid: string): Promise<any[]> {
    try {
        const orders = await db.query.orders.findMany({
            where: eq(schema.orders.userId, firebaseUid),
            with: {
                items: {
                    with: {
                        product: true
                    }
                }
            },
            orderBy: [desc(schema.orders.createdAt)]
        });

        return JSON.parse(JSON.stringify(orders.map(o => ({...o, date: o.createdAt}))));

    } catch (error) {
        console.error("Failed to fetch user orders:", error);
        return [];
    }
}

export async function getAllOrders() {
  try {
     const orders = await db.query.orders.findMany({
        with: {
            user: true,
            items: {
                with: {
                    product: true
                }
            }
        },
        orderBy: [desc(schema.orders.createdAt)]
    });

    return JSON.parse(JSON.stringify(orders.map(o => ({...o, date: o.createdAt}))));
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
    return [];
  }
}
