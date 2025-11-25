import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { authService, adminService } from "@/services/api";

export type AdminRole = "admin" | "official" | "capitan";

export interface AdminInfo {
  id: number;
  name: string;
  username: string;
  role: AdminRole;
}

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  id: number;
  name: string;
  username: string;
  role: AdminRole;
  token: string;
  token_type: string;
  message?: string;
}

interface AdminContextType {
  adminInfo: AdminInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isOfficial: boolean;
  isCapitan: boolean;
  hasRole: (role: AdminRole | AdminRole[]) => boolean;
  login: (credentials: AdminLoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  refreshAdminInfo: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const {
    isAuthenticated: authIsAuthenticated,
    userType,
    adminInfo: authAdminInfo,
    login: authLogin,
    logout: authLogout,
    loading: authLoading,
  } = useAuth();
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check if admin is authenticated
  const isAuthenticated =
    authIsAuthenticated && userType === "admin" && !!adminInfo;

  // Check if user has admin role
  const isAdmin = adminInfo?.role === "admin";

  // Check if user has official role
  const isOfficial = adminInfo?.role === "official";

  // Check if user has capitan role
  const isCapitan = adminInfo?.role === "capitan";

  // Check if user has specific role(s)
  const hasRole = (role: AdminRole | AdminRole[]): boolean => {
    if (!adminInfo) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(adminInfo.role);
  };

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Update admin info when auth context changes
  useEffect(() => {
    if (authAdminInfo && userType === "admin") {
      setAdminInfo(authAdminInfo as AdminInfo);
    } else {
      setAdminInfo(null);
    }
    setIsLoading(authLoading);
  }, [authAdminInfo, userType, authLoading]);

  const checkAuth = () => {
    const token = localStorage.getItem("auth_token");
    const type = localStorage.getItem("user_type");

    if (token && type === "admin") {
      const storedAdminInfo = authService.getStoredAdminInfo();
      if (storedAdminInfo) {
        setAdminInfo(storedAdminInfo as AdminInfo);
      }
    } else {
      setAdminInfo(null);
    }
    setIsLoading(false);
  };

  const login = async (credentials: AdminLoginRequest): Promise<void> => {
    try {
      const response = await authService.adminLogin(credentials);

      // Validate role
      if (
        response.role !== "admin" &&
        response.role !== "official" &&
        response.role !== "capitan"
      ) {
        throw new Error("Invalid role received from server");
      }

      const adminData: AdminInfo = {
        id: response.id,
        name: response.name,
        username: response.username,
        role: response.role as AdminRole,
      };

      setAdminInfo(adminData);
      authLogin(adminData, "admin");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Login failed. Please check your credentials.";
      throw new Error(errorMessage);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.adminLogout();
    } catch (error) {
      console.error("Admin logout error:", error);
    } finally {
      setAdminInfo(null);
      authLogout();
    }
  };

  const refreshAdminInfo = async (): Promise<void> => {
    try {
      const response = await adminService.getCurrentAdmin();

      if (response.admin_info) {
        const freshAdminData: AdminInfo = {
          id: response.admin_info.id,
          name: response.admin_info.name,
          username: response.admin_info.username,
          role: response.admin_info.role as AdminRole,
        };

        setAdminInfo(freshAdminData);

        // Also update auth context
        authLogin(freshAdminData, "admin");
      }
    } catch (error) {
      console.error("Failed to refresh admin info:", error);
      throw error;
    }
  };

  const value: AdminContextType = {
    adminInfo,
    isAuthenticated,
    isLoading,
    isAdmin,
    isOfficial,
    isCapitan,
    hasRole,
    login,
    logout,
    checkAuth,
    refreshAdminInfo,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};

export default AdminContext;
