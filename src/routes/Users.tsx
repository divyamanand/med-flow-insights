import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Plus, Trash2, UserMinus } from 'lucide-react'

import { api } from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
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
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Page Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl sm:text-2xl">User Management</CardTitle>
          <CreateUserDialog />
        </CardHeader>
      </Card>

      {/* Filters Row */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              placeholder="Search by Name or Email"
              value={emailLike}
              onChange={(e) => { setEmailLike(e.target.value); resetToFirstPage() }}
            />

            <div>
              <div className="text-xs text-muted-foreground mb-1">Role</div>
              <Select value={role} onValueChange={(v) => { setRole(v); resetToFirstPage() }}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {roles.map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Type</div>
              <Select value={type} onValueChange={(v) => { setType(v); resetToFirstPage() }}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {types.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Extra</div>
              <Select value={extra} onValueChange={(v) => { setExtra(v); resetToFirstPage() }}>
                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {extraOptions.map((x) => (<SelectItem key={x} value={x}>{x}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="pt-6">
          {usersQ.isLoading ? (
            <div className="flex items-center justify-center p-10"><Spinner className="size-6" /></div>
          ) : usersQ.error ? (
            <div className="text-destructive">{(usersQ.error as Error).message}</div>
          ) : (
            <>
              <div className="w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>CreatedAt</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageRows.map((u, idx) => (
                      <TableRow key={u.id}>
                        <TableCell>{start + idx + 1}</TableCell>
                        <TableCell>{[u.firstName, u.lastName].filter(Boolean).join(' ') || '-'}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell className="capitalize">{u.role}</TableCell>
                        <TableCell className="capitalize">{u.type}</TableCell>
                        <TableCell>{u.phone ?? '-'}</TableCell>
                        <TableCell>{u.createdAt ? format(new Date(u.createdAt), 'PP') : '-'}</TableCell>
                        <TableCell className="text-right">
                          <DisableUserDialog>
                            <Button variant="ghost" size="sm" title="Disable">
                              <UserMinus className="size-4 text-muted-foreground" />
                            </Button>
                          </DisableUserDialog>
                          <DeleteUserDialog>
                            <Button variant="ghost" size="sm" title="Delete">
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </DeleteUserDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Separator className="my-4" />

              {/* Pagination Row */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <span>Rows per page:</span>
                  <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1) }}>
                    <SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {[10, 20, 50].map((n) => (<SelectItem key={n} value={String(n)}>{n}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span>{total === 0 ? '0–0 of 0' : `${start + 1}–${end} of ${total}`}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>{'<'}</Button>
                    <Button variant="outline" size="sm" disabled={end >= total} onClick={() => setPage((p) => p + 1)}>{'>'}</Button>
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
