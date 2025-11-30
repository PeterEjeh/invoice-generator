import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fslkwrexltvuemxsanul.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzbGt3cmV4bHR2dWVteHNhbnVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0OTc5NTgsImV4cCI6MjA4MDA3Mzk1OH0.54X0ITB2Klt30FAl8piLSxJEb74-IlAeEhsIqb0th-w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
