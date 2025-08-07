// @/actions/user-actions.ts
'use server';

import prisma from '@/lib/prisma';
import type { Role } from '@prisma/client';

export async function getUserRole(firebaseUid: string): Promise<Role> {
    try {
        const user = await prisma.user.findUnique({
            where: { firebaseUid },
            select: { role: true }
        });
        // The role is guaranteed to be there if the user exists, default to CUSTOMER if not found.
        return user?.role || 'CUSTOMER';
    } catch (error) {
        console.error("Failed to fetch user role:", error);
        // Default to the least privileged role in case of an error.
        return 'CUSTOMER';
    }
}

export async function createUserInDb(data: { firebaseUid: string; email: string; name: string; }) {
     await prisma.user.create({
        data: {
            firebaseUid: data.firebaseUid,
            email: data.email,
            name: data.name,
            role: 'CUSTOMER' // Default role for new users
        }
    });
}
