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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Spinner } from '@/components/ui/spinner'
import { Users, Filter, Search, Plus, Eye, Edit2, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react'

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
    <div className="flex flex-col gap-6 sm:gap-8 animate-slide-in-bottom">
      {/* Enhanced Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Users className="size-4 text-primary" />
          <span className="text-sm font-medium text-primary">Staff Management</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text">
            Staff Directory
          </h1>
          <AddStaffDialog />
        </div>
      </div>

      {/* Filters */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect">
        <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2">
            <Filter className="size-5 text-primary" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 sm:grid-cols-[1fr_200px_200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name"
                value={search}
                onChange={(e) => {
                  const val = e.target.value
                  setSearch(val)
                  setPage(1)
                  updateSearchParams({ search: val || undefined, page: 1 })
                }}
                className="pl-10 border-2"
              />
            </div>

            <Select
              value={role}
              onValueChange={(v) => {
                const next = v === role ? '' : v
                setRole(next)
                setPage(1)
                updateSearchParams({ role: next || undefined, page: 1 })
              }}
            >
              <SelectTrigger className="border-2">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((r) => (
                  <SelectItem key={r} value={r} className="capitalize">
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
              <SelectTrigger className="border-2">
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
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Switch
                checked={isAvailable}
                onCheckedChange={(ck) => {
                  setIsAvailable(ck)
                  setPage(1)
                  updateSearchParams({ isAvailable: ck ? true : undefined, page: 1 })
                }}
                id="flt-available"
              />
              <Label htmlFor="flt-available" className="text-sm font-medium cursor-pointer">Available Now</Label>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Switch
                checked={onLeave}
                onCheckedChange={(ck) => {
                  setOnLeave(ck)
                  setPage(1)
                  updateSearchParams({ onLeave: ck ? true : undefined, page: 1 })
                }}
                id="flt-onleave"
              />
              <Label htmlFor="flt-onleave" className="text-sm font-medium cursor-pointer">On Leave</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect">
        <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5 text-primary" />
            Staff Members ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {staffQuery.isLoading ? (
            <div className="flex items-center gap-2 justify-center py-8">
              <Spinner className="size-5" /> Loading staff directory...
            </div>
          ) : staffQuery.error ? (
            <div className="text-destructive text-center py-8">
              {(staffQuery.error as Error).message}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b-2 border-border/50 hover:bg-transparent">
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Role</TableHead>
                      <TableHead className="font-semibold">Phone</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Specialties</TableHead>
                      <TableHead className="font-semibold">Notes</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paged.map((s) => (
                      <TableRow key={s.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">
                          <Link to={`/staff/${s.id}`} className="text-primary hover:underline flex items-center gap-2">
                            <Users className="size-4" />
                            {s.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">{s.role}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{s.phone ?? '-'}</TableCell>
                        <TableCell className="text-sm">{s.email ?? '-'}</TableCell>

                        <TableCell className="max-w-60">
                          <div className="flex flex-wrap gap-1">
                            {(s.specialties ?? []).map((sp) => (
                              <Badge key={sp.id} variant="outline" className="text-xs">
                                {sp.name}
                              </Badge>
                            ))}
                            {(s.specialties ?? []).length === 0 && (
                              <span className="text-muted-foreground text-xs">None</span>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="truncate max-w-40 text-sm text-muted-foreground">
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
                    {paged.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                          No staff members found. Try adjusting your filters.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {paged.length === 0 ? 0 : (pageSafe - 1) * pageSize + 1} to {Math.min(pageSafe * pageSize, filtered.length)} of {filtered.length} results
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pageSafe <= 1}
                    onClick={() => {
                      const next = Math.max(1, pageSafe - 1)
                      setPage(next)
                      updateSearchParams({ page: next })
                    }}
                    className="gap-1"
                  >
                    <ChevronLeft className="size-4" />
                    Previous
                  </Button>

                  {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => i + 1).map((n) => (
                    <Button
                      key={n}
                      size="sm"
                      variant={n === pageSafe ? 'default' : 'outline'}
                      onClick={() => {
                        setPage(n)
                        updateSearchParams({ page: n })
                      }}
                      className="w-10"
                    >
                      {n}
                    </Button>
                  ))}

                  {pageCount > 5 && (
                    <span className="text-sm text-muted-foreground px-2">…</span>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pageSafe >= pageCount}
                    onClick={() => {
                      const next = Math.min(pageCount, pageSafe + 1)
                      setPage(next)
                      updateSearchParams({ page: next })
                    }}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="size-4" />
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
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')

  type CreateStaffInput = {
    email?: string
    password?: string
    role: string
    firstName?: string
    lastName?: string
    dateOfBirth?: string
    gender?: string
    phone?: string
    notes?: string
  }

  const createMut = useMutation({
    mutationFn: async (payload: CreateStaffInput) => {
      return api.post('/staff', payload)
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['staff'] })
      setOpen(false)
      // Reset form
      setEmail('')
      setRole('')
      setFirstName('')
      setLastName('')
      setDateOfBirth('')
      setGender('')
      setPhone('')
      setNotes('')
    },
  })

  const canSubmit = !!role

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    const password = dateOfBirth.replace(/-/g, '')
    const payload: CreateStaffInput = {
      role,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      dateOfBirth: dateOfBirth || undefined,
      gender: gender || undefined,
      phone: phone || undefined,
      notes: notes || undefined,
    }
    // Only include email/password if both provided
    if (email && password) {
      payload.email = email
      payload.password = password
    }
    createMut.mutate(payload)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="size-4" />
          Add Staff
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-5 text-primary" />
            Add Staff Member
          </DialogTitle>
          <DialogDescription>
            Register a new staff member. Email & password are optional for creating login credentials.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="grid gap-4">
          {/* Role (Required) */}
          <div>
            <Label className="font-semibold">Role <span className="text-destructive">*</span></Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="border-2">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((r) => (
                  <SelectItem key={r} value={r} className="capitalize">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Name Fields */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="font-semibold">First Name</Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Alice" className="border-2" />
            </div>
            <div>
              <Label className="font-semibold">Last Name</Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Admin" className="border-2" />
            </div>
          </div>

          {/* Login Credentials (Optional) */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50 space-y-3">
            <p className="text-xs font-medium text-muted-foreground">Login Credentials (Optional)</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="font-semibold">Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alice@hospital.com" className="border-2" />
              </div>
            </div>
          </div>

          {/* Additional Fields */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="font-semibold">Phone</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 0101" className="border-2" />
            </div>
            <div>
              <Label className="font-semibold">Date of Birth</Label>
              <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="border-2" />
            </div>
          </div>

          <div>
            <Label className="font-semibold">Gender</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="border-2">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="font-semibold">Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." className="border-2" />
          </div>

          {createMut.isError && (
            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
              {(createMut.error as Error)?.message ?? 'Failed to create staff member'}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={createMut.isPending}>Cancel</Button>
            <Button type="submit" disabled={!canSubmit || createMut.isPending}>
              {createMut.isPending ? 'Creating…' : 'Create Staff Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function ViewStaffDialog({ staff }: { staff: Staff }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Eye className="size-4" />
          View
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="size-5 text-primary" />
            Staff Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between p-2 rounded bg-muted/50">
            <span className="font-semibold">Name:</span>
            <span>{staff.name}</span>
          </div>
          <div className="flex justify-between p-2 rounded bg-muted/50">
            <span className="font-semibold">Role:</span>
            <Badge variant="secondary" className="capitalize">{staff.role}</Badge>
          </div>
          <div className="flex justify-between p-2 rounded bg-muted/50">
            <span className="font-semibold">Phone:</span>
            <span>{staff.phone ?? '-'}</span>
          </div>
          <div className="flex justify-between p-2 rounded bg-muted/50">
            <span className="font-semibold">Email:</span>
            <span>{staff.email ?? '-'}</span>
          </div>
          <div className="p-2 rounded bg-muted/50">
            <span className="font-semibold block mb-2">Specialties:</span>
            <div className="flex flex-wrap gap-1">
              {(staff.specialties ?? []).map((sp) => (
                <Badge key={sp.id} variant="outline">
                  {sp.name}
                </Badge>
              ))}
              {(staff.specialties ?? []).length === 0 && (
                <span className="text-muted-foreground">None</span>
              )}
            </div>
          </div>
          <div className="p-2 rounded bg-muted/50">
            <span className="font-semibold block mb-1">Notes:</span>
            <span className="text-muted-foreground">{staff.notes ?? 'No notes'}</span>
          </div>
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
        <Button variant="outline" size="sm" className="gap-1">
          <Edit2 className="size-4" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit2 className="size-5 text-primary" />
            Edit Staff Member
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm py-8 justify-center">
            <Spinner className="size-4" /> Loading staff details...
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!canSave) return
              updateMut.mutate()
            }}
            className="grid gap-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="font-semibold">First Name</Label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="border-2" />
              </div>
              <div>
                <Label className="font-semibold">Last Name</Label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="border-2" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="font-semibold">Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="border-2" />
              </div>
              <div>
                <Label className="font-semibold">Date of Birth</Label>
                <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} className="border-2" />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label className="font-semibold">Gender</Label>
                <Input placeholder="male | female | other" value={gender} onChange={(e) => setGender(e.target.value)} className="border-2" />
              </div>
              <div>
                <Label className="font-semibold">Avatar URL</Label>
                <Input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="border-2" />
              </div>
            </div>

            {updateMut.isError && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                {(updateMut.error as Error)?.message ?? 'Update failed'}
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={updateMut.isPending}>Cancel</Button>
              <Button type="submit" disabled={!canSave || updateMut.isPending}>
                {updateMut.isPending ? 'Saving…' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
