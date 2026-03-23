export type OnboardingStatus = 'pending' | 'sent' | 'failed';

export interface StudentOnboarding {
  id: string;
  jira_ticket_id: string | null;
  student_name: string;
  course_name: string;
  diagnostic_score: number | null;
  output_commitment: boolean;
  sign_date: string;
  representative_name: string | null;
  student_email: string;
  parent_name: string | null;
  parent_email: string | null;
  phone: string | null;
  status: OnboardingStatus;
  resend_message_id: string | null;
  sent_by: string | null;
  sent_at: string | null;
  error_message: string | null;
  attachments_sent: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface OnboardingFilters {
  search?: string;
  status?: OnboardingStatus;
}

export interface OnboardingStats {
  total: number;
  pending: number;
  sent: number;
  failed: number;
}

export interface CreateOnboardingInput {
  student_name: string;
  course_name: string;
  diagnostic_score?: number | null;
  output_commitment: boolean;
  sign_date: string;
  representative_name?: string | null;
  student_email: string;
  parent_name?: string | null;
  parent_email?: string | null;
  phone?: string | null;
}
