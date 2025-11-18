
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://icqvzhtluyuruzwvuzjl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljcXZ6aHRsdXl1cnV6d3Z1empsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0ODUwNDgsImV4cCI6MjA3OTA2MTA0OH0.DVJyWQFBTJXB9l9FuIIiQCGQvV3_VzvScbjt6tBAE9Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export const isSupabaseConfigured = () => {
    return supabaseUrl && supabaseAnonKey;
};
