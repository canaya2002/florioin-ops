/**
 * Server-side Supabase clients.
 *
 * - `createSupabaseServerClient(cookies)` → user-scoped, RLS enforced via JWT.
 * - `createSupabaseServiceClient()` → bypasses RLS. Use ONLY in server-only
 *   code (cron jobs, webhooks, Inngest steps). Never expose to the browser.
 */
import { createServerClient, type CookieMethodsServer } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export function createSupabaseServerClient(cookieStore: CookieMethodsServer) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return createServerClient(url, anon, {
    db: { schema: 'ops' },
    cookies: cookieStore,
  });
}

export function createSupabasePublicServerClient(cookieStore: CookieMethodsServer) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return createServerClient(url, anon, {
    cookies: cookieStore,
  });
}

/**
 * Service-role client. Bypasses RLS. Server-only.
 */
export function createSupabaseServiceClient(schema: 'ops' | 'public' = 'ops') {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(url, serviceKey, {
    db: { schema },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
