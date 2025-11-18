import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Spinner } from '@/components/ui/spinner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type Patient = {
  id: string
  userId: string
  name: string
  gender: string
  dateOfBirth: string
  age: number
  createdAt: string
  appointmentsCount: number
  prescriptionsCount: number
}

export default function Patients() {
  const [search, setSearch] = useState('')
  const [gender, setGender] = useState<'all' | 'male' | 'female'>('all')
  const [ageRange, setAgeRange] = useState<[number, number]>([0, 120])
  const [minAgeInput, setMinAgeInput] = useState(0)
  const [maxAgeInput, setMaxAgeInput] = useState(120)
  const [applied, setApplied] = useState({
    gender: 'all' as 'all' | 'male' | 'female',
    minAge: 0,
    maxAge: 120,
  })
  const [searchParams, setSearchParams] = useSearchParams()

  // Initialize filters from URL params
  useEffect(() => {
    const spSearch = searchParams.get('search') || ''
    const spGender = (searchParams.get('gender') as 'male' | 'female' | 'all' | null) || 'all'
    const spMinAge = parseInt(searchParams.get('minAge') || '0', 10)
    const spMaxAge = parseInt(searchParams.get('maxAge') || '120', 10)
    setSearch(spSearch)
    setGender(spGender)
    setAgeRange([isNaN(spMinAge) ? 0 : spMinAge, isNaN(spMaxAge) ? 120 : spMaxAge])
    setApplied({ gender: spGender, minAge: isNaN(spMinAge) ? 0 : spMinAge, maxAge: isNaN(spMaxAge) ? 120 : spMaxAge })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setMinAgeInput(ageRange[0])
    setMaxAgeInput(ageRange[1])
  }, [ageRange])

  const queryFilters = {
    search,
    gender: applied.gender === 'all' ? '' : applied.gender,
    minAge: applied.minAge,
    maxAge: applied.maxAge,
  }
  const { data, isLoading, error } = useQuery<Patient[]>({
    queryKey: ['patients', queryFilters],
    queryFn: () => api.get<Patient[]>('/patients', queryFilters),
  })

  const initialPage = parseInt(searchParams.get('page') || '1', 10)
  const [page, setPage] = useState(isNaN(initialPage) ? 1 : initialPage)
  const pageSize = 10
  const rows = data ?? []
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const pageSafe = Math.min(page, pageCount)
  const paged = rows.slice((pageSafe - 1) * pageSize, pageSafe * pageSize)

  function updateSearchParams(next: Record<string, any>) {
    const sp = new URLSearchParams(searchParams)
    Object.entries(next).forEach(([k, v]) => {
      if (v === '' || v === undefined || v === null) {
        sp.delete(k)
      } else {
        sp.set(k, String(v))
      }
    })
    setSearchParams(sp, { replace: true })
  }

  function applyFilters() {
    const [min, max] = ageRange
    const _min = Math.max(0, Math.min(min, max))
    const _max = Math.max(_min, Math.min(max, 150))
    const nextApplied = { gender, minAge: _min, maxAge: _max }
    setApplied(nextApplied)
    setPage(1)
    updateSearchParams({
      search: search || undefined,
      gender: gender !== 'all' ? gender : undefined,
      minAge: _min !== 0 ? _min : undefined,
      maxAge: _max !== 120 ? _max : undefined,
      page: 1,
    })
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Header Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-xl font-semibold">Patient Management</h1>
        <div className="flex items-center gap-2 sm:min-w-[420px]">
          <Input
            placeholder="Search patients..."
            value={search}
            onChange={(e) => {
              const val = e.target.value
              setSearch(val)
              setPage(1)
              updateSearchParams({
                search: val || undefined,
                page: 1,
              })
            }}
          />
          <AddPatientDialog />
        </div>
      </div>

      {/* Compact Filters */}
      <Card>
        <CardContent className="py-3 px-4">
          <div className="flex flex-wrap items-end gap-4">
            {/* Gender */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs font-medium">Gender</Label>
              <RadioGroup
                value={gender}
                onValueChange={(v) => setGender(v as any)}
                className="flex gap-3"
              >
                <div className="flex items-center gap-1">
                  <RadioGroupItem id="g-all" value="all" />
                  <Label htmlFor="g-all" className="text-xs">All</Label>
                </div>
                <div className="flex items-center gap-1">
                  <RadioGroupItem id="g-female" value="female" />
                  <Label htmlFor="g-female" className="text-xs">Female</Label>
                </div>
                <div className="flex items-center gap-1">
                  <RadioGroupItem id="g-male" value="male" />
                  <Label htmlFor="g-male" className="text-xs">Male</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Age Range inline */}
            <div className="flex flex-col gap-1 min-w-[220px]">
              <Label className="text-xs font-medium">Age {ageRange[0]} - {ageRange[1]}</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={minAgeInput}
                  onChange={(e) => setMinAgeInput(Number(e.target.value))}
                  onBlur={() =>
                    setAgeRange(([_, max]) => [
                      Math.max(0, Math.min(minAgeInput, max)),
                      max,
                    ])
                  }
                  className="h-8 w-16"
                />
                <Slider
                  min={0}
                  max={120}
                  value={ageRange}
                  onValueChange={(v) => setAgeRange(v as [number, number])}
                  className="flex-1"
                />
                <Input
                  type="number"
                  value={maxAgeInput}
                  onChange={(e) => setMaxAgeInput(Number(e.target.value))}
                  onBlur={() =>
                    setAgeRange(([min, _]) => [
                      min,
                      Math.max(min, Math.min(maxAgeInput, 150)),
                    ])
                  }
                  className="h-8 w-16"
                />
              </div>
            </div>

            <div className="ml-auto flex gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                // Reset filters
                setGender('all')
                setAgeRange([0, 120])
                setApplied({ gender: 'all', minAge: 0, maxAge: 120 })
                setMinAgeInput(0)
                setMaxAgeInput(120)
                setPage(1)
                updateSearchParams({ gender: undefined, minAge: undefined, maxAge: undefined, page: 1 })
              }}>Reset</Button>
              <Button size="sm" onClick={applyFilters}>Apply</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Patients</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Spinner className="size-5" /> Loading…
            </div>
          ) : error ? (
            <div className="text-destructive">{(error as Error).message}</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>DOB</TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>Registered On</TableHead>
                    <TableHead>Appointments</TableHead>
                    <TableHead>Prescriptions</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">
                        <Link to={`/patients/${p.id}`} className="text-primary hover:underline">
                          {p.name}
                        </Link>
                      </TableCell>
                      <TableCell className="capitalize">{p.gender}</TableCell>
                      <TableCell>{p.dateOfBirth}</TableCell>
                      <TableCell>{p.age}</TableCell>
                      <TableCell>{p.createdAt}</TableCell>
                      <TableCell>{p.appointmentsCount}</TableCell>
                      <TableCell>{p.prescriptionsCount}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <RowActions id={p.id} userId={p.userId} name={p.name} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between text-sm">
                <div>Page {pageSafe} of {pageCount}</div>
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
                    Prev
                  </Button>
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

/* ---------- Dialogs ---------- */

function AddPatientDialog() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('') // YYYY-MM-DD
  const [gender, setGender] = useState<'male' | 'female' | ''>('')

  type CreatePatientInput = {
    email: string
    password: string
    firstName: string
    lastName: string
    dateOfBirth: string
    gender: string
    phone: string
  }

  const createPatient = useMutation({
    mutationFn: async (payload: CreatePatientInput) => {
      return api.post('/patients', payload)
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['patients'] })
      setOpen(false)
      // reset form
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhone('')
      setDateOfBirth('')
      setGender('')
    },
  })

  const canSubmit =
    !!firstName &&
    !!lastName &&
    !!email &&
    !!dateOfBirth &&
    !!gender

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    const password = dateOfBirth.replace(/-/g, '') // YYYYMMDD
    createPatient.mutate({
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phone,
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Add Patient</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Patient</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-1">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-1">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
              <p className="text-xs text-muted-foreground">Password will be set to YYYYMMDD</p>
            </div>
            <div className="grid gap-1">
              <Label>Gender</Label>
              <Select value={gender} onValueChange={(v) => setGender(v as 'male' | 'female')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {createPatient.isError ? (
            <div className="text-sm text-destructive">
              {(createPatient.error as Error)?.message ?? 'Failed to create patient'}
            </div>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={createPatient.isPending}>Cancel</Button>
            <Button type="submit" disabled={!canSubmit || createPatient.isPending}>
              {createPatient.isPending ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

type PatientDetail = {
  id: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    email: string
    role: 'patient'
    type: 'patient'
    firstName: string | null
    lastName: string | null
    dateOfBirth: string | null // YYYY-MM-DD
    gender: string | null
    phone: string | null
  }
  primaryPhysician: { id: string } | null
}

function RowActions({ id, userId, name }: { id: string; userId: string; name: string }) {
  const qc = useQueryClient()

  // Edit dialog state and data
  const [openEdit, setOpenEdit] = useState(false)
  const { data, isLoading } = useQuery<PatientDetail>({
    queryKey: ['patient', id, 'detail'],
    queryFn: () => api.get<PatientDetail>(`/patients/${id}`),
    enabled: openEdit,
  })

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | ''>('')
  const [phone, setPhone] = useState('')

  // Initialize form when data loads
  useEffect(() => {
    if (data?.user) {
      setFirstName(data.user.firstName ?? '')
      setLastName(data.user.lastName ?? '')
      setDateOfBirth(data.user.dateOfBirth ?? '')
      const g = (data.user.gender ?? '').toLowerCase()
      setGender(g === 'male' || g === 'female' ? (g as 'male' | 'female') : '')
      setPhone(data.user.phone ?? '')
    }
  }, [data])

  const updateMut = useMutation({
    mutationFn: async () => {
      const body = {
        firstName,
        lastName,
        dateOfBirth,
        gender,
        phone,
      }
      // Prefer updating profile fields via users endpoint
      return api.put(`/users/${userId}`, body)
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['patients'] }),
        qc.invalidateQueries({ queryKey: ['patient', id, 'detail'] }),
      ])
      setOpenEdit(false)
    },
  })

  const canSave = !!firstName && !!lastName && !!dateOfBirth && !!gender

  // Delete dialog state
  const [openDelete, setOpenDelete] = useState(false)
  const deleteMut = useMutation({
    mutationFn: async () => api.delete(`/patients/${id}`),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['patients'] })
      setOpenDelete(false)
    },
  })

  return (
    <div className="flex items-center gap-2">
      {/* Edit */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">Edit</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Patient</DialogTitle>
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
              className="grid gap-4"
            >
              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-1">
                  <Label htmlFor={`fn-${id}`}>First Name</Label>
                  <Input id={`fn-${id}`} value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor={`ln-${id}`}>Last Name</Label>
                  <Input id={`ln-${id}`} value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <div className="grid gap-1">
                  <Label htmlFor={`dob-${id}`}>Date of Birth</Label>
                  <Input id={`dob-${id}`} type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required />
                </div>
                <div className="grid gap-1">
                  <Label>Gender</Label>
                  <Select value={gender} onValueChange={(v) => setGender(v as 'male' | 'female')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-1">
                <Label htmlFor={`ph-${id}`}>Phone</Label>
                <Input id={`ph-${id}`} value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              {updateMut.isError ? (
                <div className="text-sm text-destructive">{(updateMut.error as Error)?.message ?? 'Update failed'}</div>
              ) : null}

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setOpenEdit(false)} disabled={updateMut.isPending}>Cancel</Button>
                <Button type="submit" disabled={!canSave || updateMut.isPending}>{updateMut.isPending ? 'Saving…' : 'Save'}</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">Delete</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Patient</DialogTitle>
          </DialogHeader>
          <p className="text-sm">Are you sure you want to delete <span className="font-medium">{name}</span>?</p>
          {deleteMut.isError ? (
            <div className="text-sm text-destructive">{(deleteMut.error as Error)?.message ?? 'Delete failed'}</div>
          ) : null}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpenDelete(false)} disabled={deleteMut.isPending}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteMut.mutate()} disabled={deleteMut.isPending}>
              {deleteMut.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
