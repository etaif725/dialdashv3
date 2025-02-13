import { useState } from 'react';
import { getSupabase } from '../lib/supabase/client';
import { toast } from 'sonner';
import type { Lead } from '../lib/supabase/types';

export function useLeadActions() {
  const [loading, setLoading] = useState(false);

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    setLoading(true);
    try {
      const { error } = await getSupabase()
        .from('leads')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      toast.success('Lead updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteLead = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await getSupabase()
        .from('leads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Lead deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting lead:', error);
      toast.error('Failed to delete lead');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateLead,
    deleteLead
  };
} 