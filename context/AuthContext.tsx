
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signIn: (email: string, username?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: null }),
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and subscribe to changes
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, username?: string) => {
    try {
        // Determine the redirect URL
        let redirectUrl = window.location.origin + '/dashboard/overview';
        
        // If hosted on Netlify, explicitly set the domain to ensure magic links work
        if (window.location.hostname.includes('netlify.app')) {
            redirectUrl = `https://${window.location.hostname}/dashboard/overview`;
        }

        const options: any = {
            emailRedirectTo: redirectUrl,
        };

        if (username) {
            options.data = { username };
        }

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options
        });
        
        return { error };
    } catch (error) {
        return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
