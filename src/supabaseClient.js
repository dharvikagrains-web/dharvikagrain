import { createClient } from "@supabase/supabase-js";

// =============================================================================
// PASTE YOUR SUPABASE CREDENTIALS BELOW
// =============================================================================

// 1. Paste your Supabase Project URL here (e.g. "https://xxxx.supabase.co"):
const SUPABASE_URL = "https://zwcrqycvxyzmhizvbqpp.supabase.co";

// 2. Paste your Supabase Publishable / Anon Public Key here:
const SUPABASE_PUBLIC_KEY = "sb_publishable_2O_ae3k1rQ6FSlnTG4RA7g_5nnFnG5c";

// Strip any trailing /rest/v1 or trailing slashes automatically so auth endpoints work properly
const cleanUrl = (SUPABASE_URL || "").replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");

// =============================================================================
// SUPABASE CLIENT EXPORT
// =============================================================================
export const supabase = createClient(cleanUrl, SUPABASE_PUBLIC_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
