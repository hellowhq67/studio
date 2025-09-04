
'use server';

import type { Role } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from "firebase/firestore"; 

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
                role: 'ADMIN', // Temporarily assign ADMIN to all new users
            });
            console.log("User created in Firestore:", data.firebaseUid);
        } else {
            console.log("User already exists in Firestore:", data.firebaseUid);
        }

   } catch(error) {
     console.error("Error creating user in Firestore:", error);
   }
}
