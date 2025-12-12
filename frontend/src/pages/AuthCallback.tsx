import { useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import {
  useOAuthCallback,
  useSession,
} from '../features/authorisation/hooks/useAuth';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { oauthCallback, error: oauthError } = useOAuthCallback();
  const { data: session } = useSession();

  const code = useMemo(() => searchParams.get('code'), [searchParams]);
  const errorParam = useMemo(() => searchParams.get('error'), [searchParams]);

  useEffect(() => {
    const handleCallback = async () => {
      if (errorParam) {
        setTimeout(() => navigate('/login'), 3000);
        return;
      }
      if (code) {
        oauthCallback(code);
      } else {
        if (session) {
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      }
    };

    handleCallback();
  }, [code, errorParam]);

  const error = oauthError || errorParam;

  const getErrorMessage = (error: unknown): string => {
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      return axiosError.response?.data?.message || 'Failed to authenticate';
    }
    return 'Failed to authenticate';
  };

  if (error) {
    const errorMessage = getErrorMessage(error);

    return (
      <div>
        <h2>Authentication Error</h2>
        <p>{errorMessage}</p>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Completing authentication...</h2>
    </div>
  );
};

export default AuthCallback;
