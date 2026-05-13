import { PlaceholderSection } from '@/components/PlaceholderSection';

export default function MarketingPage() {
  return (
    <PlaceholderSection
      eyebrow="Marketing"
      title="Performance + Posts publicados"
      description="ROI por canal, anomalías de tráfico, top content patterns."
      comingIn="Phase 5"
      bullets={[
        'Métricas pull de GA4, GSC, Instagram, TikTok, LinkedIn (vía Apollo)',
        'ROI por canal (Apollo cold, organic, social, referral)',
        'Top content patterns generados por marketing-director processor',
        'Linkea performance con ops.content_plan para feedback loop',
      ]}
    />
  );
}
