import { Bell, Search, Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userService, type UserDetails } from "@/services/api/userService";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(false);

  const { logout } = useAuth();

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_info");
    localStorage.removeItem("user_type");
    localStorage.removeItem("user_details_cache");

    logout();
  };

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
            valid_id_path: "",
            valid_id_url: "",
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
  const userInfo = localStorage.getItem("user_info");
  const fallbackUser = userInfo ? JSON.parse(userInfo) : null;

  return (
    <header className="h-16 border-b border-border bg-background">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search residents, documents..."
              className="pl-10 w-64"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive text-xs">
              <span className="sr-only">Notifications</span>
            </span>
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-3 p-2"
              >
                <img
                  src={
                    userDetails?.valid_id_url ||
                    `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmlsZSUyMHBob3RvfGVufDB8fDB8fHww`
                  }
                  alt="User Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <div className="hidden text-sm md:block text-left">
                  <p className="font-medium">
                    {loading
                      ? "Loading..."
                      : userDetails?.first_name || fallbackUser?.name || "User"}
                  </p>
                  <p className="text-muted-foreground">
                    {loading
                      ? "Loading..."
                      : userDetails?.email ||
                        fallbackUser?.email ||
                        "user@email.com"}
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center space-x-2 text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
