export type OnboardingStatus = 'pending' | 'sent' | 'failed';

export interface StudentOnboarding {
  id: string;
  jira_ticket_id: string | null;
  student_name: string;
  diagnostic_math_score: number | null;
  diagnostic_verbal_score: number | null;
  diagnostic_total_score: number | null;
  course_math_name: string | null;
  math_code: string | null;
  course_verbal_name: string | null;
  verbal_code: string | null;
  output_commitment_math: boolean;
  output_commitment_verbal: boolean;
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
  sent_by?: string;
}

export interface OnboardingStats {
  total: number;
  pending: number;
  sent: number;
  failed: number;
}

export interface CreateOnboardingInput {
  student_name: string;
  diagnostic_math_score: number;
  diagnostic_verbal_score: number;
  diagnostic_total_score: number;
  course_math_name: string;
  math_code: string;
  course_verbal_name: string;
  verbal_code: string;
  output_commitment_math: boolean;
  output_commitment_verbal: boolean;
  sign_date: string;
  representative_name?: string | null;
  student_email: string;
  parent_name?: string | null;
  parent_email?: string | null;
  phone?: string | null;
}
