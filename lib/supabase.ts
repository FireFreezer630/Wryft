import { createClient } from '@supabase/supabase-js';

// NOTE: In a real environment, these would be in a .env file.
// Since this is a scaffold/demo, we provide placeholders or check for env vars.
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to check if supabase is actually configured
export const isSupabaseConfigured = () => {
    return supabaseUrl !== 'https://placeholder-url.supabase.co';
};