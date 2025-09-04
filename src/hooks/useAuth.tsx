
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
import type { Role, ShippingAddress } from '@/lib/types';
import { getUser, createUserInDb } from '@/actions/user-actions';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export interface AppUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    role: Role;
    shippingAddress: ShippingAddress | null;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserDisplayName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const setAuthCookies = (user: FirebaseUser, role: Role) => {
    Cookies.set('user_role', role, { expires: 7, path: '/' });
    user.getIdToken().then(token => {
        Cookies.set('auth_token', token, { expires: 7, path: '/' });
    })
};

const clearAuthCookies = () => {
    Cookies.remove('user_role', { path: '/' });
    Cookies.remove('auth_token', { path: '/' });
};


const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserAndSet = useCallback(async (firebaseUser: FirebaseUser): Promise<AppUser | null> => {
      const appUser = await getUser(firebaseUser.uid);
      if (appUser) {
        const fullUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: appUser.role,
          shippingAddress: appUser.shippingAddress || null
        };
        setUser(fullUser);
        setAuthCookies(firebaseUser, fullUser.role);
        return fullUser;
      }
      return null;
  }, []);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        await fetchUserAndSet(firebaseUser);
      } else {
        setUser(null);
        clearAuthCookies();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserAndSet]);
  
  const handleAuthSuccess = async (firebaseUser: FirebaseUser) => {
    const appUser = await fetchUserAndSet(firebaseUser);
    if (appUser?.role === 'ADMIN') {
        router.push('/admin');
    } else {
        router.push('/account');
    }
  };

  const signup = useCallback(async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        await createUserInDb({
            firebaseUid: userCredential.user.uid,
            email: userCredential.user.email,
            name: displayName,
        });
        await handleAuthSuccess(userCredential.user);
    }
  }, [fetchUserAndSet, router]);

  const login = useCallback(async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if(userCredential.user) {
        await handleAuthSuccess(userCredential.user);
    }
  }, [fetchUserAndSet, router]);

  const signInWithGoogle = useCallback(async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    if (userCredential.user) {
        await createUserInDb({
            firebaseUid: userCredential.user.uid,
            email: userCredential.user.email,
            name: userCredential.user.displayName,
        });
       await handleAuthSuccess(userCredential.user);
    }
  }, [fetchUserAndSet, router]);

  const updateUserDisplayName = useCallback(async (name: string) => {
    if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
        await fetchUserAndSet(auth.currentUser);
    }
  }, [fetchUserAndSet]);


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
    updateUserDisplayName
  }), [user, loading, signup, login, signInWithGoogle, logout, updateUserDisplayName]);
  
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
