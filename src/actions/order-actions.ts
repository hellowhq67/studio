
'use server';

import type { Order, OrderItemInput } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { orders, orderItems, users as usersSchema, products as productsSchema } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// This function needs to be adapted based on how you want to handle product/user details.
// For now, it's a simplified version. A real app might need joins.
async function enrichOrder(order: any): Promise<any> {
    const orderItemsResult = await db.select({
      quantity: orderItems.quantity,
      price: orderItems.price,
      product: productsSchema
    })
    .from(orderItems)
    .leftJoin(productsSchema, eq(orderItems.productId, productsSchema.id))
    .where(eq(orderItems.orderId, order.id));
    
    const userResult = await db.select().from(usersSchema).where(eq(usersSchema.id, order.userId)).limit(1);

    return {
        ...order,
        items: orderItemsResult.map(oi => ({...oi, product: oi.product || { name: 'Unknown Product' }})),
        user: userResult[0] || { name: 'Unknown User' },
        date: order.createdAt, // for compatibility with existing components
    };
}


export async function createOrder(
  firebaseUid: string,
  items: OrderItemInput[],
  total: number,
  shippingAddress: any,
  transactionId?: string,
  status: 'Processing' | 'Paid' | 'Failed' = 'Processing'
): Promise<Order | null> {
  try {
     const newOrder = await db.transaction(async (tx) => {
        const [insertedOrder] = await tx.insert(orders).values({
            userId: firebaseUid,
            total: total.toString(),
            status,
            shippingAddress,
            transactionId,
        }).returning();

        const itemsToInsert = items.map(item => ({
            orderId: insertedOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price.toString(),
        }));

        if (itemsToInsert.length > 0) {
           await tx.insert(orderItems).values(itemsToInsert);
        }

        return insertedOrder;
     });


    revalidatePath('/account');
    
    return newOrder as Order;

  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

export async function getUserOrders(firebaseUid: string): Promise<any[]> {
    try {
        const userOrders = await db.select().from(orders).where(eq(orders.userId, firebaseUid));
        const enrichedOrders = await Promise.all(userOrders.map(enrichOrder));
        return JSON.parse(JSON.stringify(enrichedOrders));
    } catch (error) {
        console.error("Failed to fetch user orders:", error);
        return [];
    }
}

export async function getAllOrders() {
  try {
     const allOrders = await db.select().from(orders);
     const enrichedOrders = await Promise.all(allOrders.map(enrichOrder));
     return JSON.parse(JSON.stringify(enrichedOrders));
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
    return [];
  }
}
