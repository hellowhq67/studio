
'use server';

import type { Order, OrderItemInput, Product, User } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, doc, getDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';

// Helper to fetch product details for enrichment
async function getProductDetails(productId: string): Promise<Product | null> {
    try {
        const productRef = doc(db, 'products', productId);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
            return { id: productSnap.id, ...productSnap.data() } as Product;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching product ${productId}:`, error);
        return null;
    }
}

// Helper to fetch user details for enrichment
async function getUserDetails(userId: string): Promise<User | null> {
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            return userSnap.data() as User;
        }
         return { id: userId, name: 'Unknown User', email: 'unknown@example.com', role: 'CUSTOMER' };
    } catch (error) {
        console.error(`Error fetching user ${userId}:`, error);
        return { id: userId, name: 'Unknown User', email: 'unknown@example.com', role: 'CUSTOMER' };
    }
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
    const ordersCollection = collection(db, 'orders');
    
    // Create the main order document
    const newOrderRef = await addDoc(ordersCollection, {
        userId: firebaseUid,
        total: total,
        status,
        shippingAddress: JSON.stringify(shippingAddress),
        transactionId: transactionId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    const batch = writeBatch(db);
    const orderItemsCollection = collection(db, `orders/${newOrderRef.id}/items`);
    
    items.forEach(item => {
        const itemRef = doc(orderItemsCollection);
        batch.set(itemRef, {
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
        });
    });

    await batch.commit();

    revalidatePath('/account');
    revalidatePath('/admin/orders');
    
    const createdOrderDoc = await getDoc(newOrderRef);
    return { id: createdOrderDoc.id, ...createdOrderDoc.data() } as Order;

  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

export async function getUserOrders(firebaseUid: string): Promise<any[]> {
    try {
        const ordersQuery = query(collection(db, 'orders'), where('userId', '==', firebaseUid));
        const querySnapshot = await getDocs(ordersQuery);
        
        const orders = await Promise.all(querySnapshot.docs.map(async (orderDoc) => {
            const orderData = orderDoc.data();
            const itemsQuery = query(collection(db, `orders/${orderDoc.id}/items`));
            const itemsSnapshot = await getDocs(itemsQuery);
            
            const items = await Promise.all(itemsSnapshot.docs.map(async (itemDoc) => {
                const itemData = itemDoc.data();
                const product = await getProductDetails(itemData.productId);
                return {
                    ...itemData,
                    product: product || { name: 'Unknown Product', images: [] },
                };
            }));

            return {
                id: orderDoc.id,
                ...orderData,
                createdAt: orderData.createdAt.toDate().toISOString(),
                items,
            };
        }));
        
        return JSON.parse(JSON.stringify(orders));

    } catch (error) {
        console.error("Failed to fetch user orders:", error);
        return [];
    }
}

export async function getAllOrders(): Promise<any[]> {
  try {
     const ordersQuery = query(collection(db, 'orders'));
     const querySnapshot = await getDocs(ordersQuery);

     const orders = await Promise.all(querySnapshot.docs.map(async (orderDoc) => {
         const orderData = orderDoc.data();
         
         const user = await getUserDetails(orderData.userId);
         
         const itemsQuery = query(collection(db, `orders/${orderDoc.id}/items`));
         const itemsSnapshot = await getDocs(itemsQuery);
         const items = itemsSnapshot.docs.map(doc => doc.data());

         return {
             id: orderDoc.id,
             ...orderData,
             createdAt: orderData.createdAt.toDate().toISOString(),
             user: user || { name: 'Unknown User', email: '' },
             items: items
         };
     }));

     return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
    return [];
  }
}
