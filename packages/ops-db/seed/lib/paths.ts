import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

/**
 * Resolve paths relative to this package, regardless of cwd at runtime.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const PKG_ROOT = resolve(__dirname, '..', '..');
export const MIGRATIONS_DIR = resolve(PKG_ROOT, 'migrations');
export const FIXTURES_DIR = resolve(PKG_ROOT, 'fixtures');
