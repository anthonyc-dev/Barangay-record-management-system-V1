import { Bell, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Link } from "react-router-dom";

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
        return "Admin";
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
          <div className="flex items-center gap-2 text-lg font-sans font-bold text-[#11224E]">
            {adminInfo?.role ? getRoleLabel(adminInfo.role) : "Admin"}
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
                  src={
                    adminInfo?.role === "admin"
                      ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4Z4vN_ItrBdi7PHVS6L3R_R1eAG1tmo5Q7qH_WWJn-vjPSySH5MHHr3iED5drU9l6Uzw&usqp=CAU"
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMyqsqJLX8gBcDfo_gkc6RrEA3Q0F9XvyNzsaiBYTUTyka3ETqfi5QVSyr94Ck1neecm0&usqp=CAU"
                  }
                  alt={adminInfo?.name || "Admin User"}
                  className="h-8 w-8 rounded-full object-cover border-2 border-blue-500"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <img
                  src={
                    adminInfo?.role === "admin"
                      ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4Z4vN_ItrBdi7PHVS6L3R_R1eAG1tmo5Q7qH_WWJn-vjPSySH5MHHr3iED5drU9l6Uzw&usqp=CAU"
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMyqsqJLX8gBcDfo_gkc6RrEA3Q0F9XvyNzsaiBYTUTyka3ETqfi5QVSyr94Ck1neecm0&usqp=CAU"
                  }
                  alt={adminInfo?.name || "Admin User"}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <p className="font-medium">
                    {adminInfo?.name || "Admin User"}
                  </p>

                  {/* <p className="text-xs text-muted-foreground">
                    {adminInfo?.role
                      ? getRoleLabel(adminInfo.role)
                      : "Administrator"}
                  </p> */}
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Link
                  to="/admin/settings"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Settings className=" h-4 w-4" />
                  <span>Settings</span>
                </Link>
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
