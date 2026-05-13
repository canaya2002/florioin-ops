import { type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

/**
 * Next.js 16 renamed `middleware` to `proxy`. Behavior is identical.
 * Enforces founder allowlist (carlos@florioin.app) on every protected route.
 */
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image, favicon, public files
     * - api routes that need to bypass auth (webhooks, inngest)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/webhooks|api/inngest|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?)$).*)',
  ],
};
