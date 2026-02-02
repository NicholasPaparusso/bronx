import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key Check:", supabaseAnonKey ? "Loaded (" + supabaseAnonKey.substring(0, 5) + "...)" : "MISSING");

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables! Check .env.local');
}

// Fallback to avoid crash on load if keys are missing (allows UI to render error)
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient(url, key);
