import type { ReportRow } from '../../src/types';
import { SEED_NOW, daysAgo, iso, isoDate } from '../lib/dates';
import { SeededRandom } from '../lib/random';

export type SeedReport = ReportRow;

const CEO_BRIEF_MARKDOWN = `# 🎯 CEO DAILY BRIEF — ${new Intl.DateTimeFormat('es-MX', {
  timeZone: 'America/Mexico_City',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(SEED_NOW)}

## OVERVIEW DEL DÍA
- 2 trials en día 25+ — momento make-or-break esta semana
- 6 hot leads activos del último batch Apollo
- MRR $284 USD (+$80 vs semana pasada con anual nuevo de Bandera Roja)
- 12 acciones esperando approval en queue, 3 urgentes

## 📊 NÚMEROS CLAVE
- MRR: $284 USD (+39% MoM)
- Trials activos: 6 (2 en zona crítica día 25+)
- Pipeline value: $1,420 USD MRR esperado
- Acciones pendientes approval: 12

## 🔥 PRIORIDADES DE HOY
1. Responder WhatsApp inbound de la mañana — lead urgente, ICP perfecto, espera <1h respuesta
2. Mandar trial_reminder_day25 a los 2 trials críticos (drafts ya listos en queue)
3. Approvar/editar respuesta al lead que preguntó pricing directo

## ⚠️ ALERTAS
- Trial de PixelStudio MX termina viernes — sin check-in personal, 70% probable lost

## 💡 INSIGHTS DE LA SEMANA
- Agencias 5-15 personas convirtien 2.3x más que 40+ — vale enfocar próximos cold batches
- Build-in-public en LinkedIn outperforma educational 3x — doblar apuesta esta semana

## 📅 AGENDA HOY
- 10:00 — Demo con Cardumen Creativo (preparé contexto en /sales)
- 14:00 — Llamada Tinta y Hueso (trial check-in)
- 17:30 — Investor coffee remoto

## 📝 CONTENIDO HOY
- 📝 **LinkedIn 8:00 AM** — Build-in-public: Lanzamos Smart Inbox con captura WhatsApp
- 📸 **Instagram 12:30 PM** — Feature spotlight Smart Inbox (carrousel 5 slides)
- Visual ya descrito en /content. Copy listo para copy-paste.

## 📨 PENDIENTES APPROVAL (12 total)
1. 🔥 WhatsApp reply — María de PixelStudio (urgente, 2h)
2. 🔥 Email reply — Diego de Cardumen, pidió slot esta semana
3. 🔥 Email reply — Lead pregunta pricing directo
4. ⏰ Trial day 25 — Sofía de Bandera Roja
5. ⏰ Trial day 14 — Equipo Manta
6. ⏰ Failed payment — Estación Veintidós (probablemente tarjeta vencida)
7. ⏰ Demo confirmation — Volcán Studio
8. 📨 Cold email — La Diabla (ICP fit alto)
9. 📨 LinkedIn DM — Loop & Co
10. 📨 Follow-up — Macondo Lab (segundo intento)
11. 📨 Churn recovery — La Mecha (pregunta honesta, no recovery pitch)
12. 📨 Seat change ack — Estudio Octopus

## 🎬 ACCIÓN INMEDIATA
**Responder el WhatsApp de María de PixelStudio antes de las 10:30 AM.** Es la conversión más alta probabilidad del día — espera respuesta urgente, ICP perfecto, founder directo. El draft está listo en /actions, solo necesita tu OK.
`;

const WEEKLY_RECAP_MARKDOWN = `# 📊 WEEKLY RECAP — Semana ${isoDate(daysAgo(7))} → ${isoDate(daysAgo(0))}

## NUMBERS
- MRR: $284 USD (+39% vs semana pasada)
- Nuevos trials: 3
- Nuevos customers: 1 (Bandera Roja, anual, 8 seats, $32 MRR)
- Cold emails enviados: 287
- Reply rate: 5.2%
- Demos agendadas: 4
- Demos realizadas: 3
- Pipeline net change: +$340 MRR esperado

## QUÉ FUNCIONÓ
1. **Lanzamiento Smart Inbox** generó 3 demos directas vía LinkedIn build-in-public post
2. **Trial day-25 check-in personal** convirtió 2 de 3 (Bandera Roja firmó anual)
3. **Foco en agencias 5-15 personas** dio mejor conversión que intentar grandes

## QUÉ NO FUNCIONÓ
1. Follow-up email genérico tuvo 1.8% reply rate — necesita más personalización
2. Demo de jueves canceló a última hora — habría que reconfirmar mañana del día
3. TikTok post de domingo bajo rendimiento (<800 views) — hook no funcionó

## PRÓXIMA SEMANA
1. **2 trials críticos** en día 25-30 requieren check-in personal lunes/martes
2. **Apollo batch nuevo** apuntado a agencias 5-15 en CDMX/GDL
3. **Content planner** ya generó plan semana próxima: 3 LI + 4 IG + 2 TT
4. **Investor update mensual** vence próximo lunes — preparar borrador esta semana

## RIESGO
- Si los 2 trials críticos no convierten, MRR puede caer a $260 (-8%) próxima semana
- Acción mitigación: drafts personalizados ya en queue

— Generado por chief-of-staff processor
`;

export function buildReports(rng: SeededRandom): SeedReport[] {
  return [
    {
      id: rng.uuid(),
      report_type: 'ceo_daily_brief',
      period_start: isoDate(daysAgo(0)),
      period_end: isoDate(daysAgo(0)),
      content_markdown: CEO_BRIEF_MARKDOWN,
      content_html: null,
      key_metrics: {
        mrr_usd: 284,
        active_trials: 6,
        critical_trials: 2,
        pipeline_mrr: 1420,
        pending_actions: 12,
        urgent_actions: 3,
      },
      top_actions: [
        'Responder WhatsApp inbound urgente',
        'Trial day-25 check-ins (×2)',
        'Demo confirmation Volcán Studio',
      ],
      shareable_link: null,
      shareable_link_expires_at: null,
      shareable_link_password_hash: null,
      shareable_link_viewed_count: 0,
      shareable_link_last_viewed_at: null,
      sent_at: iso(daysAgo(0)),
      sent_channel: 'email',
      recipients: ['carlos@florioin.app'],
      created_at: iso(daysAgo(0)),
    },
    {
      id: rng.uuid(),
      report_type: 'sales_weekly',
      period_start: isoDate(daysAgo(7)),
      period_end: isoDate(daysAgo(0)),
      content_markdown: WEEKLY_RECAP_MARKDOWN,
      content_html: null,
      key_metrics: {
        mrr_usd: 284,
        mrr_growth_pct: 0.39,
        new_trials: 3,
        new_customers: 1,
        cold_emails_sent: 287,
        reply_rate: 0.052,
      },
      top_actions: [
        'Check-in los 2 trials críticos lunes/martes',
        'Apollo batch agencias 5-15 CDMX/GDL',
        'Preparar investor update mensual',
      ],
      shareable_link: null,
      shareable_link_expires_at: null,
      shareable_link_password_hash: null,
      shareable_link_viewed_count: 0,
      shareable_link_last_viewed_at: null,
      sent_at: iso(daysAgo(0)),
      sent_channel: 'email',
      recipients: ['carlos@florioin.app'],
      created_at: iso(daysAgo(0)),
    },
  ];
}
