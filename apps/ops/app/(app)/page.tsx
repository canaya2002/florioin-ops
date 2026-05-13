import { GlassCard, PageHeader, StatusBadge } from '@florioin-ops/ops-ui';
import { formatDateMX } from '@florioin-ops/ops-core';

const kpis = [
  { label: 'MRR', value: '—', helper: 'Empieza a tracking en Phase 5' },
  { label: 'Trials activos', value: '—', helper: 'Conecta FlorioIn DB en Phase 4' },
  { label: 'Pipeline value', value: '—', helper: 'Apollo + Stripe en Phase 4' },
  { label: 'Pending actions', value: '0', helper: 'Aprueba/edita/rechaza' },
];

export default function OverviewPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={`Hoy · ${formatDateMX(new Date(), { weekday: 'long' })}`}
        title="Tu departamento virtual te resume el día"
        description="El CEO Daily Brief aparecerá aquí cada mañana a las 7:30am MX. Por ahora es un skeleton."
      />

      <GlassCard variant="strong" className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <StatusBadge tone="brand">CEO Daily Brief</StatusBadge>
          <span className="text-xs text-[color:var(--color-ink-muted)]">
            Generado por chief-of-staff · llega en Phase 5
          </span>
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-[color:var(--color-ink)]">
          Buenos días, Carlos.
        </h3>
        <p className="max-w-2xl text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
          Una vez en producción, este card consolidará MRR, trials, hot leads, at-risk
          deals, contenido del día y la acción de mayor leverage para empezar la mañana.
          La voz se siente como Carlos founder, no como sequence corporativa.
        </p>
      </GlassCard>

      <section>
        <h4 className="mb-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--color-ink-muted)]">
          KPIs clave
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <GlassCard key={k.label} className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-[color:var(--color-ink-muted)]">
                {k.label}
              </p>
              <p className="text-2xl font-semibold text-[color:var(--color-ink)]">
                {k.value}
              </p>
              <p className="text-xs text-[color:var(--color-ink-subtle)]">{k.helper}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <GlassCard className="space-y-3">
          <h4 className="text-sm font-semibold text-[color:var(--color-ink)]">
            Top 3 Hot Leads
          </h4>
          <p className="text-xs text-[color:var(--color-ink-muted)]">
            Se llenará automáticamente cuando sales-vp processor corra en Phase 5.
          </p>
        </GlassCard>
        <GlassCard className="space-y-3">
          <h4 className="text-sm font-semibold text-[color:var(--color-ink)]">
            Top 3 At-Risk Deals
          </h4>
          <p className="text-xs text-[color:var(--color-ink-muted)]">
            Detectados con trial day 25+ o silencio prolongado.
          </p>
        </GlassCard>
        <GlassCard className="space-y-3">
          <h4 className="text-sm font-semibold text-[color:var(--color-ink)]">
            Contenido de hoy
          </h4>
          <p className="text-xs text-[color:var(--color-ink-muted)]">
            Si el Content Planner generó post para hoy, aparece aquí con copy listo.
          </p>
        </GlassCard>
        <GlassCard className="space-y-3">
          <h4 className="text-sm font-semibold text-[color:var(--color-ink)]">
            Latest Insights
          </h4>
          <p className="text-xs text-[color:var(--color-ink-muted)]">
            Patterns y anomalías generados por data-scientist.
          </p>
        </GlassCard>
      </section>
    </div>
  );
}
