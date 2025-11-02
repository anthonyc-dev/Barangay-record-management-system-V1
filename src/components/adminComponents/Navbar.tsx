import { Bell, Search, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const { adminInfo } = useAdmin();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      // Start logout process - logoutLoading will be set to true
      // AuthContext will handle redirect for admin logout
      await logout();
      toast.success("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
      // Fallback redirect if logout doesn't redirect automatically
      window.location.href = "/admin";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "official":
        return "Official";
      default:
        return "Admin";
    }
  };

  return (
    <header
      className={cn("h-16 border-b border-border bg-background", className)}
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
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

          {/* Admin Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center space-x-3 p-2"
              >
                <img
                  src={`https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuJTIwYXZhdGFyfGVufDB8fDB8fHww`}
                  alt={adminInfo?.name || "Admin User"}
                  className="h-8 w-8 rounded-full object-cover border-2 border-blue-500"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <img
                  src={`https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuJTIwYXZhdGFyfGVufDB8fDB8fHww`}
                  alt={adminInfo?.name || "Admin User"}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <p className="font-medium">
                    {adminInfo?.name || "Admin User"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {adminInfo?.username || "admin"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {adminInfo?.role
                      ? getRoleLabel(adminInfo.role)
                      : "Administrator"}
                  </p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
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
