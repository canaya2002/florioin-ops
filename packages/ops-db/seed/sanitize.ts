import type { SeedDataset } from './generate';

/**
 * Strip internal-only fields (those prefixed with `_`) so the row matches
 * the SQL table shape exactly.
 */
function stripInternal<T extends Record<string, unknown>>(row: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (!k.startsWith('_')) out[k] = v;
  }
  return out;
}

export function sanitizeRows(table: keyof SeedDataset, rows: unknown[]): Record<string, unknown>[] {
  return rows.map((r) => stripInternal(r as Record<string, unknown>));
}
