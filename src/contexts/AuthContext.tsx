import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authService } from "@/services/api";

interface UserInfo {
  id: number;
  name: string;
  email: string;
}

interface AdminInfo {
  id: number;
  name: string;
  username: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userType: "user" | "admin" | null;
  userInfo: UserInfo | null;
  adminInfo: AdminInfo | null;
  loading: boolean;
  logoutLoading: boolean;
  login: (userInfo: UserInfo | AdminInfo, type: "user" | "admin") => void;
  logout: () => void;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userType, setUserType] = useState<"user" | "admin" | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("auth_token");
    const type = localStorage.getItem("user_type") as "user" | "admin" | null;

    if (token && type) {
      setIsAuthenticated(true);
      setUserType(type);

      if (type === "user") {
        const storedUserInfo = authService.getStoredUserInfo();
        setUserInfo(storedUserInfo);
      } else if (type === "admin") {
        const storedAdminInfo = authService.getStoredAdminInfo();
        setAdminInfo(storedAdminInfo);
      }
    } else {
      setIsAuthenticated(false);
      setUserType(null);
      setUserInfo(null);
      setAdminInfo(null);
    }

    setLoading(false);
  };

  const login = (info: UserInfo | AdminInfo, type: "user" | "admin") => {
    setIsAuthenticated(true);
    setUserType(type);

    if (type === "user") {
      setUserInfo(info as UserInfo);
      setAdminInfo(null);
    } else {
      setAdminInfo(info as AdminInfo);
      setUserInfo(null);
    }
  };

  const logout = async () => {
    setLogoutLoading(true);
    try {
      if (userType === "admin") {
        await authService.adminLogout();
      } else {
        await authService.userLogout();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsAuthenticated(false);
      setUserType(null);
      setUserInfo(null);
      setAdminInfo(null);
      setLogoutLoading(false);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    userType,
    userInfo,
    adminInfo,
    loading,
    logoutLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
