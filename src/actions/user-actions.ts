'use server';

import type { Role } from '@/lib/types';

// Mock function to simulate fetching user role
export async function getUserRole(firebaseUid: string): Promise<Role> {
    // In a real app, you'd fetch this from your database.
    // For now, we can default to CUSTOMER or check a mock list.
    // Let's assume all users are CUSTOMERs for now.
    // A more advanced mock could check if the UID matches a mock admin UID.
    if (firebaseUid === 'mock-admin-uid') {
        return 'ADMIN';
    }
    return 'CUSTOMER';
}

// Mock function to simulate creating a user record
export async function createUserInDb(data: { firebaseUid: string; email: string | null; name: string | null; }) {
    // This is a mock function. In a real application, you would create a new
    // user record in your database here.
    console.log('Mock: Creating user in DB:', data);
    // No operation needed for mock data setup.
    return Promise.resolve();
}
