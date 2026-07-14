import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance = null;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Check your .env file. Using mock client fallback.');
    
    // Create a mock/stub client to prevent startup crashes
    const chainable = {};
    const chainableMethods = [
        'select', 'insert', 'update', 'delete', 'eq', 'neq', 'gt', 'lt', 'gte', 'lte',
        'like', 'ilike', 'is', 'in', 'contains', 'containedBy', 'rangeGt', 'rangeGte',
        'rangeLt', 'rangeLte', 'rangeAdjacent', 'overlaps', 'textSearch', 'match',
        'not', 'or', 'filter', 'order', 'limit', 'range', 'single', 'maybeSingle',
        'csv'
    ];
    chainableMethods.forEach(method => {
        chainable[method] = () => chainable;
    });
    chainable.then = (onFulfilled) => {
        return Promise.resolve({ data: [], error: null }).then(onFulfilled);
    };

    supabaseInstance = {
        auth: {
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            signUp: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
            signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
            signOut: () => Promise.resolve({ error: null }),
            getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        },
        from: () => chainable,
    };
} else {
    try {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (err) {
        console.error('Failed to initialize Supabase client:', err);
    }
}

export const supabase = supabaseInstance;
