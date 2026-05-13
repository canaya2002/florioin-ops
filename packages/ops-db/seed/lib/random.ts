/**
 * Seeded RNG — Mulberry32. Deterministic so the same seed produces the same
 * dataset every run. No external dep.
 *
 * https://stackoverflow.com/a/47593316
 */

export class SeededRandom {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0;
  }

  /** [0, 1) */
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** [min, max) */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /** [min, max] inclusive */
  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }

  pick<T>(arr: readonly T[]): T {
    if (arr.length === 0) throw new Error('pick() on empty array');
    return arr[this.int(0, arr.length - 1)]!;
  }

  /** Pick N unique items from arr. */
  sample<T>(arr: readonly T[], count: number): T[] {
    if (count > arr.length) throw new Error('sample() count > arr.length');
    const pool = [...arr];
    const out: T[] = [];
    for (let i = 0; i < count; i++) {
      const idx = this.int(0, pool.length - 1);
      out.push(pool.splice(idx, 1)[0]!);
    }
    return out;
  }

  /** Weighted pick. Items with higher weight are more likely. */
  weighted<T>(items: readonly { value: T; weight: number }[]): T {
    const total = items.reduce((s, x) => s + x.weight, 0);
    let roll = this.next() * total;
    for (const item of items) {
      roll -= item.weight;
      if (roll <= 0) return item.value;
    }
    return items[items.length - 1]!.value;
  }

  /**
   * Deterministic v4-like UUID derived from this RNG.
   * NOT cryptographically random; only valid for seed data.
   */
  uuid(): string {
    const hex = (n: number) => n.toString(16).padStart(2, '0');
    const bytes: number[] = [];
    for (let i = 0; i < 16; i++) bytes.push(this.int(0, 255));
    bytes[6] = (bytes[6]! & 0x0f) | 0x40; // v4
    bytes[8] = (bytes[8]! & 0x3f) | 0x80; // variant
    const h = bytes.map(hex).join('');
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  }

  /** Boolean with probability `p`. */
  bool(p = 0.5): boolean {
    return this.next() < p;
  }
}

/** Default seed for the Hub's deterministic dataset. */
export const SEED = 17_05_2026;
