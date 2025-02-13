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
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string
          phone: string | null
          organization_id_main: string | null
          organization_id_sub: string | null
          department_id: string | null
          team_id: string | null
          role: string
          sub_accounts: string[]
          is_verified: boolean
          is_sub_account: boolean
          is_admin: boolean
          is_super_admin: boolean
          is_user: boolean
          is_affiliate: boolean
          is_banned: boolean
          is_active: boolean
          is_deleted: boolean
          is_suspended: boolean
          is_trial: boolean
          is_trial_ended: boolean
          is_trial_started: boolean
          last_login: string | null
          last_login_ip: string | null
          last_login_country: string | null
          last_login_city: string | null
          last_login_region: string | null
          last_login_device: string | null
          last_login_browser: string | null
          last_login_os: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          email: string
          phone?: string | null
          organization_id_main?: string | null
          organization_id_sub?: string | null
          department_id?: string | null
          team_id?: string | null
          role?: string
          sub_accounts?: string[]
          is_verified?: boolean
          is_sub_account?: boolean
          is_admin?: boolean
          is_super_admin?: boolean
          is_user?: boolean
          is_affiliate?: boolean
          is_banned?: boolean
          is_active?: boolean
          is_deleted?: boolean
          is_suspended?: boolean
          is_trial?: boolean
          is_trial_ended?: boolean
          is_trial_started?: boolean
          last_login?: string | null
          last_login_ip?: string | null
          last_login_country?: string | null
          last_login_city?: string | null
          last_login_region?: string | null
          last_login_device?: string | null
          last_login_browser?: string | null
          last_login_os?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string
          phone?: string | null
          organization_id_main?: string | null
          organization_id_sub?: string | null
          department_id?: string | null
          team_id?: string | null
          role?: string
          sub_accounts?: string[]
          is_verified?: boolean
          is_sub_account?: boolean
          is_admin?: boolean
          is_super_admin?: boolean
          is_user?: boolean
          is_affiliate?: boolean
          is_banned?: boolean
          is_active?: boolean
          is_deleted?: boolean
          is_suspended?: boolean
          is_trial?: boolean
          is_trial_ended?: boolean
          is_trial_started?: boolean
          last_login?: string | null
          last_login_ip?: string | null
          last_login_country?: string | null
          last_login_city?: string | null
          last_login_region?: string | null
          last_login_device?: string | null
          last_login_browser?: string | null
          last_login_os?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          user_id: string
          company_name: string
          company_description: string | null
          company_phone: string | null
          company_email: string | null
          company_logo_url: string | null
          company_website: string | null
          company_address: string | null
          company_city: string | null
          company_state: string
          company_country: string
          company_postal_code: string | null
          company_timezone: string
          company_niche: string | null
          company_size: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          company_description?: string | null
          company_phone?: string | null
          company_email?: string | null
          company_logo_url?: string | null
          company_website?: string | null
          company_address?: string | null
          company_city?: string | null
          company_state: string
          company_country: string
          company_postal_code?: string | null
          company_timezone: string
          company_niche?: string | null
          company_size?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          company_description?: string | null
          company_phone?: string | null
          company_email?: string | null
          company_logo_url?: string | null
          company_website?: string | null
          company_address?: string | null
          company_city?: string | null
          company_state?: string
          company_country?: string
          company_postal_code?: string | null
          company_timezone?: string
          company_niche?: string | null
          company_size?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          full_name: string
          email: string | null
          phone: string | null
          status: string
          source: string | null
          notes: string | null
          call_attempts: number
          last_called_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          full_name: string
          email?: string | null
          phone?: string | null
          status?: string
          source?: string | null
          notes?: string | null
          call_attempts?: number
          last_called_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          full_name?: string
          email?: string | null
          phone?: string | null
          status?: string
          source?: string | null
          notes?: string | null
          call_attempts?: number
          last_called_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          organization_id: string
          user_id: string
          lead_id: string
          status: string
          scheduled_at: string
          duration: number
          notes: string | null
          event_settings_id: string | null
          appointment_id: string | null
          appointment_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          user_id: string
          lead_id: string
          status?: string
          scheduled_at: string
          duration: number
          notes?: string | null
          event_settings_id?: string | null
          appointment_id?: string | null
          appointment_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          user_id?: string
          lead_id?: string
          status?: string
          scheduled_at?: string
          duration?: number
          notes?: string | null
          event_settings_id?: string | null
          appointment_id?: string | null
          appointment_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          theme: string | null
          notifications_enabled: boolean
          email_notifications: boolean
          sms_notifications: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: string | null
          notifications_enabled?: boolean
          email_notifications?: boolean
          sms_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: string | null
          notifications_enabled?: boolean
          email_notifications?: boolean
          sms_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      call_logs: {
        Row: {
          id: string
          lead_id: string
          vapi_call_id: string
          initial_response: Json
          initiated_at: string
          ended_at?: string | null
          ended_reason?: string | null
          recording_url?: string | null
          stereo_recording_url?: string | null
          duration_seconds?: number | null
          cost?: number | null
          report?: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lead_id: string
          vapi_call_id: string
          initial_response: Json
          initiated_at: string
          ended_at?: string | null
          ended_reason?: string | null
          recording_url?: string | null
          stereo_recording_url?: string | null
          duration_seconds?: number | null
          cost?: number | null
          report?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lead_id?: string
          vapi_call_id?: string
          initial_response?: Json
          initiated_at?: string
          ended_at?: string | null
          ended_reason?: string | null
          recording_url?: string | null
          stereo_recording_url?: string | null
          duration_seconds?: number | null
          cost?: number | null
          report?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'user' | 'affiliate'
      lead_status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
      appointment_status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
    }
  }
} 