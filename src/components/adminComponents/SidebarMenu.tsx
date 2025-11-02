import {
  Home,
  Users,
  FileText,
  DollarSign,
  BarChart3,
  Megaphone,
  Settings,
  ChevronDown,
  ChevronRight,
  Shield,
  Map,
  Folder,
  User,
} from "lucide-react";
import { useState, useMemo } from "react";
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
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
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    allowedRoles: ["admin"],
    submenu: [
      { name: "Overview", href: "/admin/analytics", icon: BarChart3 },
      { name: "Population", href: "/admin/analytics/population", icon: Users },
      { name: "Documents", href: "/admin/analytics/documents", icon: FileText },
      { name: "Incidents", href: "/admin/analytics/incidents", icon: Shield },
      {
        name: "Financial",
        href: "/admin/analytics/financial",
        icon: DollarSign,
      },
      {
        name: "Geographical",
        href: "/admin/analytics/geographical",
        icon: Map,
      },
    ],
  },
  {
    name: "Residents",
    href: "/admin/residents",
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
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Filter navigation based on role
  const navigation = useMemo(() => {
    const userRole = isAdmin ? "admin" : isOfficial ? "official" : null;
    if (!userRole) return [];

    return allNavigation.filter((item) =>
      item.allowedRoles?.includes(userRole)
    );
  }, [isAdmin, isOfficial]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

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
                const isExpanded = expandedItems.includes(item.name);
                const hasSubmenu = "submenu" in item;
                const isActive = !hasSubmenu && location.pathname === item.href;
                const isSubActive = hasSubmenu
                  ? item.submenu?.some(
                      (subItem) => location.pathname === subItem.href
                    )
                  : false;

                return (
                  <SidebarMenuItem key={item.name}>
                    {hasSubmenu ? (
                      <>
                        <SidebarMenuButton
                          onClick={() => toggleExpanded(item.name)}
                          isActive={isSubActive || isExpanded}
                          tooltip={item.name}
                          className={cn(
                            "text-white/80 hover:bg-white/10 hover:text-white",
                            (isSubActive || isExpanded) &&
                              "bg-white/20 text-white hover:bg-white/25 hover:text-white"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.name}</span>
                          {isExpanded ? (
                            <ChevronDown className="ml-auto h-4 w-4" />
                          ) : (
                            <ChevronRight className="ml-auto h-4 w-4" />
                          )}
                        </SidebarMenuButton>
                        {isExpanded && item.submenu && (
                          <SidebarMenuSub>
                            {item.submenu.map((subItem) => {
                              const SubIcon = subItem.icon;
                              const isSubItemActive =
                                location.pathname === subItem.href;
                              return (
                                <SidebarMenuSubItem key={subItem.name}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isSubItemActive}
                                  >
                                    <Link to={subItem.href}>
                                      <SubIcon className="h-4 w-4" />
                                      <span>{subItem.name}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        )}
                      </>
                    ) : (
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
                    )}
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
                      src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuJTIwYXZhdGFyfGVufDB8fDB8fHww"
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
                    <span className="truncate text-xs text-white/70">
                      {getRoleLabel()}
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
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFuJTIwYXZhdGFyfGVufDB8fDB8fHww"
                        alt={adminInfo?.name || "Admin User"}
                      />
                      <AvatarFallback className="rounded-lg">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {adminInfo?.name || "Admin User"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
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
