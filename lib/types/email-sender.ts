// Email sending form data
export interface EmailFormData {
  from: string; // "Display Name <email@domain.com>"
  to: string; // Single or comma-separated emails
  names: string; // Optional, comma-separated names
  cc: string; // Optional, comma-separated
  subject: string;
  htmlContent: string;
  plainText: string; // Optional
  templateCode: string | null; // Selected template code or null
}

// Single recipient with personalization
export interface EmailRecipient {
  email: string;
  name?: string;
}

// Prepared email for sending
export interface PreparedEmail {
  from: string;
  to: string;
  cc?: string[];
  subject: string;
  html: string;
  text?: string;
}

// Send result for a single email
export interface SingleEmailResult {
  email: string;
  success: boolean;
  messageId?: string;
  error?: string;
}

// Batch send result
export interface BatchEmailResult {
  success: boolean;
  totalSent: number;
  totalFailed: number;
  results: SingleEmailResult[];
  error?: string;
}

// Form validation errors
export interface EmailFormErrors {
  from?: string;
  to?: string;
  subject?: string;
  htmlContent?: string;
  general?: string;
}
