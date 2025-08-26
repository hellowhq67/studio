
'use server';

import type { Order, OrderItemInput, Product, User } from '@/lib/types';
import { orders as mockOrders, products as mockProducts } from '@/lib/mock-data';
import { revalidatePath } from 'next/cache';

let orders: Order[] = [...mockOrders];

async function enrichOrder(order: Order): Promise<any> {
    const enrichedItems = order.items.map(item => {
        const product = mockProducts.find(p => p.id === item.productId);
        return {
            ...item,
            product: product || { name: 'Unknown Product' }
        };
    });

    // In a mock scenario, we don't have a real user database.
    // We'll just return a mock user object.
    const user: User = {
        id: order.userId,
        name: 'Mock User',
        email: 'mock@example.com',
        role: 'CUSTOMER'
    };

    return {
        ...order,
        items: enrichedItems,
        user: user,
        date: order.createdAt,
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
    const newOrder: Order = {
      id: `ord_${Math.random().toString(36).substr(2, 9)}`,
      userId: firebaseUid,
      items: items.map(item => ({
          ...item,
          id: `item_${Math.random().toString(36).substr(2, 9)}`,
          orderId: '', // will be set later
          product: {} as Product // Mock product
      })),
      total: total,
      status,
      shippingAddress: JSON.stringify(shippingAddress),
      transactionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user: {} as User, // Mock user
    };
    newOrder.items.forEach(item => item.orderId = newOrder.id);
    
    orders.push(newOrder);

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
        const enrichedOrders = await Promise.all(userOrders.map(enrichOrder));
        return JSON.parse(JSON.stringify(enrichedOrders));
    } catch (error) {
        console.error("Failed to fetch user orders:", error);
        return [];
    }
}

export async function getAllOrders() {
  try {
     const allOrders = [...orders];
     const enrichedOrders = await Promise.all(allOrders.map(enrichOrder));
     return JSON.parse(JSON.stringify(enrichedOrders));
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
    return [];
  }
}
