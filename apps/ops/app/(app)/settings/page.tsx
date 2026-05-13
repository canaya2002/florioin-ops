import { GlassCard, PageHeader, StatusBadge } from '@florioin-ops/ops-ui';
import { signOutAction } from '@/lib/auth';

const integrations: Array<{ source: string; tier: 1 | 2 | 3 }> = [
  { source: 'Apollo.io', tier: 1 },
  { source: 'Gmail', tier: 1 },
  { source: 'Google Calendar', tier: 1 },
  { source: 'WhatsApp Business', tier: 1 },
  { source: 'Stripe', tier: 1 },
  { source: 'FlorioIn DB', tier: 1 },
  { source: 'GA4', tier: 2 },
  { source: 'Search Console', tier: 2 },
  { source: 'Vercel', tier: 2 },
  { source: 'Instagram', tier: 3 },
  { source: 'TikTok', tier: 3 },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Integraciones, backups, founder profile"
        description="Estado de las 11 integraciones, backup history, y sign out."
      />

      <GlassCard>
        <h3 className="mb-4 text-sm font-semibold text-[color:var(--color-ink)]">
          Integraciones
        </h3>
        <ul className="divide-y divide-[color:var(--color-hairline)]">
          {integrations.map((i) => (
            <li
              key={i.source}
              className="flex items-center justify-between py-3 text-sm"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-[color:var(--color-ink)]">{i.source}</span>
                <span className="text-xs text-[color:var(--color-ink-subtle)]">
                  Tier {i.tier}
                </span>
              </div>
              <StatusBadge tone="warning">mock</StatusBadge>
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard>
        <h3 className="mb-2 text-sm font-semibold text-[color:var(--color-ink)]">
          Sesión
        </h3>
        <p className="mb-4 text-xs text-[color:var(--color-ink-muted)]">
          Único usuario permitido: carlos@florioin.app
        </p>
        <form action={signOutAction}>
          <button
            type="submit"
            className="rounded-xl border border-[color:var(--color-hairline-strong)] bg-white px-4 py-2 text-sm font-medium text-[color:var(--color-ink)] transition-colors hover:bg-[#F4F6F9]"
          >
            Cerrar sesión
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
