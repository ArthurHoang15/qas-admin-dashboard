// Re-export common types from campaign.ts
export type { ContactStatus, EngagementLevel } from './campaign';

// Main marketing contact interface
export interface MarketingContact {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  source: string | null;
  tags: string[];
  status: 'active' | 'unsubscribed' | 'bounced' | 'complained';
  engagement_level: 'none' | 'sent' | 'opened' | 'clicked';
  templates_received: string[];
  unsubscribe_token: string | null;
  last_email_at: string | null;
  last_opened_at: string | null;
  last_clicked_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
}

// Input for creating a contact
export interface ContactCreateInput {
  email: string;
  first_name?: string;
  last_name?: string;
  source?: string;
  tags?: string[];
}

// Input for updating a contact
export interface ContactUpdateInput {
  first_name?: string;
  last_name?: string;
  tags?: string[];
  status?: 'active' | 'unsubscribed' | 'bounced' | 'complained';
}

// CSV import row structure
export interface CSVContact {
  email: string;
  first_name?: string;
  last_name?: string;
  tags?: string; // Comma-separated in CSV
}

// Contact filter options
export interface ContactFilters {
  search?: string;
  status?: 'active' | 'unsubscribed' | 'bounced' | 'complained';
  engagement_level?: 'none' | 'sent' | 'opened' | 'clicked';
  tags?: string[];
}

// CSV validation error
export interface CSVContactValidationError {
  row: number;
  field: string;
  message: string;
}

// CSV validation result
export interface CSVContactValidationResult {
  valid: boolean;
  validRows: number;
  invalidRows: number;
  errors: CSVContactValidationError[];
}

// CSV import result
export interface ContactImportResult {
  success: boolean;
  total: number;
  inserted: number;
  updated: number;
  failed: number;
  errors: CSVContactValidationError[];
}

// Duplicate check result
export interface DuplicateCheckResult {
  existing: Array<{
    email: string;
    id: string;
    templates_received: string[];
  }>;
  new: string[];
}

// Contact event for timeline/history
export interface ContactEvent {
  id: string;
  type: 'campaign_sent' | 'opened' | 'clicked' | 'bounced' | 'unsubscribed' | 'imported' | 'tag_added' | 'tag_removed';
  campaign_id?: string;
  campaign_name?: string;
  template_code?: string;
  details?: string;
  timestamp: string;
}

// Contact with campaign history
export interface ContactWithHistory extends MarketingContact {
  campaigns: Array<{
    campaign_id: string;
    campaign_name: string;
    template_code: string;
    status: string;
    sent_at: string | null;
    opened_at: string | null;
    clicked_at: string | null;
  }>;
}

// Bulk operation input
export interface BulkContactOperation {
  contact_ids: string[];
  operation: 'add_tags' | 'remove_tags' | 'update_status';
  tags?: string[];
  status?: 'active' | 'unsubscribed' | 'bounced' | 'complained';
}

// Bulk operation result
export interface BulkOperationResult {
  success: boolean;
  affected: number;
  error?: string;
}
