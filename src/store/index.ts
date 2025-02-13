import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createLeadsSlice, LeadsSlice } from './slices/leads';
interface Store extends 
  LeadsSlice,
  AuthSlice,
  UISlice,
  SettingsSlice {}
export const useStore = create<Store>()(
  persist(
    (...args) => ({
      ...createLeadsSlice(...args),
      ...createAuthSlice(...args),
      ...createUISlice(...args),
      ...createSettingsSlice(...args),
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        settings: ,
        auth: {
          token: state.token,
          user: state.user,
        },
      }),
    }
  )
); 