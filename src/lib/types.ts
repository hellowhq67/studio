export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  longDescription: string;
  price: number;
  rating: number;
  reviewCount: number;
  category: 'Skincare' | 'Makeup' | 'Haircare' | 'Fragrance';
  images: string[];
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
