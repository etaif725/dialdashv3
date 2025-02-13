import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { ForgotPwForm } from '@/components/auth/ForgotPwForm';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Dashboard } from '@/pages/Dashboard/index';
import CompaniesPage from '@/pages/Companies/index';
import { Leads } from '@/pages/Leads/index';
import { Appointments } from '@/pages/Appointments/index';
import { Analytics } from '@/pages/Analytics/index';
import { Settings } from '@/pages/Settings/index';
import { ThemeProvider } from '@/contexts';
import { RetellProvider } from './contexts/RetellContext';
import { LoadingScreen } from './components/LoadingScreen';
import { useAuth } from './contexts/AuthContext';
import { AIShowcase } from './pages/AIShowcase';

// Protected route wrapper component
{/* function ProtectedRouteWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
} */}

// Public route wrapper component (accessible only when not authenticated)
function PublicRouteWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RetellProvider>
          <Routes>
            {/* Public routes */}
            <Route
              path="/auth"
              element={
                <PublicRouteWrapper>
                  <AuthForm type="signin" />
                </PublicRouteWrapper>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRouteWrapper>
                  <ForgotPwForm />
                </PublicRouteWrapper>
              }
            />

            {/* Protected routes */}
            <Route
              path="/*"
              element={
                <DashboardLayout />
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="ai-employees" element={<AIShowcase />} />
              <Route path="companies" element={<CompaniesPage />} />
              <Route path="leads" element={<Leads />} />
              <Route path="appointments" element={<Appointments />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Root route redirects to dashboard if authenticated, auth if not */}
            <Route path="/" element={<Navigate to="/" />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/auth" />} />
          </Routes>
        </RetellProvider>
      </ThemeProvider>
      <ToastProvider />
    </AuthProvider>
  );
}