'use server';

import type { Role, User } from '@/lib/types';

// Mock user data store
const mockUsers: { [key: string]: User } = {};

export async function getUserRole(firebaseUid: string): Promise<Role> {
    // In a mock environment, we can assign roles based on some logic,
    // or just default to CUSTOMER. For simplicity, we'll check a mock admin UID.
    if (firebaseUid === 'admin_user_uid_placeholder') {
        return 'ADMIN';
    }
    // You could also check an email address for a mock admin
    const user = mockUsers[firebaseUid];
    if (user && user.email === 'admin@example.com') {
      return 'ADMIN';
    }
    return user?.role || 'CUSTOMER';
}

export async function createUserInDb(data: { firebaseUid: string; email: string | null; name: string | null; }) {
   if (!data.email) {
     throw new Error("Email is required to create a user.");
   }
   if (mockUsers[data.firebaseUid]) {
       // User already exists, do nothing
       return;
   }
   
   // In a real app, you might have specific logic to determine the role.
   // For now, we'll make a specific email an admin for testing purposes.
   const role = data.email === 'admin@example.com' ? 'ADMIN' : 'CUSTOMER';
   
   mockUsers[data.firebaseUid] = {
       id: data.firebaseUid,
       email: data.email,
       name: data.name,
       role: role,
   };
   console.log('Mock user created:', mockUsers[data.firebaseUid]);
}
