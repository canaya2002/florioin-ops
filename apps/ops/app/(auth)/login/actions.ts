'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase/server';

const FOUNDER_EMAIL = 'carlos@florioin.app' as const;

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get('email') || '').trim().toLowerCase();

  if (email !== FOUNDER_EMAIL) {
    return { error: 'Solo carlos@florioin.app tiene acceso.' };
  }

  const hdrs = await headers();
  const proto = hdrs.get('x-forwarded-proto') ?? 'http';
  const host = hdrs.get('host') ?? 'localhost:3000';
  const origin = `${proto}://${host}`;

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      shouldCreateUser: true,
    },
  });

  if (error) {
    console.error('[auth] magic link failed', error.message);
    return { error: 'No pudimos mandar el link. Reintenta en unos segundos.' };
  }

  redirect('/login?sent=1');
}
