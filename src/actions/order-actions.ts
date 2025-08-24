'use server';

import type { Order, OrderItemInput } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { orders as mockOrders } from '@/lib/mock-data';

let orders = [...mockOrders];

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
    
    const newOrder: Order = {
        id: orderId,
        userId: firebaseUid,
        total,
        status,
        shippingAddress: JSON.stringify(shippingAddress),
        transactionId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: items.map(item => ({
            id: `item_${Date.now()}_${item.productId}`,
            orderId: orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            // In a real app, you'd fetch product details here
            product: { id: item.productId, name: 'Mock Product', description: '', longDescription: '', price: item.price, category: 'Skincare', images: [], tags: [], rating: 4, reviewCount: 10, deliveryTime: '2 days', brand: 'Mock Brand', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
        })),
        // In a real app, you'd fetch user details here
        user: { id: firebaseUid, name: 'Mock User', email: 'user@example.com', role: 'CUSTOMER' }
    };

    orders.unshift(newOrder);

    revalidatePath('/account');
    
    return newOrder;

  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

export async function getUserOrders(firebaseUid: string): Promise<any[]> {
    try {
        const userOrders = orders.filter(o => o.userId === firebaseUid);
        return JSON.parse(JSON.stringify(userOrders.map(o => ({...o, date: o.createdAt}))));
    } catch (error) {
        console.error("Failed to fetch user orders:", error);
        return [];
    }
}

export async function getAllOrders() {
  try {
     const allOrders = orders;
     return JSON.parse(JSON.stringify(allOrders.map(o => ({...o, date: o.createdAt}))));
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
    return [];
  }
}
