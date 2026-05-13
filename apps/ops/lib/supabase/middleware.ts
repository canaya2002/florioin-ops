import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const FOUNDER_EMAIL = 'carlos@florioin.app' as const;

/**
 * Edge-safe Supabase session refresh + founder allowlist enforcement.
 * Runs in middleware.ts on every protected request.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Soft-fail in greenfield setup: if env not yet wired, skip auth.
  if (!url || !anon) {
    return response;
  }

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/auth');
  const isPublicRoute = pathname.startsWith('/share/');

  // Not logged in + accessing protected → redirect login
  if (!user && !isAuthRoute && !isPublicRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // Logged in but not founder → sign out + back to login
  if (user && user.email !== FOUNDER_EMAIL) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('error', 'unauthorized');
    await supabase.auth.signOut();
    return NextResponse.redirect(loginUrl);
  }

  // Logged in founder hitting /login → bounce to overview
  if (user && user.email === FOUNDER_EMAIL && isAuthRoute) {
    const home = request.nextUrl.clone();
    home.pathname = '/';
    return NextResponse.redirect(home);
  }

  return response;
}
