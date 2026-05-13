/**
 * Load env from repo-root .env.local for seed/migration scripts.
 * Imported at the top of each script.
 */
import { config } from 'dotenv';
import { resolve } from 'node:path';
import { PKG_ROOT } from './paths';

// Walk up to repo root: packages/ops-db → ../../
const repoRoot = resolve(PKG_ROOT, '..', '..');
config({ path: resolve(repoRoot, '.env.local'), quiet: true });
config({ path: resolve(repoRoot, '.env'), quiet: true });
