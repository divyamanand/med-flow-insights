import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'

type Staff = {
  id: string
  name: string
  role: string
  phone: string | null
  email: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  specialties: { id: string; name: string }[]
}

type Specialty = { id: string; name: string }

const roleOptions = ['admin', 'receptionist', 'doctor', 'nurse', 'labTech', 'pharmacist', 'inventory', 'roomManager'] as const

export default function StaffDirectory() {
  const [search, setSearch] = useState('')
  const [role, setRole] = useState<string>('')
  const [specialtyId, setSpecialtyId] = useState<string>('')

  const [page, setPage] = useState(1)
  const pageSize = 10

  const specialtiesQuery = useQuery<Specialty[]>({
    queryKey: ['specialties'],
    queryFn: () =>
      api.get<Specialty[]>('/specialties').catch(() => [
        { id: 'cardiology', name: 'Cardiology' },
        { id: 'orthopedics', name: 'Orthopedics' },
        { id: 'pediatrics', name: 'Pediatrics' },
      ]),
  })

  const staffQuery = useQuery<Staff[]>({
    queryKey: ['staff', { search, role, specialtyId }],
    queryFn: () =>
      api.get<Staff[]>('/staff', {
        search,
        role,
        specialtyId,
      }),
  })

  const filtered = useMemo(() => {
    let rows = staffQuery.data ?? []

    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter((s) => s.name.toLowerCase().includes(q))
    }

    if (role) rows = rows.filter((s) => s.role === role)

    if (specialtyId) {
      rows = rows.filter((s) =>
        (s.specialties ?? []).some((sp) => sp.id === specialtyId),
      )
    }

    return rows
  }, [staffQuery.data, search, role, specialtyId])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageSafe = Math.min(page, pageCount)
  const paged = filtered.slice((pageSafe - 1) * pageSize, pageSafe * pageSize)

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Staff Directory</h1>
        <AddStaffDialog />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-3 sm:grid-cols-[1fr_200px_200px]">
            <Input
              placeholder="Search by name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
            />

            <Select
              value={role}
              onValueChange={(v) => {
                setRole(v === role ? '' : v)
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={specialtyId}
              onValueChange={(v) => {
                setSpecialtyId(v === specialtyId ? '' : v)
                setPage(1)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                {(specialtiesQuery.data ?? []).map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Filter</div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card>
        <CardHeader>
          <CardTitle>Staff</CardTitle>
        </CardHeader>
        <CardContent>
          {staffQuery.isLoading ? (
            <div className="flex items-center gap-2">
              <Spinner className="size-5" /> Loading…
            </div>
          ) : staffQuery.error ? (
            <div className="text-destructive">
              {(staffQuery.error as Error).message}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Specialties</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paged.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="capitalize">{s.role}</TableCell>
                      <TableCell>{s.phone ?? '-'}</TableCell>
                      <TableCell>{s.email ?? '-'}</TableCell>

                      <TableCell className="max-w-60">
                        <div className="flex flex-wrap gap-1">
                          {(s.specialties ?? []).map((sp) => (
                            <Badge key={sp.id} variant="secondary">
                              {sp.name}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell className="truncate max-w-40">
                        {s.notes ?? '-'}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ViewStaffDialog staff={s} />
                          <EditStaffDialog staff={s} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    disabled={pageSafe <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: pageCount }, (_, i) => i + 1)
                    .slice(0, 5)
                    .map((n) => (
                      <Button
                        key={n}
                        variant={n === pageSafe ? 'default' : 'ghost'}
                        onClick={() => setPage(n)}
                      >
                        {n}
                      </Button>
                    ))}

                  {pageCount > 5 ? (
                    <span className="text-sm text-muted-foreground">…</span>
                  ) : null}

                  <Button
                    variant="ghost"
                    disabled={pageSafe >= pageCount}
                    onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/* ---------------- Dialogs ---------------- */

function AddStaffDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>+ Add Staff</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Staff (Demo)</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <div>
            <Label>Name</Label>
            <Input placeholder="Alice Admin" />
          </div>
          <div>
            <Label>Role</Label>
            <Input placeholder="doctor" />
          </div>
          <div>
            <Label>Phone</Label>
            <Input placeholder="+1 555 0101" />
          </div>
          <div>
            <Label>Email</Label>
            <Input placeholder="email@example.com" />
          </div>
        </div>

        <DialogFooter>
          <Button>Save (Demo)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ViewStaffDialog({ staff }: { staff: Staff }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Staff Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <div><span className="font-medium">Name:</span> {staff.name}</div>
          <div><span className="font-medium">Role:</span> {staff.role}</div>
          <div><span className="font-medium">Phone:</span> {staff.phone ?? '-'}</div>
          <div><span className="font-medium">Email:</span> {staff.email ?? '-'}</div>
          <div className="flex flex-wrap gap-1">
            <span className="font-medium mr-2">Specialties:</span>
            {(staff.specialties ?? []).map((sp) => (
              <Badge key={sp.id} variant="secondary">
                {sp.name}
              </Badge>
            ))}
          </div>
          <div><span className="font-medium">Notes:</span> {staff.notes ?? '-'}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function EditStaffDialog({ staff }: { staff: Staff }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Staff (Demo)</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <div>
            <Label>Name</Label>
            <Input defaultValue={staff.name} />
          </div>
          <div>
            <Label>Role</Label>
            <Input defaultValue={staff.role} />
          </div>
          <div>
            <Label>Phone</Label>
            <Input defaultValue={staff.phone ?? ''} />
          </div>
          <div>
            <Label>Email</Label>
            <Input defaultValue={staff.email ?? ''} />
          </div>
        </div>

        <DialogFooter>
          <Button>Save (Demo)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
