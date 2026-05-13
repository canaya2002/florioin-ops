export const FOUNDER_EMAIL = 'carlos@florioin.app' as const;

export const OPS_SCHEMA = 'ops' as const;

export const INTEGRATION_SOURCES = [
  'apollo',
  'gmail',
  'calendar',
  'whatsapp',
  'stripe',
  'florioin_db',
  'ga4',
  'gsc',
  'vercel',
  'instagram',
  'tiktok',
] as const;

export type IntegrationSource = (typeof INTEGRATION_SOURCES)[number];
