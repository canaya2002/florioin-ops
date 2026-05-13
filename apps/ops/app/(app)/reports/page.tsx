import { PlaceholderSection } from '@/components/PlaceholderSection';

export default function ReportsPage() {
  return (
    <PlaceholderSection
      eyebrow="Reports"
      title="CEO Daily · Weekly · Investor updates"
      description="Reportes generados por chief-of-staff con sharing links protegidos."
      comingIn="Phase 5-6"
      bullets={[
        'CEO Daily Brief diario 7:30am al inbox',
        'Reports weekly/monthly por área (sales, marketing, finance, product)',
        'Investor update mensual con shareable link público (password + expiración)',
        'Tracking: shareable_link_viewed_count + last_viewed_at',
      ]}
    />
  );
}
