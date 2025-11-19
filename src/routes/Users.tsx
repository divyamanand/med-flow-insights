import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Plus, Trash2, UserMinus, UserRound } from 'lucide-react'

import { api } from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'

type User = {
  id: string
  email: string
  role: 'admin' | 'receptionist' | 'doctor' | 'nurse' | 'labTech' | 'pharmacist' | 'inventory' | 'roomManager' | 'patient' | string
  type: 'staff' | 'patient' | string
  firstName?: string
  lastName?: string
  phone?: string
  createdAt?: string
}

const roles = ['admin','receptionist','doctor','nurse','labTech','pharmacist','inventory','roomManager','patient'] as const
const types = ['staff','patient'] as const
const extraOptions = ['all','receptionist','patient'] as const // frontend-only

export default function Users() {
  const [emailLike, setEmailLike] = useState('')
  const [role, setRole] = useState<string>('all')
  const [type, setType] = useState<string>('all')
  const [extra, setExtra] = useState<string>('all')

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const usersQ = useQuery<User[]>({
    queryKey: ['users', { role, type, emailLike }],
    queryFn: () => api.get<User[]>('/users', {
      role: role === 'all' ? undefined : role,
      type: type === 'all' ? undefined : type,
      emailLike: emailLike || undefined,
    }),
  })

  const filtered = useMemo(() => {
    let list = usersQ.data ?? []
    if (extra === 'receptionist') list = list.filter((u) => u.role === 'receptionist')
    if (extra === 'patient') list = list.filter((u) => u.type === 'patient')
    return list
  }, [usersQ.data, extra])

  const total = filtered.length
  const start = (page - 1) * pageSize
  const end = Math.min(start + pageSize, total)
  const pageRows = filtered.slice(start, end)

  function resetToFirstPage() { setPage(1) }

  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-slide-in-bottom">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <UserRound className="size-4 text-primary" />
            <span className="text-sm font-medium text-primary">User Management</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text">
            User Directory
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage all users, roles, and permissions
          </p>
        </div>
        <CreateUserDialog />
      </div>

      {/* Modern Filters Card */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Plus className="size-5 text-primary" />
            <CardTitle>Filters & Search</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Search</label>
              <Input
                placeholder="Search by Name or Email..."
                value={emailLike}
                onChange={(e) => { setEmailLike(e.target.value); resetToFirstPage() }}
                className="border-2 focus:border-primary transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Role</label>
              <Select value={role} onValueChange={(v) => { setRole(v); resetToFirstPage() }}>
                <SelectTrigger className="border-2 focus:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {roles.map((r) => (<SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Type</label>
              <Select value={type} onValueChange={(v) => { setType(v); resetToFirstPage() }}>
                <SelectTrigger className="border-2 focus:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {types.map((t) => (<SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">Extra Filter</label>
              <Select value={extra} onValueChange={(v) => { setExtra(v); resetToFirstPage() }}>
                <SelectTrigger className="border-2 focus:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {extraOptions.map((x) => (<SelectItem key={x} value={x} className="capitalize">{x}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modern Users Table */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserRound className="size-5 text-primary" />
              <CardTitle>Users List</CardTitle>
            </div>
            <Badge variant="outline" className="px-3 py-1">{total} Total</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {usersQ.isLoading ? (
            <div className="flex items-center justify-center gap-3 p-12">
              <Spinner className="size-6 text-primary" />
              <span className="text-lg font-medium">Loading users...</span>
            </div>
          ) : usersQ.error ? (
            <div className="p-12 text-center">
              <div className="text-destructive font-medium">{(usersQ.error as Error).message}</div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="w-12 font-bold">#</TableHead>
                      <TableHead className="font-bold">Name</TableHead>
                      <TableHead className="font-bold">Email</TableHead>
                      <TableHead className="font-bold">Role</TableHead>
                      <TableHead className="font-bold">Type</TableHead>
                      <TableHead className="font-bold">Phone</TableHead>
                      <TableHead className="font-bold">Created</TableHead>
                      <TableHead className="text-right font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageRows.map((u, idx) => (
                      <TableRow key={u.id} className="hover:bg-primary/5 transition-colors">
                        <TableCell className="font-mono text-muted-foreground">{start + idx + 1}</TableCell>
                        <TableCell className="font-semibold">{[u.firstName, u.lastName].filter(Boolean).join(' ') || '-'}</TableCell>
                        <TableCell className="text-sm">{u.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{u.role}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">{u.type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{u.phone ?? '-'}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{u.createdAt ? format(new Date(u.createdAt), 'PP') : '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <DisableUserDialog>
                              <Button variant="ghost" size="sm" title="Disable" className="hover:bg-warning/10">
                                <UserMinus className="size-4 text-warning" />
                              </Button>
                            </DisableUserDialog>
                            <DeleteUserDialog>
                              <Button variant="ghost" size="sm" title="Delete" className="hover:bg-destructive/10">
                                <Trash2 className="size-4 text-destructive" />
                              </Button>
                            </DeleteUserDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Modern Pagination */}
              <div className="border-t border-border/50 bg-muted/20 px-6 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Rows per page:</span>
                    <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1) }}>
                      <SelectTrigger className="w-20 h-9 border-2 focus:border-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[10, 20, 50].map((n) => (<SelectItem key={n} value={String(n)}>{n}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">{total === 0 ? '0–0 of 0' : `${start + 1}–${end} of ${total}`}</span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="border-2">
                        <UserMinus className="size-4" />
                      </Button>
                      <Button variant="outline" size="sm" disabled={end >= total} onClick={() => setPage((p) => p + 1)} className="border-2">
                        <Plus className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function CreateUserDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="mr-2 size-4" /> Create User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User (Demo)</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">This opens a placeholder dialog. Wire to POST /users when ready.</p>
        <DialogFooter>
          <Button>Create (Demo)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DisableUserDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disable User (Demo)</DialogTitle>
        </DialogHeader>
        <p className="text-sm">Are you sure you want to disable this user?</p>
        <DialogFooter>
          <Button variant="ghost">Cancel</Button>
          <Button variant="outline">Disable (Demo)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteUserDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete User (Demo)</DialogTitle>
        </DialogHeader>
        <p className="text-sm">This is irreversible. Proceed?</p>
        <DialogFooter>
          <Button variant="ghost">Cancel</Button>
          <Button variant="destructive">Delete (Demo)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
