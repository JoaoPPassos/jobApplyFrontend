// Espelha src/modules/application e entidades do backend

export const APPLICATION_STATUSES = [
  'applied',
  'in_review',
  'interview',
  'offer',
  'rejected',
  'withdrawn',
  'no_response',
] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const SOURCE_PLATFORMS = [
  'linkedin',
  'indeed',
  'company_board',
  'recruiter',
  'other',
] as const;
export type SourcePlatform = (typeof SOURCE_PLATFORMS)[number];

export interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  salary_range: string;
  source_url: string;
  source_platform: SourcePlatform;
  location: string;
  metadata_status: string;
}

export interface Application {
  id: string;
  current_status: ApplicationStatus;
  applied_at: string;
  notes: string;
  job?: Job;
  contact?: Contact;
  created_at: string;
  updated_at: string;
}

export interface ContactDTO {
  name: string;
  email: string;
  role: string;
}

export interface CreateApplicationDTO {
  job_source_url: string;
  company: string;
  role: string;
  source_platform: SourcePlatform;
  current_status: ApplicationStatus;
  applied_at: string;
  notes?: string;
  contact: ContactDTO;
}

export interface UpdateApplicationDTO {
  current_status?: ApplicationStatus;
  applied_at?: string;
  notes?: string;
}
