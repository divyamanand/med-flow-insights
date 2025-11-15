import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator, BreadcrumbLink, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'

export default function AppLayout() {
  const location = useLocation()
  const { user, clearSession } = useAuth()
  const logoutMut = useMutation({
    mutationFn: async () => {
      await api.post<{ ok: boolean }>("/auth/logout")
    },
    onSettled: () => {
      clearSession()
      // Let route guards redirect to /login if present
    },
  })

  const pathname = location.pathname
  const segments = pathname.split('/').filter(Boolean)
  const crumbHref = (idx: number) => `/${segments.slice(0, idx + 1).join('/')}`
  const labelMap: Record<string, string> = {
    dashboard: 'Dashboard',
    patients: 'Patients',
    staff: 'Staff',
    appointments: 'Appointments',
    inventory: 'Inventory',
    requirements: 'Requirements',
    items: 'Items',
    rooms: 'Rooms',
    prescriptions: 'Prescriptions',
    users: 'Users',
    settings: 'Settings',
  }

  return (
    <SidebarProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <Link to="/dashboard" className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-secondary">
            <Pill className="size-5" />
            <span className="font-semibold">Hospital Client</span>
          </Link>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <SidebarInput placeholder="Search…" className="pl-9" />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Dashboard">
                    <NavLink to="/dashboard" className={({ isActive }) => cn(isActive && 'data-[active=true]') }>
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Patients">
                    <NavLink to="/patients">
                      <Users />
                      <span>Patients</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Staff">
                    <NavLink to="/staff">
                      <UserRound />
                      <span>Staff</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Appointments">
                    <NavLink to="/appointments">
                      <CalendarDays />
                      <span>Appointments</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Inventory">
                    <NavLink to="/inventory">
                      <Boxes />
                      <span>Inventory</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Requirements">
                    <NavLink to="/requirements/items">
                      <ClipboardList />
                      <span>Requirements</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Rooms">
                    <NavLink to="/rooms">
                      <BedDouble />
                      <span>Rooms</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Prescriptions">
                    <NavLink to="/prescriptions">
                      <Pill />
                      <span>Prescriptions</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Fulfillments</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Fulfillments Overview">
                    <Link to="/requirements/items" className="opacity-90">
                      <ListChecks />
                      <span>Overview</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Settings">
                <NavLink to="/settings">
                  <Cog />
                  <span>Settings</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b">
          <div className="flex h-14 items-center gap-3 px-4">
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/dashboard">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {segments.map((seg, idx) => (
                  <>
                    <BreadcrumbSeparator key={`sep-${idx}`} />
                    <BreadcrumbItem key={`item-${idx}`}>
                      {idx < segments.length - 1 ? (
                        <BreadcrumbLink asChild>
                          <Link to={crumbHref(idx)}>{labelMap[seg] || seg}</Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>{labelMap[seg] || seg}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="size-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">{user?.email || 'Profile'}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/users">Users</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logoutMut.mutate()}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <div className="w-full max-w-screen-2xl mx-auto p-4 sm:p-6 md:p-8">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
