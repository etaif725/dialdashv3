import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingScreen } from '@/components/LoadingScreen';
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, profile, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user || !profile) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiredRole && profile.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 