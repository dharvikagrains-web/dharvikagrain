import { createClient } from "@supabase/supabase-js";

// =============================================================================
// PASTE YOUR SUPABASE CREDENTIALS BELOW
// =============================================================================

// 1. Paste your Supabase Project URL here:
// (Note: Supabase base URL is typically "https://<project-ref>.supabase.co")
const SUPABASE_URL = "https://zwcrqycvxyzmhizvbqpp.supabase.co/rest/v1/";

// 2. Paste your Supabase Publishable / Anon Public Key here:
const SUPABASE_PUBLIC_KEY = "sb_publishable_2O_ae3k1rQ6FSlnTG4RA7g_5nnFnG5c";

// =============================================================================
// SUPABASE CLIENT EXPORT
// =============================================================================
export const supabase = createClient(
  // Automatically strips trailing /rest/v1 if present so queries don't double up
  SUPABASE_URL.replace(/\/rest\/v1\/?$/, ""),
  SUPABASE_PUBLIC_KEY
);
