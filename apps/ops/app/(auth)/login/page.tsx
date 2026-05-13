import { GlassCard } from '@florioin-ops/ops-ui';
import { LoginForm } from './LoginForm';

export const metadata = {
  title: 'Sign in · Florioin Ops',
};

interface LoginPageProps {
  searchParams: Promise<{ error?: string; sent?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const errorParam = params.error;
  const sent = params.sent === '1';

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="brand-gradient h-12 w-12 rounded-2xl shadow-[0_18px_40px_-16px_rgba(168,140,255,0.55)]" />
          <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--color-ink)]">
            Florioin Ops
          </h1>
          <p className="text-sm text-[color:var(--color-ink-muted)]">
            Hub interno del founder. Acceso restringido.
          </p>
        </div>

        <GlassCard variant="strong" className="space-y-5">
          {sent ? (
            <div className="space-y-2 text-center">
              <h2 className="text-base font-semibold text-[color:var(--color-ink)]">
                Revisa tu correo
              </h2>
              <p className="text-sm text-[color:var(--color-ink-soft)]">
                Te mandamos un link mágico a tu inbox. Ábrelo desde el mismo dispositivo.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <h2 className="text-base font-semibold text-[color:var(--color-ink)]">
                  Entrar con Magic Link
                </h2>
                <p className="text-xs text-[color:var(--color-ink-muted)]">
                  Solo carlos@florioin.app puede entrar.
                </p>
              </div>
              <LoginForm />
              {errorParam === 'unauthorized' && (
                <p className="text-xs text-[#9a2230]">
                  Esa cuenta no tiene acceso. El Hub solo permite al founder.
                </p>
              )}
              {errorParam === 'magic-link-failed' && (
                <p className="text-xs text-[#9a2230]">
                  No pudimos mandar el link. Revisa la consola y reintenta.
                </p>
              )}
            </>
          )}
        </GlassCard>

        <p className="mt-6 text-center text-[11px] text-[color:var(--color-ink-subtle)]">
          ops.florioin.app · v0.1.0
        </p>
      </div>
    </main>
  );
}
