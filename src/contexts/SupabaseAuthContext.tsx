import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // adjust path if needed
import { User } from '@supabase/supabase-js';
import {
  signInAdmin,
  signOutAdmin,
  resetPassword,
  updatePassword,
  AdminUser,
} from '../lib/supabaseAuth';

interface SupabaseAuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  resetUserPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateUserPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  isAdmin: () => boolean;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export const useSupabaseAuth = () => {
  const context = useContext(SupabaseAuthContext);
  if (!context) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};

// ✅ helper function: map Supabase User → AdminUser
function mapToAdminUser(user: User): AdminUser {
  return {
    id: user.id,
    email: user.email ?? '',
    role: 'admin', // you can also fetch this from your `admin_users` table if needed
    created_at: (user as any).created_at ?? '', // fallback to empty string if not present
  };
}

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ✅ Check existing session
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error.message);
      }
      if (data.session?.user) {
        setUser(mapToAdminUser(data.session.user));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    };

    getSession();

    // ✅ Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(mapToAdminUser(session.user));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await signInAdmin(email, password);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const result = await signOutAdmin();
      if (result.success) {
        setUser(null);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const resetUserPassword = async (email: string) => {
    return await resetPassword(email);
  };

  const updateUserPassword = async (newPassword: string) => {
    return await updatePassword(newPassword);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <SupabaseAuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
        resetUserPassword,
        updateUserPassword,
        isAdmin,
      }}
    >
      {children}
    </SupabaseAuthContext.Provider>
  );
};
