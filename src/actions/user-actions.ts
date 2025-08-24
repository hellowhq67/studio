'use server';

import type { Role } from '@/lib/types';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function getUserRole(firebaseUid: string): Promise<Role> {
    try {
        const user = await db.query.user.findFirst({
            where: eq(schema.user.id, firebaseUid),
            columns: { role: true }
        });
        return user?.role || 'CUSTOMER';
    } catch {
        return 'CUSTOMER';
    }
}

export async function createUserInDb(data: { firebaseUid: string; email: string | null; name: string | null; }) {
   if (!data.email) {
     throw new Error("Email is required to create a user.");
   }
   try {
     await db.insert(schema.user).values({
        id: data.firebaseUid,
        email: data.email,
        name: data.name,
        role: 'CUSTOMER'
     }).onConflictDoNothing();
   } catch (error) {
    console.error("Failed to create user in DB:", error);
    // Decide if you want to throw the error or handle it gracefully
   }
}
