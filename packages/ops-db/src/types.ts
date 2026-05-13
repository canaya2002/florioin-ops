/**
 * Database row types for schema `ops`.
 * These mirror the SQL migration 0001_init_ops_schema.sql.
 * Replace with generated types from `supabase gen types` once the schema lives.
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Severity = 'info' | 'warning' | 'critical';
export type Period = 'realtime' | 'hourly' | 'daily' | 'weekly' | 'monthly';
export type ContactStatus =
  | 'cold'
  | 'contacted'
  | 'engaged'
  | 'demo_scheduled'
  | 'demo_done'
  | 'trial_active'
  | 'customer'
  | 'lost'
  | 'dormant';

export type SourceChannel =
  | 'apollo_email'
  | 'linkedin_dm'
  | 'whatsapp_inbound'
  | 'website_form'
  | 'referral'
  | 'organic'
  | 'social_inbound'
  | 'manual';

export type ConversationChannel =
  | 'email'
  | 'whatsapp'
  | 'linkedin'
  | 'sms'
  | 'phone'
  | 'meeting';

export type ConversationDirection = 'inbound' | 'outbound';
export type Sentiment = 'positive' | 'neutral' | 'negative' | 'urgent';

export type DealStage =
  | 'lead'
  | 'qualified'
  | 'demo_scheduled'
  | 'demo_done'
  | 'trial_active'
  | 'closed_won'
  | 'closed_lost'
  | 'dormant';

export type BillingPlan = 'monthly' | 'annual';

export type ActionType =
  | 'send_cold_email'
  | 'send_email_reply'
  | 'send_email_followup'
  | 'send_whatsapp_reply'
  | 'send_whatsapp_initial'
  | 'send_linkedin_dm'
  | 'schedule_demo'
  | 'send_proposal'
  | 'trial_reminder_day7'
  | 'trial_reminder_day14'
  | 'trial_reminder_day25'
  | 'failed_payment_reminder'
  | 'churn_recovery_email'
  | 'seat_change_notification'
  | 'manual_outreach_research';

export type ActionPriority = 'low' | 'normal' | 'high' | 'urgent';
export type ActionStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'executed'
  | 'failed'
  | 'expired'
  | 'editing';

export type ReportType =
  | 'ceo_daily_brief'
  | 'sales_weekly'
  | 'marketing_weekly'
  | 'finance_monthly'
  | 'product_health_weekly'
  | 'executive_monthly'
  | 'investor_update'
  | 'content_weekly_plan';

export type InsightCategory =
  | 'sales'
  | 'marketing'
  | 'finance'
  | 'product'
  | 'customer_success'
  | 'seo'
  | 'social'
  | 'data_science'
  | 'content';

export type InsightType =
  | 'anomaly'
  | 'trend'
  | 'opportunity'
  | 'risk'
  | 'recommendation'
  | 'prediction';

export type InsightSeverity = 'info' | 'notice' | 'warning' | 'critical';

export type ContentPlatform = 'linkedin' | 'instagram' | 'tiktok';

export type ContentType =
  | 'build_in_public'
  | 'educational'
  | 'case_study'
  | 'feature_spotlight'
  | 'thought_leadership'
  | 'behind_the_scenes'
  | 'testimonial'
  | 'meme'
  | 'reel';

export type ContentStatus = 'planned' | 'published' | 'skipped' | 'edited';

export interface MetricRow {
  id: string;
  source: string;
  metric_name: string;
  value: number | null;
  dimension_1: string | null;
  dimension_2: string | null;
  metadata: Json;
  captured_at: string;
  period: Period | null;
}

export interface EventRow {
  id: string;
  source: string;
  event_type: string;
  severity: Severity;
  external_id: string | null;
  payload: Json;
  processed: boolean;
  ai_summary: string | null;
  ai_suggested_action: string | null;
  related_contact_id: string | null;
  related_deal_id: string | null;
  created_at: string;
  processed_at: string | null;
}

export interface ContactRow {
  id: string;
  external_apollo_id: string | null;
  email: string | null;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  role: string | null;
  linkedin_url: string | null;
  phone: string | null;
  whatsapp_phone: string | null;
  company_name: string | null;
  company_size: string | null;
  company_industry: string | null;
  company_country: string | null;
  company_website: string | null;
  status: ContactStatus;
  source_channel: SourceChannel | null;
  ai_research_summary: string | null;
  ai_research_data: Json | null;
  ai_personalization_hooks: string[] | null;
  ai_research_updated_at: string | null;
  first_touch_at: string | null;
  last_touch_at: string | null;
  next_action_at: string | null;
  next_action_type: string | null;
  notes: string | null;
  ai_score: number;
  ai_tags: string[] | null;
  do_not_contact: boolean;
  do_not_contact_reason: string | null;
  florioin_workspace_id: string | null;
  florioin_user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationRow {
  id: string;
  contact_id: string | null;
  channel: ConversationChannel;
  direction: ConversationDirection;
  subject: string | null;
  body: string;
  ai_intent: string | null;
  ai_sentiment: Sentiment | null;
  ai_emotional_signals: string[] | null;
  external_message_id: string | null;
  thread_id: string | null;
  delivered: boolean;
  opened: boolean;
  opened_at: string | null;
  replied: boolean;
  replied_at: string | null;
  human_edited: boolean;
  edit_history: Json | null;
  created_at: string;
}

export interface DealRow {
  id: string;
  contact_id: string | null;
  company_name: string;
  stage: DealStage;
  expected_seats: number | null;
  expected_mrr: number | null;
  actual_seats: number | null;
  actual_mrr: number | null;
  billing_plan: BillingPlan | null;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  first_payment_at: string | null;
  closed_at: string | null;
  lost_reason: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  florioin_workspace_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActionsQueueRow {
  id: string;
  action_type: ActionType;
  contact_id: string | null;
  deal_id: string | null;
  priority: ActionPriority;
  ai_generated_content: Json;
  ai_reasoning: string | null;
  ai_personalization_used: string[] | null;
  ai_confidence_score: number | null;
  status: ActionStatus;
  requires_approval: boolean;
  scheduled_for: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  rejection_reason: string | null;
  edited_by_human: boolean;
  final_content: Json | null;
  executed_at: string | null;
  execution_result: Json | null;
  expires_at: string;
  created_at: string;
}

export interface ReportRow {
  id: string;
  report_type: ReportType;
  period_start: string;
  period_end: string;
  content_markdown: string;
  content_html: string | null;
  key_metrics: Json | null;
  top_actions: Json | null;
  shareable_link: string | null;
  shareable_link_expires_at: string | null;
  shareable_link_password_hash: string | null;
  shareable_link_viewed_count: number;
  shareable_link_last_viewed_at: string | null;
  sent_at: string | null;
  sent_channel: 'email' | 'slack' | 'dashboard' | 'shareable_link' | null;
  recipients: string[] | null;
  created_at: string;
}

export interface AiInsightRow {
  id: string;
  category: InsightCategory;
  insight_type: InsightType;
  severity: InsightSeverity;
  title: string;
  summary: string;
  detailed_analysis: string | null;
  data_points: Json | null;
  confidence_score: number | null;
  generated_at: string;
  expires_at: string | null;
  acted_on: boolean;
  acted_on_at: string | null;
  related_contact_id: string | null;
  related_deal_id: string | null;
}

export interface ContentPlanRow {
  id: string;
  week_start_date: string;
  scheduled_date: string;
  platform: ContentPlatform;
  content_type: ContentType | null;
  topic: string;
  hook: string | null;
  copy_primary: string;
  copy_variation_2: string | null;
  copy_variation_3: string | null;
  hashtags: string[];
  cta: string | null;
  visual_idea: string | null;
  reference_links: string[] | null;
  ai_reasoning: string | null;
  status: ContentStatus;
  published_at: string | null;
  external_post_url: string | null;
  engagement_data: Json | null;
  founder_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface IntegrationRow {
  id: string;
  source: string;
  status: 'inactive' | 'active' | 'error' | 'expired' | 'mock';
  mock_mode: boolean;
  config: Json;
  last_sync_at: string | null;
  last_error: string | null;
  next_sync_at: string | null;
  sync_frequency_minutes: number | null;
  total_records_synced: number;
  created_at: string;
  updated_at: string;
}
