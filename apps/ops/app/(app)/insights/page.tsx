import { PlaceholderSection } from '@/components/PlaceholderSection';

export default function InsightsPage() {
  return (
    <PlaceholderSection
      eyebrow="Insights"
      title="Patterns · Anomalías · Recomendaciones"
      description="Output cross-processor consolidado en una sola línea de tiempo."
      comingIn="Phase 5"
      bullets={[
        'data-scientist genera cohort analysis, funnels, correlations cada 12h',
        'Anomalías auto-detectadas: drops de tráfico, picos de churn, etc.',
        'Cada insight tiene confidence_score + acted_on flag',
        'Filtros por categoría: sales · marketing · finance · product · content',
      ]}
    />
  );
}
