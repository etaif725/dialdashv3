import { create } from 'zustand';
import { api } from '../lib/api/client';
import type { Lead } from '../types/database';

interface LeadsState {
  leads: Lead[];
  isLoading: boolean;
  error: Error | null;
  fetchLeads: (params?: { page?: number; limit?: number }) => Promise<void>;
  createLead: (data: Omit<Lead, 'id'>) => Promise<void>;
  updateLead: (id: string, data: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
}

export const useLeadsStore = create<LeadsState>((set, get) => ({
  leads: [],
  isLoading: false,
  error: null,

  fetchLeads: async (params) => {
    try {
      set({ isLoading: true });
      const { data } = await api.getLeads(params);
      set({ leads: data, error: null });
    } catch (error) {
      set({ error: error as Error });
    } finally {
      set({ isLoading: false });
    }
  },

  createLead: async (data) => {
    try {
      set({ isLoading: true });
      const { data: newLead } = await api.createLead(data);
      set((state) => ({
        leads: [...state.leads, newLead],
        error: null,
      }));
    } catch (error) {
      set({ error: error as Error });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Add other methods...
})); 