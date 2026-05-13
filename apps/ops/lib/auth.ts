import { redirect } from 'next/navigation';
import { createServerSupabase } from './supabase/server';

export const FOUNDER_EMAIL = 'carlos@florioin.app' as const;

export async function getCurrentUser() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== FOUNDER_EMAIL) return null;
  return user;
}

export async function signOutAction() {
  'use server';
  const supabase = await createServerSupabase();
  await supabase.auth.signOut();
  redirect('/login');
}
