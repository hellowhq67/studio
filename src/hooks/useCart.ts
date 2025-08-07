'use client';

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { CartItem, Product } from '@/lib/types';
import { useToast } from './use-toast';
import { useAuth } from './useAuth';
import { getFirestore, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const db = getFirestore(app);

const getInitialCart = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const savedCart = localStorage.getItem('glowup-cart-guest');
  return savedCart ? JSON.parse(savedCart) : [];
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const writeToFirestore = useCallback(async (cartItems: CartItem[]) => {
    if (user) {
      try {
        const cartRef = doc(db, 'carts', user.uid);
        await setDoc(cartRef, { items: cartItems });
      } catch (error) {
        console.error("Error writing cart to Firestore:", error);
        toast({
          variant: 'destructive',
          title: 'Error Saving Cart',
          description: 'Could not save your cart to the cloud.',
        });
      }
    }
  }, [user, toast]);
  
  useEffect(() => {
    const syncCart = async () => {
      setLoading(true);
      if (user) {
        // User is logged in, sync with Firestore
        const cartRef = doc(db, 'carts', user.uid);
        const cartSnap = await getDoc(cartRef);
        const guestCart = getInitialCart();

        if (cartSnap.exists()) {
          const firestoreCart = cartSnap.data().items as CartItem[];
          // Merge guest cart with firestore cart
          const mergedCart = [...firestoreCart];

          guestCart.forEach(guestItem => {
            const existingItemIndex = mergedCart.findIndex(item => item.product.id === guestItem.product.id);
            if (existingItemIndex > -1) {
              mergedCart[existingItemIndex].quantity += guestItem.quantity;
            } else {
              mergedCart.push(guestItem);
            }
          });
          
          setItems(mergedCart);
          if (guestCart.length > 0) {
            await writeToFirestore(mergedCart);
          }
        } else if (guestCart.length > 0) {
          // No firestore cart, but guest cart exists, so upload it
          setItems(guestCart);
          await writeToFirestore(guestCart);
        } else {
          setItems([]);
        }
        localStorage.removeItem('glowup-cart-guest');
      } else {
        // User is not logged in, use localStorage
        setItems(getInitialCart());
      }
      setLoading(false);
    };

    syncCart();
  }, [user, writeToFirestore]);

  useEffect(() => {
    // Save to localStorage for guest users
    if (!user) {
      localStorage.setItem('glowup-cart-guest', JSON.stringify(items));
    }
  }, [items, user]);
  
  const addItem = useCallback(async (product: Product, quantity: number) => {
    const newItemsFn = (prevItems: CartItem[]) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { product, quantity }];
    };
    
    setItems(prev => {
        const newItems = newItemsFn(prev);
        if (user) {
            writeToFirestore(newItems);
        }
        return newItems;
    });
  }, [toast, user, writeToFirestore]);

  const removeItem = useCallback(async (productId: string) => {
    const newItems = items.filter((item) => item.product.id !== productId);
    setItems(newItems);
    if (user) {
      await writeToFirestore(newItems);
    }
  }, [user, items, writeToFirestore]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    let newItems;
    if (quantity <= 0) {
      newItems = items.filter((item) => item.product.id !== productId);
    } else {
      newItems = items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    }
    setItems(newItems);
    if (user) {
        await writeToFirestore(newItems);
    }
  }, [user, items, writeToFirestore]);

  const clearCart = useCallback(async () => {
    setItems([]);
    if (user) {
      const cartRef = doc(db, 'carts', user.uid);
      await deleteDoc(cartRef);
    }
  }, [user]);

  const cartTotal = useMemo(() => {
    return items.reduce((total, item) => {
      const price = item.product.salePrice ?? item.product.price;
      return total + price * item.quantity
    }, 0);
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);
  
  const value = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount,
    loading,
  }), [items, addItem, removeItem, updateQuantity, clearCart, cartTotal, itemCount, loading]);

  return React.createElement(CartContext.Provider, { value }, children);
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
