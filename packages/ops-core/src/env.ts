import { z } from 'zod';

/**
 * Env vars schema.
 * Validated lazily — server-only env is checked when accessed.
 * Empty per-source mock flag => inherit USE_MOCK_DATA.
 */

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // Mock global
  USE_MOCK_DATA: z
    .string()
    .optional()
    .transform((v) => v === 'true'),

  // Supabase (public)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),

  // Auth
  NEXT_PUBLIC_FOUNDER_EMAIL: z.string().email().default('carlos@florioin.app'),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  USE_MOCK_DATA: process.env.USE_MOCK_DATA,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_FOUNDER_EMAIL: process.env.NEXT_PUBLIC_FOUNDER_EMAIL,
});

/**
 * Resolve per-source mock flag. Empty per-source flag => inherit global.
 */
export function isMock(source: string): boolean {
  const key = `USE_MOCK_${source.toUpperCase()}` as const;
  const perSource = process.env[key];
  if (perSource === 'true') return true;
  if (perSource === 'false') return false;
  return env.USE_MOCK_DATA;
}
