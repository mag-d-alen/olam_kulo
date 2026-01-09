import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useAuthContext } from './authentication/contexts/AuthContext';
import { lazy, Suspense } from 'react';
import { Loader } from './components/Loader';

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
const LazyLoginPage = lazy(() =>
  import('./pages/LoginPage').then((module) => ({ default: module.LoginPage }))
);
const LazySignUpPage = lazy(() =>
  import('./pages/SignUpPage').then((module) => ({
    default: module.SignUpPage,
  }))
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user && !user.homeCity) {
    return <Navigate to="/onboarding" replace />;
  }
  return <OnboardedRoute>{children}</OnboardedRoute>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

const OnboardedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  if (user && user.homeCity) {
    return <>{children}</>;
  }
  return (
    <Suspense fallback={<Loader />}>
      <LazyOnboardingPage />
    </Suspense>
  );
};

const OnboardingRoute = () => {
  const { user } = useAuthContext();
  if (user && user.destinationCity) {
    return <Navigate to="/journeyTracker" replace />;
  }
  return (
    <Suspense fallback={<Loader />}>
      <LazyOnboardingPage />
    </Suspense>
  );
};

const JourneyTrackerRoute = () => {
  const { user } = useAuthContext();
  if (user && !user.destinationCity) {
    return <Navigate to="/dashboard" replace />;
  }
  return (
    <Suspense fallback={<Loader />}>
      <LazyJourneyPage />
    </Suspense>
  );
};

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          path="login"
          element={
            <PublicRoute>
              <Suspense fallback={<Loader />}>
                <LazyLoginPage />
              </Suspense>
            </PublicRoute>
          }
        />
        <Route
          path="signup"
          element={
            <PublicRoute>
              <Suspense fallback={<Loader />}>
                <LazySignUpPage />
              </Suspense>
            </PublicRoute>
          }
        />
        <Route
          path="onboarding"
          element={
            <ProtectedRoute>
              <Suspense fallback={<Loader />}>
                <OnboardingRoute />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Suspense fallback={<Loader />}>
                <LazyDashboardPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="journeyTracker"
          element={
            <ProtectedRoute>
              <Suspense fallback={<Loader />}>
                <JourneyTrackerRoute />
              </Suspense>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};
