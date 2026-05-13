#!/usr/bin/env node
/**
 * Truncate every ops.* table. No seeding, just clearing.
 *
 * Usage: pnpm seed:clear
 */
import '../seed/lib/load-env';
import { createAdminClient, hasAdminCreds } from '../seed/lib/admin-client';
import { SEED_TABLE_ORDER } from '../seed/generate';

async function main() {
  if (!hasAdminCreds()) {
    console.error('[reset] Missing SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }
  const admin = createAdminClient('ops');
  const reverseOrder = [...SEED_TABLE_ORDER].reverse();

  for (const table of reverseOrder) {
    const { error } = await admin
      .from(table)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (error) {
      console.error(`[reset] clear ${table} failed:`, error.message);
      process.exit(1);
    }
    process.stdout.write(`  ✓ cleared ops.${table}\n`);
  }
  console.info('\n[reset] done.');
}

main().catch((err) => {
  console.error('[reset] fatal:', err);
  process.exit(1);
});
