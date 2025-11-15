import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'

import { api } from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'

type Specialty = { id: string; name: string; isPrimary?: boolean }
type Staff = {
  id: string
  userId?: string
  role: string
  firstName: string
  lastName: string
  phone?: string
  email?: string
  notes?: string
  specialties?: Specialty[]
}

type Timing = { id: string; weekday: number; startTime: string; endTime: string; isAvailable: boolean; notes?: string }
type Leave = { id: string; startDate: string; endDate: string; status: 'pending' | 'approved' | 'rejected' }
type Appointment = { id: string; patientId: string; doctorId: string; startAt: string; status: string }

const weekday = (n: number) => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][n] ?? String(n)

export default function StaffProfile() {
  const { id = '' } = useParams()

  const staffQuery = useQuery<Staff>({
    queryKey: ['staff', id],
    queryFn: () => api.get<Staff>(`/staff/${id}`),
    enabled: !!id,
  })

  const timingsQuery = useQuery<Timing[]>({
    queryKey: ['staff', id, 'timings'],
    queryFn: () => api.get<Timing[]>(`/staff/${id}/timings`),
    enabled: !!id,
  })

  const leavesQuery = useQuery<Leave[]>({
    queryKey: ['staff', id, 'leaves'],
    queryFn: () => api.get<Leave[]>(`/staff/${id}/leaves`),
    enabled: !!id,
  })

  const role = staffQuery.data?.role
  const appointmentsQuery = useQuery<Appointment[]>({
    queryKey: ['staff', id, 'appointments'],
    queryFn: () => api.get<Appointment[]>(`/staff/${id}/appointments`),
    enabled: !!id && role === 'doctor',
  })

  // Local editable state for demo actions (notes, specialties)
  const [localStaff, setLocalStaff] = useState<Staff | null>(null)
  useEffect(() => {
    if (staffQuery.data) setLocalStaff(staffQuery.data)
  }, [staffQuery.data])

  if (staffQuery.isLoading) {
    return (
      <div className="flex items-center justify-center p-10"><Spinner className="size-6" /></div>
    )
  }
  if (staffQuery.error) {
    return <div className="text-destructive">{(staffQuery.error as Error).message}</div>
  }

  const fullName = `${localStaff?.firstName ?? ''} ${localStaff?.lastName ?? ''}`.trim() || 'Staff Member'

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Staff Header Card */}
      <Card>
        <CardHeader>
          <CardTitle>{fullName}</CardTitle>
          <CardDescription>Staff ID: {localStaff?.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
            <div className="space-y-2">
              <div><span className="font-medium">Role:</span> <span className="capitalize">{localStaff?.role}</span></div>
              <div><span className="font-medium">Phone:</span> {localStaff?.phone ?? '-'}</div>
              <div>
                <span className="font-medium">Email:</span>{' '}
                {localStaff?.email ? (
                  <a className="underline underline-offset-4" href={`mailto:${localStaff.email}`}>{localStaff.email}</a>
                ) : (
                  '-'
                )}
              </div>
              <div className="space-y-1">
                <Label>Notes</Label>
                <Textarea
                  value={localStaff?.notes ?? ''}
                  onChange={(e) => setLocalStaff((prev) => (prev ? { ...prev, notes: e.target.value } : prev))}
                  placeholder="Add internal notes (demo, not persisted)"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Edit Staff</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Staff (Demo)</DialogTitle>
                    <DialogDescription>Modify local values only.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3">
                    <div>
                      <Label>Phone</Label>
                      <Input value={localStaff?.phone ?? ''} onChange={(e) => setLocalStaff((p) => (p ? { ...p, phone: e.target.value } : p))} />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={localStaff?.email ?? ''} onChange={(e) => setLocalStaff((p) => (p ? { ...p, email: e.target.value } : p))} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button>Save (Demo)</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Linked User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Linked User Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm text-muted-foreground">Specialities</div>
            <div className="flex items-center gap-2">
              {localStaff?.userId ? (
                <Link to={`/users/${localStaff.userId}`} className="text-sm underline underline-offset-4 hover:text-primary">View User Profile</Link>
              ) : null}
              <AddSpecialtyDialog onAdd={(s) => setLocalStaff((p) => (p ? { ...p, specialties: [...(p.specialties ?? []), s] } : p))} />
            </div>
          </div>
          <Separator className="my-3" />
          <div className="flex flex-wrap gap-2">
            {(localStaff?.specialties ?? []).length === 0 ? (
              <div className="text-sm text-muted-foreground">No specialties</div>
            ) : (
              (localStaff?.specialties ?? []).map((s) => (
                <SpecialtyChip key={s.id} s={s} onRemove={() => setLocalStaff((p) => (p ? { ...p, specialties: (p.specialties ?? []).filter((x) => x.id !== s.id) } : p))} />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* 3. Weekly Timings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Timings</CardTitle>
        </CardHeader>
        <CardContent>
          {timingsQuery.isLoading ? (
            <div className="flex items-center gap-2"><Spinner className="size-5" /> Loading…</div>
          ) : timingsQuery.error ? (
            <div className="text-destructive">{(timingsQuery.error as Error).message}</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Day</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(timingsQuery.data ?? []).map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{weekday(t.weekday)}</TableCell>
                      <TableCell>{t.startTime}</TableCell>
                      <TableCell>{t.endTime}</TableCell>
                      <TableCell>{t.isAvailable ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{t.notes ?? ''}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <DemoActionButtons />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild><Button variant="outline">+ Add Timing</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Add Timing (Demo)</DialogTitle></DialogHeader>
                    <DialogFooter><Button>Save (Demo)</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild><Button variant="outline">Bulk Upload Timings</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Bulk Upload (Demo)</DialogTitle></DialogHeader>
                    <DialogFooter><Button>Upload (Demo)</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 4. Leaves Card */}
      <Card>
        <CardHeader>
          <CardTitle>Leaves</CardTitle>
        </CardHeader>
        <CardContent>
          {leavesQuery.isLoading ? (
            <div className="flex items-center gap-2"><Spinner className="size-5" /> Loading…</div>
          ) : leavesQuery.error ? (
            <div className="text-destructive">{(leavesQuery.error as Error).message}</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(leavesQuery.data ?? []).map((l) => (
                    <TableRow key={l.id}>
                      <TableCell>{l.startDate}</TableCell>
                      <TableCell>{l.endDate}</TableCell>
                      <TableCell className="capitalize">{l.status}</TableCell>
                      <TableCell className="whitespace-nowrap"><DemoActionButtons /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4">
                <Dialog>
                  <DialogTrigger asChild><Button variant="outline">+ Request/Add Leave</Button></DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Request Leave (Demo)</DialogTitle></DialogHeader>
                    <DialogFooter><Button>Submit (Demo)</Button></DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 5. Upcoming Appointments (Doctor Only) */}
      {role === 'doctor' ? (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {appointmentsQuery.isLoading ? (
              <div className="flex items-center gap-2"><Spinner className="size-5" /> Loading…</div>
            ) : appointmentsQuery.error ? (
              <div className="text-destructive">{(appointmentsQuery.error as Error).message}</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(appointmentsQuery.data ?? []).map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{format(parseISO(a.startAt), 'PPp')}</TableCell>
                      <TableCell>{a.patientId}</TableCell>
                      <TableCell className="capitalize">{a.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

function SpecialtyChip({ s, onRemove }: { s: Specialty; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
      <span>{s.name}</span>
      {s.isPrimary ? <Badge variant="secondary">Primary</Badge> : null}
      <Button size="sm" variant="ghost" onClick={onRemove}>Remove</Button>
    </div>
  )
}

function AddSpecialtyDialog({ onAdd }: { onAdd: (s: Specialty) => void }) {
  const [name, setName] = useState('')
  const [primary, setPrimary] = useState(false)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add Specialty</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Specialty (Demo)</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Cardiology" />
          </div>
          <div className="flex items-center gap-2">
            <input id="primary" type="checkbox" checked={primary} onChange={(e) => setPrimary(e.target.checked)} />
            <Label htmlFor="primary">Primary</Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              if (!name.trim()) return
              onAdd({ id: name.toLowerCase().replace(/\s+/g, '-'), name, isPrimary: primary })
              setName(''); setPrimary(false)
            }}
          >Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DemoActionButtons() {
  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild><Button variant="outline" size="sm">View</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>View (Demo)</DialogTitle></DialogHeader>
          <DialogFooter><Button>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild><Button variant="outline" size="sm">Edit</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit (Demo)</DialogTitle></DialogHeader>
          <DialogFooter><Button>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
