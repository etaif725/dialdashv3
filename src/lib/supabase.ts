import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';
import { getSupabase } from './supabase/client';

// Database types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Common table types
export type UserProfile = Tables<'user_profiles'>;
export type Company = Tables<'companies'>;
export type Lead = Tables<'leads'>;
export type Appointment = Tables<'appointments'>;
export type UserSettings = Tables<'user_settings'>;

// Helper function to handle Supabase errors consistently
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  throw new Error(error.message || 'An unexpected error occurred');
};

// Supabase service class for reusable database operations
export class SupabaseService {
  private static instance: SupabaseService;
  private client: SupabaseClient<Database>;

  private constructor() {
    this.client = getSupabase();
  }

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  // Auth methods
  async signIn(email: string, password: string) {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) handleSupabaseError(error);
    return data;
  }

  async signUp(email: string, password: string, userData: { full_name: string }) {
    const { data, error } = await this.client.auth.signUp({
      email,
      password,
      options: { data: userData }
    });
    if (error) handleSupabaseError(error);
    return data;
  }

  async signOut() {
    const { error } = await this.client.auth.signOut();
    if (error) handleSupabaseError(error);
  }

  // Profile methods
  async getUserProfile(userId: string) {
    const { data, error } = await this.client
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) handleSupabaseError(error);
    return data;
  }

  // Company methods
  async getCompany(companyId: string) {
    const { data, error } = await this.client
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();
    
    if (error) handleSupabaseError(error);
    return data;
  }

  // Lead methods
  async getLeads(filters?: { 
    organization_id?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    let query = this.client
      .from('leads')
      .select('*', { count: 'exact' });
    
    if (filters?.organization_id) {
      query = query.eq('organization_id', filters.organization_id);
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.search) {
      query = query.ilike('full_name', `%${filters.search}%`);
    }
    
    if (filters?.page && filters?.limit) {
      const from = (filters.page - 1) * filters.limit;
      const to = from + filters.limit - 1;
      query = query.range(from, to);
    }
    
    const { data, error, count } = await query;
    if (error) handleSupabaseError(error);
    
    return { data, count };
  }

  // Appointment methods
  async getAppointments(filters?: {
    organization_id?: string;
    status?: string;
    from_date?: string;
    to_date?: string;
    page?: number;
    limit?: number;
  }) {
    let query = this.client
      .from('appointments')
      .select('*', { count: 'exact' });
    
    if (filters?.organization_id) {
      query = query.eq('organization_id', filters.organization_id);
    }
    
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.from_date) {
      query = query.gte('scheduled_at', filters.from_date);
    }
    
    if (filters?.to_date) {
      query = query.lte('scheduled_at', filters.to_date);
    }
    
    if (filters?.page && filters?.limit) {
      const from = (filters.page - 1) * filters.limit;
      const to = from + filters.limit - 1;
      query = query.range(from, to);
    }
    
    const { data, error, count } = await query;
    if (error) handleSupabaseError(error);
    
    return { data, count };
  }
}

// Export a singleton instance
export const supabaseService = SupabaseService.getInstance(); 