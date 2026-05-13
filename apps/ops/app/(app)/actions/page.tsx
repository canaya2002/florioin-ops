import { PlaceholderSection } from '@/components/PlaceholderSection';

export default function ActionsPage() {
  return (
    <PlaceholderSection
      eyebrow="Actions"
      title="Approval queue — el corazón del Hub"
      description="Todo output AI pasa por aquí antes de salir al mundo."
      comingIn="Phase 3"
      bullets={[
        'Cards con preview content + AI reasoning + personalization hooks usados',
        '4 acciones: Aprobar · Editar · Rechazar · Posponer',
        'Edit mode: rich text con diff vs versión AI original',
        'Expira a las 48h sin acción (auto-cleanup)',
        'AI nunca manda nada sin tu aprobación explícita',
      ]}
    />
  );
}
