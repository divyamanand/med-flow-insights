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
    <div className="flex flex-col gap-6">
      {/* Profile Header Card */}
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>ID: {localUser?.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
            <div className="space-y-1">
              <div className="text-lg font-medium underline underline-offset-4 decoration-transparent hover:decoration-inherit cursor-default">
                {fullName}
              </div>
              <div className="text-sm text-muted-foreground">{localUser?.email}</div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Role:</span> {localUser?.role}
                {isDisabled ? <Badge variant="secondary">Disabled</Badge> : null}
              </div>
              <div className="text-sm"><span className="font-medium">Type:</span> {localUser?.userType ?? 'N/A'}</div>
            </div>
            <div className="flex flex-col gap-2 sm:justify-start">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default">Reset Password</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Force Reset Password</DialogTitle>
                    <DialogDescription>
                      This will set a new password for the user instantly.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="text-sm">New password to be set: <span className="font-medium">Adm1nForced!23</span></div>
                  <DialogFooter>
                    <Button onClick={() => resetPassword.mutate()} disabled={resetPassword.isPending}>
                      {resetPassword.isPending ? 'Resetting…' : 'Confirm Reset'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Disable User</Button>
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
          {resetSuccess ? (
            <div className="text-sm mt-4 text-green-600">{resetSuccess}</div>
          ) : null}
          {resetError ? (
            <div className="text-sm mt-4 text-destructive">{resetError}</div>
          ) : null}
        </CardContent>
      </Card>

      {/* Personal Info Card */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle>Personal Info</CardTitle>
          </div>
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full" aria-label="Edit Personal Info">
                ✎
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Personal Info</DialogTitle>
              </DialogHeader>
              <Form {...editForm}>
                <form
                  className="grid gap-3"
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
                          <Input {...field} />
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
                          <Input {...field} />
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
                          <Input type="date" {...field} />
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
                          <Input placeholder="Male/Female/Other" {...field} />
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
                          <Input placeholder="+1 555 000 0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Save</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>First Name: <span className="underline underline-offset-4 decoration-transparent hover:decoration-inherit cursor-default">{localUser?.firstName || 'Not Provided'}</span></div>
            <div>Phone: <span className="underline underline-offset-4 decoration-transparent hover:decoration-inherit cursor-default">{localUser?.phone || 'Not Provided'}</span></div>
            <div>Date of Birth: <span>{localUser?.dateOfBirth || 'Not Provided'}</span></div>
            <div>Gender: <span>{localUser?.gender || 'Not Provided'}</span></div>
            <div>Patient Record: <span className="underline underline-offset-4">Not Linked</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Login & Activity Card */}
      <Card>
        <CardHeader>
          <CardTitle>Login & Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Label className="sr-only">Filter</Label>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Login">Login</SelectItem>
                  <SelectItem value="Logout">Logout</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                  <SelectItem value="Data Access">Data Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 sm:max-w-sm">
              <Input placeholder="Search description or IP" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <Separator className="my-4" />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Action Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r, idx) => (
                <TableRow key={idx}>
                  <TableCell>{r.time}</TableCell>
                  <TableCell>{r.action}</TableCell>
                  <TableCell>{r.description}</TableCell>
                  <TableCell>{r.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
