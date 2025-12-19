import { useRouteContext } from '@tanstack/react-router';

import { OnboardingPage } from './OnboardingPage';
export const DashboardPage = () => {
  const { user } = useRouteContext({ from: '__root__' });
  if(!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>
        <h1>Welcome to Olam Kulo</h1>
      </div>
      {!user && <div>Loading...</div>}
      {user && <div>{user.email}</div>}
      {user?.homeCity ? (
        <div>
          <h2>Welcome to {user.homeCity}</h2>
        </div>
      ) : (
        <div>
          <OnboardingPage />
        </div>
      )}
    </>
  );
};
