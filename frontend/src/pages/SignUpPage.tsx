import { Link } from 'react-router-dom';
import { useSignUp } from '../features/authorisation/hooks/useAuth';
import { useForm } from 'react-hook-form';

export const SignUpPage = () => {
  const { signUp, error: signUpError, isPending: signUpPending } = useSignUp();
  const {
    register,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<{ email: string; password: string }>();

  const errorMessage = signUpError?.message || 'Failed to sign up';

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit((data) => signUp(data))}>
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
            {...register('password')}
            type='password'
            placeholder='Password'
            required
          />
        </div>
        {signUpError && <div>{errorMessage}</div>}
        <button type='submit' disabled={signUpPending || isSubmitting}>
          {signUpPending ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <p>
        Already have an account? <Link to='/login'>Login</Link>
      </p>
    </div>
  );
};
