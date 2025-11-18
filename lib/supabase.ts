
import { createClient } from '@supabase/supabase-js';

// Ideally, these should be in a .env file (e.g. .env.local)
// REACT_APP_SUPABASE_URL=https://icqvzhtluyuruzwvuzjl.supabase.co
// REACT_APP_SUPABASE_ANON_KEY=eyJhbGci...

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://icqvzhtluyuruzwvuzjl.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljcXZ6aHRsdXl1cnV6d3Z1empsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0ODUwNDgsImV4cCI6MjA3OTA2MTA0OH0.DVJyWQFBTJXB9l9FuIIiQCGQvV3_VzvScbjt6tBAE9Q';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to check if supabase is actually configured
export const isSupabaseConfigured = () => {
    return supabaseUrl && supabaseAnonKey;
};
