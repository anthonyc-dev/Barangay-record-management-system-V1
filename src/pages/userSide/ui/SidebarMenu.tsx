import { cn } from "@/lib/utils";
import { Home, FileText, Megaphone, Settings, ChevronLeft } from "lucide-react";

interface SidebarProps {
  className?: string;
  onClose?: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/resident", icon: Home },
  { name: "Documents", href: "", icon: FileText },
  { name: "Announcements", href: "/resident/announcement", icon: Megaphone },
  { name: "Settings", href: "/resident/settings", icon: Settings },
];

export function Sidebar({ className, onClose }: SidebarProps) {
  const isCollapsed: boolean = false;

  return (
    <div
      className={cn(
        "flex h-screen w-64 flex-col bg-blue-900 border-r border-border transition-all duration-300",
        isCollapsed && "w-16",
        className
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-slate-500 px-4">
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
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                "text-primary-foreground/80 hover:bg-blue-700 hover:text-primary-foreground",
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
      <div className="border-t border-slate-500 p-4">
        <div
          className={cn(
            "flex items-center rounded-lg px-3 py-2 text-sm",
            "text-primary-foreground/80 hover:bg-primary-light transition-colors"
          )}
        >
          <img
            src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmlsZSUyMHBob3RvfGVufDB8fDB8fHww`}
            alt="Admin User"
            className="h-8 w-8 rounded-full object-cover flex-shrink-0"
          />
          {!isCollapsed && (
            <div className="ml-3 min-w-0">
              <p className="text-sm font-medium text-primary-foreground">
                Charlito Sparcia
              </p>
              <p className="text-xs text-primary-foreground/70">Resident</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
