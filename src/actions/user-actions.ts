'use server';

import type { Role } from '@/lib/types';

// Mock user roles. In a real app, you'd fetch this from your database.
const mockUserRoles: { [firebaseUid: string]: Role } = {
    // Add mock users here if needed, e.g.
    // 'admin-uid': 'ADMIN'
};

export async function getUserRole(firebaseUid: string): Promise<Role> {
    // For demonstration, we'll make a specific user an admin.
    // In a real app, you would look this up in your database.
    if (firebaseUid === 'S5fchz9p6pTKVmB9l3v4a2aX8yI2') { // A mock admin UID
        return 'ADMIN';
    }
    return mockUserRoles[firebaseUid] || 'CUSTOMER';
}

export async function createUserInDb(data: { firebaseUid: string; email: string; name: string; }) {
    // This is a mock function. In a real app, this would create a user in the database.
    console.log('Mock: Creating user in DB', data);
    mockUserRoles[data.firebaseUid] = 'CUSTOMER';
    return Promise.resolve();
}
