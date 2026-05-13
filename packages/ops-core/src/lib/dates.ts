/**
 * Date helpers — America/Mexico_City is the founder's working timezone.
 */

export const FOUNDER_TZ = 'America/Mexico_City' as const;

export function formatDateMX(date: Date | string, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-MX', {
    timeZone: FOUNDER_TZ,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...opts,
  }).format(d);
}

export function formatTimeMX(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-MX', {
    timeZone: FOUNDER_TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
}

/** Returns the Monday of the week containing `date` (UTC date string). */
export function getMondayOf(date: Date): string {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}

export function addDays(date: Date | string, days: number): Date {
  const d = typeof date === 'string' ? new Date(date) : new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}
