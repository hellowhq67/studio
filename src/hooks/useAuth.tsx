'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import prisma from '@/lib/prisma';
import { Loader2 } from 'lucide-react';

// This is a server action to get user role from your new DB
async function getUserRole(firebaseUid: string): Promise<'ADMIN' | 'CUSTOMER'> {
    'use server';
    try {
        const user = await prisma.user.findUnique({
            where: { firebaseUid },
            select: { role: true }
        });
        return user?.role || 'CUSTOMER';
    } catch (error) {
        console.error("Failed to fetch user role:", error);
        return 'CUSTOMER';
    }
}

// This is a server action to create a user in your new DB
async function createUserInDb(data: { firebaseUid: string; email: string; name: string; }) {
    'use server';
    await prisma.user.create({
        data: {
            firebaseUid: data.firebaseUid,
            email: data.email,
            name: data.name,
            role: 'CUSTOMER'
        }
    });
}

export interface AppUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: 'ADMIN' | 'CUSTOMER';
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserWithRole = useCallback(async (firebaseUser: FirebaseUser): Promise<AppUser> => {
    const role = await getUserRole(firebaseUser.uid);
    return { 
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: role
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const appUser = await fetchUserWithRole(firebaseUser);
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [fetchUserWithRole]);

  const signup = useCallback(async (email: string, password: string, displayName: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      
      // Create user in your Postgres DB via Prisma
      if (userCredential.user.email) {
        await createUserInDb({
            firebaseUid: userCredential.user.uid,
            email: userCredential.user.email,
            name: displayName
        });
      }
      
      const appUser = await fetchUserWithRole(userCredential.user);
      setUser(appUser);
    } finally {
      setLoading(false);
    }
  }, [fetchUserWithRole]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle fetching the user role
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    signup,
    login,
    logout,
  }), [user, loading, signup, login, logout]);

  if (loading && user === undefined) {
    return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
