import type {
  ConversationChannel,
  ConversationDirection,
  ConversationRow,
  Sentiment,
} from '../../src/types';
import { SEED_NOW, hoursAgo, iso } from '../lib/dates';
import { SeededRandom } from '../lib/random';
import { COMPANIES } from './companies';
import type { SeedContact } from './contacts';

export type SeedConversation = ConversationRow;

/**
 * Cold-email subject templates — used outbound only. Generic enough to feel
 * like Carlos wrote them, never about a competitor by name.
 */
const COLD_SUBJECTS = [
  '$NAME, sobre tu post de feedback de clientes',
  '$NAME, una idea desde México',
  'Smart Inbox para $COMPANY',
  '$NAME — 15 min sobre approvals cross-channel',
  '$NAME, build-in-public desde MX',
  'Para $NAME en $COMPANY',
];

const COLD_BODIES = [
  'Hola $NAME,\n\nVi tu post sobre coordinar feedback de clientes. Me identifiqué mucho — por eso construí FlorioIn desde México.\n\nSmart Inbox une approvals cross-channel en un timeline por proyecto. Pricing simple: $5 USD/seat mensual o $4 USD/seat anual.\n\n¿Te haría sentido vernos 15 min? Si no, totalmente entiendo.\n\nCarlos\nFounder, FlorioIn',
  'Hola $NAME,\n\nSé que en $COMPANY manejan varias cuentas en paralelo. Estoy construyendo FlorioIn — un workspace que une approvals cross-channel sin sacar a nadie de WhatsApp ni email.\n\nNo te quito tiempo con un pitch. Si te genera curiosidad, te mando un loom de 3 min.\n\nUn abrazo,\nCarlos',
  'Hola $NAME,\n\nFelicidades por $SIGNAL — vi la nota.\n\nSi un día quieres ver cómo otras agencias mexicanas están unificando approvals, FlorioIn está en beta abierta. Solo manda DM y te paso acceso.\n\nCarlos',
];

const REPLY_INTERESTED_BODIES = [
  'Hola Carlos,\n\nGracias por el mensaje. Sí me interesa ver. ¿Tienes algún slot esta semana? Mejor por la tarde de mi lado.',
  'Carlos, qué tal. Me da curiosidad. Cuéntame más sobre cómo manejan el feedback cross-channel — eso es justo lo que más nos cuesta.',
  'Hola Carlos, sí, mándame el loom. Si me convence, agendamos.',
];

const REPLY_QUESTION_BODIES = [
  '¿Cómo se compara contra lo que ya usamos? No estoy buscando cambiar todo, pero si me ahorra un par de horas a la semana, vale la pena.',
  '¿Tienen integración con WhatsApp? Es lo que más usamos con clientes.',
  '¿Cuánto cuesta exactamente por equipo de 12?',
];

const WHATSAPP_INBOUND_BODIES = [
  'Hola! Me pasaron tu contacto. Manejamos una agencia chica en CDMX y estamos buscando algo para no perder approvals en WhatsApp. ¿Tienes 10 min hoy?',
  'Carlos buenas, vi tu post en LinkedIn. ¿Puedes mandarme info de pricing por favor?',
  'Hola, llevo días viendo cómo coordinar feedback entre 3 clientes y un equipo de 8 sin que se vuelva caos. ¿Una llamada esta semana?',
];

const WHATSAPP_REPLY_BODIES = [
  'Hola, claro. Te mando link de Calendly: cal.com/florioin/15. Cualquier slot que veas libre lo confirmo.',
  'Buenas. Mismo pricing para todos: $5 USD por seat al mes o $4 USD si pagan anual. Sin tiers ni descuentos.',
  'Te mando WhatsApp Cloud API en respuesta. Lleva captura de la conversación y la deja como approval pendiente.',
];

const LINKEDIN_DM_BODIES = [
  'Hola $NAME, ví tu perfil y trabajo en algo parecido al problema que mencionas en tu último post. ¿Te interesaría ver una demo de 10 min?',
  '$NAME, escribo porque construyo desde México un workspace para agencias creativas. No te quito tiempo con pitch.',
];

function pick<T>(rng: SeededRandom, arr: readonly T[]): T {
  return arr[rng.int(0, arr.length - 1)]!;
}

function fillTemplate(tpl: string, contact: SeedContact, companyName: string, signal: string | undefined): string {
  return tpl
    .replaceAll('$NAME', contact.first_name ?? 'hola')
    .replaceAll('$COMPANY', companyName)
    .replaceAll('$SIGNAL', signal ?? 'tu trabajo reciente');
}

/**
 * Build ~400 conversations distributed across the 80 contacts.
 * Cold contacts: 1-2 outbound only.
 * Contacted/engaged: 2-6 conversations with replies.
 * Demo+: full thread.
 * Customer: a few historical + recent check-ins.
 */
export function buildConversations(
  rng: SeededRandom,
  contacts: SeedContact[],
): SeedConversation[] {
  const out: SeedConversation[] = [];

  for (const contact of contacts) {
    const company = COMPANIES[contact._companyIndex]!;
    const targetCount = countFor(rng, contact);

    // Channel preference per contact:
    const primary: ConversationChannel =
      contact.source_channel === 'whatsapp_inbound'
        ? 'whatsapp'
        : contact.source_channel === 'linkedin_dm'
          ? 'linkedin'
          : 'email';

    const firstTouchHoursAgo =
      contact.first_touch_at
        ? Math.floor((SEED_NOW.getTime() - new Date(contact.first_touch_at).getTime()) / 3_600_000)
        : 168;

    let ts = firstTouchHoursAgo + rng.int(0, 6);
    let lastDirection: ConversationDirection = 'outbound';

    for (let i = 0; i < targetCount; i++) {
      const channel: ConversationChannel = i === 0 ? primary : rng.bool(0.85) ? primary : 'email';
      const direction: ConversationDirection =
        i === 0 && primary === 'whatsapp'
          ? 'inbound'
          : i === 0
            ? 'outbound'
            : lastDirection === 'outbound'
              ? rng.bool(0.55)
                ? 'inbound'
                : 'outbound'
              : 'outbound';
      lastDirection = direction;

      const tpl =
        channel === 'email' && direction === 'outbound'
          ? pick(rng, COLD_BODIES)
          : channel === 'email' && direction === 'inbound'
            ? rng.bool(0.4)
              ? pick(rng, REPLY_QUESTION_BODIES)
              : pick(rng, REPLY_INTERESTED_BODIES)
            : channel === 'whatsapp' && direction === 'inbound'
              ? pick(rng, WHATSAPP_INBOUND_BODIES)
              : channel === 'whatsapp' && direction === 'outbound'
                ? pick(rng, WHATSAPP_REPLY_BODIES)
                : pick(rng, LINKEDIN_DM_BODIES);

      const subject =
        channel === 'email' && direction === 'outbound'
          ? fillTemplate(pick(rng, COLD_SUBJECTS), contact, company.name, company.signals[0])
          : channel === 'email' && direction === 'inbound'
            ? `Re: Smart Inbox para ${company.name}`
            : null;

      const body = fillTemplate(tpl, contact, company.name, company.signals[0]);

      const sentiment: Sentiment | null =
        direction === 'inbound'
          ? rng.weighted([
              { value: 'positive' as Sentiment, weight: 5 },
              { value: 'neutral' as Sentiment, weight: 4 },
              { value: 'urgent' as Sentiment, weight: 1 },
              { value: 'negative' as Sentiment, weight: 1 },
            ])
          : null;

      const intent =
        direction === 'inbound'
          ? body.includes('cuánto') || body.includes('pricing')
            ? 'pricing_question'
            : body.includes('demo') || body.includes('slot')
              ? 'schedule_demo'
              : 'general_interest'
          : null;

      out.push({
        id: rng.uuid(),
        contact_id: contact.id,
        channel,
        direction,
        subject,
        body,
        ai_intent: intent,
        ai_sentiment: sentiment,
        ai_emotional_signals:
          sentiment === 'urgent'
            ? ['time_pressure']
            : sentiment === 'positive'
              ? ['curious', 'open']
              : null,
        external_message_id: rng.uuid().replace(/-/g, '').slice(0, 24),
        thread_id: `thread_${contact.id.slice(0, 8)}`,
        delivered: direction === 'outbound',
        opened: direction === 'outbound' ? rng.bool(0.6) : false,
        opened_at:
          direction === 'outbound' && rng.bool(0.6)
            ? iso(hoursAgo(ts - rng.int(0, 6)))
            : null,
        replied: false,
        replied_at: null,
        human_edited: direction === 'outbound' && rng.bool(0.2),
        edit_history: null,
        created_at: iso(hoursAgo(ts)),
      });

      // Step time backwards each iteration (newer conversations = lower ts).
      ts = Math.max(1, ts - rng.int(4, 48));
    }
  }

  // Sort descending (newest first).
  out.sort((a, b) => b.created_at.localeCompare(a.created_at));
  return out;
}

function countFor(rng: SeededRandom, contact: SeedContact): number {
  // Tuned to land around 400 total across 80 contacts (≈5 avg) per spec.
  switch (contact.status) {
    case 'customer':
      return rng.int(14, 22);
    case 'trial_active':
      return rng.int(9, 14);
    case 'demo_done':
      return rng.int(7, 10);
    case 'demo_scheduled':
      return rng.int(5, 8);
    case 'engaged':
      return rng.int(4, 8);
    case 'contacted':
      return rng.int(2, 5);
    case 'lost':
      return rng.int(2, 6);
    case 'dormant':
      return rng.int(2, 4);
    case 'cold':
    default:
      // Most colds get at least 1 outbound — they're in the system because
      // an outbound was attempted. Spec target: ~400 total conversations.
      return rng.weighted([
        { value: 0, weight: 1 },
        { value: 1, weight: 4 },
        { value: 2, weight: 3 },
        { value: 3, weight: 1 },
      ]);
  }
}
