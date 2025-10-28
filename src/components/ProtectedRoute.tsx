import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredType?: 'user' | 'admin';
}

export const ProtectedRoute = ({ children, requiredType }: ProtectedRouteProps) => {
  const { isAuthenticated, userType, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Check if user type matches required type
  if (requiredType && userType !== requiredType) {
    // Redirect admin to admin dashboard if trying to access user routes
    if (userType === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    // Redirect user to user dashboard if trying to access admin routes
    if (userType === 'user') {
      return <Navigate to="/resident" replace />;
    }
    // Fallback: redirect to home
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;