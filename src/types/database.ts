export type UserRole = 'sudo' | 'agency' | 'owner' | 'admin' | 'manager' | 'user' | 'dev' | 'trial';

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  organization_id_main: string | null;
  organization_id_sub: string | null;
  department_id: string | null;
  team_id: string | null;
  role: UserRole;
  sub_accounts: string[];
  is_verified: boolean;
  is_sub_account: boolean;
  is_admin: boolean;
  is_super_admin: boolean;
  is_user: boolean;
  is_affiliate: boolean;
  is_banned: boolean;
  is_active: boolean;
  is_deleted: boolean;
  is_suspended: boolean;
  is_trial: boolean;
  is_trial_ended: boolean;
  is_trial_started: boolean;
  last_login: string | null;
  last_login_ip: string | null;
  last_login_country: string | null;
  last_login_city: string | null;
  last_login_region: string | null;
  last_login_device: string | null;
  last_login_browser: string | null;
  last_login_os: string | null;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  user_id: string;
  company_name: string;
  company_description: string | null;
  company_phone: string | null;
  company_email: string | null;
  company_logo_url: string | null;
  company_website: string | null;
  company_address: string | null;
  company_city: string | null;
  company_state: string;
  company_country: string;
  company_postal_code: string | null;
  company_timezone: string;
  company_niche: string | null;
  company_size: string | null;
  created_at: string;
  updated_at: string;
}

export type CallStatus = 'pending' | 'calling' | 'no_answer' | 'scheduled' | 'bad_lead' | 'error';
export type PipelineStatus = 'open' | 'won' | 'lost' | 'follow_up' | 'voicemail' | 'not_interested' | 'other';

export interface Lead {
  id: string;
  organization_id: string;
  user_id: string;
  contact_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  company_name: string;
  call_status: CallStatus;
  pipeline_status: PipelineStatus;
  call_attempts: number;
  timezone: string;
  last_called_at: string | null;
  appointment_url: string | null;
  follow_up_email_sent: boolean;
  notes: string | null;
  ai_notes: string | null;
  ai_summary: string | null;
  ai_summary_sentiment: string;
  tags: string[];
  source: string;
  created_at: string;
  updated_at: string;
}

export interface LeadCallLog {
  id: string;
  lead_id: string;
  call_id: string;
  call_initiated_at: string | null;
  call_ended_at: string | null;
  call_ended_reason: string | null;
  call_recording_url: string | null;
  call_stereo_recording_url: string | null;
  call_duration_seconds: number;
  call_cost: number;
  call_initial_response: any;
  call_sentiment: string;
  call_report: any[];
  created_at: string;
  updated_at: string;
}

// Database schema type
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'id' | 'email'>>;
        Relationships: [
          {
            foreignKeyName: "user_profiles_organization_id_main_fkey"
            columns: ["organization_id_main"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_organization_id_sub_fkey"
            columns: ["organization_id_sub"]
            referencedRelation: "company_sub_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_department_id_fkey"
            columns: ["department_id"]
            referencedRelation: "company_departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_team_id_fkey"
            columns: ["team_id"]
            referencedRelation: "company_teams"
            referencedColumns: ["id"]
          }
        ];
      };
      companies: {
        Row: Company;
        Insert: Omit<Company, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Company, 'id' | 'user_id'>>;
      };
      leads: {
        Row: Lead;
        Insert: Omit<Lead, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Lead, 'id' | 'organization_id' | 'user_id'>>;
      };
      leads_call_logs: {
        Row: LeadCallLog;
        Insert: Omit<LeadCallLog, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<LeadCallLog, 'id' | 'lead_id' | 'call_id'>>;
      };
    };
  };
} 