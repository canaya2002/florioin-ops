#!/usr/bin/env node
/**
 * Applies SQL migrations from packages/ops-db/migrations/ to Supabase.
 *
 * Strategy:
 *   - Iterate migrations/*.sql in lexicographic order.
 *   - Each migration is wrapped in an `IF NOT EXISTS` guard already, so re-running is safe.
 *   - We execute via Supabase Postgres connection. Since the Supabase JS client doesn't
 *     expose raw SQL, this script uses the Postgres REST `query` endpoint OR
 *     falls back to instructing the founder to paste in SQL Editor.
 *
 * Usage:
 *   pnpm migrate          # auto if SUPABASE_DB_URL is set
 *   pnpm migrate --print  # just print the SQL to apply manually
 */
import '../seed/lib/load-env';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { MIGRATIONS_DIR } from '../seed/lib/paths';

const args = new Set(process.argv.slice(2));
const PRINT_ONLY = args.has('--print') || args.has('-p');

async function main() {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.error('[migrate] no .sql files found in', MIGRATIONS_DIR);
    process.exit(1);
  }

  if (PRINT_ONLY) {
    for (const f of files) {
      const path = resolve(MIGRATIONS_DIR, f);
      console.info(`\n-- ${f}\n`);
      console.info(readFileSync(path, 'utf8'));
    }
    return;
  }

  // Direct DB execution requires `SUPABASE_DB_URL` (Postgres connection string,
  // not the REST URL). If absent, fall back to print-only with instructions.
  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    console.warn(
      '\n[migrate] SUPABASE_DB_URL not set — cannot apply automatically.\n' +
        '\nApply the migration manually:\n' +
        '  1. Open Supabase Dashboard → SQL Editor\n' +
        '  2. Paste contents of:\n',
    );
    for (const f of files) {
      console.info(`     packages/ops-db/migrations/${f}`);
    }
    console.info('\n  3. Run. The migration is idempotent (IF NOT EXISTS).\n');
    console.info('Or set SUPABASE_DB_URL=postgres://... and rerun.\n');
    process.exit(0);
  }

  // Lazy import so this script works without the `pg` dep when in print mode.
  let Client: typeof import('pg').Client;
  try {
    const pg = await import('pg');
    Client = pg.Client;
  } catch {
    console.error(
      '[migrate] `pg` not installed. Run `pnpm add -D pg @types/pg -F @florioin-ops/ops-db`',
    );
    process.exit(1);
  }

  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  try {
    for (const f of files) {
      const sql = readFileSync(resolve(MIGRATIONS_DIR, f), 'utf8');
      process.stdout.write(`[migrate] applying ${f}... `);
      await client.query(sql);
      process.stdout.write('OK\n');
    }
    console.info('[migrate] done.');
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error('[migrate] fatal:', err);
  process.exit(1);
});
