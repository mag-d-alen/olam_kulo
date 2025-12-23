import React, { createContext, useContext } from 'react';
import { useSession, useUser } from '../hooks/useAuth';
import { User } from '../types';
import { Session } from '../../services/session';

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
  const { data: session, isLoading: sessionLoading } = useSession();
  const { user, isLoading: userLoading } = useUser();

  const isLoading = sessionLoading || userLoading;

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        session: session || null,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
