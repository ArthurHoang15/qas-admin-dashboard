export interface Registration {
  id: number;
  created_at: string;
  updated_at: string;
  course: string | null;
  sat_score: number | null;
  first_name: string;
  last_name: string;
  birth_year: number | null;
  email: string;
  phone: string;
  facebook_link: string | null;
  discovery_source: string | null;
  test_date: string | null;
  target_score: number | null;
  is_completed: boolean;
  is_qualified: boolean;
  priority_level: number | null;
  priority_score: number | null;
  priority_label: string | null;
  engagement_pool: EngagementPool | null;
  pool_name: string | null;
  pool_description: string | null;
  submission_type: string | null;
  sat_test_status: 'taken' | 'never' | null;
  last_email_sent_id: string | null;
  last_action: string | null;
  next_email_date: string | null;
  last_email_sent_code: string | null;
}

export type EngagementPool =
  | 'sales'
  | 'consulting'
  | 'experience'
  | 'nurture'
  | 'education'
  | 'giveaway';

export interface RegistrationFilters {
  search?: string;
  priority_level?: number | null;
  engagement_pool?: EngagementPool | null;
  is_qualified?: boolean | null;
  is_completed?: boolean | null;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterOptions {
  engagement_pools: string[];
  priority_levels: number[];
}

export interface CSVRegistration {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  course?: string;
  sat_score?: number;
  birth_year?: number;
  facebook_link?: string;
  discovery_source?: string;
  test_date?: string;
  target_score?: number;
  sat_test_status?: 'taken' | 'never';
  priority_level?: number;
  engagement_pool?: EngagementPool;
}

export interface CSVValidationError {
  row: number;
  field: string;
  message: string;
}

export interface CSVImportResult {
  success: number;
  failed: number;
  errors: CSVValidationError[];
}
