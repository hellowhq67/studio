
'use server';

import type { Role } from '@/lib/types';

const mockUsers: { [key: string]: { role: Role, name: string | null, email: string } } = {
  'admin@example.com': { role: 'ADMIN', name: 'Admin User', email: 'admin@example.com' },
};

export async function getUserRole(firebaseUid: string): Promise<Role> {
    // In a mock setup, we can't reliably get the user by UID without a DB.
    // We can use a simple rule for the mock admin.
    // A real implementation would query the database.
    return mockUsers['admin@example.com'] ? 'ADMIN' : 'CUSTOMER';
}

export async function createUserInDb(data: { firebaseUid: string; email: string | null; name: string | null; }) {
   if (!data.email) {
     console.warn("Attempted to create user without an email.");
     return;
   }
   
   // In a mock setup, we don't persist users. This function can be a no-op.
   console.log("Mock: Creating user in DB", data);
   if (data.email === 'admin@example.com') {
     mockUsers[data.firebaseUid] = { role: 'ADMIN', name: data.name, email: data.email };
   }
}
