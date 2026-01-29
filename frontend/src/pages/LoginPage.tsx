import { useSignIn } from '../authentication/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Input } from '../components/Input';
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
          <Input
            {...register('email')}
            type="email"
            placeholder="Email"
            label="Email"
            required
          />
        </div>
        <div>
          <Input
            {...register('password')}
            type="password"
            placeholder="Password"
            label='Password'
          />
        </div>
        {signInError && <div>{signInError.message}</div>}
        <button type="submit" disabled={signInPending || isSubmitting}>
          {signInPending ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
};
