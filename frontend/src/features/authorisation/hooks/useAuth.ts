import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../services/supabase';
import {
  authService,
  SignInData,
  SignUpData,
} from '../../../services/authService';
import { useNavigate } from '@tanstack/react-router';

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
  const { data: session, isLoading: sessionLoading, ...rest } = useSession();

  // Fetch public user data
  const { data: userData, isLoading: publicUserLoading } = useQuery({
    queryKey: [...authKeys.user(), 'profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching public user:', error);
        return null;
      }

      return userData;
    },
    enabled: !!session?.user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    ...rest,
    user: userData,
    isLoading: sessionLoading || publicUserLoading,
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
      navigate({ to: '/app/dashboard' });
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
      navigate({ to: '/app/dashboard' });
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
  const navigate = useNavigate();

  const {
    mutate: signOut,
    isPending,
    error,
  } = useMutation({
    mutationFn: async () => {
      await authService.signOut();
    },
    onSuccess: () => {
      console.log('signOut success');
      console.log(authKeys.all);
      queryClient.setQueryData(authKeys.session(), null);
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      navigate({ to: '/login' });
    },
  });
  return {
    signOut,
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
