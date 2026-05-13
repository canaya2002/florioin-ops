import { PlaceholderSection } from '@/components/PlaceholderSection';

export default function ContactsPage() {
  return (
    <PlaceholderSection
      eyebrow="Contacts"
      title="CRM lightweight"
      description="Tabla con filtros, bulk actions, drill-down a perfil completo del contacto."
      comingIn="Phase 3-4"
      bullets={[
        'Schema ops.contacts ya creado: incluye ai_research_summary + ai_personalization_hooks',
        'Cada contact tiene investigación AI persistida (LinkedIn, empresa, hooks)',
        'Vincula con producto FlorioIn vía florioin_workspace_id cuando convierte',
        'Filtros: status, source_channel, ICP fit, AI score',
      ]}
    />
  );
}
