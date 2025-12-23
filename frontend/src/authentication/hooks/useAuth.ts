import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sessionManager } from '../../services/session';
import { authApi, SignUpData } from '../api/authApi';
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
    queryKey: [...authKeys.user()],
    queryFn: async () => {
      if (!session?.access_token) return null;
      const user = await authApi.getUser();
      return user;
    },
    enabled: !!session?.access_token,
  });
  console.log('userData', userData);
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
      return response;
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: authKeys.user() });
      await queryClient.refetchQueries({ queryKey: authKeys.session() });

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          navigate({ to: '/signup', replace: true });
        });
      });
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
      const userData = await authApi.getUser();
      return { user: userData, session: response.session };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user(), data.user);
      queryClient.setQueryData(authKeys.session(), data.session);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          navigate({ to: '/login', replace: true });
        });
      });
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
      queryClient.setQueryData(authKeys.session(), null);
      queryClient.setQueryData(authKeys.user(), null);
      navigate({ to: '/login' });
    },
  });
  return {
    signOut,
    isPending,
    error,
  };
};
