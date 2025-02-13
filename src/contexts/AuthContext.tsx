import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase/client';
import type { Database } from '@/types/database.types';
import { toast } from 'sonner';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, companyData: any) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userProfile: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await getSupabase().auth.signInWithPassword({
        email,
        password
      });
      if (error || !data.session) throw error || new Error('Failed to sign in');
      
      toast.success('Signed in successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string, companyData: any) => {
    try {
      // Create auth user
      const { data: { user: newUser }, error: signUpError } = await getSupabase().auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      
      if (signUpError || !newUser?.id) throw signUpError || new Error('Failed to create user');

      // Create company
      const { data: company, error: companyError } = await getSupabase()
        .from('companies')
        .insert([{
          user_id: newUser.id,
          ...companyData,
          company_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }])
        .select()
        .single();

      if (companyError) throw companyError;

      // Create user profile
      const { error: profileError } = await getSupabase()
        .from('user_profiles')
        .insert([{
          id: newUser.id,
          email,
          full_name: fullName,
          organization_id_main: company.id,
          role: 'admin', // First user is admin
          is_admin: true,
          is_user: true,
          is_active: true
        }]);

      if (profileError) throw profileError;

      // Create default user settings
      const { error: settingsError } = await getSupabase()
        .from('user_settings')
        .insert([{
          user_id: newUser.id
        }]);

      if (settingsError) throw settingsError;

      toast.success('Account created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await getSupabase().auth.signOut();
      if (error) throw error;
      
      // Clear all auth state
      setSession(null);
      setUser(null);
      setUserProfile(null);
      
      // Navigate to auth page
      window.location.href = '/auth';
      
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await getSupabase().auth.getSession();
        
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);

          if (initialSession?.user) {
            const { data: profile } = await getSupabase()
              .from('user_profiles')
              .select('*')
              .eq('id', initialSession.user.id)
              .single();
              
            if (mounted) {
              setUserProfile(profile);
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Initialize auth state
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = getSupabase().auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const { data: profile } = await getSupabase()
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (mounted) {
            setUserProfile(profile);
          }
        } else {
          setUserProfile(null);
        }
      }
    );

    // Cleanup
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      userProfile, 
      loading, 
      signIn,
      signUp,
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 