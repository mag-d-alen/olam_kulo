import { useSignIn } from '../features/authorisation/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { Link } from '@tanstack/react-router';
export const LoginPage = () => {
  const {
    register,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<{ email: string; password: string }>();
  const { signIn, error: signInError, isPending: signInPending } = useSignIn();

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit((data) => signIn(data))}>
        <div>
          <input
            {...register('email')}
            type='email'
            placeholder='Email'
            required
          />
        </div>
        <div>
          <input
            type='password'
            placeholder='Password'
            {...register('password')}
          />
        </div>
        {signInError && <div>{signInError.message}</div>}
        <button type='submit' disabled={signInPending || isSubmitting}>
          {signInPending ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p>
        Don't have an account? <Link to='/signup'>Sign up</Link>
      </p>
    </div>
  );
};
