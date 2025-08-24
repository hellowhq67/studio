
'use server';

import type { Role } from '@/lib/types';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';


export async function getUserRole(firebaseUid: string): Promise<Role> {
    try {
      const userResult = await db.select({ role: users.role }).from(users).where(eq(users.id, firebaseUid)).limit(1);
      if (userResult.length === 0) {
        return 'CUSTOMER';
      }
      return userResult[0].role as Role;
    } catch (error) {
       console.error("Failed to get user role:", error);
       return 'CUSTOMER';
    }
}

export async function createUserInDb(data: { firebaseUid: string; email: string | null; name: string | null; }) {
   if (!data.email) {
     throw new Error("Email is required to create a user.");
   }
   
   try {
    const existingUser = await db.select().from(users).where(eq(users.id, data.firebaseUid)).limit(1);
    if (existingUser.length > 0) {
      return;
    }

    const role = data.email === 'admin@example.com' ? 'ADMIN' : 'CUSTOMER';

    await db.insert(users).values({
      id: data.firebaseUid,
      email: data.email,
      name: data.name,
      role: role,
    });
   } catch(error) {
      console.error("Failed to create user in DB:", error);
      // Decide if you want to throw the error or handle it gracefully
   }
}
