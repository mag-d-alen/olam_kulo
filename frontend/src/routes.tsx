import { lazy, Suspense } from 'react';
import { Loader } from './components/Loader';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from './authentication/contexts/AuthContext';

const LazyOnboardingPage = lazy(() =>
  import('./pages/OnboardingPage').then((module) => ({
    default: module.OnboardingPage,
  }))
);
const LazyDashboardPage = lazy(() =>
  import('./pages/DashboardPage').then((module) => ({
    default: module.DashboardPage,
  }))
);
const LazyJourneyPage = lazy(() =>
  import('./features/showJourney/JourneyMap').then((module) => ({
    default: module.JourneyPage,
  }))
);

export const LazyLoginPage = lazy(() =>
  import('./pages/LoginPage').then((module) => ({ default: module.LoginPage }))
);
export const LazySignUpPage = lazy(() =>
  import('./pages/SignUpPage').then((module) => ({
    default: module.SignUpPage,
  }))
);

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuthContext();
  if (!user && !isLoading) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const OnboardingRoute = () => {
  const { user, isLoading } = useAuthContext();
  if (user && user.homeCity?.city) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <Suspense fallback={isLoading ? <Loader /> : null}>
      <LazyOnboardingPage />
    </Suspense>
  );
};

export const DashboardRoute = () => {
  const { user, isLoading } = useAuthContext();
  if (user && !user.homeCity?.city) {
    return <Navigate to="/onboarding" replace />;
  }
  return (
    <Suspense fallback={isLoading ? <Loader /> : null}>
      <LazyDashboardPage />
    </Suspense>
  );
};

export const JourneyTrackerRoute = () => {
  const { user, isLoading } = useAuthContext();
  if (user && !user.destination?.city) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <Suspense fallback={isLoading ? <Loader /> : null}>
      <LazyJourneyPage />
    </Suspense>
  );
};
