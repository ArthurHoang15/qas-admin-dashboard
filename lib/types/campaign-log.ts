// Log status type
export type LogStatus =
  | 'queued'
  | 'sent'
  | 'delivered'
  | 'failed'
  | 'opened'
  | 'clicked'
  | 'bounced'
  | 'complained'
  | 'unsubscribed';

// Main campaign log interface
export interface CampaignLog {
  id: string;
  campaign_id: string;
  contact_id: string;
  email_provider_id: string | null;
  status: LogStatus;
  sent_at: string | null;
  delivered_at: string | null;
  opened_at: string | null;
  clicked_at: string | null;
  bounced_at: string | null;
  error_message: string | null;
  error_code: string | null;
  created_at: string;
  updated_at: string;
}

// Campaign log with contact info (for display)
export interface CampaignLogWithContact extends CampaignLog {
  contact_email: string;
  contact_first_name: string | null;
  contact_last_name: string | null;
}

// Input for creating a log
export interface LogCreateInput {
  campaign_id: string;
  contact_id: string;
  email_provider_id?: string;
  status?: LogStatus;
}

// Input for updating a log (from webhook)
export interface LogUpdateInput {
  status?: LogStatus;
  email_provider_id?: string;
  sent_at?: string;
  delivered_at?: string;
  opened_at?: string;
  clicked_at?: string;
  bounced_at?: string;
  error_message?: string;
  error_code?: string;
}

// Webhook event from Resend
export interface ResendWebhookEvent {
  type: 'email.sent' | 'email.delivered' | 'email.opened' | 'email.clicked' | 'email.bounced' | 'email.complained';
  created_at: string;
  data: {
    email_id: string;
    from: string;
    to: string[];
    subject: string;
    // Additional fields for specific events
    click?: {
      link: string;
      timestamp: string;
    };
    bounce?: {
      type: 'hard' | 'soft';
      message: string;
    };
  };
}

// Campaign log filter options
export interface LogFilters {
  campaign_id?: string;
  contact_id?: string;
  status?: LogStatus;
}

// Log stats aggregation
export interface LogStatsAggregation {
  status: LogStatus;
  count: number;
}

// Campaign send progress
export interface CampaignSendProgress {
  campaign_id: string;
  total: number;
  queued: number;
  sent: number;
  delivered: number;
  failed: number;
  progress_percent: number;
}
