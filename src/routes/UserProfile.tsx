import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { api } from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { Badge } from '@/components/ui/badge'
import { User, Shield, Phone, Mail, Calendar, Activity, Edit2, Key, UserX, Filter } from 'lucide-react'

type User = {
  id: string
  email: string
  role: string
  userType?: string | null
  staffId?: string | null
  firstName?: string | null
  lastName?: string | null
  dateOfBirth?: string | null
  gender?: string | null
  phone?: string | null
}

const EditSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  phone: z.string().optional(),
})

export default function UserProfile() {
  const { id = '' } = useParams()
  const [isDisabled, setIsDisabled] = useState(false)
  const [resetSuccess, setResetSuccess] = useState<string | null>(null)
  const [resetError, setResetError] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', id],
    queryFn: () => api.get<User>(`/users/${id}`),
    enabled: Boolean(id),
  })

  const [localUser, setLocalUser] = useState<User | null>(null)
  useEffect(() => {
    if (data) setLocalUser(data)
  }, [data])

  const editForm = useForm<z.infer<typeof EditSchema>>({
    resolver: zodResolver(EditSchema),
    values: {
      firstName: localUser?.firstName ?? '',
      lastName: localUser?.lastName ?? '',
      dateOfBirth: localUser?.dateOfBirth ?? '',
      gender: localUser?.gender ?? '',
      phone: localUser?.phone ?? '',
    },
  })

  const resetPassword = useMutation({
    mutationKey: ['reset-password', id],
    mutationFn: () => api.post<{ ok: true }, { userId: string; newPassword: string }>(
      '/auth/reset-password',
      { userId: id, newPassword: 'Adm1nForced!23' },
    ),
    onSuccess: () => {
      setResetError(null)
      setResetSuccess('Password reset successfully.')
    },
    onError: (err: any) => {
      setResetSuccess(null)
      setResetError(err?.message || 'Reset failed')
    },
  })

  // Demo activity rows
  const activityRows = useMemo(
    () => [
      { time: '10:30 AM', action: 'Login', description: 'Successful login', ip: '192.168.1.101' },
      { time: '09:45 AM', action: 'Data Access', description: 'Viewed patient records', ip: '192.168.1.101' },
      { time: '07:10 AM', action: 'Logout', description: 'User logout', ip: '192.168.1.99' },
      { time: '04:30 AM', action: 'System', description: 'Password change attempt', ip: '192.168.1.99' },
    ],
    [],
  )
  const [filter, setFilter] = useState<string>('All')
  const [search, setSearch] = useState('')
  const filtered = useMemo(() => {
    return activityRows.filter((r) => {
      const byFilter = filter === 'All' || r.action === filter
      const q = search.trim().toLowerCase()
      const bySearch = !q || r.description.toLowerCase().includes(q) || r.ip.toLowerCase().includes(q)
      return byFilter && bySearch
    })
  }, [activityRows, filter, search])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (error) {
    return <div className="text-destructive">{(error as Error).message}</div>
  }

  const fullName = [localUser?.firstName, localUser?.lastName].filter(Boolean).join(' ') || 'Unnamed User'

  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-slide-in-bottom">
      {/* Enhanced Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <User className="size-4 text-primary" />
          <span className="text-sm font-medium text-primary">User Profile</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text">
          {fullName}
        </h1>
        <p className="text-sm text-muted-foreground font-mono">ID: {localUser?.id}</p>
      </div>

      {/* Profile Header Card */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect">
        <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2">
            <User className="size-5 text-primary" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="size-5 text-primary shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Email</div>
                  <div className="font-medium">{localUser?.email}</div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Shield className="size-5 text-accent shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">Role</div>
                    <Badge variant="secondary" className="capitalize">{localUser?.role}</Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Activity className="size-5 text-primary shrink-0" />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">Type</div>
                    <div className="font-medium">{localUser?.userType ?? 'N/A'}</div>
                  </div>
                </div>
              </div>

              {isDisabled && (
                <Badge variant="destructive" className="gap-1">
                  <UserX className="size-3" />
                  Account Disabled
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Key className="size-4" />
                    Reset Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Key className="size-5 text-primary" />
                      Force Reset Password
                    </DialogTitle>
                    <DialogDescription>
                      This will set a new password for the user instantly.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="text-sm bg-muted/50 p-4 rounded-lg">
                    New password: <span className="font-mono font-semibold">Adm1nForced!23</span>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => resetPassword.mutate()} disabled={resetPassword.isPending}>
                      {resetPassword.isPending ? 'Resetting…' : 'Confirm Reset'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <UserX className="size-4" />
                    Disable User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Disable this user?</DialogTitle>
                    <DialogDescription>Are you sure you want to disable this user?</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="secondary">Cancel</Button>
                    <Button variant="destructive" onClick={() => setIsDisabled(true)}>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {resetSuccess && (
            <div className="mt-4 p-3 rounded-lg bg-success/10 border border-success/20 text-success text-sm">
              {resetSuccess}
            </div>
          )}
          {resetError && (
            <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {resetError}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Personal Info Card */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect">
        <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="size-5 text-primary" />
              Personal Information
            </CardTitle>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogTrigger asChild>
                <Button size="icon" variant="ghost" className="rounded-full" aria-label="Edit Personal Info">
                  <Edit2 className="size-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Edit2 className="size-5 text-primary" />
                    Edit Personal Info
                  </DialogTitle>
                </DialogHeader>
                <Form {...editForm}>
                  <form
                    className="grid gap-4"
                    onSubmit={editForm.handleSubmit((values) => {
                      setLocalUser((prev) => (prev ? { ...prev, ...values } : prev))
                      setEditOpen(false)
                    })}
                  >
                    <FormField
                      control={editForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <Label>First Name</Label>
                          <FormControl>
                            <Input {...field} className="border-2" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Last Name</Label>
                          <FormControl>
                            <Input {...field} className="border-2" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Date of Birth</Label>
                          <FormControl>
                            <Input type="date" {...field} className="border-2" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Gender</Label>
                          <FormControl>
                            <Input placeholder="Male/Female/Other" {...field} className="border-2" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Phone</Label>
                          <FormControl>
                            <Input placeholder="+1 555 000 0000" {...field} className="border-2" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <User className="size-5 text-primary shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">First Name</div>
                <div className="font-medium">{localUser?.firstName || 'Not Provided'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Phone className="size-5 text-primary shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Phone</div>
                <div className="font-medium">{localUser?.phone || 'Not Provided'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Calendar className="size-5 text-primary shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Date of Birth</div>
                <div className="font-medium">{localUser?.dateOfBirth || 'Not Provided'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <User className="size-5 text-primary shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Gender</div>
                <div className="font-medium">{localUser?.gender || 'Not Provided'}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Activity className="size-5 text-primary shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Patient Record</div>
                <div className="text-sm text-muted-foreground">Not Linked</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Login & Activity Card */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect">
        <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5 text-primary" />
            Login & Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="min-w-40 border-2">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Activities</SelectItem>
                  <SelectItem value="Login">Login</SelectItem>
                  <SelectItem value="Logout">Logout</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                  <SelectItem value="Data Access">Data Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 sm:max-w-sm">
              <Input
                placeholder="Search description or IP"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-2"
              />
            </div>
          </div>
          <Separator className="my-4" />
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 border-border/50 hover:bg-transparent">
                  <TableHead className="font-semibold">Time</TableHead>
                  <TableHead className="font-semibold">Action Type</TableHead>
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="font-semibold">IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{r.time}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{r.action}</Badge>
                    </TableCell>
                    <TableCell>{r.description}</TableCell>
                    <TableCell>
                      <span className="font-mono text-xs">{r.ip}</span>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No activities found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
