'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Category, Product } from '@prisma/client';

const ProductSchema = z.object({
  name: z.string().min(3, 'Product name is too short'),
  description: z.string().min(10, 'Description is too short'),
  longDescription: z.string().min(20, "Long description is too short"),
  tags: z.string().min(1, 'Please add at least one tag'),
  price: z.coerce.number().positive('Price must be positive'),
  salePrice: z.coerce.number().optional(),
  specialPrice: z.coerce.number().optional(),
  couponCode: z.string().optional(),
  deliveryCharge: z.coerce.number().min(0, 'Delivery charge cannot be negative').optional(),
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
    specialPrice: formData.get('specialPrice'),
    couponCode: formData.get('couponCode'),
    deliveryCharge: formData.get('deliveryCharge'),
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
    
    await prisma.product.create({
      data: {
        ...productData,
        tags: tags.split(',').map(tag => tag.trim()),
        images: images.split(',').map(img => img.trim()),
        category: validatedFields.data.category as Category,
        rating: Math.floor(Math.random() * (5 - 3 + 1)) + 3, // mock rating
        reviewCount: Math.floor(Math.random() * 200), // mock review count
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

export async function getProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return products;
}

export async function getProductById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
        where: { id }
    });
    return product;
}
