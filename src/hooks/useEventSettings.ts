import { useState } from 'react';
import { getSupabase } from '../lib/supabase/client';
import { toast } from 'sonner';
import type { Database } from '../types/database.types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type EventSettings = Tables<'event_settings'>;

export function useEventSettings() {
  const [loading, setLoading] = useState(false);

  const getEventSettings = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await getSupabase()
        .from('event_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching event settings:', error);
      toast.error('Failed to fetch event settings');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateEventSettings = async (userId: string, settings: Partial<EventSettings>) => {
    setLoading(true);
    try {
      const { error } = await getSupabase()
        .from('event_settings')
        .update(settings)
        .eq('user_id', userId);

      if (error) throw error;
      toast.success('Event settings updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating event settings:', error);
      toast.error('Failed to update event settings');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getEventSettings,
    updateEventSettings
  };
} 