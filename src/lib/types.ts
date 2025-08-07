export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  salePrice?: number;
  rating: number;
  reviewCount: number;
  category: 'Skincare' | 'Makeup' | 'Haircare' | 'Fragrance';
  images: string[]; // URLs
  tags: string[];
  // New fields from user request
  specialPrice?: number;
  couponCode?: string;
  deliveryCharge: number;
  quantity: number;
  deliveryTime: string;
  brand: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}


export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  date: string; // Or Date
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface AppUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: 'ADMIN' | 'CUSTOMER';
}
