import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured =
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('PLACEHOLDER') &&
  !supabaseAnonKey.includes('PLACEHOLDER');

let supabaseInstance: SupabaseClient;

if (isConfigured) {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn(
    '⚠️ Supabase non configuré. Configurez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans votre fichier .env'
  );
  // Create a mock-like client that won't crash the app
  // All operations will fail gracefully
  supabaseInstance = new Proxy({} as SupabaseClient, {
    get(_target, prop) {
      if (prop === 'auth') {
        return {
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithPassword: () => Promise.reject(new Error('Supabase non configuré')),
          signOut: () => Promise.resolve({ error: null }),
          getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        };
      }
      if (prop === 'from') {
        return () => ({
          select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase non configuré' } }), order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }), data: [], error: null }), order: () => ({ data: [], error: null }) }),
          insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase non configuré' } }) }) }),
          delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
        });
      }
      if (prop === 'storage') {
        return {
          from: () => ({
            upload: () => Promise.resolve({ error: { message: 'Supabase non configuré' } }),
            getPublicUrl: () => ({ data: { publicUrl: '' } }),
            remove: () => Promise.resolve({ error: null }),
          }),
        };
      }
      return () => {};
    },
  });
}

export const supabase = supabaseInstance;
export { isConfigured as isSupabaseConfigured };
