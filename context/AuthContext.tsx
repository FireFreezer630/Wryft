import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Demo mode: simulate a logged in user after a short delay if requested, 
      // or just start as null. For this demo, we'll start null.
      setLoading(false);
      return;
    }

    // Check active sessions and subscribe to changes
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string) => {
    if (!isSupabaseConfigured()) {
        // Mock login for demo
        setUser({ id: 'demo-user', email, user_metadata: { username: 'house' } });
        return;
    }
    // In a real app, handle OTP or password login here
    await supabase.auth.signInWithOtp({ email });
  };

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
        setUser(null);
        return;
    }
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);