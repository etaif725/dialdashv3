import type { UserProfile } from './database';

export type User = UserProfile;

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  signIn: (user: User, token: string) => void;
  signOut: () => void;
} 