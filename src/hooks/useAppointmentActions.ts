import { useState } from 'react';
import { getSupabase } from '../lib/supabase/client';
import { toast } from 'sonner';
import type { Database } from '../types/database.types';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type Appointment = Tables<'appointments'>;

export function useAppointmentActions() {
  const [loading, setLoading] = useState(false);

  const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
    setLoading(true);
    try {
      const { error } = await getSupabase()
        .from('appointments')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      toast.success('Appointment updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await getSupabase()
        .from('appointments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Appointment deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Failed to delete appointment');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    updateAppointment,
    deleteAppointment
  };
} 