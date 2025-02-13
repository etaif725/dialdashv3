import { useState } from 'react';
import { getSupabase } from '../lib/supabase/client';
import { toast } from 'sonner';
import type { Database } from '../types/database.types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type UserProfile = Tables<'user_profiles'>;

export function useUserProfile() {
  const [loading, setLoading] = useState(false);

  const getUserProfile = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await getSupabase()
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to fetch user profile');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userId: string, updates: Partial<UserProfile>) => {
    setLoading(true);
    try {
      const { error } = await getSupabase()
        .from('user_profiles')
        .update(updates)
        .eq('id', userId);

      if (error) throw error;
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast.error('Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getUserProfile,
    updateUserProfile
  };
} 