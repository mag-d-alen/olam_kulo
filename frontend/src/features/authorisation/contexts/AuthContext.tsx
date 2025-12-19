import React, { createContext, useContext, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../services/supabase';
import { useSession, useUser, authKeys } from '../hooks/useAuth';
import { User } from '../types';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const queryClient = useQueryClient();
  const { data: session, isLoading: sessionLoading } = useSession();
  const { user, isLoading: userLoading } = useUser();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const isLoading = sessionLoading || userLoading;

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        session: session || null,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
