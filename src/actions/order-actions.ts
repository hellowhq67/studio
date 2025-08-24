'use server';

import type { Order, OrderItemInput } from '@/lib/types';
import { orders as mockOrders } from '@/lib/mock-data';
import { revalidatePath } from 'next/cache';
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
    const newOrder = {
      id: `ord_${Date.now()}`,
      userId: firebaseUid,
      total,
      status,
      shippingAddress: JSON.stringify(shippingAddress),
      transactionId: transactionId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: items.map(item => ({
        id: `item_${Date.now()}_${item.productId}`,
        orderId: `ord_${Date.now()}`,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        // In a real DB, you'd fetch the product. For mock, this is complex.
        // We'll omit the 'product' field from the mock OrderItem.
      })),
      // Mock user data
      user: { id: firebaseUid, email: 'mock@user.com', name: 'Mock User', role: 'CUSTOMER' }
    };
    
    mockOrders.unshift(newOrder as Order);
    revalidatePath('/account');

    return JSON.parse(JSON.stringify(newOrder));

  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

export async function getUserOrders(firebaseUid: string): Promise<any[]> {
    try {
        const userOrders = mockOrders.filter(o => o.userId === firebaseUid);
        return JSON.parse(JSON.stringify(userOrders.map(o => ({...o, date: o.createdAt}))));

    } catch (error) {
        console.error("Failed to fetch user orders:", error);
        return [];
    }
}

export async function getAllOrders() {
  try {
     return JSON.parse(JSON.stringify(mockOrders.map(o => ({...o, date: o.createdAt}))));
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
    return [];
  }
}
