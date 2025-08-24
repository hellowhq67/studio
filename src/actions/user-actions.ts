'use server';

import type { Role } from '@/lib/types';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { eq } from 'drizzle-orm';


export async function getUserRole(firebaseUid: string): Promise<Role> {
    const user = await db.query.users.findFirst({
        where: eq(schema.users.id, firebaseUid)
    });
    return (user?.role as Role) || 'CUSTOMER';
}

export async function createUserInDb(data: { firebaseUid: string; email: string | null; name: string | null; }) {
    try {
        await db.update(schema.users)
          .set({ 
            email: data.email,
            name: data.name,
            role: 'CUSTOMER' // Default role
          })
          .where(eq(schema.users.id, data.firebaseUid));
    } catch (error) {
        // If user doesn't exist, this will fail. We can ignore this for now as better-auth creates user.
        // A more robust implementation might use upsert.
        console.log("Could not update user, probably because they were just created by better-auth.", error);
    }
}
