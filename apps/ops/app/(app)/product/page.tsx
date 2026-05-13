import { PlaceholderSection } from '@/components/PlaceholderSection';

export default function ProductPage() {
  return (
    <PlaceholderSection
      eyebrow="Product Health"
      title="Uptime · Errors · Deployments"
      description="Telemetría del producto FlorioIn — observación, no intervención."
      comingIn="Phase 5"
      bullets={[
        'Vercel deployments, build times, function invocations, bandwidth',
        'Sentry error rate de florioin.app + mobile',
        'Inngest job failures + uptime histórico',
        'FlorioIn DB activity: active workspaces, churned, low engagement',
        'Alerts críticos → Slack push immediato',
      ]}
    />
  );
}
