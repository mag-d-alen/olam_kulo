import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { useAuthContext } from './authentication/contexts/AuthContext';
import { JourneyPage } from './pages/JourneyPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthContext();
  if (!user) {
    return <Navigate to="/login" replace />;
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
  return <OnboardingPage />;
};

const OnboardingRoute = () => {
  const { user } = useAuthContext();
  console.log('from onboarding route', user);

  if (user && user.destinationCity) {
    return <Navigate to="/journeyTracker" replace />;
  }
  return <OnboardingPage />;
};

const JourneyTrackerRoute = () => {
  const { user } = useAuthContext();
  if (user && !user.destinationCity) {
    return <Navigate to="/dashboard" replace />;
  }
  return <JourneyPage />;
};

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          path="login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="signup"
          element={
            <PublicRoute>
              <SignUpPage />
            </PublicRoute>
          }
        />
        <Route
          path="onboarding"
          element={
            <ProtectedRoute>
              <OnboardingRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="journeyTracker"
          element={
            <ProtectedRoute>
              <JourneyTrackerRoute />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
};
