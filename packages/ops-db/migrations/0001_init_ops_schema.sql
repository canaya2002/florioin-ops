-- =============================================================================
-- Florioin Ops Hub — Initial schema
-- Runs against the SAME Supabase instance as the FlorioIn product
-- (ref: heqzwommoufzqoprybyq). Creates an isolated `ops` schema so the Hub
-- never touches product data. The only writable surface in `public` is the
-- new `florioin_ops_flags` table.
-- =============================================================================

-- ============================================
-- Schema + grants
-- ============================================
CREATE SCHEMA IF NOT EXISTS ops;

GRANT USAGE ON SCHEMA ops TO authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA ops TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ops TO authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA ops
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA ops
  GRANT ALL ON TABLES TO service_role;

-- ============================================
-- public.florioin_ops_flags
-- Only writable Hub→Product surface in schema public.
-- Lets the Hub flag interactions WITHOUT mutating product tables.
-- ============================================
CREATE TABLE IF NOT EXISTS public.florioin_ops_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID,
  user_id UUID,
  flag_type TEXT NOT NULL,
  flag_value JSONB DEFAULT '{}'::jsonb,
  set_by TEXT DEFAULT 'ops_hub',
  set_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_florioin_ops_flags_workspace
  ON public.florioin_ops_flags(workspace_id);
CREATE INDEX IF NOT EXISTS idx_florioin_ops_flags_user
  ON public.florioin_ops_flags(user_id);
CREATE INDEX IF NOT EXISTS idx_florioin_ops_flags_type
  ON public.florioin_ops_flags(flag_type);

-- ============================================
-- ops.metrics — time-series raw metrics
-- ============================================
CREATE TABLE IF NOT EXISTS ops.metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL CHECK (source IN (
    'apollo','gmail','calendar','whatsapp','stripe','florioin_db',
    'ga4','gsc','vercel','instagram','tiktok'
  )),
  metric_name TEXT NOT NULL,
  value NUMERIC,
  dimension_1 TEXT,
  dimension_2 TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  period TEXT CHECK (period IN ('realtime','hourly','daily','weekly','monthly'))
);
CREATE INDEX IF NOT EXISTS idx_ops_metrics_source
  ON ops.metrics(source);
CREATE INDEX IF NOT EXISTS idx_ops_metrics_captured
  ON ops.metrics(captured_at DESC);
CREATE INDEX IF NOT EXISTS idx_ops_metrics_source_metric
  ON ops.metrics(source, metric_name, captured_at DESC);

-- ============================================
-- ops.events — discrete events from any source
-- ============================================
CREATE TABLE IF NOT EXISTS ops.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  event_type TEXT NOT NULL,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info','warning','critical')),
  external_id TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  processed BOOLEAN DEFAULT FALSE,
  ai_summary TEXT,
  ai_suggested_action TEXT,
  related_contact_id UUID,
  related_deal_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_ops_events_unprocessed
  ON ops.events(created_at) WHERE processed = FALSE;
CREATE INDEX IF NOT EXISTS idx_ops_events_severity
  ON ops.events(severity, created_at DESC);

-- ============================================
-- ops.contacts — lightweight CRM (with humanistic research fields)
-- ============================================
CREATE TABLE IF NOT EXISTS ops.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_apollo_id TEXT UNIQUE,
  email TEXT,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  role TEXT,
  linkedin_url TEXT,
  phone TEXT,
  whatsapp_phone TEXT,
  company_name TEXT,
  company_size TEXT,
  company_industry TEXT,
  company_country TEXT DEFAULT 'Mexico',
  company_website TEXT,
  status TEXT DEFAULT 'cold' CHECK (status IN (
    'cold','contacted','engaged','demo_scheduled','demo_done',
    'trial_active','customer','lost','dormant'
  )),
  source_channel TEXT CHECK (source_channel IN (
    'apollo_email','linkedin_dm','whatsapp_inbound','website_form',
    'referral','organic','social_inbound','manual'
  )),
  ai_research_summary TEXT,
  ai_research_data JSONB,
  ai_personalization_hooks TEXT[],
  ai_research_updated_at TIMESTAMPTZ,
  first_touch_at TIMESTAMPTZ,
  last_touch_at TIMESTAMPTZ,
  next_action_at TIMESTAMPTZ,
  next_action_type TEXT,
  notes TEXT,
  ai_score NUMERIC DEFAULT 0,
  ai_tags TEXT[],
  do_not_contact BOOLEAN DEFAULT FALSE,
  do_not_contact_reason TEXT,
  florioin_workspace_id UUID,
  florioin_user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ops_contacts_email
  ON ops.contacts(email);
CREATE INDEX IF NOT EXISTS idx_ops_contacts_status
  ON ops.contacts(status);
CREATE INDEX IF NOT EXISTS idx_ops_contacts_next_action
  ON ops.contacts(next_action_at) WHERE next_action_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ops_contacts_florioin
  ON ops.contacts(florioin_workspace_id);

-- ============================================
-- ops.conversations — cross-channel threads
-- ============================================
CREATE TABLE IF NOT EXISTS ops.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES ops.contacts(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN (
    'email','whatsapp','linkedin','sms','phone','meeting'
  )),
  direction TEXT NOT NULL CHECK (direction IN ('inbound','outbound')),
  subject TEXT,
  body TEXT NOT NULL,
  ai_intent TEXT,
  ai_sentiment TEXT CHECK (ai_sentiment IN ('positive','neutral','negative','urgent')),
  ai_emotional_signals TEXT[],
  external_message_id TEXT,
  thread_id TEXT,
  delivered BOOLEAN DEFAULT FALSE,
  opened BOOLEAN DEFAULT FALSE,
  opened_at TIMESTAMPTZ,
  replied BOOLEAN DEFAULT FALSE,
  replied_at TIMESTAMPTZ,
  human_edited BOOLEAN DEFAULT FALSE,
  edit_history JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ops_conv_contact
  ON ops.conversations(contact_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ops_conv_channel
  ON ops.conversations(channel, created_at DESC);

-- ============================================
-- ops.deals — sales pipeline
-- ============================================
CREATE TABLE IF NOT EXISTS ops.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id UUID REFERENCES ops.contacts(id),
  company_name TEXT NOT NULL,
  stage TEXT DEFAULT 'lead' CHECK (stage IN (
    'lead','qualified','demo_scheduled','demo_done','trial_active',
    'closed_won','closed_lost','dormant'
  )),
  expected_seats INTEGER,
  expected_mrr NUMERIC,
  actual_seats INTEGER,
  actual_mrr NUMERIC,
  billing_plan TEXT CHECK (billing_plan IN ('monthly','annual')),
  trial_started_at TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  first_payment_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  lost_reason TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  florioin_workspace_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ops_deals_stage
  ON ops.deals(stage);
CREATE INDEX IF NOT EXISTS idx_ops_deals_trial_ends
  ON ops.deals(trial_ends_at) WHERE stage = 'trial_active';

-- ============================================
-- ops.actions_queue — approval queue (heart of the Hub)
-- ============================================
CREATE TABLE IF NOT EXISTS ops.actions_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL CHECK (action_type IN (
    'send_cold_email',
    'send_email_reply',
    'send_email_followup',
    'send_whatsapp_reply',
    'send_whatsapp_initial',
    'send_linkedin_dm',
    'schedule_demo',
    'send_proposal',
    'trial_reminder_day7',
    'trial_reminder_day14',
    'trial_reminder_day25',
    'failed_payment_reminder',
    'churn_recovery_email',
    'seat_change_notification',
    'manual_outreach_research'
  )),
  contact_id UUID REFERENCES ops.contacts(id),
  deal_id UUID REFERENCES ops.deals(id),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  ai_generated_content JSONB NOT NULL,
  ai_reasoning TEXT,
  ai_personalization_used TEXT[],
  ai_confidence_score NUMERIC,
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending','approved','rejected','executed','failed','expired','editing'
  )),
  requires_approval BOOLEAN DEFAULT TRUE,
  scheduled_for TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  edited_by_human BOOLEAN DEFAULT FALSE,
  final_content JSONB,
  executed_at TIMESTAMPTZ,
  execution_result JSONB,
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '48 hours',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ops_queue_pending
  ON ops.actions_queue(priority, created_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_ops_queue_contact
  ON ops.actions_queue(contact_id);

-- ============================================
-- ops.reports — generated reports + shareable links
-- ============================================
CREATE TABLE IF NOT EXISTS ops.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type TEXT NOT NULL CHECK (report_type IN (
    'ceo_daily_brief','sales_weekly','marketing_weekly',
    'finance_monthly','product_health_weekly','executive_monthly',
    'investor_update','content_weekly_plan'
  )),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  content_markdown TEXT NOT NULL,
  content_html TEXT,
  key_metrics JSONB,
  top_actions JSONB,
  shareable_link TEXT UNIQUE,
  shareable_link_expires_at TIMESTAMPTZ,
  shareable_link_password_hash TEXT,
  shareable_link_viewed_count INTEGER DEFAULT 0,
  shareable_link_last_viewed_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  sent_channel TEXT CHECK (sent_channel IN ('email','slack','dashboard','shareable_link')),
  recipients TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ops_reports_type
  ON ops.reports(report_type, period_end DESC);
CREATE INDEX IF NOT EXISTS idx_ops_reports_shareable
  ON ops.reports(shareable_link) WHERE shareable_link IS NOT NULL;

-- ============================================
-- ops.ai_insights — AI-generated observations
-- ============================================
CREATE TABLE IF NOT EXISTS ops.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN (
    'sales','marketing','finance','product','customer_success',
    'seo','social','data_science','content'
  )),
  insight_type TEXT NOT NULL CHECK (insight_type IN (
    'anomaly','trend','opportunity','risk','recommendation','prediction'
  )),
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info','notice','warning','critical')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  detailed_analysis TEXT,
  data_points JSONB,
  confidence_score NUMERIC CHECK (confidence_score BETWEEN 0 AND 1),
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  acted_on BOOLEAN DEFAULT FALSE,
  acted_on_at TIMESTAMPTZ,
  related_contact_id UUID,
  related_deal_id UUID
);
CREATE INDEX IF NOT EXISTS idx_ops_insights_unread
  ON ops.ai_insights(generated_at DESC) WHERE acted_on = FALSE;

-- ============================================
-- ops.content_plan — v3 weekly social content planner
-- AI plans; Carlos publishes manually from phone.
-- ============================================
CREATE TABLE IF NOT EXISTS ops.content_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start_date DATE NOT NULL,
  scheduled_date DATE NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN (
    'linkedin','instagram','tiktok'
  )),
  content_type TEXT CHECK (content_type IN (
    'build_in_public','educational','case_study','feature_spotlight',
    'thought_leadership','behind_the_scenes','testimonial','meme','reel'
  )),
  topic TEXT NOT NULL,
  hook TEXT,
  copy_primary TEXT NOT NULL,
  copy_variation_2 TEXT,
  copy_variation_3 TEXT,
  hashtags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  cta TEXT,
  visual_idea TEXT,
  reference_links TEXT[],
  ai_reasoning TEXT,
  status TEXT DEFAULT 'planned' CHECK (status IN (
    'planned','published','skipped','edited'
  )),
  published_at TIMESTAMPTZ,
  external_post_url TEXT,
  engagement_data JSONB,
  founder_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ops_content_week
  ON ops.content_plan(week_start_date);
CREATE INDEX IF NOT EXISTS idx_ops_content_date
  ON ops.content_plan(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_ops_content_status
  ON ops.content_plan(status);

-- ============================================
-- ops.integrations — per-source status (mock vs real)
-- ============================================
CREATE TABLE IF NOT EXISTS ops.integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'inactive' CHECK (status IN (
    'inactive','active','error','expired','mock'
  )),
  mock_mode BOOLEAN DEFAULT TRUE,
  config JSONB DEFAULT '{}'::jsonb,
  last_sync_at TIMESTAMPTZ,
  last_error TEXT,
  next_sync_at TIMESTAMPTZ,
  sync_frequency_minutes INTEGER,
  total_records_synced BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ops.audit_log — founder action history
-- ============================================
CREATE TABLE IF NOT EXISTS ops.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  before_state JSONB,
  after_state JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_log_created
  ON ops.audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_resource
  ON ops.audit_log(resource_type, resource_id);

-- ============================================
-- ops.backups — backup metadata
-- ============================================
CREATE TABLE IF NOT EXISTS ops.backups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  backup_type TEXT NOT NULL CHECK (backup_type IN (
    'daily_auto','weekly_full','manual'
  )),
  status TEXT DEFAULT 'in_progress' CHECK (status IN (
    'in_progress','completed','failed'
  )),
  storage_url TEXT,
  size_bytes BIGINT,
  tables_included TEXT[],
  rows_total BIGINT,
  duration_seconds NUMERIC,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================
-- Row Level Security — founder-only
-- Only carlos@florioin.app can read/write Hub data.
-- ============================================
ALTER TABLE ops.metrics         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops.events          ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops.contacts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops.conversations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops.deals           ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops.actions_queue   ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops.reports         ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops.ai_insights     ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops.content_plan    ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops.integrations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops.audit_log       ENABLE ROW LEVEL SECURITY;
ALTER TABLE ops.backups         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.florioin_ops_flags ENABLE ROW LEVEL SECURITY;

-- Helper: founder email check
-- Reused across every policy. Service role bypasses RLS automatically.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'ops' AND tablename = 'metrics' AND policyname = 'founder_all') THEN
    CREATE POLICY founder_all ON ops.metrics       FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'carlos@florioin.app') WITH CHECK (auth.jwt() ->> 'email' = 'carlos@florioin.app');
    CREATE POLICY founder_all ON ops.events        FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'carlos@florioin.app') WITH CHECK (auth.jwt() ->> 'email' = 'carlos@florioin.app');
    CREATE POLICY founder_all ON ops.contacts      FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'carlos@florioin.app') WITH CHECK (auth.jwt() ->> 'email' = 'carlos@florioin.app');
    CREATE POLICY founder_all ON ops.conversations FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'carlos@florioin.app') WITH CHECK (auth.jwt() ->> 'email' = 'carlos@florioin.app');
    CREATE POLICY founder_all ON ops.deals         FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'carlos@florioin.app') WITH CHECK (auth.jwt() ->> 'email' = 'carlos@florioin.app');
    CREATE POLICY founder_all ON ops.actions_queue FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'carlos@florioin.app') WITH CHECK (auth.jwt() ->> 'email' = 'carlos@florioin.app');
    CREATE POLICY founder_all ON ops.reports       FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'carlos@florioin.app') WITH CHECK (auth.jwt() ->> 'email' = 'carlos@florioin.app');
    CREATE POLICY founder_all ON ops.ai_insights   FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'carlos@florioin.app') WITH CHECK (auth.jwt() ->> 'email' = 'carlos@florioin.app');
    CREATE POLICY founder_all ON ops.content_plan  FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'carlos@florioin.app') WITH CHECK (auth.jwt() ->> 'email' = 'carlos@florioin.app');
    CREATE POLICY founder_all ON ops.integrations  FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'carlos@florioin.app') WITH CHECK (auth.jwt() ->> 'email' = 'carlos@florioin.app');
    CREATE POLICY founder_all ON ops.audit_log     FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'carlos@florioin.app') WITH CHECK (auth.jwt() ->> 'email' = 'carlos@florioin.app');
    CREATE POLICY founder_all ON ops.backups       FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'carlos@florioin.app') WITH CHECK (auth.jwt() ->> 'email' = 'carlos@florioin.app');
    CREATE POLICY founder_all ON public.florioin_ops_flags FOR ALL TO authenticated USING (auth.jwt() ->> 'email' = 'carlos@florioin.app') WITH CHECK (auth.jwt() ->> 'email' = 'carlos@florioin.app');
  END IF;
END $$;
