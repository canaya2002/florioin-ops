import { PlaceholderSection } from '@/components/PlaceholderSection';

export default function ContentPage() {
  return (
    <PlaceholderSection
      eyebrow="Content · This Week"
      title="Content Planner semanal"
      description="AI planea cada domingo 6pm. Tú publicas manual desde el celular."
      comingIn="Phase 3 (UI) · Phase 5 (AI generation)"
      bullets={[
        'Cadencias: LinkedIn L·Mi·V · Instagram cada 2 días · TikTok cada 3 días',
        'Cada post: copy primario + 2 variaciones + hashtags + idea visual + AI reasoning',
        'Calendario semanal con celdas por día y plataforma',
        'Marcar como publicado + agregar URL del post real para tracking engagement',
        'Recordatorio diario 8am email/Slack del post del día',
        'Hub NUNCA auto-publica — tú publicas manual desde celular',
      ]}
    />
  );
}
