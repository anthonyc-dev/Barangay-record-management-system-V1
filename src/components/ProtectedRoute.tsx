import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredType?: "user" | "admin" | "official" | "capitan";
}

export const ProtectedRoute = ({
  children,
  requiredType,
}: ProtectedRouteProps) => {
  const { isAuthenticated, userType, loading } = useAuth();

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

  // Redirect to appropriate login page if not authenticated
  if (!isAuthenticated) {
    if (requiredType === "admin") {
      return <Navigate to="/admin/login" replace />;
    }
    if (requiredType === "user") {
      return <Navigate to="/resident/login" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Check if user type matches required type
  if (requiredType && userType !== requiredType) {
    if (userType === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (userType === "user") {
      return <Navigate to="/resident" replace />;
    }

    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
