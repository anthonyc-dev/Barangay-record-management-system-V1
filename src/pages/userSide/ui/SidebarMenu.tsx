import {
  Home,
  FileText,
  Megaphone,
  Settings,
  AlertTriangle,
  ChevronRight,
  User,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { useUserProfile } from "@/contexts/UserProfileContext";
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
import { Skeleton } from "@/components/ui/skeleton";

const navigation = [
  { name: "Dashboard", href: "/resident", icon: Home },
  { name: "Documents", href: "/resident/documents", icon: FileText },
  { name: "Complainant", href: "/resident/complainant", icon: AlertTriangle },
  { name: "Announcements", href: "/resident/announcement", icon: Megaphone },
  { name: "Manage Profile", href: "/resident/settings", icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const { userProfile, loading } = useUserProfile();

  return (
    <SidebarPrimitive collapsible="icon" className="border-r ">
      <SidebarHeader className="border-b border-white/10 bg-[#11224E]">
        <div className="flex h-16 items-center gap-3 px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-blue-600 bg-white overflow-hidden flex-shrink-0 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 transition-all duration-200">
            <img
              src="/image/2s.png"
              alt="Barangay Logo"
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
      </SidebarHeader>

      <SidebarContent className="bg-[#11224E]">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
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
                  {loading ? (
                    <Skeleton className="h-8 w-8 rounded-full" />
                  ) : (
                    <Avatar className="h-8 w-8 rounded-full">
                      <AvatarImage
                        src={
                          userProfile?.profile_url ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                        }
                        alt={userProfile?.name || "User"}
                        className="h-8 w-8 rounded-full object-cover  border-2 border-blue-500"
                      />
                      <AvatarFallback className="rounded-lg">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-white">
                      {loading ? "Loading..." : userProfile?.name || "User"}
                    </span>
                    <span className="truncate text-xs text-white/70">
                      {loading
                        ? "Loading..."
                        : userProfile?.email || "user@email.com"}
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
                        src={
                          userProfile?.profile_url ||
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"
                        }
                        alt={userProfile?.name || "User"}
                      />
                      <AvatarFallback className="rounded-lg">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userProfile?.name || "User"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {userProfile?.email || "user@email.com"}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/resident/settings">
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
