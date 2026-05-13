import type { DealRow, DealStage } from '../../src/types';
import { daysAgo, iso } from '../lib/dates';
import { SeededRandom } from '../lib/random';
import { COMPANIES } from './companies';
import type { SeedContact } from './contacts';

export type SeedDeal = DealRow;

/**
 * Build 16 deals connected to the status-bearing contacts:
 *  - 4 closed_won (customer)
 *  - 6 trial_active
 *  - 2 demo_done
 *  - 2 demo_scheduled
 *  - 2 qualified (engaged)
 *
 * Pricing is hardcoded: $5 monthly / $4 annual per seat.
 * Seat sizes match company_size buckets so the math feels real.
 */
export function buildDeals(rng: SeededRandom, contacts: SeedContact[]): SeedDeal[] {
  const out: SeedDeal[] = [];

  const customers = contacts.filter((c) => c.status === 'customer');
  const trials = contacts.filter((c) => c.status === 'trial_active');
  const demosDone = contacts.filter((c) => c.status === 'demo_done').slice(0, 2);
  const demosScheduled = contacts.filter((c) => c.status === 'demo_scheduled').slice(0, 2);
  const engaged = contacts.filter((c) => c.status === 'engaged').slice(0, 2);

  for (const c of customers) {
    out.push(makeDeal(rng, c, 'closed_won'));
  }
  for (const c of trials) {
    out.push(makeDeal(rng, c, 'trial_active'));
  }
  for (const c of demosDone) {
    out.push(makeDeal(rng, c, 'demo_done'));
  }
  for (const c of demosScheduled) {
    out.push(makeDeal(rng, c, 'demo_scheduled'));
  }
  for (const c of engaged) {
    out.push(makeDeal(rng, c, 'qualified'));
  }

  return out;
}

function makeDeal(rng: SeededRandom, contact: SeedContact, stage: DealStage): SeedDeal {
  const company = COMPANIES[contact._companyIndex]!;

  const sizeRanges: Record<string, [number, number]> = {
    '5-15': [4, 12],
    '16-40': [10, 28],
    '41-100': [22, 60],
    '101-200': [45, 110],
  };
  const [minSeats, maxSeats] = sizeRanges[company.size]!;
  const expectedSeats = rng.int(minSeats, maxSeats);

  const isAnnual = rng.bool(0.45);
  const pricePerSeat = isAnnual ? 4 : 5;
  const expectedMrr = expectedSeats * pricePerSeat;

  // Trial dates
  const trialStarted =
    stage === 'trial_active' ? daysAgo(rng.int(1, 28)) : stage === 'closed_won' ? daysAgo(rng.int(60, 90)) : null;
  const trialEnds = trialStarted
    ? new Date(trialStarted.getTime() + 30 * 86_400_000)
    : null;

  // First payment for closed_won
  const firstPaymentAt =
    stage === 'closed_won' ? daysAgo(rng.int(30, 75)) : null;

  // Actuals only realized for trials and closed
  const actualSeats =
    stage === 'closed_won' || stage === 'trial_active' ? expectedSeats : null;
  const actualMrr = actualSeats ? actualSeats * pricePerSeat : null;

  return {
    id: rng.uuid(),
    contact_id: contact.id,
    company_name: company.name,
    stage,
    expected_seats: expectedSeats,
    expected_mrr: expectedMrr,
    actual_seats: actualSeats,
    actual_mrr: actualMrr,
    billing_plan: isAnnual ? 'annual' : 'monthly',
    trial_started_at: trialStarted ? iso(trialStarted) : null,
    trial_ends_at: trialEnds ? iso(trialEnds) : null,
    first_payment_at: firstPaymentAt ? iso(firstPaymentAt) : null,
    closed_at: stage === 'closed_won' && firstPaymentAt ? iso(firstPaymentAt) : null,
    lost_reason: null,
    stripe_customer_id: stage === 'closed_won' ? `cus_${rng.uuid().replace(/-/g, '').slice(0, 14)}` : null,
    stripe_subscription_id:
      stage === 'closed_won' ? `sub_${rng.uuid().replace(/-/g, '').slice(0, 14)}` : null,
    florioin_workspace_id: contact.florioin_workspace_id,
    notes: null,
    created_at: iso(trialStarted ?? daysAgo(rng.int(5, 30))),
    updated_at: iso(daysAgo(rng.int(0, 5))),
  };
}
