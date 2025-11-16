import {
  Home,
  Users,
  FileText,
  Megaphone,
  Settings,
  ChevronRight,
  Folder,
  User,
} from "lucide-react";
import { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const allNavigation = [
  {
    name: "Dashboard",
    href: "/admin/home",
    icon: Home,
    allowedRoles: ["admin", "official"],
  },
  {
    name: "Residents",
    href: "/admin/residents",
    icon: Users,
    allowedRoles: ["admin"],
  },
  {
    name: "Officials",
    href: "/admin/officials",
    icon: Users,
    allowedRoles: ["admin"],
  },
  {
    name: "Documents",
    href: "/admin/documents",
    icon: FileText,
    allowedRoles: ["admin"],
  },
  {
    name: "Announcements",
    href: "/admin/announcement",
    icon: Megaphone,
    allowedRoles: ["admin", "official"],
  },
  {
    name: "Folder Storage",
    href: "/admin/folder-storage",
    icon: Folder,
    allowedRoles: ["admin"],
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    allowedRoles: ["admin", "official"],
  },
];

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { adminInfo, isAdmin, isOfficial } = useAdmin();

  // Role-filtered navigation
  const navigation = useMemo(() => {
    const userRole = isAdmin ? "admin" : isOfficial ? "official" : null;
    if (!userRole) return [];

    return allNavigation.filter((item) =>
      item.allowedRoles?.includes(userRole)
    );
  }, [isAdmin, isOfficial]);

  const getRoleLabel = () => {
    if (isAdmin) return "Administrator";
    if (isOfficial) return "Official";
    return "Admin";
  };

  return (
    <SidebarPrimitive collapsible="icon" className={cn("border-r", className)}>
      <SidebarHeader className="border-b border-white/10 bg-[#11224E]">
        <div className="flex h-16 items-center justify-between gap-3 px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-600 bg-white overflow-hidden flex-shrink-0 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 transition-all duration-200">
              <img
                src="/image/2s.png"
                alt="Barangay RMS Logo"
                className="object-cover h-10 w-10 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 transition-all duration-200"
              />
            </div>
            <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
              <h1 className="text-base font-bold text-white truncate">
                Barangay
              </h1>
              <p className="text-xs text-white/70 truncate">
                Record Management System
              </p>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-[#11224E]">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const Icon = item.icon;
                const hasSubmenu = "submenu" in item;
                const isActive = !hasSubmenu && location.pathname === item.href;

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                      className={
                        isActive
                          ? "bg-white/20 text-white hover:bg-white/25 hover:text-white"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }
                    >
                      <Link to={item.href}>
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-[#11224E]">
        <SidebarSeparator className="bg-white/10" />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="text-white hover:bg-white/10 data-[state=open]:bg-white/15 data-[state=open]:text-white"
                >
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage
                      src={
                        adminInfo?.role === "admin"
                          ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4Z4vN_ItrBdi7PHVS6L3R_R1eAG1tmo5Q7qH_WWJn-vjPSySH5MHHr3iED5drU9l6Uzw&usqp=CAU"
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMyqsqJLX8gBcDfo_gkc6RrEA3Q0F9XvyNzsaiBYTUTyka3ETqfi5QVSyr94Ck1neecm0&usqp=CAU"
                      }
                      alt={adminInfo?.name || "Admin User"}
                      className="h-8 w-8 rounded-full object-cover border-2 border-blue-500"
                    />
                    <AvatarFallback className="rounded-lg">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-white">
                      {adminInfo?.name || "Admin User"}
                    </span>
                  </div>
                  <ChevronRight className="ml-auto h-4 w-4 text-white" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-full">
                      <AvatarImage
                        src={
                          adminInfo?.role === "admin"
                            ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4Z4vN_ItrBdi7PHVS6L3R_R1eAG1tmo5Q7qH_WWJn-vjPSySH5MHHr3iED5drU9l6Uzw&usqp=CAU"
                            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMyqsqJLX8gBcDfo_gkc6RrEA3Q0F9XvyNzsaiBYTUTyka3ETqfi5QVSyr94Ck1neecm0&usqp=CAU"
                        }
                        alt={adminInfo?.name || "Admin User"}
                        className="h-8 w-8 rounded-full object-cover border-2 border-blue-500"
                      />
                      <AvatarFallback className="rounded-full">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {getRoleLabel()}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link to="/admin/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarPrimitive>
  );
}
