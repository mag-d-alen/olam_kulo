import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './authentication/contexts/AuthContext';
import { lazy } from 'react';
import { AppRouter } from './router';
import './index.css';

const queryClient = new QueryClient();
const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((module) => ({
    default: module.ReactQueryDevtools,
  }))
);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
