import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zwcrqycvxyzmhizvbqpp.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_2O_ae3k1rQ6FSlnTG4RA7g_5nnFnG5c';

/**
 * Creates a browser-safe Supabase client for Client Components
 */
export const createClient = () =>
  createBrowserClient(supabaseUrl, supabaseKey);
