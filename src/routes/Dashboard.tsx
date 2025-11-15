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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Empty className="border-destructive/20 bg-destructive/5">
          <EmptyHeader>
            <EmptyTitle className="text-destructive">Error Loading Dashboard</EmptyTitle>
            <EmptyDescription>{(error as Error).message}</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>No data available</EmptyTitle>
            <EmptyDescription>Connect the dashboard endpoint to view statistics.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    )
  }

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
          value={data.appointmentsToday.count}
          icon={Calendar}
          description="Total scheduled"
          className="bg-gradient-to-br from-card to-primary/5"
        />

        <StatCard
          title="Pending Invitations"
          value={data.pendingInvitations.count}
          icon={UserCheck}
          description="Not yet accepted"
          className="bg-gradient-to-br from-card to-accent/5"
        />

        <StatCard
          title="Low Stock Items"
          value={data.lowStock.count}
          icon={AlertCircle}
          description="Below threshold"
          className="bg-gradient-to-br from-card to-destructive/5"
        />

        <StatCard
          title="Rooms Occupied"
          value={data.roomsOccupied.count}
          icon={Bed}
          description="Currently in use"
          className="bg-gradient-to-br from-card to-success/5"
        />

        <StatCard
          title="Staff on Leave"
          value={data.staffOnLeave.count}
          icon={UserX}
          description="Today"
          className="bg-gradient-to-br from-card to-secondary/5"
        />

        <StatCard
          title="Expiring Soon"
          value={data.inventorySnapshot.expiringSoon.length}
          icon={Package}
          description="Medicine count"
          className="bg-gradient-to-br from-card to-warning/5"
        />

        <StatCard
          title="Most In-Demand"
          value={data.inventorySnapshot.mostInDemand.length}
          icon={TrendingUp}
          description="Top items"
          className="bg-gradient-to-br from-card to-info/5"
        />

        <StatCard
          title="Recent Activity"
          value={data.recentActivity.count}
          icon={Activity}
          description="Last 24 hours"
          className="bg-gradient-to-br from-card to-chart-3/5"
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
                <p className="text-2xl font-semibold">{data.inventorySnapshot.totalItems}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Total Stock</p>
                <p className="text-2xl font-semibold">{data.inventorySnapshot.totalStock}</p>
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
                {Object.keys(data.requirementsSummary.item).length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-accent/5 rounded-lg">
              <span className="text-sm font-medium">Staff Requirements</span>
              <span className="text-lg font-semibold text-accent">
                {Object.keys(data.requirementsSummary.staff).length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-secondary/5 rounded-lg">
              <span className="text-sm font-medium">Room Requirements</span>
              <span className="text-lg font-semibold text-secondary-foreground">
                {Object.keys(data.requirementsSummary.room).length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
