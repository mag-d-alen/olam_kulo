import { useNavigate } from 'react-router-dom';
import { HomeCityNameForm } from '../features/homeCityInfo/HomeCityNameForm';
import { useUser } from '../authentication/hooks/useAuth';

export const OnboardingPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  if (user && user.homeCity) {
    navigate('/dashboard', { replace: true });
    return <></>;
  }
  return <HomeCityNameForm />;
};
