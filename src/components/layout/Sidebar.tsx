import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  Home,
  Hospital,
  LayoutDashboard,
  LogOut,
  User,
  Users,
  Package,
  FileText,
  Calendar,
  Briefcase,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

export function AppSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const navItems = [
    {
      title: "Dashboard",
      path: "/app",
      icon: LayoutDashboard,
    },
    {
      title: "Patients",
      path: "/app/patients",
      icon: User,
    },
    {
      title: "Doctors",
      path: "/app/doctors",
      icon: Users,
    },
    {
      title: "Staff",
      path: "/app/staff",
      icon: Briefcase,
    },
    {
      title: "Rooms",
      path: "/app/rooms",
      icon: Home,
    },
    {
      title: "Appointments",
      path: "/app/appointments",
      icon: Calendar,
    },
    {
      title: "Inventory",
      path: "/app/inventory",
      icon: Package,
    },
    {
      title: "Prescriptions",
      path: "/app/prescription",
      icon: FileText,
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">MedFlow</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      location.pathname === item.path &&
                        "bg-primary/10 text-primary"
                    )}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                {user?.name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role || 'Staff'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
