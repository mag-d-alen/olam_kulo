import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../services/supabase';
import { authService, SignUpData } from '../../../services/authService';
import { useNavigate } from '@tanstack/react-router';
import { User } from '../types';

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
  const { data: userData, isLoading: publicUserLoading } = useQuery({
    queryKey: [...authKeys.user()],
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
    user: userData
      ? ({
          id: userData.id,
          email: userData.email,
          homeCity: userData.home_city,
          homeCountry: userData.home_country,
        } as User)
      : null,
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
        queryClient.setQueryData(authKeys.user(), response.user);
        queryClient.invalidateQueries({ queryKey: authKeys.user() });
      }
      return response;
    },
    onSuccess: () => {
      navigate({ to: '/dashboard' });
    },
  });
  return {
    signUp,
    isPending,
    error,
  };
};

export const useSignIn = () => {
  const navigate = useNavigate();
  const {
    mutate: signIn,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      navigate({ to: '/dashboard' });
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
      console.log(authKeys.user());
      console.log(authKeys.session());
      queryClient.setQueryData(authKeys.session(), null);
      queryClient.setQueryData(authKeys.user(), null);
      // queryClient.invalidateQueries({
      //   queryKey: [...authKeys.user()],
      // });

      navigate({ to: '/login' });
    },
  });
  return {
    signOut,
    isPending,
    error,
  };
};
