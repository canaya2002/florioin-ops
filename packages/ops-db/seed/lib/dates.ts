/**
 * Date helpers for seed generation. "Now" is anchored — set the SEED_NOW env
 * var to lock the dataset to a specific moment, otherwise uses real now.
 */

export const SEED_NOW = process.env.SEED_NOW ? new Date(process.env.SEED_NOW) : new Date();

export function daysAgo(n: number): Date {
  const d = new Date(SEED_NOW);
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

export function hoursAgo(n: number): Date {
  const d = new Date(SEED_NOW);
  d.setUTCHours(d.getUTCHours() - n);
  return d;
}

export function daysFromNow(n: number): Date {
  return daysAgo(-n);
}

export function iso(d: Date): string {
  return d.toISOString();
}

export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Monday (UTC) of the week that contains `date`. Returns YYYY-MM-DD. */
export function mondayOf(date: Date = SEED_NOW): string {
  const d = new Date(date);
  const day = d.getUTCDay(); // 0 = Sun
  const diff = (day === 0 ? -6 : 1) - day;
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return isoDate(d);
}

export function addDays(date: Date | string, n: number): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setUTCDate(d.getUTCDate() + n);
  return d;
}
