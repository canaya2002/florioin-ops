#!/usr/bin/env node
/**
 * Wraps `supabase gen types typescript` so we can regenerate
 * packages/ops-db/src/types.gen.ts from the live database.
 *
 * Until creds are wired, the hand-written packages/ops-db/src/types.ts
 * mirrors the SQL migration 1:1 and is the source of truth.
 *
 * Usage:
 *   pnpm gen-types         # requires SUPABASE_PROJECT_ID + access token
 */
import '../seed/lib/load-env';
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PKG_ROOT } from '../seed/lib/paths';

const PROJECT_ID =
  process.env.SUPABASE_PROJECT_ID ??
  // derive from public URL if available
  (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!PROJECT_ID) {
  console.error(
    '[gen-types] SUPABASE_PROJECT_ID not set, and could not derive from NEXT_PUBLIC_SUPABASE_URL.',
  );
  process.exit(1);
}

const OUT_PATH = resolve(PKG_ROOT, 'src/types.gen.ts');

try {
  const sql = execSync(
    `npx supabase gen types typescript --project-id ${PROJECT_ID} --schema ops --schema public`,
    { stdio: ['ignore', 'pipe', 'inherit'] },
  ).toString();
  writeFileSync(OUT_PATH, sql);
  console.info(`[gen-types] wrote ${OUT_PATH}`);
} catch (err) {
  console.error('[gen-types] failed:', err);
  process.exit(1);
}
