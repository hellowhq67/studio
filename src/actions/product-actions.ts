// @/actions/product-actions.ts
'use server';

import { z } from 'zod';
import { db, storage } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const ProductSchema = z.object({
  name: z.string().min(3, 'Product name is too short'),
  description: z.string().min(10, 'Description is too short'),
  longDescription: z.string().min(20, "Long description is too short"),
  tags: z.string().min(1, 'Please add at least one tag'),
  price: z.coerce.number().positive('Price must be positive'),
  salePrice: z.coerce.number().optional(),
  specialPrice: z.coerce.number().optional(),
  couponCode: z.string().optional(),
  deliveryCharge: z.coerce.number().min(0, 'Delivery charge cannot be negative'),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative'),
  deliveryTime: z.string().min(1, 'Please provide a delivery estimate'),
  category: z.enum(['Skincare', 'Makeup', 'Haircare', 'Fragrance']),
  brand: z.string().min(1, 'Brand is required'),
  images: z.any()
    .refine((files) => files?.length >= 1, 'At least one image is required.')
    .refine((files) => Array.from(files).every((file: any) => file.size <= MAX_FILE_SIZE), `Max file size is 5MB.`)
    .refine(
      (files) => Array.from(files).every((file: any) => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ),
});

async function uploadImages(images: File[]): Promise<string[]> {
  const uploadTasks = Array.from(images).map(async (file) => {
    const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  });
  return Promise.all(uploadTasks);
}

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
    images: formData.getAll('images'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error: Please check the form fields.',
    };
  }

  try {
    const imageUrls = await uploadImages(validatedFields.data.images as unknown as File[]);
    
    const productData = {
      ...validatedFields.data,
      tags: validatedFields.data.tags.split(',').map(tag => tag.trim()),
      images: imageUrls,
      rating: 0, // Default rating
      reviewCount: 0 // Default review count
    };

    await addDoc(collection(db, 'products'), productData);

  } catch (error) {
    console.error('Error adding product:', error);
    return { message: 'Database Error: Failed to Create Product.' };
  }
  
  revalidatePath('/admin/products');
  redirect('/admin/products');
}
