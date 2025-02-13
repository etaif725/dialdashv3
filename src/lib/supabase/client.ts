import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create a singleton instance of the Supabase client
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

// Helper to handle Supabase errors
export class SupabaseError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'SupabaseError';
  }
}

// Type guard for Supabase errors
export function isSupabaseError(error: unknown): error is SupabaseError {
  return error instanceof Error && error.name === 'SupabaseError';
}

// Export only the getter function to ensure single instance
export function getSupabase() {
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        flowType: 'pkce',
        debug: import.meta.env.DEV,
      },
      db: {
        schema: 'public',
      },
      global: {
        headers: {
          'x-client-info': 'dialwise-web',
        },
      },
    });

    // Add auth state change listener
    supabaseInstance.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        // Clear any local storage items
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('supabase.auth.token');
          window.localStorage.removeItem('user');
          window.localStorage.removeItem('session');
        }
        // Reset the instance to force a new client on next getSupabase() call
        supabaseInstance = null;
      }
    });
  }
  return supabaseInstance;
}

// Initialize the instance
getSupabase();