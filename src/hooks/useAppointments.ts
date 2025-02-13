import { useCallback, useState } from 'react';
import type { Database } from '../types/database.types';
import { useSupabase } from './useSupabase';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type Appointment = Tables<'appointments'>;

interface UseAppointmentsOptions {
  organizationId?: string;
  onError?: (error: any) => void;
}

export function useAppointments(options: UseAppointmentsOptions = {}) {
  const { organizationId, onError } = options;
  const [loading, setLoading] = useState(false);
  const { getAll, getById, create, update, remove } = useSupabase({
    handleError: onError,
  });

  const getAppointments = useCallback(async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }) => {
    setLoading(true);
    try {
      const { data, count } = await getAll('appointments', {
        page: params?.page,
        limit: params?.limit,
        filters: {
          ...(organizationId && { organization_id: organizationId }),
          ...(params?.status && { status: params.status }),
          ...(params?.fromDate && { scheduled_at: params.fromDate }),
          ...(params?.toDate && { scheduled_at: params.toDate }),
        },
      });

      return {
        appointments: data as Appointment[],
        total: count || 0,
      };
    } finally {
      setLoading(false);
    }
  }, [getAll, organizationId]);

  const getAppointment = useCallback(async (id: string) => {
    setLoading(true);
    try {
      return await getById('appointments', id);
    } finally {
      setLoading(false);
    }
  }, [getById]);

  const createAppointment = useCallback(async (data: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      return await create('appointments', {
        ...data,
        organization_id: organizationId || data.organization_id,
        status: data.status || 'scheduled',
      });
    } finally {
      setLoading(false);
    }
  }, [create, organizationId]);

  const updateAppointment = useCallback(async (
    id: string,
    data: Partial<Omit<Appointment, 'id' | 'created_at' | 'updated_at'>>
  ) => {
    setLoading(true);
    try {
      return await update('appointments', id, data);
    } finally {
      setLoading(false);
    }
  }, [update]);

  const deleteAppointment = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await remove('appointments', id);
    } finally {
      setLoading(false);
    }
  }, [remove]);

  const updateAppointmentStatus = useCallback(async (
    id: string,
    status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  ) => {
    setLoading(true);
    try {
      return await update('appointments', id, { status });
    } finally {
      setLoading(false);
    }
  }, [update]);

  const getUpcomingAppointments = useCallback(async (params?: {
    page?: number;
    limit?: number;
  }) => {
    setLoading(true);
    try {
      const now = new Date().toISOString();
      const { data, count } = await getAll('appointments', {
        page: params?.page,
        limit: params?.limit,
        filters: {
          ...(organizationId && { organization_id: organizationId }),
          status: 'scheduled',
        },
      });

      // Filter appointments that are scheduled for the future
      const upcomingAppointments = (data as Appointment[]).filter(
        (appointment) => appointment.scheduled_at > now
      );

      return {
        appointments: upcomingAppointments,
        total: count || 0,
      };
    } finally {
      setLoading(false);
    }
  }, [getAll, organizationId]);

  return {
    loading,
    getAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    updateAppointmentStatus,
    getUpcomingAppointments,
  };
} 