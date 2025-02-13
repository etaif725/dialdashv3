import { useCallback } from 'react';
import { getSupabase } from '../lib/supabase/client';
import type { AutomationSettings } from '../lib/services/settings';

export function useSettings() {
  const getSettings = useCallback(async () => {
    const { data: { user } } = await getSupabase().auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await getSupabase()
      .from('settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;
    return data;
  }, []);

  const updateSettings = useCallback(async (data: Partial<AutomationSettings>) => {
    const { data: { user } } = await getSupabase().auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { error } = await getSupabase()
      .from('settings')
      .update({
        automation_enabled: data.automation_enabled,
        max_calls_batch: data.max_calls_batch,
        retry_interval: data.retry_interval,
        max_attempts: data.max_attempts
      })
      .eq('user_id', user.id);

    if (error) throw error;
  }, []);

  const initializeSettings = useCallback(async () => {
    const { data: { user } } = await getSupabase().auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { error } = await getSupabase()
      .from('settings')
      .insert([{
        user_id: user.id,
        automation_enabled: false,
        max_calls_batch: 10,
        retry_interval: 60,
        max_attempts: 3
      }]);

    if (error) throw error;
  }, []);

  return {
    getSettings,
    updateSettings,
    initializeSettings
  };
} 