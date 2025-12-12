import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../services/supabase';
import {
  authService,
  SignInData,
  SignUpData,
} from '../../../services/authService';
import { useNavigate } from 'react-router-dom';

export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

export const useSession = () => {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUser = () => {
  const { data: session, ...rest } = useSession();
  return {
    ...rest,
    user: session?.user ?? null,
  };
};

export const useSignUp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    mutate: signUp,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: SignUpData) => {
      const response = await authService.signUp(data);
      if (response.session) {
        await supabase.auth.setSession(response.session);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      navigate('/dashboard');
    },
  });
  return {
    signUp,
    isPending,
    error,
  };
};

export const useSignIn = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    mutate: signIn,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (data: SignInData) => {
      const response = await authService.signIn(data);
      if (response.session) {
        await supabase.auth.setSession(response.session);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      navigate('/dashboard');
    },
  });
  return {
    signIn,
    isPending,
    error,
  };
};

export const useSignOut = () => {
  const queryClient = useQueryClient();

  const {
    mutate: signOut,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      await authService.signOut();
    },
    onSuccess: () => {
      queryClient.setQueryData(authKeys.session(), null);
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
  return {
    signOut,
    isPending,
    error,
  };
};

export const useOAuthCallback = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate: oauthCallback,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (code: string) => {
      const response = await authService.handleOAuthCallback(code);
      if (response.session) {
        await supabase.auth.setSession(response.session);
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      navigate('/dashboard');
    },
  });
  return {
    oauthCallback,
    isPending,
    error,
  };
};

export const useCurrentUser = () => {
  const { data: session, isLoading, error } = useSession();

  const { data: user } = useQuery({
    queryKey: [...authKeys.user(), 'profile'],
    queryFn: async () => {
      if (!session?.access_token) return null;
      return await authService.getCurrentUser(session.access_token);
    },
    enabled: !!session?.access_token,
    staleTime: 5 * 60 * 1000,
  });
  return {
    user,
    isLoading,
    error,
  };
};
