
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Product } from '@/lib/types';
import prisma from '@/lib/prisma';

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
    const { ...productData } = validatedFields.data;
    
    await prisma.product.create({
      data: {
        ...productData,
        rating: Math.floor(Math.random() * (5 - 3 + 1)) + 3,
        reviewCount: Math.floor(Math.random() * 200),
      }
    });

  } catch (error) {
    console.error('Error adding product:', error);
    return { message: 'Database Error: Failed to Create Product.' };
  }
  
  revalidatePath('/admin/products');
  revalidatePath('/products');
  redirect('/admin/products');
}

function mapDbProductToAppProduct(dbProduct: any): Product {
    return {
        ...dbProduct,
        tags: typeof dbProduct.tags === 'string' ? dbProduct.tags.split(',').map((t: string) => t.trim()) : [],
        images: typeof dbProduct.images === 'string' ? dbProduct.images.split(',').map((i: string) => i.trim()) : [],
    }
}


export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return JSON.parse(JSON.stringify(products.map(mapDbProductToAppProduct)));
}

export async function getProductById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
        where: { id }
    });
    if (!product) return null;
    return JSON.parse(JSON.stringify(mapDbProductToAppProduct(product)));
}
