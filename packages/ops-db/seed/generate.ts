/**
 * Pure orchestrator — produces the full seed dataset without touching any I/O.
 * Both `seed.ts` (writes to DB) and `seed-to-json.ts` (writes to disk) call
 * into this. Same generator → same data, regardless of destination.
 */
import { SEED, SeededRandom } from './lib/random';
import { buildContacts, type SeedContact } from './data/contacts';
import { buildConversations, type SeedConversation } from './data/conversations';
import { buildDeals, type SeedDeal } from './data/deals';
import { buildEvents, type SeedEvent } from './data/events';
import { buildActions, type SeedAction } from './data/actions';
import { buildContentPlan, type SeedContentPost } from './data/content-plan';
import { buildMetrics, type SeedMetric } from './data/metrics';
import { buildInsights, type SeedInsight } from './data/insights';
import { buildReports, type SeedReport } from './data/reports';
import { buildIntegrations, type SeedIntegration } from './data/integrations';

export interface SeedDataset {
  contacts: SeedContact[];
  conversations: SeedConversation[];
  deals: SeedDeal[];
  events: SeedEvent[];
  actions_queue: SeedAction[];
  content_plan: SeedContentPost[];
  metrics: SeedMetric[];
  ai_insights: SeedInsight[];
  reports: SeedReport[];
  integrations: SeedIntegration[];
}

export interface SeedCounts {
  contacts: number;
  conversations: number;
  deals: number;
  events: number;
  actions_queue: number;
  content_plan: number;
  metrics: number;
  ai_insights: number;
  reports: number;
  integrations: number;
  total: number;
}

export function generateSeedData(seed: number = SEED): SeedDataset {
  const rng = new SeededRandom(seed);

  // Order matters: contacts first, then everything that references them.
  const contacts = buildContacts(rng);
  const deals = buildDeals(rng, contacts);
  const conversations = buildConversations(rng, contacts);
  const events = buildEvents(rng, contacts, deals);
  const actions_queue = buildActions(rng, contacts, deals);
  const content_plan = buildContentPlan(rng);
  const metrics = buildMetrics(rng);
  const ai_insights = buildInsights(rng);
  const reports = buildReports(rng);
  const integrations = buildIntegrations(rng);

  return {
    contacts,
    conversations,
    deals,
    events,
    actions_queue,
    content_plan,
    metrics,
    ai_insights,
    reports,
    integrations,
  };
}

export function countDataset(dataset: SeedDataset): SeedCounts {
  const c: SeedCounts = {
    contacts: dataset.contacts.length,
    conversations: dataset.conversations.length,
    deals: dataset.deals.length,
    events: dataset.events.length,
    actions_queue: dataset.actions_queue.length,
    content_plan: dataset.content_plan.length,
    metrics: dataset.metrics.length,
    ai_insights: dataset.ai_insights.length,
    reports: dataset.reports.length,
    integrations: dataset.integrations.length,
    total: 0,
  };
  c.total =
    c.contacts +
    c.conversations +
    c.deals +
    c.events +
    c.actions_queue +
    c.content_plan +
    c.metrics +
    c.ai_insights +
    c.reports +
    c.integrations;
  return c;
}

/** Tables in insertion order — respects foreign keys. */
export const SEED_TABLE_ORDER = [
  'integrations',
  'metrics',
  'contacts',
  'deals',
  'conversations',
  'events',
  'actions_queue',
  'content_plan',
  'ai_insights',
  'reports',
] as const;

export type SeedTable = (typeof SEED_TABLE_ORDER)[number];
