'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Product } from '@/lib/types';
import { products as mockProducts } from '@/lib/mock-data';

const ProductSchema = z.object({
  name: z.string().min(3, 'Product name is too short'),
  description: z.string().min(10, 'Description is too short'),
  longDescription: z.string().min(20, "Long description is too short"),
  tags: z.string().min(1, 'Please add at least one tag'),
  price: z.coerce.number().positive('Price must be positive'),
  salePrice: z.coerce.number().optional(),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative').optional(),
  deliveryTime: z.string().min(1, 'Please provide a delivery estimate'),
  category: z.enum(['Skincare', 'Makeup', 'Haircare', 'Fragrance']),
  brand: z.string().min(1, 'Brand is required'),
  images: z.string().min(1, 'At least one image URL is required'), 
});

export async function addProduct(prevState: any, formData: FormData) {
  const validatedFields = ProductSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    longDescription: formData.get('longDescription'),
    tags: formData.get('tags'),
    price: formData.get('price'),
    salePrice: formData.get('salePrice'),
    quantity: formData.get('quantity'),
    deliveryTime: formData.get('deliveryTime'),
    category: formData.get('category'),
    brand: formData.get('brand'),
    images: formData.get('images'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error: Please check the form fields.',
    };
  }

  try {
    const { images, tags, ...productData } = validatedFields.data;
    
    const newProduct: Product = {
        id: `prod_${Date.now()}`,
        ...productData,
        images: images.split(',').map(i => i.trim()),
        tags: tags.split(',').map(t => t.trim()),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        rating: Math.floor(Math.random() * (5 - 3 + 1)) + 3,
        reviewCount: Math.floor(Math.random() * 200),
    }
    
    mockProducts.unshift(newProduct);

  } catch (error) {
    console.error('Error adding product:', error);
    return { message: 'Database Error: Failed to Create Product.' };
  }
  
  revalidatePath('/admin/products');
  revalidatePath('/products');
  redirect('/admin/products');
}

export async function getProducts(): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return JSON.parse(JSON.stringify(mockProducts));
}

export async function getProductById(id: string): Promise<Product | null> {
    // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const product = mockProducts.find(p => p.id === id);
  if (!product) return null;
  return JSON.parse(JSON.stringify(product));
}
