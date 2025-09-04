
'use server';

import type { Role, User, ShippingAddress } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"; 
import { revalidatePath } from 'next/cache';

export async function getUser(firebaseUid: string): Promise<User | null> {
    try {
        const userRef = doc(db, "users", firebaseUid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();
            return {
                id: userSnap.id,
                email: data.email,
                name: data.name,
                role: data.role || 'CUSTOMER',
                shippingAddress: data.shippingAddress || null,
            } as User;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}


export async function getUserRole(firebaseUid: string): Promise<Role> {
    try {
        const userRef = doc(db, "users", firebaseUid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data().role || 'CUSTOMER';
        } else {
            // Default to CUSTOMER if no user document exists
            return 'CUSTOMER';
        }
    } catch (error) {
        console.error("Error fetching user role:", error);
        return 'CUSTOMER'; // Default role on error
    }
}

export async function createUserInDb(data: { firebaseUid: string; email: string | null; name: string | null; }) {
   if (!data.email || !data.firebaseUid) {
     console.warn("Attempted to create user with missing email or UID.");
     return;
   }
   
   try {
        const userRef = doc(db, "users", data.firebaseUid);
        const userSnap = await getDoc(userRef);

        // Only create document if it doesn't already exist
        if (!userSnap.exists()) {
            await setDoc(userRef, {
                email: data.email,
                name: data.name,
                role: 'CUSTOMER', // Default role for new users
                createdAt: serverTimestamp(),
            });
            console.log("User created in Firestore:", data.firebaseUid);
        } else {
            console.log("User already exists in Firestore:", data.firebaseUid);
        }

   } catch(error) {
     console.error("Error creating user in Firestore:", error);
   }
}

export async function updateUserProfile(firebaseUid: string, data: { name: string; shippingAddress: ShippingAddress }) {
    try {
        const userRef = doc(db, 'users', firebaseUid);
        
        await updateDoc(userRef, {
            name: data.name,
            shippingAddress: data.shippingAddress
        });

        revalidatePath('/account');

        return { success: true, message: 'Profile updated successfully!' };
    } catch (error) {
        console.error('Error updating user profile:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return { success: false, message: `Database Error: ${errorMessage}` };
    }
}
