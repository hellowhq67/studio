'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { 
    getAuth, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    updateProfile, 
    GoogleAuthProvider,
    signInWithPopup,
    type User as FirebaseUser 
} from 'firebase/auth';
import { app } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import type { Role } from '@/lib/types';
import { getUserRole, createUserInDb } from '@/actions/user-actions';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export interface AppUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: Role;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  logout: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRoleAndSetUser = useCallback(async (firebaseUser: FirebaseUser) => {
      const role = await getUserRole(firebaseUser.uid);
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        role: role,
      });
  }, []);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        await fetchUserRoleAndSetUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserRoleAndSetUser]);
  
  const signup = useCallback(async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        await createUserInDb({
            firebaseUid: userCredential.user.uid,
            email: userCredential.user.email,
            name: displayName,
        });
        await fetchUserRoleAndSetUser(userCredential.user);
    }
    return userCredential;
  }, [fetchUserRoleAndSetUser]);

  const login = useCallback(async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    if (userCredential.user) {
        // This function also handles creating the user in the DB if they don't exist
        await createUserInDb({
            firebaseUid: userCredential.user.uid,
            email: userCredential.user.email,
            name: userCredential.user.displayName,
        });
       await fetchUserRoleAndSetUser(userCredential.user);
    }
    return userCredential;
  }, [fetchUserRoleAndSetUser]);


  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const value = useMemo(() => ({
    user,
    loading,
    signup,
    login,
    signInWithGoogle,
    logout,
  }), [user, loading, signup, login, signInWithGoogle, logout]);
  
  if (loading) {
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
