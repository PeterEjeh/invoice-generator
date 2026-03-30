import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fftmybrzzcanewjkxorg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZmdG15YnJ6emNhbmV3amt4b3JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ4NzkxNjIsImV4cCI6MjA5MDQ1NTE2Mn0.xjN_Fx3KzSYUyNfa0otUJ_gsKuk6OzvgjNuCpojDgOc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
