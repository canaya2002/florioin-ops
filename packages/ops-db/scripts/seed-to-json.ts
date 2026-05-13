#!/usr/bin/env node
/**
 * Dumps the seed dataset to JSON files under packages/ops-db/fixtures/.
 * Use case:
 *   - Validate seed without DB creds (this is the Phase 2 acceptance test).
 *   - Phase 3-4 mock mode reads these fixtures directly.
 *
 * Usage: pnpm seed:json
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FIXTURES_DIR } from '../seed/lib/paths';
import { generateSeedData, countDataset, SEED_TABLE_ORDER, type SeedTable } from '../seed/generate';
import { sanitizeRows } from '../seed/sanitize';

function main() {
  const dataset = generateSeedData();
  const counts = countDataset(dataset);

  mkdirSync(FIXTURES_DIR, { recursive: true });

  // One JSON file per table — easier to spot-check, Git diff, and import.
  for (const table of SEED_TABLE_ORDER) {
    const rows = sanitizeRows(table, dataset[table as SeedTable]);
    const path = resolve(FIXTURES_DIR, `${table}.json`);
    writeFileSync(path, JSON.stringify(rows, null, 2));
    process.stdout.write(`  ✓ ${table}.json (${rows.length} rows)\n`);
  }

  // Manifest with counts so consumers can verify integrity.
  writeFileSync(
    resolve(FIXTURES_DIR, 'manifest.json'),
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        counts,
      },
      null,
      2,
    ),
  );

  console.info('\n[seed:json] done.');
  console.info(`  total rows: ${counts.total}`);
  console.info(`  fixtures:   ${FIXTURES_DIR}`);
}

try {
  main();
} catch (err) {
  console.error('[seed:json] fatal:', err);
  process.exit(1);
}
