import { useCallback, useState } from 'react';
import type { Database } from '../types/database.types';
import { useSupabase } from './useSupabase';

type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type Lead = Tables<'leads'>;

interface UseLeadsOptions {
  organizationId?: string;
  onError?: (error: any) => void;
}

export function useLeads(options: UseLeadsOptions = {}) {
  const { organizationId, onError } = options;
  const [loading, setLoading] = useState(false);
  const { getAll, getById, create, update, remove } = useSupabase({
    handleError: onError,
  });

  const getLeads = useCallback(async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) => {
    setLoading(true);
    try {
      const { data, count } = await getAll('leads', {
        page: params?.page,
        limit: params?.limit,
        filters: {
          ...(organizationId && { organization_id: organizationId }),
          ...(params?.status && { status: params.status }),
        },
        ...(params?.search && {
          search: { column: 'full_name', query: params.search },
        }),
      });

      return {
        leads: data as Lead[],
        total: count || 0,
      };
    } finally {
      setLoading(false);
    }
  }, [getAll, organizationId]);

  const getLead = useCallback(async (id: string) => {
    setLoading(true);
    try {
      return await getById('leads', id);
    } finally {
      setLoading(false);
    }
  }, [getById]);

  const createLead = useCallback(async (data: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      return await create('leads', {
        ...data,
        organization_id: organizationId || data.organization_id,
        call_attempts: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [create, organizationId]);

  const updateLead = useCallback(async (
    id: string,
    data: Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at'>>
  ) => {
    setLoading(true);
    try {
      return await update('leads', id, data);
    } finally {
      setLoading(false);
    }
  }, [update]);

  const deleteLead = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await remove('leads', id);
    } finally {
      setLoading(false);
    }
  }, [remove]);

  const incrementCallAttempts = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const lead = await getById('leads', id);
      if (!lead) throw new Error('Lead not found');

      return await update('leads', id, {
        call_attempts: (lead as Lead).call_attempts + 1,
        last_called_at: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  }, [getById, update]);

  return {
    loading,
    getLeads,
    getLead,
    createLead,
    updateLead,
    deleteLead,
    incrementCallAttempts,
  };
} 