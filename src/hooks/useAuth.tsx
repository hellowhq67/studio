'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { createAuthClient, type AuthClient } from 'better-auth/react';
import { Loader2 } from 'lucide-react';
import type { Role } from '@/lib/types';
import { getUserRole, createUserInDb } from '@/actions/user-actions';


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
  logout: () => Promise<any>;
  client: AuthClient;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authClient = createAuthClient();

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  const { useSession } = authClient;
  const session = useSession();

  useEffect(() => {
    const checkSession = async () => {
      if (session.status === 'authenticated') {
        const betterAuthUser = session.data.user;
        const role = await getUserRole(betterAuthUser.id);
        setUser({
          uid: betterAuthUser.id,
          email: betterAuthUser.email,
          displayName: betterAuthUser.name,
          photoURL: betterAuthUser.image,
          role: role,
        });
      } else {
        setUser(null);
      }
       setLoading(false);
    };

    if (session.status !== 'loading') {
       checkSession();
    }
  }, [session.status, session.data]);
  
  const signup = useCallback(async (email: string, password: string, displayName: string) => {
    const result = await authClient.signUp("email", { email, password, name: displayName });
    if (result.success) {
      await createUserInDb({
        firebaseUid: result.data.user.id,
        email,
        name: displayName
      })
    }
    return result;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    return authClient.signIn("email", { email, password });
  }, []);

  const logout = useCallback(async () => {
    await authClient.signOut();
  }, []);

  const value = useMemo(() => ({
    user,
    loading: session.status === 'loading' || loading,
    signup,
    login,
    logout,
    client: authClient
  }), [user, session.status, loading, signup, login, logout]);
  
  if (value.loading) {
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
