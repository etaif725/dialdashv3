import { useCallback } from 'react';
import { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import { getSupabase } from '../lib/supabase/client';
import { supabaseService } from '../lib/supabase';
import type { Database } from '../types/database.types';

type TableName = keyof Database['public']['Tables'];
type Row<T extends TableName> = Database['public']['Tables'][T]['Row'];
type Insert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
type Update<T extends TableName> = Database['public']['Tables'][T]['Update'];

interface UseSupabaseOptions {
  handleError?: (error: any) => void;
}

export function useSupabase(options: UseSupabaseOptions = {}) {
  const { handleError = console.error } = options;

  const handleSupabaseError = useCallback((error: any) => {
    handleError(error);
    throw error;
  }, [handleError]);

  const getById = useCallback(async <T extends TableName>(
    table: T,
    id: string
  ): Promise<Row<T> | null> => {
    try {
      const { data, error } = await getSupabase()
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      handleSupabaseError(error);
      return null;
    }
  }, [handleSupabaseError]);

  const getAll = useCallback(async <T extends TableName>(
    table: T,
    options?: {
      page?: number;
      limit?: number;
      filters?: Record<string, any>;
      search?: { column: string; query: string };
    }
  ) => {
    try {
      let query = getSupabase().from(table).select('*', { count: 'exact' });

      // Apply filters
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            (query as PostgrestFilterBuilder<any, any, any>).eq(key, value);
          }
        });
      }

      // Apply search
      if (options?.search) {
        query = query.ilike(options.search.column, `%${options.search.query}%`);
      }

      // Apply pagination
      if (options?.page !== undefined && options?.limit !== undefined) {
        const from = (options.page - 1) * options.limit;
        const to = from + options.limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) throw error;
      return { data, count };
    } catch (error) {
      handleSupabaseError(error);
      return { data: [], count: 0 };
    }
  }, [handleSupabaseError]);

  const create = useCallback(async <T extends TableName>(
    table: T,
    data: Insert<T>
  ): Promise<Row<T>> => {
    try {
      const { data: created, error } = await getSupabase()
        .from(table)
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      return created;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }, [handleSupabaseError]);

  const update = useCallback(async <T extends TableName>(
    table: T,
    id: string,
    data: Update<T>
  ): Promise<Row<T>> => {
    try {
      const { data: updated, error } = await getSupabase()
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }, [handleSupabaseError]);

  const remove = useCallback(async <T extends TableName>(
    table: T,
    id: string
  ): Promise<void> => {
    try {
      const { error } = await getSupabase()
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      handleSupabaseError(error);
      throw error;
    }
  }, [handleSupabaseError]);

  return {
    getById,
    getAll,
    create,
    update,
    remove,
    supabase: getSupabase(),
    supabaseService,
  };
} 