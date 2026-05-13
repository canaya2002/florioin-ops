import { PlaceholderSection } from '@/components/PlaceholderSection';

export default function FinancePage() {
  return (
    <PlaceholderSection
      eyebrow="Finance"
      title="MRR · ARR · Trials · Churn"
      description="Stripe-driven con cálculos hardcoded del pricing real Florioin."
      comingIn="Phase 5"
      bullets={[
        'Pricing: $5 USD/seat mensual · $4 USD/seat anual (20% off pagado adelantado)',
        'Sin tiers · Sin descuentos · Sin refunds · Sin extensiones de trial',
        'MRR + ARR + growth rate vs mes anterior',
        'Trial conversion + churn rate 30 días + revenue split monthly vs annual',
        'Trial day 25 → reminder humano antes que termine',
      ]}
    />
  );
}
