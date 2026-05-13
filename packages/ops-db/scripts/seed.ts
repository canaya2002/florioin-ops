#!/usr/bin/env node
/**
 * Writes the seed dataset to Supabase via the service-role key.
 * Idempotent: if `--reset` is passed, truncates ops.* first.
 *
 *   pnpm seed              → upsert (preserves existing edits)
 *   pnpm seed:reset        → DELETE FROM all tables, then insert clean
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in env.
 */
import '../seed/lib/load-env';
import { createAdminClient, hasAdminCreds } from '../seed/lib/admin-client';
import { generateSeedData, countDataset, SEED_TABLE_ORDER, type SeedTable } from '../seed/generate';
import { sanitizeRows } from '../seed/sanitize';

const args = new Set(process.argv.slice(2));
const RESET = args.has('--reset') || args.has('-r');

async function main() {
  if (!hasAdminCreds()) {
    console.error(
      '\n[seed] Missing Supabase credentials.\n' +
        'Set SUPABASE_SERVICE_ROLE_KEY (and NEXT_PUBLIC_SUPABASE_URL) in .env.local,\n' +
        'or run `pnpm seed:json` to dump to disk without DB.\n',
    );
    process.exit(1);
  }

  const dataset = generateSeedData();
  const counts = countDataset(dataset);
  console.info(`[seed] generated dataset:`, counts);

  const admin = createAdminClient('ops');

  if (RESET) {
    console.info('[seed] --reset: clearing ops.* tables in reverse FK order');
    const reverseOrder = [...SEED_TABLE_ORDER].reverse();
    for (const table of reverseOrder) {
      const { error } = await admin
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) {
        console.error(`[seed] clear ${table} failed:`, error.message);
        process.exit(1);
      }
      process.stdout.write(`  ✓ cleared ops.${table}\n`);
    }
  }

  for (const table of SEED_TABLE_ORDER) {
    const rows = sanitizeRows(table, dataset[table as SeedTable]);
    if (rows.length === 0) continue;
    // Chunk inserts so we don't hit payload limits.
    const CHUNK = 200;
    for (let i = 0; i < rows.length; i += CHUNK) {
      const slice = rows.slice(i, i + CHUNK);
      const { error } = await admin.from(table).upsert(slice, { onConflict: 'id' });
      if (error) {
        console.error(`[seed] upsert ops.${table} failed at chunk ${i}:`, error.message);
        console.error('first row sample:', JSON.stringify(slice[0], null, 2).slice(0, 800));
        process.exit(1);
      }
    }
    process.stdout.write(`  ✓ ops.${table}: ${rows.length} rows\n`);
  }

  console.info('\n[seed] done.');
}

main().catch((err) => {
  console.error('[seed] fatal:', err);
  process.exit(1);
});
