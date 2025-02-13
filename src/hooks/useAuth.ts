import { useContext } from 'react';
import type { User } from '@supabase/supabase-js';
import type { UserProfile, Company } from '../types/api';
import { AuthContext } from '@/contexts/AuthContext';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  organization: Company | null;
  isLoading: boolean;
  signIn: (data: { user: User; profile: UserProfile; organization: Company }) => void;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context as AuthContextType;
}