import { PlaceholderSection } from '@/components/PlaceholderSection';

export default function SalesPage() {
  return (
    <PlaceholderSection
      eyebrow="Sales"
      title="Pipeline · Hot Leads · At Risk · Forecast"
      description="Kanban del pipeline + drill-downs en hot leads, at-risk deals y forecast."
      comingIn="Phase 5"
      bullets={[
        'Pipeline kanban con stages lead → qualified → demo → trial → closed',
        'Hot leads detectados por sales-vp processor (cada 30 min)',
        'At-risk deals: trial day 25+, silencio prolongado, failed payment',
        'Forecast basado en historical conversion + cohort analysis',
      ]}
    />
  );
}
