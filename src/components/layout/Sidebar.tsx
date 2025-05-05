
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
  Calendar,
  Database,
  Heart,
  Home,
  Hospital,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Users,
  BriefcaseMedical,
  Activity
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar() {
  const location = useLocation();
  
  const navItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Patients",
      path: "/patients",
      icon: User,
    },
    {
      title: "Doctors",
      path: "/doctors",
      icon: Users,
    },
    {
      title: "Supplies",
      path: "/supplies",
      icon: Database,
    },
    {
      title: "Blood Bank",
      path: "/blood-bank",
      icon: Heart,
    },
    {
      title: "Robots",
      path: "/robots",
      icon: Hospital,
    },
    {
      title: "Calendar",
      path: "/calendar",
      icon: Calendar,
    },
    {
      title: "Medicines",
      path: "/medicines",
      icon: BriefcaseMedical
    },
    {
      title: "Prescription",
      path: "/prescription",
      icon: Hospital
    },
    {
      title: "Patient Monitoring",
      path: "/rtpatientmonitoring",
      icon: Activity
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
        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    location.pathname === "/settings" && "bg-primary/10 text-primary"
                  )}
                >
                  <Link to="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Dr. Sarah Johnson</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-full p-1.5 text-muted-foreground hover:bg-muted"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
