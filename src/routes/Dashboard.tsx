import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'

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

  const renderValue = (value: string | number) => {
    if (isLoading) return <Spinner className="size-6" />
    if (error) return <div className="text-destructive">{(error as Error).message}</div>
    if (!data)
      return (
        <Empty className="border">
          <EmptyHeader>
            <EmptyTitle>No data</EmptyTitle>
            <EmptyDescription>Connect the dashboard endpoint.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )
    return <div className="text-3xl font-semibold">{value}</div>
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Appointments Today</CardTitle>
          <CardDescription>Total appointments</CardDescription>
        </CardHeader>
        <CardContent>
          {renderValue(data?.appointmentsToday.count ?? 0)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>Not yet accepted</CardDescription>
        </CardHeader>
        <CardContent>
          {renderValue(data?.pendingInvitations.count ?? 0)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Low Stock Items</CardTitle>
          <CardDescription>Below threshold</CardDescription>
        </CardHeader>
        <CardContent>
          {renderValue(data?.lowStock.count ?? 0)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rooms Occupied</CardTitle>
          <CardDescription>Currently in use</CardDescription>
        </CardHeader>
        <CardContent>
          {renderValue(data?.roomsOccupied.count ?? 0)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Staff on Leave</CardTitle>
          <CardDescription>Today</CardDescription>
        </CardHeader>
        <CardContent>
          {renderValue(data?.staffOnLeave.count ?? 0)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expiring Soon</CardTitle>
          <CardDescription>Medicine count</CardDescription>
        </CardHeader>
        <CardContent>
          {renderValue(data?.inventorySnapshot.expiringSoon.length ?? 0)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Most In-Demand</CardTitle>
          <CardDescription>Top items</CardDescription>
        </CardHeader>
        <CardContent>
          {renderValue(data?.inventorySnapshot.mostInDemand.length ?? 0)}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Open Requirements</CardTitle>
          <CardDescription>Item / Staff / Room</CardDescription>
        </CardHeader>
        <CardContent>
          {renderValue(
            (data?.requirementsSummary.item.open ?? 0) +
            (data?.requirementsSummary.staff.open ?? 0) +
            (data?.requirementsSummary.room.open ?? 0)
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Last 24 hours</CardDescription>
        </CardHeader>
        <CardContent>
          {renderValue(data?.recentActivity.count ?? 0)}
        </CardContent>
      </Card>
    </div>
  )
}
