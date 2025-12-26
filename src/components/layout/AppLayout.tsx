import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Fragment, useState } from 'react'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarSeparator,
  SidebarInput,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  Users,
  UserRound,
  CalendarDays,
  Boxes,
  ClipboardList,
  BedDouble,
  Pill,
  ListChecks,
  Cog,
  Bell,
  Search,
  CalendarClock,
  Clock,
  Activity,
  Building2,
  FileText,
  Moon,
  Sun,
  LogOut,
  User,
  Settings,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, clearSession } = useAuth()
  const [isDark, setIsDark] = useState(false)
  
  const logoutMut = useMutation({
    mutationFn: async () => {
      await api.post<{ ok: boolean }>("/auth/logout")
    },
    onSettled: () => {
      clearSession()
      navigate("/")
    },
  })

  // Toggle theme
  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
  }

  const pathname = location.pathname
  const segments = pathname.split('/').filter(Boolean)
  const crumbHref = (idx: number) => `/${segments.slice(0, idx + 1).join('/')}`
  const labelMap: Record<string, string> = {
    dashboard: 'Dashboard',
    patients: 'Patients',
    staff: 'Staff',
    appointments: 'Appointments',
    inventory: 'Inventory',
    // requirements: 'Requirements',
    items: 'Items',
    rooms: 'Rooms',
    prescriptions: 'Prescriptions',
    users: 'Users',
    settings: 'Settings',
    leaves: 'Leaves',
    timings: 'Timings',
    doctors: 'Doctors',
    // fulfillments: 'Fulfillments',
    about: 'About',
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return 'U'
    return user.email.charAt(0).toUpperCase()
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon" className="border-r border-sidebar-border bg-sidebar backdrop-blur supports-backdrop-filter:bg-sidebar/90">
        <SidebarHeader className="border-b border-sidebar-border/50">
          <Link to="/dashboard" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-sidebar-accent transition-colors group">
            <div className="flex items-center justify-center size-10 rounded-lg bg-linear-to-br from-primary to-accent shadow-md group-hover:shadow-lg transition-shadow">
              <Activity className="size-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="font-bold text-base tracking-tight text-sidebar-foreground">MedFlow</span>
              <span className="text-xs text-muted-foreground">Insights</span>
            </div>
          </Link>
          <div className="relative mt-2 group-data-[collapsible=icon]:hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <SidebarInput placeholder="Search..." className="pl-9 bg-sidebar-accent/50 border-sidebar-border/50 focus:bg-card transition-colors" />
          </div>
        </SidebarHeader>

        <SidebarContent className="py-2">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70 px-3">
              Main Menu
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Dashboard" className="group">
                    <NavLink to="/dashboard" className={({ isActive }) => cn(
                      "transition-all duration-200",
                      isActive
                        ? "text-gray-700 dark:text-gray-200 hover:bg-sidebar-primary/90 shadow-sm"
                        : "text-gray-700 dark:text-gray-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}>
                      <LayoutDashboard className="group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Dashboard</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Patients" className="group">
                    <NavLink to="/patients" className={({ isActive }) => cn(
                      "transition-all duration-200",
                      isActive
                        ? "text-gray-700 dark:text-gray-200 hover:bg-sidebar-primary/90 shadow-sm"
                        : "text-gray-700 dark:text-gray-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}>
                      <Users className="group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Patients</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Staff Directory" className="group">
                    <NavLink to="/staff" className={({ isActive }) => cn(
                      "transition-all duration-200",
                      isActive
                        ? "text-gray-700 dark:text-gray-200 hover:bg-sidebar-primary/90 shadow-sm"
                        : "text-gray-700 dark:text-gray-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}>
                      <UserRound className="group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Staff</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Appointments" className="group">
                    <NavLink to="/appointments" className={({ isActive }) => cn(
                      "transition-all duration-200",
                      isActive
                        ? "text-gray-700 dark:text-gray-200 hover:bg-sidebar-primary/90 shadow-sm"
                        : "text-gray-700 dark:text-gray-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}>
                      <CalendarDays className="group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Appointments</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Inventory Management" className="group">
                    <NavLink to="/inventory" className={({ isActive }) => cn(
                      "transition-all duration-200",
                      isActive
                        ? "text-gray-700 dark:text-gray-200hover:bg-sidebar-primary/90 shadow-sm"
                        : "text-gray-700 dark:text-gray-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}>
                      <Boxes className="group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Inventory</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {/* <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Requirements" className="group">
                    <NavLink to="/requirements/items" className={({ isActive }) => cn(
                      "transition-all duration-200",
                      isActive
                        ? "text-gray-700 dark:text-gray-200 hover:bg-sidebar-primary/90 shadow-sm"
                        : "text-gray-700 dark:text-gray-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}>
                      <ClipboardList className="group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Requirements</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem> */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Rooms" className="group">
                    <NavLink to="/rooms" className={({ isActive }) => cn(
                      "transition-all duration-200",
                      isActive
                        ? "text-gray-700 dark:text-gray-200 hover:bg-sidebar-primary/90 shadow-sm"
                        : "text-gray-700 dark:text-gray-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}>
                      <BedDouble className="group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Rooms</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Prescriptions" className="group">
                    <NavLink to="/prescriptions" className={({ isActive }) => cn(
                      "transition-all duration-200",
                      isActive
                        ? "text-gray-700 dark:text-gray-200 hover:bg-sidebar-primary/90 shadow-sm"
                        : "text-gray-700 dark:text-gray-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}>
                      <Pill className="group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Prescriptions</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="my-2 bg-sidebar-border/50" />

          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70 px-3">
              Scheduling
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Staff Leaves" className="group">
                    <NavLink to="/leaves" className={({ isActive }) => cn(
                      "transition-all duration-200",
                      isActive
                        ? "text-gray-700 dark:text-gray-200 hover:bg-sidebar-primary/90 shadow-sm"
                        : "text-gray-700 dark:text-gray-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}>
                      <CalendarClock className="group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Leaves</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Staff Timings" className="group">
                    <NavLink to="/timings" className={({ isActive }) => cn(
                      "transition-all duration-200",
                      isActive
                        ? "text-gray-700 dark:text-gray-200 hover:bg-sidebar-primary/90 shadow-sm"
                        : "text-gray-700 dark:text-gray-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}>
                      <Clock className="group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Timings</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="my-2 bg-sidebar-border/50" />
{/* 
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/70 px-3">
              Fulfillments
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Fulfillment Overview" className="group">
                    <NavLink to="/fulfillments/items" className={({ isActive }) => cn(
                      "transition-all duration-200",
                      isActive
                        ? "text-gray-700 dark:text-gray-200 hover:bg-sidebar-primary/90 shadow-sm"
                        : "text-gray-700 dark:text-gray-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}>
                      <ListChecks className="group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Overview</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup> */}
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border/50 p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings" className="group">
                <NavLink to="/settings" className={({ isActive }) => cn(
                  "transition-all duration-200",
                  isActive
                    ? "text-gray-700 dark:text-gray-200 hover:bg-sidebar-primary/90 shadow-sm"
                    : "text-gray-700 dark:text-gray-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}>
                  <Cog className="group-hover:rotate-90 transition-transform duration-300" />
                  <span className="font-medium">Settings</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border/40 shadow-sm">
          <div className="flex h-16 items-center gap-4 px-6 text-foreground">
            <SidebarTrigger className="hover:bg-accent/50 transition-colors rounded-md" />
            
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/dashboard" className="flex items-center gap-2 hover:text-primary transition-colors">
                      <Building2 className="size-4" />
                      <span>Home</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {segments.map((seg, idx) => (
                  <Fragment key={`crumb-${idx}`}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {idx < segments.length - 1 ? (
                        <BreadcrumbLink asChild>
                          <Link to={crumbHref(idx)} className="hover:text-primary transition-colors capitalize">
                            {labelMap[seg] || seg}
                          </Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="font-semibold capitalize">
                          {labelMap[seg] || seg}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            <div className="ml-auto flex items-center gap-3">
              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme}
                className="hover:bg-accent/50 transition-all hover:rotate-180 duration-300"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </Button>

              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:bg-accent/50 transition-colors" 
                aria-label="Notifications"
              >
                <Bell className="size-5" />
                <Badge className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 bg-destructive text-destructive-foreground text-xs">
                  3
                </Badge>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 hover:bg-accent/50 transition-colors px-3">
                    <Avatar className="size-8 border-2 border-primary/20">
                      <AvatarFallback className="bg-linear-to-br from-primary to-accent text-primary-foreground font-semibold text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">{user?.email?.split('@')[0] || 'User'}</span>
                      <span className="text-xs text-muted-foreground capitalize">{user?.role || 'Staff'}</span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.email?.split('@')[0] || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email || 'user@example.com'}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/users" className="flex items-center gap-2 cursor-pointer">
                      <User className="size-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="size-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => logoutMut.mutate()}
                    className="text-destructive focus:text-destructive cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="size-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="w-full max-w-screen-2xl mx-auto p-6 sm:p-8 animate-slide-in-bottom">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
