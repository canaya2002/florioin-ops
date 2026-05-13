import type {
  ActionPriority,
  ActionType,
  ActionsQueueRow,
  Json,
} from '../../src/types';
import { daysAgo, hoursAgo, iso } from '../lib/dates';
import { SeededRandom } from '../lib/random';
import type { SeedContact } from './contacts';
import type { SeedDeal } from './deals';

export type SeedAction = ActionsQueueRow;

/**
 * Resolve a contact by matching predicate. Throws if not found — seed should
 * fail fast if the contact pool changed shape, rather than silently picking
 * the wrong row.
 */
function findContact(
  contacts: SeedContact[],
  pred: (c: SeedContact, i: number) => boolean,
  hint: string,
): SeedContact {
  const c = contacts.find(pred);
  if (!c) throw new Error(`seed: no contact found for ${hint}`);
  return c;
}

interface DraftSpec {
  action_type: ActionType;
  priority: ActionPriority;
  contact: SeedContact;
  deal?: SeedDeal;
  ageHours: number;
  confidence: number;
  reasoning: string;
  hooks: string[];
  content: Record<string, Json>;
}

/**
 * Build 12 hand-crafted humanistic action drafts. Each one:
 *  - sounds like Carlos wrote it personally (MX Spanish, founder voice)
 *  - includes the specific personalization hooks used
 *  - has AI reasoning the founder can audit
 *  - confidence ≥ 0.7 except where requires_approval is explicitly forced
 *  - never names a competitor, never invents customers
 *
 * Order in `out` becomes the visual order on the queue (newest priority on top).
 */
export function buildActions(
  rng: SeededRandom,
  contacts: SeedContact[],
  deals: SeedDeal[],
): SeedAction[] {
  // ----- pick specific contacts for each draft -----
  const hotInbound = findContact(
    contacts,
    (c) => c.source_channel === 'whatsapp_inbound' && c.status === 'engaged',
    'whatsapp_inbound + engaged',
  );

  const replyToColdInterested = findContact(
    contacts,
    (c) => c.status === 'engaged' && c.source_channel === 'apollo_email',
    'engaged apollo lead',
  );

  const replyToPricingQuestion = findContact(
    contacts,
    (c, i) => c.status === 'contacted' && i > 0,
    'pricing question lead',
  );

  const coldOutreachResearch = findContact(
    contacts,
    (c) => c.status === 'cold' && c.ai_score > 0.4,
    'cold high-fit lead',
  );

  const trialDay25 = findContact(
    contacts,
    (c) => c.status === 'trial_active',
    'trial_active for day25',
  );
  const trialDay25Deal = deals.find((d) => d.contact_id === trialDay25.id);

  const trialDay14 = findContact(
    contacts,
    (c, i) => c.status === 'trial_active' && contacts.indexOf(trialDay25) !== i,
    'trial_active for day14',
  );
  const trialDay14Deal = deals.find((d) => d.contact_id === trialDay14.id);

  const failedPaymentCustomer = findContact(
    contacts,
    (c) => c.status === 'customer',
    'customer for failed payment',
  );
  const failedPaymentDeal = deals.find((d) => d.contact_id === failedPaymentCustomer.id);

  const demoScheduled = findContact(
    contacts,
    (c) => c.status === 'demo_scheduled',
    'demo_scheduled',
  );

  const linkedinDm = findContact(
    contacts,
    (c) => c.status === 'cold' && (c.company_size === '16-40' || c.company_size === '5-15'),
    'cold for linkedin DM',
  );

  const followUp = findContact(
    contacts,
    (c) => c.status === 'contacted' && c.ai_score > 0.5,
    'contacted lead for followup',
  );

  const churnRecovery = findContact(
    contacts,
    (c) => c.status === 'lost',
    'lost contact',
  );

  const seatChange = findContact(
    contacts,
    (c, i) => c.status === 'customer' && contacts.indexOf(failedPaymentCustomer) !== i,
    'second customer for seat change',
  );
  const seatChangeDeal = deals.find((d) => d.contact_id === seatChange.id);

  // ----- 12 hand-crafted drafts -----
  const drafts: DraftSpec[] = [
    {
      action_type: 'send_whatsapp_reply',
      priority: 'urgent',
      contact: hotInbound,
      ageHours: 2,
      confidence: 0.92,
      reasoning: `Inbound WhatsApp hace 2h. ${hotInbound.first_name} es ${hotInbound.role} de ${hotInbound.company_name} (${hotInbound.company_size}). Mensaje muestra urgencia real ("¿tienes 10 min hoy?"). Responder rápido es señal de respeto.`,
      hooks: [
        `${hotInbound.company_name} es ${hotInbound.company_industry?.replace('_', ' ')}`,
        `Tamaño ${hotInbound.company_size} → match ICP`,
        'Mensaje WhatsApp tiene "tienes 10 min hoy" — urgencia real',
      ],
      content: {
        to_phone: hotInbound.whatsapp_phone,
        body: `Hola ${hotInbound.first_name}, qué tal. Justo terminando algo aquí — ¿te late en 1h? Te mando link de Google Meet: meet.google.com/florioin-demo\n\nSi prefieres mañana temprano, también va. Tú dime.`,
      },
    },
    {
      action_type: 'send_email_reply',
      priority: 'high',
      contact: replyToColdInterested,
      ageHours: 6,
      confidence: 0.88,
      reasoning: `${replyToColdInterested.first_name} respondió al cold email pidiendo slot esta semana. Es ${replyToColdInterested.role} de ${replyToColdInterested.company_name}. Decisor directo. Respuesta rápida + slot concreto evita perderlo.`,
      hooks: [
        `Es ${replyToColdInterested.role} → decisor directo`,
        `${replyToColdInterested.company_name} en ${replyToColdInterested.company_industry}`,
        'Pidió específicamente slot esta semana',
      ],
      content: {
        to: replyToColdInterested.email,
        subject: `Re: Smart Inbox para ${replyToColdInterested.company_name}`,
        body: `Hola ${replyToColdInterested.first_name},\n\nGracias por la respuesta. Tengo dos slots esta semana:\n\n• Jueves 10am MX\n• Viernes 4pm MX\n\nMándame cuál te late y te paso link de Meet.\n\nSi prefieres antes hacer una llamada rápida de 5 min para ver si tiene sentido siquiera la demo, mismo deal.\n\nCarlos`,
      },
    },
    {
      action_type: 'send_email_reply',
      priority: 'high',
      contact: replyToPricingQuestion,
      ageHours: 12,
      confidence: 0.85,
      reasoning: `${replyToPricingQuestion.first_name} preguntó pricing directo. Respuesta directa y honesta = señal de confianza. No vender, no esquivar.`,
      hooks: [
        `Preguntó pricing → señal de interés real, no curiosidad`,
        `Empresa ${replyToPricingQuestion.company_size}`,
      ],
      content: {
        to: replyToPricingQuestion.email,
        subject: `Re: Pricing FlorioIn`,
        body: `Hola ${replyToPricingQuestion.first_name},\n\nMuy simple — solo hay un plan:\n\n• $5 USD por seat al mes (mensual)\n• $4 USD por seat al mes si pagan anual (pago adelantado, 20% off)\n\nNo hay tiers, no hay add-ons, no hay descuentos especiales. Esa es la promesa.\n\nPara un equipo de tu tamaño se va alrededor de $XX/mes. Si tiene sentido, agendamos una demo de 15 min y lo viven.\n\nCarlos`,
      },
    },
    {
      action_type: 'send_cold_email',
      priority: 'normal',
      contact: coldOutreachResearch,
      ageHours: 24,
      confidence: 0.78,
      reasoning: `${coldOutreachResearch.first_name} encaja ICP (${coldOutreachResearch.company_name}, ${coldOutreachResearch.company_size}, ${coldOutreachResearch.company_industry}). Investigación previa identificó señal específica. Cold email iniciá conversación sin pitch agresivo.`,
      hooks: coldOutreachResearch.ai_personalization_hooks ?? [],
      content: {
        to: coldOutreachResearch.email,
        subject: `${coldOutreachResearch.first_name}, una idea desde México`,
        body: `Hola ${coldOutreachResearch.first_name},\n\nVi tu trabajo en ${coldOutreachResearch.company_name}. Construyo desde México un workspace para agencias creativas que unifica approvals cross-channel — porque sé lo que cuesta perder un OK importante entre WhatsApp y email.\n\nPricing simple: $5 USD/seat mensual, $4 USD anual.\n\n¿Te haría sentido un café virtual de 15 min? Si no, totalmente entiendo.\n\nCarlos\nFounder, FlorioIn\nflorioin.app`,
      },
    },
    {
      action_type: 'trial_reminder_day25',
      priority: 'urgent',
      contact: trialDay25,
      deal: trialDay25Deal,
      ageHours: 4,
      confidence: 0.95,
      reasoning: `${trialDay25.full_name} en día 25 del trial. Próximos 5 días son make-or-break. Tono comprensivo, no presión. Recordar que el trial es real (sin tarjeta) y que el founder está disponible para dudas.`,
      hooks: [
        `Trial empezó hace 25 días`,
        `Empresa ${trialDay25.company_name} con ${trialDay25Deal?.expected_seats ?? '?'} seats esperados`,
        `MRR esperado: $${trialDay25Deal?.expected_mrr ?? '?'} USD/mes`,
      ],
      content: {
        to: trialDay25.email,
        subject: `${trialDay25.first_name}, faltan 5 días para que termine tu trial`,
        body: `Hola ${trialDay25.first_name},\n\nUn aviso amistoso: faltan 5 días para que termine tu trial de FlorioIn en ${trialDay25.company_name}.\n\nNo te escribo para meterte prisa. Te escribo para preguntar de a de veras: ¿está funcionando? ¿algo te está estorbando que pueda resolver yo personalmente?\n\nSi quieres seguir, el plan es $5 USD por seat mensual o $4 anual. Si no, también está bien — déjame saber qué te faltó.\n\nUn abrazo,\nCarlos`,
      },
    },
    {
      action_type: 'trial_reminder_day14',
      priority: 'normal',
      contact: trialDay14,
      deal: trialDay14Deal,
      ageHours: 18,
      confidence: 0.82,
      reasoning: `${trialDay14.first_name} a mitad de trial. Buen momento para check-in genuino sin vender.`,
      hooks: [
        'Mitad del trial — momento de check-in honesto',
        `${trialDay14.company_name} tiene ${trialDay14Deal?.expected_seats ?? '?'} seats activos`,
      ],
      content: {
        to: trialDay14.email,
        subject: `${trialDay14.first_name}, mitad del trial — ¿cómo va?`,
        body: `Hola ${trialDay14.first_name},\n\nLlevas 14 días con FlorioIn en ${trialDay14.company_name}. Te escribo solo para preguntar: ¿qué tal va?\n\nSi algo se siente raro o falta algo concreto, dímelo. Construyo solo desde México y el feedback de los primeros equipos como el tuyo es literalmente lo que ajusta el producto cada semana.\n\nUn abrazo,\nCarlos`,
      },
    },
    {
      action_type: 'failed_payment_reminder',
      priority: 'high',
      contact: failedPaymentCustomer,
      deal: failedPaymentDeal,
      ageHours: 8,
      confidence: 0.9,
      reasoning: `Pago falló para ${failedPaymentCustomer.company_name}. Tono comprensivo — puede ser tarjeta vencida, no necesariamente intención de cancelar. NUNCA mencionar consecuencias agresivamente.`,
      hooks: [
        `Cliente activo desde hace 60+ días`,
        `${failedPaymentDeal?.actual_seats} seats activos`,
        'Pago fallido — probablemente tarjeta vencida',
      ],
      content: {
        to: failedPaymentCustomer.email,
        subject: `${failedPaymentCustomer.first_name}, falló el pago — probablemente tarjeta`,
        body: `Hola ${failedPaymentCustomer.first_name},\n\nQuería avisarte personalmente: Stripe rechazó el último cargo de FlorioIn para ${failedPaymentCustomer.company_name}. Casi siempre es tarjeta vencida o nuevo plástico.\n\nActualizas el método aquí: app.florioin.app/billing\n\nSi hay algo más complicado, me dices y lo vemos juntos. Sin prisa.\n\nCarlos`,
      },
    },
    {
      action_type: 'schedule_demo',
      priority: 'high',
      contact: demoScheduled,
      ageHours: 16,
      confidence: 0.86,
      reasoning: `Demo agendada con ${demoScheduled.full_name}. Mandar confirmación + link Meet + 1 documento sobre la agencia (research) para que sienta que vas preparado.`,
      hooks: [
        `Demo agendada para próximos días`,
        `${demoScheduled.role} de ${demoScheduled.company_name}`,
      ],
      content: {
        to: demoScheduled.email,
        subject: `Confirmado — demo con ${demoScheduled.company_name}`,
        body: `Hola ${demoScheduled.first_name},\n\nConfirmado el slot. Te mando link de Meet y agenda corta para que la demo sea valiosa:\n\n• 5 min — qué buscan resolver (ustedes hablan)\n• 5 min — cómo FlorioIn lo aborda (yo demuestro)\n• 5 min — números y siguientes pasos\n\nSi quieres mandarme antes 2-3 dolores concretos que tienen hoy, mejor lo customizo.\n\nNos vemos.\n\nCarlos`,
      },
    },
    {
      action_type: 'send_linkedin_dm',
      priority: 'normal',
      contact: linkedinDm,
      ageHours: 36,
      confidence: 0.74,
      reasoning: `${linkedinDm.first_name} encaja ICP pero no ha respondido a email. LinkedIn DM corto puede romper el hielo. No spam — mensaje específico al perfil.`,
      hooks: [
        'Cold + no respuesta email previa',
        `${linkedinDm.company_name} tamaño ${linkedinDm.company_size}`,
      ],
      content: {
        platform: 'linkedin',
        to_profile: linkedinDm.linkedin_url,
        body: `Hola ${linkedinDm.first_name}, te escribí por email hace unos días pero igual te dejo aquí: construyo desde México un workspace para agencias creativas (${linkedinDm.company_size}+ personas). Si tienes 10 min algún día, me encantaría aprender de ${linkedinDm.company_name}. Sin pitch.`,
      },
    },
    {
      action_type: 'send_email_followup',
      priority: 'normal',
      contact: followUp,
      ageHours: 48,
      confidence: 0.71,
      reasoning: `${followUp.first_name} recibió cold email hace 7 días sin respuesta. Follow-up suave con ángulo diferente (no repetir mismo argumento).`,
      hooks: [
        'No respondió primer email',
        'Segundo intento con ángulo distinto',
      ],
      content: {
        to: followUp.email,
        subject: `${followUp.first_name}, una pregunta rápida`,
        body: `Hola ${followUp.first_name},\n\nTe escribí la semana pasada — sé que el inbox es brutal. Una sola pregunta: ¿cómo manejan hoy los approvals cuando un cliente da feedback por WhatsApp y otro por email?\n\nSi la respuesta es "como podemos", quizá vale la pena que conozcas FlorioIn. Si tienen ya algo sólido, perfecto, te dejo de molestar.\n\nCarlos`,
      },
    },
    {
      action_type: 'churn_recovery_email',
      priority: 'low',
      contact: churnRecovery,
      ageHours: 72,
      confidence: 0.68,
      reasoning: `${churnRecovery.first_name} se perdió hace ~60 días. Email de "qué te faltó" es genuino — no para vender, para aprender. Confidence menor a 0.7 → marcado requires_approval forzado.`,
      hooks: [
        'Lost hace ~2 meses',
        'Pregunta genuina, no recovery pitch',
      ],
      content: {
        to: churnRecovery.email,
        subject: `${churnRecovery.first_name}, una pregunta honesta`,
        body: `Hola ${churnRecovery.first_name},\n\nSé que no fuimos lo que ${churnRecovery.company_name} necesitaba. ¿Tendrías 3 minutos para decirme qué te faltó? No estoy reabriendo conversación de venta — quiero ajustar el producto.\n\nGracias de cualquier forma.\n\nCarlos`,
      },
    },
    {
      action_type: 'seat_change_notification',
      priority: 'low',
      contact: seatChange,
      deal: seatChangeDeal,
      ageHours: 30,
      confidence: 0.83,
      reasoning: `${seatChange.company_name} cambió cantidad de seats. Acknowledge sin presionar — Stripe ya cobró proporcional. Solo es señal de que el founder ve y le importa.`,
      hooks: [
        'Cambio de seats reciente',
        `${seatChangeDeal?.actual_seats} seats ahora`,
      ],
      content: {
        to: seatChange.email,
        subject: 'Cambio de seats — todo bien',
        body: `Hola ${seatChange.first_name},\n\nVi el ajuste de seats en ${seatChange.company_name}. Stripe ya prorrateó el cargo, todo bien.\n\nSi el cambio refleja algo que debería saber (crecieron, alguien salió, etc.), te leo.\n\nCarlos`,
      },
    },
  ];

  // ----- materialize rows -----
  return drafts.map((d) => {
    const requiresApproval = d.confidence < 0.7 || true; // always require approval in this Hub
    return {
      id: rng.uuid(),
      action_type: d.action_type,
      contact_id: d.contact.id,
      deal_id: d.deal?.id ?? null,
      priority: d.priority,
      ai_generated_content: d.content,
      ai_reasoning: d.reasoning,
      ai_personalization_used: d.hooks,
      ai_confidence_score: d.confidence,
      status: 'pending',
      requires_approval: requiresApproval,
      scheduled_for: null,
      approved_at: null,
      rejected_at: null,
      rejection_reason: null,
      edited_by_human: false,
      final_content: null,
      executed_at: null,
      execution_result: null,
      expires_at: iso(hoursAgo(-48 + d.ageHours)),
      created_at: iso(d.ageHours < 24 ? hoursAgo(d.ageHours) : daysAgo(Math.floor(d.ageHours / 24))),
    };
  });
}
