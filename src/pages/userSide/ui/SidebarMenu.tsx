import { cn } from "@/lib/utils";
import {
  Home,
  FileText,
  Megaphone,
  Settings,
  ChevronLeft,
  AlertTriangle,
} from "lucide-react";

import { useState, useEffect } from "react";
import { userService, type UserDetails } from "@/services/api/userService";

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

interface User {
  email: string;
  id: number;
  name: string;
}
const navigation = [
  { name: "Dashboard", href: "/resident", icon: Home },
  { name: "Documents", href: "/resident/documents", icon: FileText },
  { name: "Complainant", href: "/resident/complainant", icon: AlertTriangle },
  { name: "Announcements", href: "/resident/announcement", icon: Megaphone },
  { name: "Settings", href: "/resident/settings", icon: Settings },
];

export function Sidebar({ className, onClose }: SidebarProps) {
  // const navigate = useNavigate();
  // const { logout } = useAuth();
  const isCollapsed: boolean = false;
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  // const handleLogout = async () => {
  //   try {
  //     // Use auth context logout which handles API call and localStorage cleanup
  //     await logout();

  //     // Clear user details cache
  //     localStorage.removeItem("user_details_cache");

  //     // Redirect to login page
  //     navigate("/", { replace: true });
  //   } catch (error) {
  //     console.error("Logout error:", error);
  //     // Even if logout API fails, still redirect to login
  //     navigate("/", { replace: true });
  //   }
  // };

  // Load user details from cache or fetch if needed
  useEffect(() => {
    const loadUserDetails = async () => {
      // Check if we have cached user details
      const cachedDetails = localStorage.getItem("user_details_cache");
      if (cachedDetails) {
        setUserDetails(JSON.parse(cachedDetails));
        return;
      }

      // If no cache, fetch from API
      setLoading(true);
      try {
        const userInfo = localStorage.getItem("user_info");
        if (userInfo) {
          const user = JSON.parse(userInfo);
          setUserInfo(user);
          if (user.id) {
            const response = await userService.getUserDetailsById(user.id);
            const details = response.data;
            setUserDetails(details);
            // Cache the details
            localStorage.setItem("user_details_cache", JSON.stringify(details));
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        // Fallback to basic user info from localStorage
        const userInfo = localStorage.getItem("user_info");

        if (userInfo) {
          const user = JSON.parse(userInfo);
          const fallbackDetails = {
            id: user.id,
            first_name: user.name || "User",
            last_name: "",
            email: user.email || "user@email.com",
            valid_id_path: user.valid_id_path,
            valid_id_url: user.valid_id_url,
          };
          setUserDetails(fallbackDetails);
          localStorage.setItem(
            "user_details_cache",
            JSON.stringify(fallbackDetails)
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserDetails();
  }, []);

  // Get fallback user info from localStorage
  const userInfos = localStorage.getItem("user_info");
  const fallbackUser = userInfos ? JSON.parse(userInfos) : null;

  return (
    <div
      className={cn(
        "flex h-screen w-64 flex-col bg-blue-900 border-r border-border transition-all duration-300",
        isCollapsed && "w-16",
        className
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between mx-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-foreground">
            <Home className="h-5 w-5 text-primary" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="text-lg font-bold text-primary-foreground">
                Barangay
              </h1>
              <p className="text-xs text-primary-foreground/70">
                Record Management System
              </p>
            </div>
          )}
        </div>
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className={cn(
              "ml-2 rounded-md p-1 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-primary",
              isCollapsed && "mx-auto"
            )}
            aria-label="Close sidebar"
            type="button"
          >
            <ChevronLeft className="h-5 w-5 text-primary-foreground" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 mt-5">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = window.location.pathname === item.href;
          return (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-black/30 text-primary-foreground"
                  : "text-primary-foreground/80 hover:bg-black/20 hover:text-primary-foreground",
                "focus:bg-primary-light focus:text-primary-foreground focus:outline-none"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="ml-3">{item.name}</span>}
            </a>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className=" p-4 space-y-3">
        <div
          className={cn(
            "flex items-center rounded-lg px-3 py-2 text-sm",
            "text-primary-foreground/80 hover:bg-primary-light transition-colors"
          )}
        >
          <img
            src={
              userDetails?.valid_id_url ||
              `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmlsZSUyMHBob3RvfGVufDB8fDB8fHww`
            }
            alt="User Profile"
            className="h-8 w-8 rounded-full object-cover flex-shrink-0"
          />
          {!isCollapsed && (
            <div className="ml-3 min-w-0">
              <p className="text-sm font-medium text-primary-foreground">
                {loading
                  ? "Loading..."
                  : userInfo?.name || fallbackUser?.name || "User"}
              </p>
              <p className="text-xs text-primary-foreground/70">
                {loading
                  ? "Loading..."
                  : userInfo?.email || fallbackUser?.email || "user@email.com"}
              </p>
            </div>
          )}
        </div>

        {/* Logout Button */}
        {/* <Button
          onClick={handleLogout}
          variant="ghost"
          className={cn(
            "w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20",
            isCollapsed && "justify-center px-3"
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button> */}
      </div>
    </div>
  );
}
