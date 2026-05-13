import type { EventRow, Severity } from '../../src/types';
import { daysAgo, hoursAgo, iso } from '../lib/dates';
import { SeededRandom } from '../lib/random';
import type { SeedContact } from './contacts';
import type { SeedDeal } from './deals';

export type SeedEvent = EventRow;

interface EventTemplate {
  source: string;
  event_type: string;
  severity: Severity;
  summary: (ctx: { contact?: SeedContact; deal?: SeedDeal }) => string;
  suggestedAction?: (ctx: { contact?: SeedContact; deal?: SeedDeal }) => string;
}

const TEMPLATES: EventTemplate[] = [
  {
    source: 'apollo',
    event_type: 'cold_email_reply',
    severity: 'warning',
    summary: (c) => `Respuesta de ${c.contact?.full_name} a cold email`,
    suggestedAction: () => 'Generar draft de respuesta humanizado',
  },
  {
    source: 'whatsapp',
    event_type: 'whatsapp_inbound',
    severity: 'warning',
    summary: (c) =>
      `Mensaje WhatsApp entrante de ${c.contact?.full_name} (${c.contact?.company_name})`,
    suggestedAction: () => 'Responder dentro de 15 min',
  },
  {
    source: 'gmail',
    event_type: 'email_reply_received',
    severity: 'info',
    summary: (c) => `Reply email de ${c.contact?.full_name}`,
  },
  {
    source: 'calendar',
    event_type: 'demo_scheduled',
    severity: 'info',
    summary: (c) => `Demo agendada con ${c.contact?.full_name}`,
    suggestedAction: () => 'Preparar contexto del lead 24h antes',
  },
  {
    source: 'stripe',
    event_type: 'invoice_payment_succeeded',
    severity: 'info',
    summary: (c) => `Pago recibido — ${c.deal?.company_name}`,
  },
  {
    source: 'stripe',
    event_type: 'invoice_payment_failed',
    severity: 'critical',
    summary: (c) => `Pago fallido — ${c.deal?.company_name}`,
    suggestedAction: () => 'Mandar recordatorio comprensivo (no agresivo)',
  },
  {
    source: 'florioin_db',
    event_type: 'signup_received',
    severity: 'info',
    summary: (c) => `Nuevo workspace creado — ${c.contact?.company_name}`,
  },
  {
    source: 'florioin_db',
    event_type: 'trial_started',
    severity: 'info',
    summary: (c) => `Trial activado — ${c.deal?.company_name} (${c.deal?.expected_seats} seats)`,
  },
  {
    source: 'florioin_db',
    event_type: 'low_activity_warning',
    severity: 'warning',
    summary: (c) =>
      `${c.contact?.full_name} (${c.contact?.company_name}) sin login en 7 días`,
    suggestedAction: () => 'Check-in personal humanizado',
  },
  {
    source: 'vercel',
    event_type: 'deployment_succeeded',
    severity: 'info',
    summary: () => 'Deploy producción florioin.app exitoso',
  },
  {
    source: 'vercel',
    event_type: 'error_rate_spike',
    severity: 'critical',
    summary: () => 'Tasa de errores subió 3x en API routes',
    suggestedAction: () => 'Revisar Sentry inmediato',
  },
];

/**
 * Build 25 events:
 *  - mix across templates
 *  - linked to contacts/deals where applicable
 *  - distributed in last 7 days
 */
export function buildEvents(
  rng: SeededRandom,
  contacts: SeedContact[],
  deals: SeedDeal[],
): SeedEvent[] {
  const out: SeedEvent[] = [];

  for (let i = 0; i < 25; i++) {
    const tpl = rng.pick(TEMPLATES);
    const contact =
      tpl.event_type.includes('reply') ||
      tpl.event_type.includes('inbound') ||
      tpl.event_type.includes('demo') ||
      tpl.event_type.includes('low_activity') ||
      tpl.event_type.includes('signup')
        ? rng.pick(contacts.filter((c) => c.status !== 'cold')) ?? contacts[0]!
        : undefined;

    const deal =
      tpl.event_type.includes('payment') || tpl.event_type.includes('trial_started')
        ? rng.pick(deals) ?? deals[0]!
        : undefined;

    const happenedAt =
      tpl.severity === 'critical'
        ? hoursAgo(rng.int(2, 24))
        : daysAgo(rng.int(0, 7));

    const ctx = { contact, deal };
    out.push({
      id: rng.uuid(),
      source: tpl.source,
      event_type: tpl.event_type,
      severity: tpl.severity,
      external_id: null,
      payload: {
        contact_id: contact?.id ?? null,
        deal_id: deal?.id ?? null,
        company: contact?.company_name ?? deal?.company_name ?? null,
      },
      processed: rng.bool(0.6),
      ai_summary: tpl.summary(ctx),
      ai_suggested_action: tpl.suggestedAction ? tpl.suggestedAction(ctx) : null,
      related_contact_id: contact?.id ?? null,
      related_deal_id: deal?.id ?? null,
      created_at: iso(happenedAt),
      processed_at: rng.bool(0.6) ? iso(happenedAt) : null,
    });
  }

  out.sort((a, b) => b.created_at.localeCompare(a.created_at));
  return out;
}
