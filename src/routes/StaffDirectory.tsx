import { useMemo, useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'

import { api } from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'

type Staff = {
  id: string
  userId: string
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
  const [isAvailable, setIsAvailable] = useState<boolean>(false)
  const [onLeave, setOnLeave] = useState<boolean>(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const initialPage = parseInt(searchParams.get('page') || '1', 10)
  const [page, setPage] = useState(isNaN(initialPage) ? 1 : initialPage)
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

  // Initialize from URL params once
  useEffect(() => {
    const spSearch = searchParams.get('search') || ''
    const spRole = searchParams.get('role') || ''
    const spSpec = searchParams.get('specialtyId') || ''
    const spAvailable = searchParams.get('isAvailable') === 'true'
    const spOnLeave = searchParams.get('onLeave') === 'true'
    setSearch(spSearch)
    setRole(spRole)
    setSpecialtyId(spSpec)
    setIsAvailable(spAvailable)
    setOnLeave(spOnLeave)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function updateSearchParams(next: Record<string, any>) {
    const sp = new URLSearchParams(searchParams)
    Object.entries(next).forEach(([k, v]) => {
      if (v === '' || v === undefined || v === null || (typeof v === 'boolean' && v === false)) {
        sp.delete(k)
      } else {
        sp.set(k, String(v))
      }
    })
    setSearchParams(sp, { replace: true })
  }

  const staffFilters = {
    search,
    role,
    specialtyId,
    isAvailable: isAvailable ? true : undefined,
    onLeave: onLeave ? true : undefined,
  }
  const staffQuery = useQuery<Staff[]>({
    queryKey: ['staff', staffFilters],
    queryFn: () => api.get<Staff[]>('/staff', staffFilters),
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
                const val = e.target.value
                setSearch(val)
                setPage(1)
                updateSearchParams({ search: val || undefined, page: 1 })
              }}
            />

            <Select
              value={role}
              onValueChange={(v) => {
                const next = v === role ? '' : v
                setRole(next)
                setPage(1)
                updateSearchParams({ role: next || undefined, page: 1 })
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
                const next = v === specialtyId ? '' : v
                setSpecialtyId(next)
                setPage(1)
                updateSearchParams({ specialtyId: next || undefined, page: 1 })
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
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={isAvailable}
                onCheckedChange={(ck) => {
                  setIsAvailable(ck)
                  setPage(1)
                  updateSearchParams({ isAvailable: ck ? true : undefined, page: 1 })
                }}
                id="flt-available"
              />
              <Label htmlFor="flt-available" className="text-sm">Available</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={onLeave}
                onCheckedChange={(ck) => {
                  setOnLeave(ck)
                  setPage(1)
                  updateSearchParams({ onLeave: ck ? true : undefined, page: 1 })
                }}
                id="flt-onleave"
              />
              <Label htmlFor="flt-onleave" className="text-sm">On Leave</Label>
            </div>
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Filters</div>
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
                      <TableCell className="font-medium">
                        <Link to={`/staff/${s.id}`} className="text-primary hover:underline">
                          {s.name}
                        </Link>
                      </TableCell>
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
                    onClick={() => {
                      const next = Math.max(1, pageSafe - 1)
                      setPage(next)
                      updateSearchParams({ page: next })
                    }}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: pageCount }, (_, i) => i + 1)
                    .slice(0, 5)
                    .map((n) => (
                      <Button
                        key={n}
                        variant={n === pageSafe ? 'default' : 'ghost'}
                        onClick={() => {
                          setPage(n)
                          updateSearchParams({ page: n })
                        }}
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
                    onClick={() => {
                      const next = Math.min(pageCount, pageSafe + 1)
                      setPage(next)
                      updateSearchParams({ page: next })
                    }}
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
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)

  type UserDetail = {
    id: string
    email: string
    role: string
    type: string
    firstName: string | null
    lastName: string | null
    dateOfBirth: string | null
    gender: string | null
    phone: string | null
    avatarUrl?: string | null
  }

  const { data, isLoading } = useQuery<UserDetail>({
    queryKey: ['user', staff.userId, 'detail'],
    queryFn: () => api.get<UserDetail>(`/users/${staff.userId}`),
    enabled: open,
  })

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState<string>('')
  const [avatarUrl, setAvatarUrl] = useState('')

  useEffect(() => {
    if (data) {
      setFirstName(data.firstName ?? (staff.name.split(' ')[0] ?? ''))
      setLastName(data.lastName ?? (staff.name.split(' ').slice(1).join(' ') ?? ''))
      setPhone(data.phone ?? (staff.phone ?? ''))
      setDateOfBirth(data.dateOfBirth ?? '')
      setGender((data.gender ?? '').toString())
      setAvatarUrl(data.avatarUrl ?? '')
    } else {
      // fallback from staff row
      setFirstName(staff.name.split(' ')[0] ?? '')
      setLastName(staff.name.split(' ').slice(1).join(' ') ?? '')
      setPhone(staff.phone ?? '')
    }
  }, [data, staff])

  const updateMut = useMutation({
    mutationFn: async () => {
      const body: Record<string, string> = {}
      if (firstName) body.firstName = firstName
      if (lastName) body.lastName = lastName
      if (phone) body.phone = phone
      if (dateOfBirth) body.dateOfBirth = dateOfBirth
      if (gender) body.gender = gender
      if (avatarUrl) body.avatarUrl = avatarUrl
      return api.put(`/users/${staff.userId}`, body)
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['staff'] }),
        qc.invalidateQueries({ queryKey: ['user', staff.userId, 'detail'] }),
      ])
      setOpen(false)
    },
  })

  const canSave = !!firstName || !!lastName || !!phone || !!dateOfBirth || !!gender || !!avatarUrl

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Staff</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm"><Spinner className="size-4" /> Loading…</div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!canSave) return
              updateMut.mutate()
            }}
            className="grid gap-3"
          >
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <Label>First Name</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <Label>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <Label>Gender</Label>
                <Input placeholder="male | female | other" value={gender} onChange={(e) => setGender(e.target.value)} />
              </div>
              <div>
                <Label>Avatar URL</Label>
                <Input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
              </div>
            </div>

            {updateMut.isError ? (
              <div className="text-sm text-destructive">{(updateMut.error as Error)?.message ?? 'Update failed'}</div>
            ) : null}

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={updateMut.isPending}>Cancel</Button>
              <Button type="submit" disabled={!canSave || updateMut.isPending}>{updateMut.isPending ? 'Saving…' : 'Save'}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
