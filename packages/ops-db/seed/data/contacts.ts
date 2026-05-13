import type {
  ContactRow,
  ContactStatus,
  SourceChannel,
} from '../../src/types';
import { COMPANIES, type SeedCompany } from './companies';
import { FEMALE_FIRST_NAMES, LAST_NAMES, MALE_FIRST_NAMES, ROLES } from './name-pools';
import { daysAgo, hoursAgo, iso } from '../lib/dates';
import { SeededRandom } from '../lib/random';

export interface SeedContact extends Omit<ContactRow, 'created_at' | 'updated_at'> {
  // Reference back to which company in COMPANIES this contact belongs to.
  _companyIndex: number;
  created_at: string;
  updated_at: string;
}

/**
 * Distribute 80 contacts across 60 companies:
 * - 20 companies get 2 contacts (founder + ops/creative lead)
 * - 40 companies get 1 contact
 * Total: 80 contacts.
 */
function pickCompanyAssignments(rng: SeededRandom): number[] {
  const twoContact = rng.sample(
    Array.from({ length: COMPANIES.length }, (_, i) => i),
    20,
  );
  const twoContactSet = new Set(twoContact);

  const assignments: number[] = [];
  for (let i = 0; i < COMPANIES.length; i++) {
    assignments.push(i);
    if (twoContactSet.has(i)) assignments.push(i);
  }
  if (assignments.length !== 80) {
    throw new Error(`Expected 80 assignments, got ${assignments.length}`);
  }
  return assignments;
}

function buildEmail(firstName: string, lastName: string, domain: string): string {
  const slug = `${firstName}.${lastName}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z.]/g, '');
  return `${slug}@${domain}`;
}

function statusFor(rng: SeededRandom, index: number): ContactStatus {
  // Realistic funnel distribution (matches seed counts):
  //  - 60% cold
  //  - 15% contacted
  //  - 8% engaged
  //  - 3% demo_scheduled
  //  - 3% demo_done
  //  - 7% trial_active
  //  - 4% customer (4 customers)
  if (index < 4) return 'customer';
  if (index < 10) return 'trial_active';
  if (index < 12) return 'demo_done';
  if (index < 14) return 'demo_scheduled';
  if (index < 20) return 'engaged';
  if (index < 32) return 'contacted';
  // rest cold
  return rng.bool(0.1) ? 'lost' : 'cold';
}

/**
 * Source channel by contact index. Specific slots are pinned so downstream
 * seeders (notably actions.ts) can rely on finding the exact combo they
 * need. The rest use weighted random for realism.
 */
function sourceFor(rng: SeededRandom, status: ContactStatus, index: number): SourceChannel {
  // ----- Pinned slots (must not change) -----
  // index 0 (customer #1): apollo_email — used for failed_payment draft
  if (index === 0) return 'apollo_email';
  // index 1 (customer #2): apollo_email — used for seat_change draft
  if (index === 1) return 'apollo_email';
  // index 4 (trial_active #1): apollo_email — used for trial_day25 draft
  if (index === 4) return 'apollo_email';
  // index 5 (trial_active #2): website_form — used for trial_day14 draft
  if (index === 5) return 'website_form';
  // index 10 (demo_done #1): apollo_email
  if (index === 10) return 'apollo_email';
  // index 12 (demo_scheduled #1): apollo_email — used for schedule_demo draft
  if (index === 12) return 'apollo_email';
  // index 14 (engaged #1): WhatsApp inbound — used for hot WhatsApp reply draft
  if (index === 14) return 'whatsapp_inbound';
  // index 15 (engaged #2): apollo_email — used for cold-reply-interested draft
  if (index === 15) return 'apollo_email';
  // index 20 (contacted #1): apollo_email — used for pricing-question draft
  if (index === 20) return 'apollo_email';

  return rng.weighted([
    { value: 'apollo_email', weight: 50 },
    { value: 'linkedin_dm', weight: 18 },
    { value: 'whatsapp_inbound', weight: 12 },
    { value: 'website_form', weight: 8 },
    { value: 'organic', weight: 6 },
    { value: 'social_inbound', weight: 4 },
    { value: 'referral', weight: 2 },
  ]);
}

function buildAiResearch(company: SeedCompany, role: string, fullName: string): {
  summary: string;
  hooks: string[];
} {
  const firstName = fullName.split(' ')[0];
  const hooks: string[] = [];

  hooks.push(`Trabaja en ${company.name} (${company.city}, ${company.industry.replace('_', ' ')})`);
  hooks.push(`Tamaño empresa: ${company.size} personas`);
  if (company.signals.length > 0) hooks.push(...company.signals.slice(0, 2));
  if (role.toLowerCase().includes('founder') || role.toLowerCase().includes('ceo')) {
    hooks.push('Decisor directo (founder/CEO)');
  }

  const summary =
    `${firstName} es ${role} en ${company.name}, ${company.industry.replace('_', ' ')} en ${company.city}. ` +
    `${company.blurb} ` +
    (company.signals[0] ? `Señal reciente: ${company.signals[0]}.` : '');

  return { summary, hooks };
}

export function buildContacts(rng: SeededRandom): SeedContact[] {
  const assignments = pickCompanyAssignments(rng);
  const contacts: SeedContact[] = [];

  for (let i = 0; i < assignments.length; i++) {
    const companyIdx = assignments[i]!;
    const company = COMPANIES[companyIdx]!;

    const isFemale = rng.bool(0.45);
    const firstName = rng.pick(isFemale ? FEMALE_FIRST_NAMES : MALE_FIRST_NAMES);
    const lastName = rng.pick(LAST_NAMES);
    const fullName = `${firstName} ${lastName}`;

    // Adjust role: female-prefix-aware. After the replace it's a plain string,
    // not a member of the ROLES literal union — we widen on purpose.
    const baseRole: string = rng.pick(ROLES);
    const role: string = isFemale
      ? baseRole
          // "Director X" → "Directora X" (leaves English suffixes alone:
          // "Creative Director" / "Managing Director" / "Account Director").
          .replace(/^Director /u, 'Directora ')
          // "Directora Creativo" → "Directora Creativa"
          .replace(/Creativo$/u, 'Creativa')
      : baseRole;

    const status = statusFor(rng, i);
    const sourceChannel = sourceFor(rng, status, i);
    const email = buildEmail(firstName, lastName, company.website);

    // Approximate first touch based on status maturity.
    const ageDays =
      status === 'customer'
        ? rng.int(60, 90)
        : status === 'trial_active'
          ? rng.int(8, 28)
          : status === 'demo_done'
            ? rng.int(15, 40)
            : status === 'demo_scheduled'
              ? rng.int(3, 14)
              : status === 'engaged'
                ? rng.int(5, 25)
                : status === 'contacted'
                  ? rng.int(1, 30)
                  : status === 'lost'
                    ? rng.int(20, 75)
                    : rng.int(0, 14);

    const firstTouch = daysAgo(ageDays);
    const lastTouch =
      status === 'cold' ? null : hoursAgo(rng.int(2, ageDays * 24));
    const nextAction =
      ['contacted', 'engaged', 'demo_scheduled', 'trial_active'].includes(status)
        ? hoursAgo(-rng.int(4, 72))
        : null;

    const { summary, hooks } = buildAiResearch(company, role, fullName);

    const aiScore =
      status === 'customer'
        ? 0
        : status === 'trial_active'
          ? rng.range(0.7, 0.95)
          : status === 'engaged' || status === 'demo_scheduled'
            ? rng.range(0.6, 0.85)
            : status === 'contacted'
              ? rng.range(0.35, 0.7)
              : status === 'lost'
                ? 0
                : rng.range(0.2, 0.55);

    // WhatsApp phone for ~half of MX contacts (LATAM bias). Always present
    // when the source is whatsapp_inbound — otherwise the action seed breaks.
    const whatsapp =
      sourceChannel === 'whatsapp_inbound' || rng.bool(0.5)
        ? `+52${rng.int(55_5000_0000, 55_9999_9999)}`
        : null;

    const id = rng.uuid();

    contacts.push({
      _companyIndex: companyIdx,
      id,
      external_apollo_id:
        sourceChannel === 'apollo_email' ? `apollo_${rng.int(10000, 99999)}` : null,
      email,
      full_name: fullName,
      first_name: firstName,
      last_name: lastName,
      role,
      linkedin_url: `https://www.linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${rng.int(1000, 9999)}`,
      phone: null,
      whatsapp_phone: whatsapp,
      company_name: company.name,
      company_size: company.size,
      company_industry: company.industry,
      company_country: 'Mexico',
      company_website: `https://${company.website}`,
      status,
      source_channel: sourceChannel,
      ai_research_summary: summary,
      ai_research_data: { city: company.city, signals: company.signals },
      ai_personalization_hooks: hooks,
      ai_research_updated_at: iso(daysAgo(rng.int(0, 7))),
      first_touch_at: status === 'cold' ? null : iso(firstTouch),
      last_touch_at: lastTouch ? iso(lastTouch) : null,
      next_action_at: nextAction ? iso(nextAction) : null,
      next_action_type:
        status === 'contacted'
          ? 'follow_up_email'
          : status === 'engaged'
            ? 'schedule_demo'
            : status === 'trial_active'
              ? 'trial_check_in'
              : null,
      notes: null,
      ai_score: Number(aiScore.toFixed(2)),
      ai_tags: [
        company.industry,
        company.city.toLowerCase(),
        ...(status === 'customer' ? ['customer'] : []),
        ...(aiScore > 0.7 ? ['high_intent'] : []),
      ],
      do_not_contact: status === 'lost' && rng.bool(0.3),
      do_not_contact_reason: null,
      florioin_workspace_id:
        status === 'customer' || status === 'trial_active' ? rng.uuid() : null,
      florioin_user_id:
        status === 'customer' || status === 'trial_active' ? rng.uuid() : null,
      created_at: iso(firstTouch),
      updated_at: iso(lastTouch ?? firstTouch),
    });
  }

  return contacts;
}
