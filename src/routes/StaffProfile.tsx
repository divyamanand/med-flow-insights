import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import { UserCircle, Phone, Mail, Edit2, Plus, Clock, Calendar, X, Eye, Save, ChevronLeft } from 'lucide-react'

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
      {/* Back button */}
      <Button variant="ghost" asChild className="w-fit gap-2">
        <Link to="/staff">
          <ChevronLeft className="size-4" />
          Back to Staff Directory
        </Link>
      </Button>

      {/* 1. Staff Header Card */}
      <Card className="border-2 shadow-lg glass-effect">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <UserCircle className="size-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl gradient-text">{fullName}</CardTitle>
              <CardDescription className="font-mono text-sm">Staff ID: #{localStaff?.id}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="capitalize">{localStaff?.role}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="size-4 text-muted-foreground" />
                <span className="font-medium">Phone:</span> {localStaff?.phone ?? '-'}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="size-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>{' '}
                {localStaff?.email ? (
                  <a className="underline underline-offset-4 hover:text-primary" href={`mailto:${localStaff.email}`}>{localStaff.email}</a>
                ) : (
                  '-'
                )}
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">Notes</Label>
                <Textarea
                  className="border-2 min-h-[100px]"
                  value={localStaff?.notes ?? ''}
                  onChange={(e) => setLocalStaff((prev) => (prev ? { ...prev, notes: e.target.value } : prev))}
                  placeholder="Add internal notes (demo, not persisted)"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Edit2 className="size-4" />
                    Edit Staff
                  </Button>
                </DialogTrigger>
                <DialogContent className="border-2 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Edit2 className="size-5 text-primary" />
                      Edit Staff (Demo)
                    </DialogTitle>
                    <DialogDescription>Modify local values only.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label className="font-semibold">Phone</Label>
                      <Input className="border-2" value={localStaff?.phone ?? ''} onChange={(e) => setLocalStaff((p) => (p ? { ...p, phone: e.target.value } : p))} />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-semibold">Email</Label>
                      <Input className="border-2" value={localStaff?.email ?? ''} onChange={(e) => setLocalStaff((p) => (p ? { ...p, email: e.target.value } : p))} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button className="gap-2">
                      <Save className="size-4" />
                      Save (Demo)
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Linked User Info Card */}
      <Card className="border-2 shadow-lg glass-effect">
        <CardHeader>
          <CardTitle>Specialties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="text-sm text-muted-foreground">Manage staff specializations</div>
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
              <div className="text-sm text-muted-foreground">No specialties assigned</div>
            ) : (
              (localStaff?.specialties ?? []).map((s) => (
                <SpecialtyChip key={s.id} s={s} onRemove={() => setLocalStaff((p) => (p ? { ...p, specialties: (p.specialties ?? []).filter((x) => x.id !== s.id) } : p))} />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* 3. Weekly Timings Card */}
      <Card className="border-2 shadow-lg glass-effect">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="size-5 text-primary" />
            </div>
            <CardTitle>Weekly Timings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {timingsQuery.isLoading ? (
            <div className="flex items-center gap-2"><Spinner className="size-5" /> Loading…</div>
          ) : timingsQuery.error ? (
            <div className="text-destructive">{(timingsQuery.error as Error).message}</div>
          ) : (
            <>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-muted/50">
                      <TableHead className="font-semibold">Day</TableHead>
                      <TableHead className="font-semibold">Start Time</TableHead>
                      <TableHead className="font-semibold">End Time</TableHead>
                      <TableHead className="font-semibold">Available</TableHead>
                      <TableHead className="font-semibold">Notes</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(timingsQuery.data ?? []).map((t) => (
                      <TableRow key={t.id} className="hover:bg-muted/50 transition-colors border-muted/30">
                        <TableCell className="flex items-center gap-2">
                          <Calendar className="size-4 text-muted-foreground" />
                          <span className="font-medium">{weekday(t.weekday)}</span>
                        </TableCell>
                        <TableCell className="text-sm">{t.startTime}</TableCell>
                        <TableCell className="text-sm">{t.endTime}</TableCell>
                        <TableCell>
                          {t.isAvailable ? <Badge variant="default">Available</Badge> : <Badge variant="secondary">Off Duty</Badge>}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{t.notes ?? '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <DemoActionButtons />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Plus className="size-4" />
                      Add Timing
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-2 shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Plus className="size-5 text-primary" />
                        Add Timing (Demo)
                      </DialogTitle>
                      <DialogDescription>
                        Add a new timing schedule for this staff member.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button className="gap-2">
                        <Save className="size-4" />
                        Save (Demo)
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Clock className="size-4" />
                      Bulk Upload Timings
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-2 shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Clock className="size-5 text-primary" />
                        Bulk Upload (Demo)
                      </DialogTitle>
                      <DialogDescription>
                        Upload multiple timing schedules at once.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button className="gap-2">
                        <Save className="size-4" />
                        Upload (Demo)
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 4. Leaves Card */}
      <Card className="border-2 shadow-lg glass-effect">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="size-5 text-primary" />
            </div>
            <CardTitle>Leave Records</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {leavesQuery.isLoading ? (
            <div className="flex items-center gap-2"><Spinner className="size-5" /> Loading…</div>
          ) : leavesQuery.error ? (
            <div className="text-destructive">{(leavesQuery.error as Error).message}</div>
          ) : (
            <>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-muted/50">
                      <TableHead className="font-semibold">Start Date</TableHead>
                      <TableHead className="font-semibold">End Date</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(leavesQuery.data ?? []).map((l) => (
                      <TableRow key={l.id} className="hover:bg-muted/50 transition-colors border-muted/30">
                        <TableCell className="text-sm text-muted-foreground">{l.startDate}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{l.endDate}</TableCell>
                        <TableCell>
                          {l.status === 'approved' && <Badge variant="default">Approved</Badge>}
                          {l.status === 'pending' && <Badge variant="secondary">Pending</Badge>}
                          {l.status === 'rejected' && <Badge variant="destructive">Rejected</Badge>}
                        </TableCell>
                        <TableCell className="whitespace-nowrap"><DemoActionButtons /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Plus className="size-4" />
                      Request Leave
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-2 shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Calendar className="size-5 text-primary" />
                        Request Leave (Demo)
                      </DialogTitle>
                      <DialogDescription>
                        Submit a leave request for this staff member.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button className="gap-2">
                        <Save className="size-4" />
                        Submit (Demo)
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* 5. Upcoming Appointments (Doctor Only) */}
      {role === 'doctor' ? (
        <Card className="border-2 shadow-lg glass-effect">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="size-5 text-primary" />
              </div>
              <CardTitle>Upcoming Appointments</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {appointmentsQuery.isLoading ? (
              <div className="flex items-center gap-2"><Spinner className="size-5" /> Loading…</div>
            ) : appointmentsQuery.error ? (
              <div className="text-destructive">{(appointmentsQuery.error as Error).message}</div>
            ) : (
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-muted/50">
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Patient</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(appointmentsQuery.data ?? []).map((a) => (
                      <TableRow key={a.id} className="hover:bg-muted/50 transition-colors border-muted/30">
                        <TableCell className="text-sm text-muted-foreground">{format(parseISO(a.startAt), 'PPp')}</TableCell>
                        <TableCell className="font-mono text-sm">#{a.patientId}</TableCell>
                        <TableCell>
                          <Badge className="capitalize">{a.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

function SpecialtyChip({ s, onRemove }: { s: Specialty; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm bg-muted/30 hover:bg-muted/50 transition-colors">
      <span className="font-medium">{s.name}</span>
      {s.isPrimary ? <Badge variant="default" className="text-xs">Primary</Badge> : null}
      <Button size="sm" variant="ghost" onClick={onRemove} className="gap-1 h-6 px-2">
        <X className="size-3" />
      </Button>
    </div>
  )
}

function AddSpecialtyDialog({ onAdd }: { onAdd: (s: Specialty) => void }) {
  const [name, setName] = useState('')
  const [primary, setPrimary] = useState(false)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="size-4" />
          Add Specialty
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="size-5 text-primary" />
            Add Specialty (Demo)
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label className="font-semibold">Name</Label>
            <Input className="border-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Cardiology" />
          </div>
          <div className="flex items-center gap-2">
            <input id="primary" type="checkbox" checked={primary} onChange={(e) => setPrimary(e.target.checked)} className="size-4" />
            <Label htmlFor="primary" className="font-medium cursor-pointer">Set as Primary Specialty</Label>
          </div>
        </div>
        <DialogFooter>
          <Button
            className="gap-2"
            onClick={() => {
              if (!name.trim()) return
              onAdd({ id: name.toLowerCase().replace(/\s+/g, '-'), name, isPrimary: primary })
              setName(''); setPrimary(false)
            }}
          >
            <Save className="size-4" />
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DemoActionButtons() {
  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <Eye className="size-3" />
            View
          </Button>
        </DialogTrigger>
        <DialogContent className="border-2 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="size-5 text-primary" />
              View (Demo)
            </DialogTitle>
          </DialogHeader>
          <DialogFooter><Button>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <Edit2 className="size-3" />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent className="border-2 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="size-5 text-primary" />
              Edit (Demo)
            </DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button className="gap-2">
              <Save className="size-4" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
