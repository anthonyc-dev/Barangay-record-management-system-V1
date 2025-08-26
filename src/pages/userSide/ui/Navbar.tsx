import { Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  onMenuClick?: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
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

          <div className="flex items-center space-x-3">
            <img
              src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmlsZSUyMHBob3RvfGVufDB8fDB8fHww`}
              alt="Admin User"
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="hidden text-sm md:block">
              <p className="font-medium">Charlito Sparcia</p>
              <p className="text-muted-foreground">Resident</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
