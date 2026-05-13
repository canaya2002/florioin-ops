/**
 * Browser-side Supabase client (anon key, RLS-enforced).
 * Use inside Client Components.
 */
import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return createBrowserClient(url, anon, {
    db: { schema: 'ops' },
  });
}

/**
 * Same instance but targeted at schema `public` (read-only access to FlorioIn
 * product data + write access to public.florioin_ops_flags).
 */
export function createSupabasePublicBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return createBrowserClient(url, anon);
}
