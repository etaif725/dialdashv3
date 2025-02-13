import { getSupabase } from '../supabase/client';
import type { Database } from '../../types/database.types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type UserSettings = Tables<'user_settings'>;

export type AutomationSettings = {
  automation_enabled: boolean
  max_calls_batch: number
  retry_interval: number
  max_attempts: number
}

export const DEFAULT_SETTINGS: AutomationSettings = {
  automation_enabled: false,
  max_calls_batch: 5,
  retry_interval: 60,
  max_attempts: 3
}

export class SettingsService {
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const { data, error } = await getSupabase()
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      return null;
    }
  }

  async updateUserSettings(userId: string, settings: Partial<UserSettings>): Promise<boolean> {
    try {
      const { error } = await getSupabase()
        .from('user_settings')
        .update(settings)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating user settings:', error);
      return false;
    }
  }

  async getAutomationSettings(): Promise<AutomationSettings> {
    try {
      const { data, error } = await getSupabase()
        .from('dialer_settings')
        .select('automation_enabled, max_calls_batch, retry_interval, max_attempts')
        .single();

      if (error) {
        // If no settings exist, try to create default settings
        if (error.code === 'PGRST116') { // PostgreSQL "no rows returned" error
          const { data: newData, error: insertError } = await getSupabase()
            .from('dialer_settings')
            .insert([DEFAULT_SETTINGS])
            .select()
            .single();

          if (insertError) throw insertError;
          return newData;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching automation settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  async updateAutomationEnabled(enabled: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await getSupabase()
        .from('dialer_settings')
        .update({ automation_enabled: enabled })
        .eq('id', 1); // Assuming we only have one settings row

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error updating automation enabled:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update automation settings'
      };
    }
  }

  async updateAllSettings(settings: AutomationSettings): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await getSupabase()
        .from('dialer_settings')
        .update(settings)
        .eq('id', 1); // Assuming we only have one settings row

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error updating automation settings:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update automation settings'
      };
    }
  }
}

// Export a singleton instance with the default client for client-side use
export const settingsService = new SettingsService()

// Export the class for server-side use with different clients
export { SettingsService }
