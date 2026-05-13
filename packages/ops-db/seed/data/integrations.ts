import type { IntegrationRow } from '../../src/types';
import { iso } from '../lib/dates';
import { INTEGRATION_SOURCES } from '../../src/constants';
import { SeededRandom } from '../lib/random';

export type SeedIntegration = IntegrationRow;

const FREQUENCIES: Record<string, number> = {
  apollo: 60,
  gmail: 30,
  calendar: 15,
  whatsapp: 5,
  stripe: 30,
  florioin_db: 15,
  ga4: 1440,
  gsc: 1440,
  vercel: 120,
  instagram: 360,
  tiktok: 360,
};

export function buildIntegrations(rng: SeededRandom): SeedIntegration[] {
  const now = new Date();
  return INTEGRATION_SOURCES.map((source) => ({
    id: rng.uuid(),
    source,
    status: 'mock',
    mock_mode: true,
    config: {},
    last_sync_at: iso(new Date(now.getTime() - 1000 * 60 * 5)),
    last_error: null,
    next_sync_at: iso(new Date(now.getTime() + 1000 * 60 * (FREQUENCIES[source] ?? 60))),
    sync_frequency_minutes: FREQUENCIES[source] ?? 60,
    total_records_synced: 0,
    created_at: iso(now),
    updated_at: iso(now),
  }));
}
