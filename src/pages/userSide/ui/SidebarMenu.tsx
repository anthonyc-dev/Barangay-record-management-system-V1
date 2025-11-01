import { cn } from "@/lib/utils";
import {
  Home,
  FileText,
  Megaphone,
  Settings,
  ChevronLeft,
  AlertTriangle,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { useUserProfile } from "@/contexts/UserProfileContext";

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/resident", icon: Home },
  { name: "Documents", href: "/resident/documents", icon: FileText },
  { name: "Complainant", href: "/resident/complainant", icon: AlertTriangle },
  { name: "Announcements", href: "/resident/announcement", icon: Megaphone },
  { name: "Settings", href: "/resident/settings", icon: Settings },
];

export function Sidebar({ className, onClose }: SidebarProps) {
  const location = useLocation();
  const isCollapsed: boolean = false;

  // Use shared user profile context
  const { userProfile, loading } = useUserProfile();

  console.log("User profile:", userProfile);

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
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground overflow-hidden">
            <img
              src="/image/2s.png"
              alt="Barangay Logo"
              className="object-cover h-8 w-8 rounded-full"
            />
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
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
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
            </Link>
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
              userProfile?.profile_url ||
              `https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png`
            }
            alt="User Profile"
            className="h-8 w-8 rounded-full object-cover flex-shrink-0"
          />
          {!isCollapsed && (
            <div className="ml-3 min-w-0">
              <p className="text-sm font-medium text-primary-foreground">
                {loading ? "Loading..." : userProfile?.name || "User"}
              </p>
              <p className="text-xs text-primary-foreground/70">
                {loading
                  ? "Loading..."
                  : userProfile?.email || "user@email.com"}
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
