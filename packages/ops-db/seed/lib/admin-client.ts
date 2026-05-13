import { createClient } from '@supabase/supabase-js';

/**
 * Admin client for seed + migration scripts. Bypasses RLS via the service role
 * key. NEVER ship this to the browser.
 *
 * Return type is inferred from `createClient` so the generic schema slot
 * widens to the union — explicit annotation would narrow it incorrectly.
 */
export function createAdminClient(schema: 'ops' | 'public' = 'ops') {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_URL');
  }
  if (!serviceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY (server-only)');
  }

  return createClient(url, serviceKey, {
    db: { schema },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Returns true if creds for the admin client are wired. */
export function hasAdminCreds(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(url && key);
}
