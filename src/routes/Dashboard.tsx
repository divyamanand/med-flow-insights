import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { StatCard } from '@/components/ui/stat-card'
import { Spinner } from '@/components/ui/spinner'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { 
  Activity, 
  Calendar, 
  UserCheck, 
  AlertCircle, 
  Bed, 
  UserX,
  Package,
  TrendingUp
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's your hospital overview for today.
        </p>
      </div>

      {/* Stats Grid - Modern Card Layout */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Appointments Today"
          value={summary.appointmentsToday.count}
          icon={Calendar}
          description="Total scheduled"
          className="bg-linear-to-br from-card to-primary/5"
        />

        <StatCard
          title="Pending Invitations"
          value={summary.pendingInvitations.count}
          icon={UserCheck}
          description="Not yet accepted"
          className="bg-linear-to-br from-card to-accent/5"
        />

        <StatCard
          title="Low Stock Items"
          value={summary.lowStock.count}
          icon={AlertCircle}
          description="Below threshold"
          className="bg-linear-to-br from-card to-destructive/5"
        />

        <StatCard
          title="Rooms Occupied"
          value={summary.roomsOccupied.count}
          icon={Bed}
          description="Currently in use"
          className="bg-linear-to-br from-card to-success/5"
        />

        <StatCard
          title="Staff on Leave"
          value={summary.staffOnLeave.count}
          icon={UserX}
          description="Today"
          className="bg-linear-to-br from-card to-secondary/5"
        />

        <StatCard
          title="Expiring Soon"
          value={summary.inventorySnapshot.expiringSoon.length}
          icon={Package}
          description="Medicine count"
          className="bg-linear-to-br from-card to-warning/5"
        />

        <StatCard
          title="Most In-Demand"
          value={summary.inventorySnapshot.mostInDemand.length}
          icon={TrendingUp}
          description="Top items"
          className="bg-linear-to-br from-card to-info/5"
        />

        <StatCard
          title="Recent Activity"
          value={summary.recentActivity.count}
          icon={Activity}
          description="Last 24 hours"
          className="bg-linear-to-br from-card to-chart-3/5"
        />
      </div>

      {/* Secondary Cards - Additional Info */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl">Inventory Snapshot</CardTitle>
            <CardDescription>Current stock overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Items</p>
                <p className="text-2xl font-semibold">{summary.inventorySnapshot.totalItems}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Stock</p>
                <p className="text-2xl font-semibold">{summary.inventorySnapshot.totalStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-xl">Requirements Summary</CardTitle>
            <CardDescription>Pending requirements overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
              <span className="text-sm font-medium">Item Requirements</span>
              <span className="text-lg font-semibold text-primary">
                {Object.keys(summary.requirementsSummary.item).length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-accent/5 rounded-lg">
              <span className="text-sm font-medium">Staff Requirements</span>
              <span className="text-lg font-semibold text-accent">
                {Object.keys(summary.requirementsSummary.staff).length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/5 rounded-lg">
              <span className="text-sm font-medium">Room Requirements</span>
              <span className="text-lg font-semibold text-secondary-foreground">
                {Object.keys(summary.requirementsSummary.room).length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
