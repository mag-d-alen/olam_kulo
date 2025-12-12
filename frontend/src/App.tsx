import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthStateListener } from './providers/AuthStateListener';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import AuthCallback from './pages/AuthCallback';
import ProtectedRoute from './components/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
function App() {
  return (
    <AuthStateListener>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/auth/callback' element={<AuthCallback />} />
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthStateListener>
  );
}

export default App;
