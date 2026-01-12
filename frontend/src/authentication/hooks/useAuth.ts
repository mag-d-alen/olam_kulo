import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sessionManager } from '../../services/session';
import { authApi, SignUpData } from '../api/authApi';
import { useNavigate } from 'react-router-dom';

export const useSession = () => {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const session = sessionManager.getSession();
      return session ?? null;
    },
    initialData: () => null,
    placeholderData: null,
  });
};

export const useUser = () => {
  const { data: session, isLoading: sessionLoading, ...rest } = useSession();
  const { data: userData, isLoading: publicUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => authApi.getUser(),
    enabled: !!session?.access_token,
    staleTime: 1000 * 60 * 5,
  });
  return {
    ...rest,
    user: userData ?? null,
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
      const response = await authApi.signUp(data);
      return { user: response.user, session: response.session };
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(['user'], data.user);
      queryClient.setQueryData(['session'], data.session);
      navigate('/onboarding', { replace: true });
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
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await authApi.signIn({
        email,
        password,
      });
      if (!response.user.id) {
        throw new Error('Invalid response data');
      }

      return { user: response.user, session: response.session };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data.user);
      queryClient.setQueryData(['session'], data.session);
      navigate('/dashboard', { replace: true });
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
      await authApi.signOut();
    },
    onSuccess: () => {
      queryClient.setQueryData(['session'], null);
      queryClient.setQueryData(['user'], null);
      navigate('/login');
    },
  });
  return {
    signOut,
    isPending,
    error,
  };
};
