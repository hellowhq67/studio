
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Product } from '@/lib/types';
import { db } from '@/lib/db';
import { products } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

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
    
    const newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating' | 'reviewCount'> & { images: string[], tags: string[]} = {
        ...productData,
        images: images.split(',').map(i => i.trim()),
        tags: tags.split(',').map(t => t.trim()),
    }

    await db.insert(products).values(newProduct);

  } catch (error) {
    console.error('Error adding product:', error);
    return { message: 'Database Error: Failed to Create Product.' };
  }
  
  revalidatePath('/admin/products');
  revalidatePath('/products');
  redirect('/admin/products');
}

export async function getProducts(): Promise<Product[]> {
  try {
    const allProducts = await db.select().from(products);
    // The schema defines non-nullable fields, so we can cast directly
    // if we trust the database integrity. A safer approach might involve validation.
    return allProducts as Product[];
  } catch (error) {
      console.error("Failed to fetch products:", error);
      return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
    try {
        const productResult = await db.select().from(products).where(eq(products.id, id)).limit(1);
        if (productResult.length === 0) return null;
        return productResult[0] as Product;
    } catch(error) {
        console.error(`Failed to fetch product ${id}:`, error);
        return null;
    }
}
