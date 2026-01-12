import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Suspense } from 'react';
import { Loader } from './components/Loader';
import {
  PublicRoute,
  LazyLoginPage,
  LazySignUpPage,
  ProtectedRoute,
  OnboardingRoute,
  DashboardRoute,
  JourneyTrackerRoute,
} from './routes';

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
              <OnboardingRoute />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardRoute />
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
