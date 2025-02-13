import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './ui/LoadingSpinner';

export function LoadingScreen() {
  const { user, userProfile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (!userProfile) {
        // If user exists but profile or company is missing, sign out as this is an invalid state
        signOut();
        navigate('/auth');
      } else {
        navigate('/');
      }
    }
  }, [user, userProfile, loading, navigate, signOut]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading...</h2>
        <p className="mt-2 text-sm text-gray-500">Please wait while we prepare your workspace</p>
      </div>
    </div>
  );
} 