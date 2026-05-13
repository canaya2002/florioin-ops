import { PlaceholderSection } from '@/components/PlaceholderSection';

export default function ConversationsPage() {
  return (
    <PlaceholderSection
      eyebrow="Conversations"
      title="Inbox unificado cross-channel"
      description="Vista 3 columnas estilo Superhuman: threads, mensajes activos, contact details."
      comingIn="Phase 4"
      bullets={[
        'Pull de Gmail, WhatsApp, LinkedIn (vía Apollo) en mismo timeline',
        'Composer con tabs: AI Suggest · Write own · Templates',
        'AI clasifica intent + sentiment de cada inbound',
        'Drafts AI quedan como pending approval, nunca se mandan auto',
      ]}
    />
  );
}
