'use server';

import type { Order, OrderItemInput } from '@/lib/types';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createOrder(
  firebaseUid: string,
  items: OrderItemInput[],
  total: number,
  shippingAddress: any,
  transactionId?: string,
  status: 'Processing' | 'Paid' | 'Failed' = 'Processing'
): Promise<Order | null> {
  try {
    const order = await prisma.order.create({
        data: {
            userId: firebaseUid,
            total,
            status,
            shippingAddress: JSON.stringify(shippingAddress),
            transactionId,
            items: {
                create: items.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }))
            }
        },
        include: {
            items: true
        }
    });
    revalidatePath('/account');
    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

export async function getUserOrders(firebaseUid: string): Promise<any[]> {
    try {
        const orders = await prisma.order.findMany({
            where: { userId: firebaseUid },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return JSON.parse(JSON.stringify(orders.map(o => ({...o, date: o.createdAt}))));

    } catch (error) {
        console.error("Failed to fetch user orders:", error);
        return [];
    }
}

export async function getAllOrders() {
  try {
      const orders = await prisma.order.findMany({
          include: {
              user: true,
              items: {
                  include: {
                      product: true
                  }
              }
          },
          orderBy: {
              createdAt: 'desc'
          }
      });

    return JSON.parse(JSON.stringify(orders.map(o => ({...o, date: o.createdAt}))));
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
    return [];
  }
}
