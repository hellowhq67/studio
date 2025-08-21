'use server';

import { mockOrders, mockProducts } from '@/lib/mock-data';
import type { CartItem, Order, OrderItemInput } from '@/lib/types';

export async function createOrder(
  firebaseUid: string,
  items: OrderItemInput[],
  total: number,
  shippingAddress: any,
  transactionId?: string,
  status: 'Processing' | 'Paid' | 'Failed' = 'Processing'
): Promise<Order | null> {
  try {
    // In a real app, you would find a user, but here we just assign a mock userId
    const userId = 'user_1'; // Mock user ID

    const newOrder: Order = {
      id: `order_${new Date().getTime()}`,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      total,
      status: status,
      transactionId: transactionId,
      shippingAddress,
      items: items.map(item => ({
        id: `order_item_${new Date().getTime()}_${item.productId}`,
        orderId: `order_${new Date().getTime()}`,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
    };
    
    mockOrders.unshift(newOrder); // Add to the beginning of the array
    return newOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

export async function getUserOrders(firebaseUid: string): Promise<any[]> {
    try {
        // Mock finding user and their orders. In this mock, we return all orders for simplicity
        const orders = mockOrders.map(order => {
            const enrichedItems = order.items.map(item => {
                const product = mockProducts.find(p => p.id === item.productId);
                return {
                    ...item,
                    product
                }
            });
            return {
                ...order,
                date: order.createdAt.toISOString(),
                items: enrichedItems,
                user: { id: order.userId, name: 'Mock User', email: 'mock@example.com' } // Mock user
            }
        });

        return orders.map(order => ({
            id: order.id,
            date: order.date,
            status: order.status,
            total: order.total,
            items: order.items.map(item => ({
                quantity: item.quantity,
                product: item.product
            }))
        }));

    } catch (error) {
        console.error("Failed to fetch user orders:", error);
        return [];
    }
}

export async function getAllOrders() {
  try {
      const orders = mockOrders.map(order => {
        const enrichedItems = order.items.map(item => {
            const product = mockProducts.find(p => p.id === item.productId);
            return {
                ...item,
                product
            }
        });
        return {
            ...order,
            date: order.createdAt.toISOString(),
            items: enrichedItems,
            user: { id: order.userId, name: 'Mock User', email: 'mock@example.com' } // Mock user
        }
    });

    return orders;
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
    return [];
  }
}
