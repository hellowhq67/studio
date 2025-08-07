'use server';

import prisma from '@/lib/prisma';
import type { CartItem } from '@/lib/types';
import type { Order } from '@prisma/client';

export async function createOrder(
  userId: string,
  items: CartItem[],
  total: number,
  shippingAddress: any
): Promise<Order | null> {
  try {
    const user = await prisma.user.findFirst({ where: { firebaseUid: userId } });
    if (!user) {
        throw new Error('User not found');
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        status: 'Processing',
        shippingAddress,
        items: {
          create: items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.salePrice ?? item.product.price,
          })),
        },
      },
    });
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

export async function getUserOrders(firebaseUid: string): Promise<any[]> {
    try {
        const user = await prisma.user.findUnique({
            where: { firebaseUid },
        });

        if (!user) {
            return [];
        }

        const orders = await prisma.order.findMany({
            where: { userId: user.id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Map to a structure similar to the old one to minimize frontend changes
        return orders.map(order => ({
            id: order.id,
            date: order.createdAt.toISOString(),
            status: order.status,
            total: order.total,
            items: order.items.map(item => ({
                quantity: item.quantity,
                product: {
                    ...item.product
                }
            }))
        }));

    } catch (error) {
        console.error("Failed to fetch user orders:", error);
        return [];
    }
}
