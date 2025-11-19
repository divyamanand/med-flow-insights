import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Badge } from '@/components/ui/badge'
import { Stethoscope, Building2, UserRound, Activity, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

type Doctor = {
  id: string
  name: string
  department: string
  status: 'on-duty' | 'off-duty'
}

export default function Doctors() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['doctors', 'list'],
    queryFn: () => api.get<Doctor[]>('/doctors'),
  })

  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-slide-in-bottom">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Stethoscope className="size-4 text-primary" />
            <span className="text-sm font-medium text-primary">Medical Staff</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text">
            Doctors Directory
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            View and manage all doctors and their departments
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 h-11">
              <Plus className="size-4" />
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Doctor (Demo)</DialogTitle>
              <DialogDescription>
                Register a new doctor in the system. Wire to POST /doctors when ready.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button>Create (Demo)</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modern Doctors Table */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
          <div className="flex items-center gap-2">
            <UserRound className="size-5 text-primary" />
            <CardTitle>Active Doctors</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 p-12">
              <Spinner className="size-6 text-primary" />
              <span className="text-lg font-medium">Loading doctors...</span>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="text-destructive font-medium">{(error as Error).message}</div>
            </div>
          ) : data && data.length ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-bold">ID</TableHead>
                    <TableHead className="font-bold">Name</TableHead>
                    <TableHead className="font-bold">Department</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((d) => (
                    <TableRow key={d.id} className="hover:bg-primary/5 transition-colors">
                      <TableCell className="font-mono text-muted-foreground">{d.id}</TableCell>
                      <TableCell className="font-semibold">
                        <div className="flex items-center gap-2">
                          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserRound className="size-4 text-primary" />
                          </div>
                          {d.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="size-4 text-muted-foreground" />
                          <span>{d.department}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={d.status === 'on-duty' ? 'default' : 'secondary'}
                          className="gap-1.5"
                        >
                          <Activity className="size-3" />
                          <span className="capitalize">{d.status}</span>
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-12">
              <Empty className="border-2 border-dashed">
                <EmptyHeader>
                  <EmptyTitle>No doctors found</EmptyTitle>
                  <EmptyDescription>Connect your doctors endpoint to see data.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
