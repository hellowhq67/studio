
import type { Timestamp } from "firebase/firestore";

export type Category = 'Skincare' | 'Makeup' | 'Haircare' | 'Fragrance';
export type Role = 'ADMIN' | 'CUSTOMER';


export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  salePrice?: number | null;
  rating: number;
  reviewCount: number;
  category: Category;
  images: string[];
  tags: string[];
  quantity?: number | null;
  deliveryTime: string;
  brand: string;
  createdAt: string | Timestamp; 
  updatedAt: string | Timestamp;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  shippingAddress: string;
  transactionId?: string | null;
  createdAt: string | Timestamp;
  updatedAt: string | Timestamp;
  user: User;
}

export interface ShippingAddress {
    address: string;
    city: string;
    state: string;
    zip: string;
}

export interface User {
    id: string;
    email: string | null;
    name: string | null;
    role: Role;
    shippingAddress: ShippingAddress | null;
}

export type OrderItemInput = {
    productId: string;
    quantity: number;
    price: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  image: string;
  content: string;
}
