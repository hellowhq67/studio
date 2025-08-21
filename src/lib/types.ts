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
  specialPrice?: number | null;
  couponCode?: string | null;
  deliveryCharge?: number | null;
  quantity?: number | null;
  deliveryTime: string;
  brand: string;
  createdAt: Date;
  updatedAt: Date;
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
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'Processing' | 'Paid' | 'Failed' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  transactionId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: Role;
}

export type OrderItemInput = {
    productId: string;
    quantity: number;
    price: number;
}
