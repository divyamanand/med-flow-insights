import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { StatCard } from '@/components/ui/stat-card'
import { Spinner } from '@/components/ui/spinner'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  Calendar, 
  UserCheck, 
  AlertCircle, 
  Bed, 
  UserX,
  Package,
  TrendingUp,
  Clock,
  ArrowRight,
  Building,
  Users,
  FileText,
  Sparkles,
  BarChart3,
  CalendarDays,
} from 'lucide-react'

type DashboardSummary = {
  date: string
  appointmentsToday: { count: number }
  appointmentsLast7: {
    days: {
      date: string
      total: number
      byStatus: Record<string, number>
    }[]
  }
  pendingInvitations: { count: number }
  lowStock: { threshold: number; count: number }
  roomsOccupied: { count: number }
  staffOnLeave: { count: number }
  inventorySnapshot: {
    totalItems: number
    totalStock: number
    expiringSoon: { id: string; name: string; expiry: string; daysToExpiry: number }[]
    mostInDemand: { itemId: string; name: string; transactions: number }[]
  }
  requirementsSummary: {
    item: Record<string, number>
    staff: Record<string, number>
    room: Record<string, number>
  }
  recentActivity: { count: number }
}

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => api.get<DashboardSummary>('/stats/overview'),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner className="size-8 text-primary" />
      </div>
    )
  }

  // Build a safe summary using defaults when fields are missing
  const s = (data as Partial<DashboardSummary> | undefined) ?? {}
  const summary: DashboardSummary = {
    date: s.date ?? new Date().toISOString(),
    appointmentsToday: { count: s.appointmentsToday?.count ?? 0 },
    appointmentsLast7: { days: s.appointmentsLast7?.days ?? [] },
    pendingInvitations: { count: s.pendingInvitations?.count ?? 0 },
    lowStock: {
      threshold: s.lowStock?.threshold ?? 0,
      count: s.lowStock?.count ?? 0,
    },
    roomsOccupied: { count: s.roomsOccupied?.count ?? 0 },
    staffOnLeave: { count: s.staffOnLeave?.count ?? 0 },
    inventorySnapshot: {
      totalItems: s.inventorySnapshot?.totalItems ?? 0,
      totalStock: s.inventorySnapshot?.totalStock ?? 0,
      expiringSoon: s.inventorySnapshot?.expiringSoon ?? [],
      mostInDemand: s.inventorySnapshot?.mostInDemand ?? [],
    },
    requirementsSummary: {
      item: s.requirementsSummary?.item ?? {},
      staff: s.requirementsSummary?.staff ?? {},
      room: s.requirementsSummary?.room ?? {},
    },
    recentActivity: { count: s.recentActivity?.count ?? 0 },
  }

  if (error) {
    // Log the error but continue rendering with defaulted values
    // eslint-disable-next-line no-console
    console.warn('Dashboard load error; rendering with defaults:', error)
  }

  // eslint-disable-next-line no-console
  console.log('Dashboard data (safe)', summary)

  return (
    <div className="space-y-8 animate-slide-in-bottom">
      {/* Page Header with Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="size-4 text-primary" />
              <span className="text-sm font-medium text-primary">Live Dashboard</span>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Hospital Overview
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time insights and analytics for {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <FileText className="size-4" />
            Export Report
          </Button>
          <Link to="/appointments">
            <Button className="gap-2 bg-linear-to-r from-primary to-accent hover:opacity-90 transition-opacity">
              <CalendarDays className="size-4" />
              View Calendar
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid - Modern Premium Card Layout */}
      <div className="grid gap-6 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-hover">
          <StatCard
            title="Appointments Today"
            value={summary.appointmentsToday.count}
            icon={Calendar}
            description="Total scheduled"
            className="border-2 border-primary/20 bg-linear-to-br from-card via-card to-primary/5 shadow-lg hover:shadow-xl transition-all duration-300"
          />
        </div>

        <div className="card-hover">
          <StatCard
            title="Pending Invitations"
            value={summary.pendingInvitations.count}
            icon={UserCheck}
            description="Not yet accepted"
            className="border-2 border-accent/20 bg-linear-to-br from-card via-card to-accent/5 shadow-lg hover:shadow-xl transition-all duration-300"
          />
        </div>

        <div className="card-hover">
          <StatCard
            title="Low Stock Items"
            value={summary.lowStock.count}
            icon={AlertCircle}
            description={`Below threshold (${summary.lowStock.threshold})`}
            className="border-2 border-destructive/20 bg-linear-to-br from-card via-card to-destructive/5 shadow-lg hover:shadow-xl transition-all duration-300"
          />
        </div>

        <div className="card-hover">
          <StatCard
            title="Rooms Occupied"
            value={summary.roomsOccupied.count}
            icon={Bed}
            description="Currently in use"
            className="border-2 border-success/20 bg-linear-to-br from-card via-card to-success/5 shadow-lg hover:shadow-xl transition-all duration-300"
          />
        </div>

        <div className="card-hover">
          <StatCard
            title="Staff on Leave"
            value={summary.staffOnLeave.count}
            icon={UserX}
            description="Today"
            className="border-2 border-border/50 glass-effect shadow-lg hover:shadow-xl transition-all duration-300"
          />
        </div>

        <div className="card-hover">
          <StatCard
            title="Expiring Soon"
            value={summary.inventorySnapshot.expiringSoon.length}
            icon={Package}
            description="Medicine count"
            className="border-2 border-warning/20 bg-linear-to-br from-card via-card to-warning/5 shadow-lg hover:shadow-xl transition-all duration-300"
          />
        </div>

        <div className="card-hover">
          <StatCard
            title="High Demand Items"
            value={summary.inventorySnapshot.mostInDemand.length}
            icon={TrendingUp}
            description="Top items"
            className="border-2 border-info/20 bg-linear-to-br from-card via-card to-info/5 shadow-lg hover:shadow-xl transition-all duration-300"
          />
        </div>

        <div className="card-hover">
          <StatCard
            title="Recent Activity"
            value={summary.recentActivity.count}
            icon={Activity}
            description="Last 24 hours"
            className="border-2 border-chart-3/20 bg-linear-to-br from-card via-card to-chart-3/5 shadow-lg hover:shadow-xl transition-all duration-300"
          />
        </div>
      </div>

      {/* Secondary Cards Grid - Enhanced Info Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 card-hover overflow-hidden">
          <div className="absolute top-0 right-0 size-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-lg bg-primary/20">
                  <Package className="size-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Inventory Snapshot</CardTitle>
                  <CardDescription>Current stock overview</CardDescription>
                </div>
              </div>
              <Link to="/inventory">
                <Button variant="ghost" size="sm" className="gap-2 group">
                  View All
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-linear-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <BarChart3 className="size-4" />
                  Total Items
                </p>
                <p className="text-3xl font-bold gradient-text">{summary.inventorySnapshot.totalItems}</p>
              </div>
              <div className="p-4 bg-linear-to-br from-accent/10 to-accent/5 rounded-xl border border-accent/20">
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                  <TrendingUp className="size-4" />
                  Total Stock
                </p>
                <p className="text-3xl font-bold gradient-text">{summary.inventorySnapshot.totalStock}</p>
              </div>
            </div>
            
            {summary.inventorySnapshot.expiringSoon.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Clock className="size-4 text-warning" />
                  Expiring Soon
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {summary.inventorySnapshot.expiringSoon.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-warning/10 border border-warning/20 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Expires in {item.daysToExpiry} days</p>
                      </div>
                      <Badge variant="outline" className="bg-warning/20 text-warning border-warning/30">
                        {new Date(item.expiry).toLocaleDateString()}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-2 border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 card-hover overflow-hidden">
          <div className="absolute top-0 right-0 size-32 bg-accent/10 rounded-full blur-3xl -z-10"></div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 rounded-lg bg-accent/20">
                  <FileText className="size-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-xl">Requirements Summary</CardTitle>
                  <CardDescription>Pending requirements overview</CardDescription>
                </div>
              </div>
              <Link to="/requirements/items">
                <Button variant="ghost" size="sm" className="gap-2 group">
                  Manage
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/requirements/items" className="block">
              <div className="flex justify-between items-center p-4 bg-linear-to-r from-primary/10 to-primary/5 rounded-xl border border-primary/20 hover:border-primary/40 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-primary/20">
                    <Package className="size-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Item Requirements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground text-base px-3 py-1">
                    {Object.keys(summary.requirementsSummary.item).length}
                  </Badge>
                  <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link to="/requirements/staff" className="block">
              <div className="flex justify-between items-center p-4 bg-linear-to-r from-accent/10 to-accent/5 rounded-xl border border-accent/20 hover:border-accent/40 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-accent/20">
                    <Users className="size-5 text-accent" />
                  </div>
                  <span className="text-sm font-medium">Staff Requirements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-accent text-accent-foreground text-base px-3 py-1">
                    {Object.keys(summary.requirementsSummary.staff).length}
                  </Badge>
                  <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link to="/requirements/rooms" className="block">
              <div className="flex justify-between items-center p-4 bg-linear-to-r from-success/10 to-success/5 rounded-xl border border-success/20 hover:border-success/40 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-success/20">
                    <Building className="size-5 text-success" />
                  </div>
                  <span className="text-sm font-medium">Room Requirements</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-success text-white text-base px-3 py-1">
                    {Object.keys(summary.requirementsSummary.room).length}
                  </Badge>
                  <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-2 border-border/50 shadow-lg overflow-hidden bg-linear-to-br from-card via-card to-muted/20">
        <div className="absolute top-0 left-0 size-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="size-5 text-primary" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/patients">
              <Button variant="outline" className="w-full h-24 flex-col gap-2 border-2 hover:border-primary hover:bg-primary/5 transition-all">
                <Users className="size-6" />
                <span className="font-semibold">Patients</span>
              </Button>
            </Link>
            <Link to="/appointments">
              <Button variant="outline" className="w-full h-24 flex-col gap-2 border-2 hover:border-accent hover:bg-accent/5 transition-all">
                <CalendarDays className="size-6" />
                <span className="font-semibold">Appointments</span>
              </Button>
            </Link>
            <Link to="/inventory">
              <Button variant="outline" className="w-full h-24 flex-col gap-2 border-2 hover:border-success hover:bg-success/5 transition-all">
                <Package className="size-6" />
                <span className="font-semibold">Inventory</span>
              </Button>
            </Link>
            <Link to="/staff">
              <Button variant="outline" className="w-full h-24 flex-col gap-2 border-2 hover:border-warning hover:bg-warning/5 transition-all">
                <UserCheck className="size-6" />
                <span className="font-semibold">Staff</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
