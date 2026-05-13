import { GlassCard, PageHeader, StatusBadge } from '@florioin-ops/ops-ui';

interface PlaceholderSectionProps {
  title: string;
  eyebrow: string;
  description: string;
  comingIn: string;
  bullets: string[];
}

export function PlaceholderSection({
  title,
  eyebrow,
  description,
  comingIn,
  bullets,
}: PlaceholderSectionProps) {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <GlassCard>
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-3">
            <StatusBadge tone="brand">Placeholder · {comingIn}</StatusBadge>
            <p className="max-w-xl text-sm text-[color:var(--color-ink-soft)]">
              Esta sección queda visible como skeleton durante Phase 1. La data real y
              componentes interactivos llegan en la fase indicada.
            </p>
          </div>
        </div>
        <ul className="mt-6 space-y-2 border-t border-[color:var(--color-hairline)] pt-5">
          {bullets.map((b) => (
            <li
              key={b}
              className="flex gap-3 text-sm text-[color:var(--color-ink-muted)]"
            >
              <span className="brand-gradient mt-2 h-1.5 w-1.5 shrink-0 rounded-full" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
