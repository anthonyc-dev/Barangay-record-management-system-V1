import { Bell, Search, Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Use shared user profile context
  const { userProfile, loading, clearProfile } = useUserProfile();

  const handleLogout = async () => {
    try {
      // Clear profile immediately for instant UI update
      clearProfile();

      await logout();

      toast.success("Logout successful");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);

      navigate("/", { replace: true });
    }
  };

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
                    userProfile?.profile_url ||
                    `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png`
                  }
                  alt="User Profile"
                  className="h-8 w-8 rounded-full object-cover  border-2 border-blue-500"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <img
                    src={
                      userProfile?.profile_url ||
                      `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png`
                    }
                    alt="User Profile"
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div className="hidden text-sm md:block text-left">
                    <p className="font-medium">
                      {loading ? "Loading..." : userProfile?.name || "User"}
                    </p>
                    <p className="text-muted-foreground">
                      {loading ? "Loading..." : userProfile?.email || "user@email.com"}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center space-x-2 text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 text-red-600 focus:text-red-600" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
