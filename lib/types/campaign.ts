// Campaign status types
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'completed' | 'paused' | 'archived';

// Contact status for audience filtering
export type ContactStatus = 'active' | 'unsubscribed' | 'bounced' | 'complained';

// Engagement level
export type EngagementLevel = 'none' | 'sent' | 'opened' | 'clicked';

// Audience filter criteria for campaign targeting
export interface AudienceFilter {
  tags?: string[];
  status?: ContactStatus[];
  engagement_level?: EngagementLevel[];
  exclude_templates?: string[]; // Exclude contacts who received these templates
}

// Main campaign interface
export interface Campaign {
  id: string;
  name: string;
  objective: string | null;
  status: CampaignStatus;
  template_code: string | null;
  scheduled_at: string | null;
  started_at: string | null;
  finished_at: string | null;
  audience_filter: AudienceFilter;
  total_recipients: number;
  stats_sent: number;
  stats_delivered: number;
  stats_opened: number;
  stats_clicked: number;
  stats_bounced: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Campaign with computed rates for display
export interface CampaignWithRates extends Campaign {
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  delivery_rate: number;
}

// Input for creating a new campaign
export interface CampaignCreateInput {
  name: string;
  objective?: string;
  template_code?: string;
  audience_filter?: AudienceFilter;
  scheduled_at?: string;
}

// Input for updating a campaign
export interface CampaignUpdateInput {
  name?: string;
  objective?: string;
  template_code?: string;
  audience_filter?: AudienceFilter;
  scheduled_at?: string;
  status?: CampaignStatus;
}

// Campaign filter options for list view
export interface CampaignFilters {
  search?: string;
  status?: CampaignStatus;
  template_code?: string;
}

// Audience preview result
export interface AudiencePreview {
  count: number;
  sample: Array<{
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    tags: string[];
  }>;
}

// Campaign execution result
export interface CampaignExecutionResult {
  success: boolean;
  campaign_id: string;
  total_queued: number;
  error?: string;
}

// Campaign stats for dashboard
export interface CampaignStats {
  total_recipients: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
  delivery_rate: number;
}
