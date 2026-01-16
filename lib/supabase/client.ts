import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// For client components
export const createSupabaseClient = () => {
  return createClientComponentClient();
};

// For server components and API routes
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client in development if env vars are missing
    if (process.env.NODE_ENV === 'development') {
      console.warn('Missing Supabase environment variables. Using mock client.');
      return createClient(
        'https://placeholder.supabase.co',
        'placeholder-key'
      );
    }
    throw new Error('Missing Supabase environment variables');
  }
  
  const cookieStore = cookies();
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        cookie: cookieStore.toString(),
      },
    },
  });
};
