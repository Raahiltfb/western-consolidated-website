import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing from environment variables.');
}

export const supabase = createClient(
  supabaseUrl || 'https://lbgcdzazmlumbhcrlupg.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiZ2NkemF6bWx1bWJoY3JsdXBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3NzM4NTUsImV4cCI6MjEwMzM0OTg1NX0.vC7V4Af-VoPLrVSqCHAz2PbgKYBV5BTloBVuLczaPZU'
);
