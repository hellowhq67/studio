
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Product } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, getDoc, serverTimestamp, updateDoc, query, where, writeBatch } from 'firebase/firestore';

const ProductSchema = z.object({
  name: z.string().min(3, 'Product name is too short'),
  description: z.string().min(10, 'Description is too short'),
  longDescription: z.string().min(20, "Long description is too short"),
  tags: z.string().min(1, 'Please add at least one tag'),
  price: z.coerce.number().positive('Price must be positive'),
  salePrice: z.coerce.number().optional().nullable(),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative').optional(),
  deliveryTime: z.string().min(1, 'Please provide a delivery estimate'),
  category: z.enum(['Skincare', 'Makeup', 'Haircare', 'Fragrance']),
  brand: z.string().min(1, 'Brand is required'),
  images: z.string().min(1, 'At least one image URL is required'), 
  specialPrice: z.coerce.number().optional(),
  couponCode: z.string().optional(),
  deliveryCharge: z.coerce.number().min(0, 'Delivery charge cannot be negative'),
});

export async function addProduct(prevState: any, formData: FormData) {
  const validatedFields = ProductSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    longDescription: formData.get('longDescription'),
    tags: formData.get('tags'),
    price: formData.get('price'),
    salePrice: formData.get('salePrice') || null,
    quantity: formData.get('quantity'),
    deliveryTime: formData.get('deliveryTime'),
    category: formData.get('category'),
    brand: formData.get('brand'),
    images: formData.get('images'),
    specialPrice: formData.get('specialPrice') || null,
    couponCode: formData.get('couponCode') || '',
    deliveryCharge: formData.get('deliveryCharge') || 0,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error: Please check the form fields.',
    };
  }

  try {
    const { images, tags, ...productData } = validatedFields.data;
    
    const newProductData = {
        ...productData,
        images: images.split(',').map(i => i.trim()),
        tags: tags.split(',').map(t => t.trim()),
        rating: 0,
        reviewCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    };
    
    const productsCollection = collection(db, 'products');
    await addDoc(productsCollection, newProductData);

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
    const productsCollection = collection(db, 'products');
    const productSnapshot = await getDocs(productsCollection);
    const productsList = productSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
        } as Product;
    });
    return productsList;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
    try {
        const productRef = doc(db, 'products', id);
        const productSnap = await getDoc(productRef);

        if (productSnap.exists()) {
            const data = productSnap.data();
            return {
                id: productSnap.id,
                ...data,
                createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
                updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
            } as Product;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch(error) {
        console.error("Error fetching product by ID:", error);
        return null;
    }
}

export async function seedSampleProduct() {
  try {
    const productsCollection = collection(db, 'products');
    const productSnapshot = await getDocs(productsCollection);

    if (productSnapshot.empty) {
      console.log('Seeding 20 sample products...');
      const batch = writeBatch(db);
      
      const sampleProducts = generateSampleProducts();

      sampleProducts.forEach(product => {
        const docRef = doc(productsCollection);
        const { id, ...productData } = product; // exclude id from data
        batch.set(docRef, { 
          ...productData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      });

      await batch.commit();

      console.log('20 sample products seeded successfully.');
      revalidatePath('/products');
      revalidatePath('/');
    } else {
      console.log('Products collection is not empty, skipping seed.');
    }
  } catch (error) {
    console.error("Error seeding sample products:", error);
  }
}


function generateSampleProducts(): Omit<Product, 'createdAt' | 'updatedAt'>[] {
  const categories: ('Skincare' | 'Makeup' | 'Haircare' | 'Fragrance')[] = ['Skincare', 'Makeup', 'Haircare', 'Fragrance'];
  const brands = {
    Skincare: ['GlowUp', 'PureDerm'],
    Makeup: ['GlowUp', 'ColorPop'],
    Haircare: ['LuxeLocks', 'SilkyStrands'],
    Fragrance: ['AuraScents', 'EssenceCo']
  };
  const productNames = {
    Skincare: ['Revitalizing Serum', 'Hydra-Boost Moisturizer', 'Clarifying Toner', 'Brightening Eye Cream', 'Gentle Foaming Cleanser'],
    Makeup: ['Matte Velvet Foundation', 'Luminous Glow Highlighter', 'Perfect Wing Eyeliner', 'Volumizing Mascara', 'Satin Finish Lipstick'],
    Haircare: ['Repairing Shampoo', 'Nourishing Conditioner', 'Leave-in Silk Spray', 'Anti-Frizz Hair Serum', 'Deep Hydration Mask'],
    Fragrance: ['Ocean Breeze EDT', 'Velvet Rose EDP', 'Spiced Amber Cologne', 'Fresh Linen Body Mist', 'Exotic Oud Parfum']
  };
  const tags = ['vegan', 'hydrating', 'brightening', 'long-lasting', 'matte', 'cruelty-free', 'repairing', 'sulfate-free', 'luxury', 'citrus'];

  const products = [];

  for (let i = 0; i < 20; i++) {
    const category = categories[i % categories.length];
    const brand = brands[category][i % brands[category].length];
    const name = productNames[category][i % productNames[category].length] + ` #${i+1}`;
    
    products.push({
      id: `sample_${i + 1}`,
      name: name,
      description: `A high-quality ${name.toLowerCase()} from ${brand}.`,
      longDescription: `Experience the best of ${category} with ${name}. This product from ${brand} is formulated with the finest ingredients to deliver exceptional results. It's perfect for your daily routine.`,
      price: parseFloat((Math.random() * (100 - 10) + 10).toFixed(2)),
      salePrice: Math.random() > 0.7 ? parseFloat((Math.random() * (80 - 10) + 10).toFixed(2)) : null,
      rating: parseFloat((Math.random() * (5 - 3.5) + 3.5).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 300) + 20,
      category: category,
      images: [
        `https://picsum.photos/600/600?random=${i*4+1}`,
        `https://picsum.photos/600/600?random=${i*4+2}`,
        `https://picsum.photos/600/600?random=${i*4+3}`,
        `https://picsum.photos/600/600?random=${i*4+4}`,
      ],
      tags: [tags[i % tags.length], tags[(i+1) % tags.length], tags[(i+2) % tags.length]],
      quantity: Math.floor(Math.random() * 100) + 10,
      deliveryTime: '2-4 business days',
      brand: brand,
    });
  }

  return products;
}

