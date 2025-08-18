'use client';

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { CartItem, Product } from '@/lib/types';
import { useToast } from './use-toast';
import { useAuth } from './useAuth';

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

const getInitialCart = (): CartItem[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  const savedCart = localStorage.getItem('evanieglow-cart-guest');
  return savedCart ? JSON.parse(savedCart) : [];
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    // For this simplified example, we'll just load from localStorage
    // A full implementation would merge localStorage cart with a DB-backed cart for logged-in users
    setLoading(true);
    setItems(getInitialCart());
    setLoading(false);
  }, []);

  useEffect(() => {
    // Save to localStorage whenever cart changes, regardless of auth state
    // This simplifies guest/user cart handling for now
    localStorage.setItem('evanieglow-cart-guest', JSON.stringify(items));
  }, [items]);
  
  const addItem = useCallback((product: Product, quantity: number) => {
    setItems(prevItems => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prevItems => prevItems.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems(prevItems => {
      if (quantity <= 0) {
        return prevItems.filter((item) => item.product.id !== productId);
      }
      return prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

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