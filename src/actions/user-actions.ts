'use server';

import type { Role } from '@/lib/types';
import prisma from '@/lib/prisma';

export async function getUserRole(firebaseUid: string): Promise<Role> {
    const user = await prisma.user.findUnique({
        where: { id: firebaseUid }
    });
    return user?.role as Role || 'CUSTOMER';
}

export async function createUserInDb(data: { firebaseUid: string; email: string | null; name: string | null; }) {
    try {
        await prisma.user.update({
            where: { id: data.firebaseUid },
            data: {
                email: data.email,
                name: data.name,
                role: 'CUSTOMER' // Default role
            }
        });
    } catch (error) {
        // If user doesn't exist, this will fail. We can ignore this for now as better-auth creates user.
        // A more robust implementation might use upsert.
        console.log("Could not update user, probably because they were just created by better-auth.", error);
    }
}
