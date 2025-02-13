import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

if (!import.meta.env.VITE_SUPABASE_URL) throw new Error('Database Url is required')
if (!import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY) throw new Error('Service Role Key is required')

// Create a Supabase client with the service role key to bypass RLS
export const createServiceClient = () => createClient<Database>(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)