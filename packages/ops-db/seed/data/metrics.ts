import type { MetricRow } from '../../src/types';
import { daysAgo, iso } from '../lib/dates';
import { SeededRandom } from '../lib/random';

export type SeedMetric = MetricRow;

interface MetricSpec {
  source: MetricRow['source'];
  metric_name: string;
  /** Returns the value for offsetDaysAgo (0 = today). */
  generator: (rng: SeededRandom, dayIdx: number) => number;
  dimension_1?: string;
  period: MetricRow['period'];
}

/**
 * 30 daily metrics: 6 metric types × 5 last days = 30 rows.
 * Values mirror the early-stage Florioin reality:
 *   - MRR climbing from $204 → $284
 *   - Trials 5 → 6
 *   - Sessions ~80-130/day
 *   - Cold email reply rate ~5%
 */
const SPECS: MetricSpec[] = [
  {
    source: 'stripe',
    metric_name: 'mrr_usd',
    generator: (_rng, dayIdx) => 204 + dayIdx * 16,
    period: 'daily',
  },
  {
    source: 'florioin_db',
    metric_name: 'active_trials',
    generator: (rng, dayIdx) => 5 + Math.floor((dayIdx * 0.3) + rng.range(0, 0.6)),
    period: 'daily',
  },
  {
    source: 'ga4',
    metric_name: 'sessions',
    generator: (rng, dayIdx) => Math.floor(90 + dayIdx * 6 + rng.range(-15, 25)),
    period: 'daily',
  },
  {
    source: 'apollo',
    metric_name: 'cold_emails_sent',
    generator: (rng, _dayIdx) => Math.floor(rng.range(40, 75)),
    period: 'daily',
  },
  {
    source: 'apollo',
    metric_name: 'cold_email_replies',
    generator: (rng, dayIdx) => Math.floor(rng.range(2, 5) + dayIdx * 0.2),
    period: 'daily',
  },
  {
    source: 'whatsapp',
    metric_name: 'inbound_messages',
    generator: (rng, dayIdx) => Math.floor(rng.range(1, 4) + dayIdx * 0.4),
    period: 'daily',
  },
];

export function buildMetrics(rng: SeededRandom): SeedMetric[] {
  const out: SeedMetric[] = [];
  // dayIdx 0 = 4 days ago, 4 = today (so values grow toward today)
  for (let dayIdx = 0; dayIdx < 5; dayIdx++) {
    const captured = daysAgo(4 - dayIdx);
    for (const spec of SPECS) {
      out.push({
        id: rng.uuid(),
        source: spec.source,
        metric_name: spec.metric_name,
        value: spec.generator(rng, dayIdx),
        dimension_1: spec.dimension_1 ?? null,
        dimension_2: null,
        metadata: {},
        captured_at: iso(captured),
        period: spec.period,
      });
    }
  }
  return out;
}
