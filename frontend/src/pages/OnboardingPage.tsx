import { useNavigate } from '@tanstack/react-router';
import { HomeCityNameForm } from '../features/homeCityInfo/HomeCityNameForm';
import { useUser } from '../authentication/hooks/useAuth';

export const OnboardingPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  if (user && user.homeCity) {
    navigate({ to: '/dashboard' });
    return <></>;
  }
  return <HomeCityNameForm />;
};
