import type { AiInsightRow } from '../../src/types';
import { daysAgo, iso } from '../lib/dates';
import { SeededRandom } from '../lib/random';

export type SeedInsight = AiInsightRow;

/**
 * 5 hand-crafted AI insights — diverse categories, severities, types.
 * Each reads like a Chief of Staff observation, not a chart caption.
 */
export function buildInsights(rng: SeededRandom): SeedInsight[] {
  return [
    {
      id: rng.uuid(),
      category: 'sales',
      insight_type: 'opportunity',
      severity: 'notice',
      title: 'Hot leads concentrados en agencias 5-15 personas, no 40+',
      summary:
        'Las últimas 8 respuestas calientes vinieron de agencias de 5-15 personas. Las agencias 40+ contestan menos, aunque pagan más alto.',
      detailed_analysis:
        'Análisis sobre últimos 14 días: 8 hot leads, 7 de agencias size 5-15, 1 de size 16-40. Las agencias grandes responden 2.3x menos al primer cold email. Hipótesis: founders chicos sienten el dolor más agudo de coordinación cross-channel.\n\nRecomendación: enfocar próximos cold batches en agencias 5-15. ARR esperado por cliente menor pero conversión más alta. CAC efectivo probablemente mejor.',
      data_points: {
        leads_by_size: { '5-15': 7, '16-40': 1, '41-100': 0, '101-200': 0 },
        conversion_rate_by_size: { '5-15': 0.12, '16-40': 0.05 },
      },
      confidence_score: 0.78,
      generated_at: iso(daysAgo(1)),
      expires_at: null,
      acted_on: false,
      acted_on_at: null,
      related_contact_id: null,
      related_deal_id: null,
    },
    {
      id: rng.uuid(),
      category: 'finance',
      insight_type: 'trend',
      severity: 'info',
      title: 'Split anual vs mensual: 45% anual entre nuevos deals',
      summary:
        'De los últimos 4 deals cerrados, 2 eligieron plan anual (20% off). Más alto que el promedio histórico de 30%.',
      detailed_analysis:
        'Customers que eligen anual tienen LTV 2.4x mayor que mensual y churn ~0%. Si este patrón se mantiene, considerar destacar más visiblemente el ahorro anual en página de pricing.\n\nNo proponer descuento adicional — la promesa "$5 mensual / $4 anual" debe quedar estable.',
      data_points: {
        annual_pct_last_4: 0.5,
        annual_pct_historical: 0.3,
        annual_ltv_multiplier: 2.4,
      },
      confidence_score: 0.82,
      generated_at: iso(daysAgo(2)),
      expires_at: null,
      acted_on: false,
      acted_on_at: null,
      related_contact_id: null,
      related_deal_id: null,
    },
    {
      id: rng.uuid(),
      category: 'customer_success',
      insight_type: 'risk',
      severity: 'warning',
      title: '2 trials en zona crítica — día 25+',
      summary:
        'Hay 2 trials activos con más de 25 días corridos. Sin acción humana esta semana, probable pérdida.',
      detailed_analysis:
        'Trials que llegan al día 25 sin un check-in personal del founder convierten ~30%. Con check-in genuino (no template), conversión sube a ~58%.\n\nAcciones generadas en el queue: trial_reminder_day25 para los 2 casos, prioridad urgente.',
      data_points: {
        critical_trials: 2,
        baseline_conversion_no_checkin: 0.3,
        baseline_conversion_with_checkin: 0.58,
      },
      confidence_score: 0.86,
      generated_at: iso(daysAgo(0)),
      expires_at: iso(daysAgo(-5)),
      acted_on: false,
      acted_on_at: null,
      related_contact_id: null,
      related_deal_id: null,
    },
    {
      id: rng.uuid(),
      category: 'content',
      insight_type: 'recommendation',
      severity: 'info',
      title: 'Build-in-public outperforma educational en LinkedIn',
      summary:
        'Los 3 posts de build-in-public últimas 2 semanas tuvieron 3x el engagement de los educational. Vale doblar apuesta.',
      detailed_analysis:
        'Build-in-public: avg 4.2% engagement rate. Educational: avg 1.4%. La diferencia es tono founder-personal vs tono experto-distante.\n\nPara la próxima semana, Content Planner ya está priorizando build-in-public en lunes (mejor día). Si tienes logro concreto esta semana, vale 2 posts en lugar de 1.',
      data_points: {
        engagement_buildinpublic: 0.042,
        engagement_educational: 0.014,
        sample_size: 6,
      },
      confidence_score: 0.74,
      generated_at: iso(daysAgo(3)),
      expires_at: null,
      acted_on: false,
      acted_on_at: null,
      related_contact_id: null,
      related_deal_id: null,
    },
    {
      id: rng.uuid(),
      category: 'marketing',
      insight_type: 'anomaly',
      severity: 'notice',
      title: 'Pico de tráfico orgánico desde Querétaro y Mérida',
      summary:
        'GA4 muestra tráfico desde QRO y MID 4x del baseline últimas 72h. Sin campaña activa en esas ciudades.',
      detailed_analysis:
        'Geo desglose:\n  - CDMX: baseline\n  - GDL: baseline\n  - QRO: +320%\n  - MID: +280%\n  - MTY: -8%\n\nHipótesis: posiblemente referrals desde un newsletter o comunidad regional. Vale investigar fuente para amplificar.',
      data_points: {
        qro_growth: 3.2,
        mid_growth: 2.8,
        period_hours: 72,
      },
      confidence_score: 0.65,
      generated_at: iso(daysAgo(1)),
      expires_at: null,
      acted_on: false,
      acted_on_at: null,
      related_contact_id: null,
      related_deal_id: null,
    },
  ];
}
