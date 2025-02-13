export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          created_by: string
          created_at: string
          updated_at: string
          is_active: boolean
          subscription_status: string
          subscription_end_date: string | null
          settings: Json | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          name: string
          created_by: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
          subscription_status?: string
          subscription_end_date?: string | null
          settings?: Json | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          name?: string
          created_by?: string
          created_at?: string
          updated_at?: string
          is_active?: boolean
          subscription_status?: string
          subscription_end_date?: string | null
          settings?: Json | null
          metadata?: Json | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          organization_id_main: string
          full_name: string
          email: string
          phone: string | null
          role: string
          is_active: boolean
          settings: Json | null
          metadata: Json | null
          created_at: string
          updated_at: string
          last_login_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          organization_id_main: string
          full_name: string
          email: string
          phone?: string | null
          role?: string
          is_active?: boolean
          settings?: Json | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          organization_id_main?: string
          full_name?: string
          email?: string
          phone?: string | null
          role?: string
          is_active?: boolean
          settings?: Json | null
          metadata?: Json | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
        }
      }
      leads: {
        Row: {
          id: string;
          organization_id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          phone: string;
          email: string;
          status: string;
          call_status: 'pending' | 'calling' | 'no_answer' | 'scheduled' | 'not_interested'
          pipeline_status: 'open' | 'won' | 'lost' | 'follow_up' | 'voicemail' | 'not_interested' | 'other';
          call_attempts: number;
          timezone: string;
          last_called_at: string;
          appointment_url: string;
          follow_up_email_sent: boolean;
          notes: string;
          ai_notes: string;
          ai_summary: string;
          ai_summary_sentiment: 'positive' | 'negative' | 'neutral';
          tags: string[];
          source: string;
          created_at: string;
          updated_at: string;
        }
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['leads']['Row']>
      }
      appointments: {
        Row: {
          id: string;
          user_id: string;
          event_settings_id: string;
          appointment_id: string;
          appointment_date: string;
          appointment_duration: number;
          appointment_status: string;
          appointment_notes: string;
          appointment_url: string;
          appointment_location: string;
          appointment_organizer_name: string;
          appointment_attendee_name: string;
          appointment_attendee_email: string;
          appointment_attendee_phone: string;
          appointment_attendees_names: string[];
          is_appointment_deleted: boolean;
          created_at: string;
          updated_at: string;
        }
        Insert: Omit<Database['public']['Tables']['appointments']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['appointments']['Row']>
      }
      settings: {
        Row: {
          id: string;
          user_id: string;
          automation_enabled: boolean;
          max_calls_batch: number;
          retry_interval: number;
          max_attempts: number;
          created_at: string;
          updated_at: string;
        }
        Insert: Omit<Database['public']['Tables']['settings']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['settings']['Row']>
      }
      events_settings: {
        Row: {
          id: string;
          user_id: string;
          event_id: string;
          event_type: string;
          event_title: string;
          event_description: string;
          event_duration: number;
          event_location: string;
          event_url: string;
          is_event_deleted: boolean;
          created_at: string;
          updated_at: string;
        }
        Insert: Omit<Database['public']['Tables']['events_settings']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['events_settings']['Row']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'owner' | 'admin' | 'manager' | 'agent'
      subscription_status: 'trial' | 'active' | 'suspended' | 'cancelled'
      lead_status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
    }
  }
}

// Convenience type for Lead table rows
export type Leads = Database['public']['Tables']['leads']['Row']

export interface Lead {
  id: string;
  organization_id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  company_name: string;
  status: string;
  call_status: 'pending' | 'calling' | 'no_answer' | 'scheduled' | 'not_interested';
  pipeline_status: 'open' | 'won' | 'lost' | 'follow_up' | 'voicemail' | 'not_interested' | 'other';
  call_attempts: number;
  timezone: string;
  last_called_at: string;
  appointment_url: string;
  follow_up_email_sent: boolean;
  notes: string;
  ai_notes: string;
  ai_summary: string;
  ai_summary_sentiment: 'positive' | 'negative' | 'neutral';
  tags: string[];
  source: string;
  created_at: string;
  updated_at: string;
}

export type UserProfiles = Database['public']['Tables']['user_profiles']['Row']

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
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
  last_login: string;
  last_login_ip: string;
  last_login_country: string;
  last_login_city: string;
  last_login_region: string;
  last_login_device: string;
  last_login_browser: string;
  last_login_os: string;
  created_at: string;
  updated_at: string;
}
