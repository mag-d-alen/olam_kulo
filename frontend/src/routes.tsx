import { lazy, Suspense } from 'react';
import { Loader } from './components/Loader';
import { useUser } from './authentication/hooks/useAuth';
import { Navigate } from 'react-router-dom';

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
  import('./pages/JourneyPage').then((module) => ({
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
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export const OnboardingRoute = () => {
  const { user } = useUser();
  if (user && user.homeCity) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <Suspense fallback={<Loader />}>
      <LazyOnboardingPage />
    </Suspense>
  );
};

export const DashboardRoute = () => {
  const { user } = useUser();
  if (user && !user.homeCity) {
    return <Navigate to="/onboarding" replace />;
  }
  return (
    <Suspense fallback={<Loader />}>
      <LazyDashboardPage />
    </Suspense>
  );
};

export const JourneyTrackerRoute = () => {
  const { user } = useUser();
  if (user && !user.destinationCity) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <Suspense fallback={<Loader />}>
      <LazyJourneyPage />
    </Suspense>
  );
};
