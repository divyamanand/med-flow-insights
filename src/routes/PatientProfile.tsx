import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'

import { api } from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { User, Stethoscope, Calendar, Mail, Phone, FileText, Edit2, ExternalLink, CalendarDays, Pill, Eye, UserCircle } from 'lucide-react'

/* ---- Types matching your payload ---- */
type User = {
  id: string
  email: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  gender?: string
  phone?: string | null
  role?: string
  type?: string
  createdAt?: string
  updatedAt?: string
}

type PatientResponse = {
  id: string
  createdAt: string
  updatedAt: string
  user: User
  primaryPhysician?: { id: string; name?: string } | null
}

type Appointment = { id: string; doctorId?: string; startAt: string; status: string }
type PrescriptionItem = { id: string; name: string; dosage?: string }
type Prescription = { id: string; doctorId?: string; nextReview?: string; items?: PrescriptionItem[] }

export default function PatientProfile() {
  const { id = '' } = useParams<{ id: string }>()

  const patientQuery = useQuery<PatientResponse>({
    queryKey: ['patients', id],
    queryFn: () => api.get<PatientResponse>(`/patients/${id}`),
    enabled: !!id,
  })

  const apptsQuery = useQuery<Appointment[]>({
    queryKey: ['patients', id, 'appointments'],
    queryFn: () => api.get<Appointment[]>(`/patients/${id}/appointments`),
    enabled: !!id,
  })

  const rxQuery = useQuery<Prescription[]>({
    queryKey: ['patients', id, 'prescriptions'],
    queryFn: () => api.get<Prescription[]>(`/patients/${id}/prescriptions`),
    enabled: !!id,
  })

  const [localPhone, setLocalPhone] = useState('')
  const [localEmail, setLocalEmail] = useState('')

  useEffect(() => {
    if (patientQuery.data?.user) {
      setLocalPhone(patientQuery.data.user.phone ?? '')
      setLocalEmail(patientQuery.data.user.email ?? '')
    }
  }, [patientQuery.data])

  if (patientQuery.isLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (patientQuery.error) {
    return <div className="text-destructive">{(patientQuery.error as Error).message}</div>
  }

  const p = patientQuery.data
  const user = p?.user
  const fullName =
    (user?.firstName || user?.lastName) ? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() : user?.email ?? 'Patient'

  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-slide-in-bottom">
      {/* Enhanced Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <User className="size-4 text-primary" />
          <span className="text-sm font-medium text-primary">Patient Profile</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text">
          {fullName}
        </h1>
        <p className="text-sm text-muted-foreground font-mono">Patient ID: {p?.id}</p>
      </div>

      {/* Patient Header */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect">
        <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2">
            <User className="size-5 text-primary" />
            Patient Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="size-5 text-primary shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Date of Birth</div>
                  <div className="font-medium">
                    {user?.dateOfBirth ? format(parseISO(user.dateOfBirth), 'PPP') : 'Not provided'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <User className="size-5 text-primary shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Gender</div>
                  <div className="font-medium capitalize">{user?.gender ?? 'Not specified'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Phone className="size-5 text-primary shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Phone</div>
                  <div className="font-medium">{user?.phone ?? 'Not provided'}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="size-5 text-primary shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Email</div>
                  {user?.email ? (
                    <a className="font-medium hover:text-primary transition-colors" href={`mailto:${user.email}`}>
                      {user.email}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Not provided</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 sm:col-span-2">
                <CalendarDays className="size-5 text-primary shrink-0" />
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">Account Created</div>
                  <div className="font-medium">
                    {user?.createdAt ? format(parseISO(user.createdAt), 'PPP p') : (p?.createdAt ? format(parseISO(p.createdAt), 'PPP p') : 'Unknown')}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Edit2 className="size-4" />
                    Edit Patient
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Edit2 className="size-5 text-primary" />
                      Edit Patient (Demo)
                    </DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-4">
                    <div>
                      <Label>Phone</Label>
                      <Input value={localPhone} onChange={(e) => setLocalPhone(e.target.value)} className="border-2" />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={localEmail} onChange={(e) => setLocalEmail(e.target.value)} className="border-2" />
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

      {/* Primary Physician */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect">
        <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="size-5 text-primary" />
            Primary Physician
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 flex-1">
              <Stethoscope className="size-5 text-accent shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Assigned Doctor</div>
                {p?.primaryPhysician?.name ? (
                  <div className="font-medium">Dr. {p.primaryPhysician.name}</div>
                ) : (
                  <span className="text-muted-foreground italic">Not assigned</span>
                )}
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Edit2 className="size-4" />
                  Change
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Stethoscope className="size-5 text-primary" />
                    Change Primary Physician (Demo)
                  </DialogTitle>
                </DialogHeader>
                <div className="text-sm text-muted-foreground">Select a new primary physician for this patient.</div>
                <DialogFooter>
                  <Button>Save (Demo)</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* 3. Appointments */}
      <Card className="border-2 shadow-lg glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="size-5 text-primary" />
              </div>
              <CardTitle>Appointments</CardTitle>
            </div>
            <Button asChild variant="outline" className="gap-2">
              <Link to={`/appointments?patient=${p?.id}`}>
                <Eye className="size-4" />
                View All
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {apptsQuery.isLoading ? (
            <div className="flex items-center gap-2"><Spinner className="size-5" /> Loading…</div>
          ) : apptsQuery.error ? (
            <div className="text-destructive">{(apptsQuery.error as Error).message}</div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-muted/50">
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Doctor</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(apptsQuery.data ?? []).map((a) => (
                    <TableRow key={a.id} className="hover:bg-muted/50 transition-colors border-muted/30">
                      <TableCell className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{a.startAt ? format(parseISO(a.startAt), 'PPp') : '-'}</span>
                      </TableCell>
                      <TableCell className="text-sm">{a.doctorId ? `Dr ${a.doctorId}` : '-'}</TableCell>
                      <TableCell>
                        <Badge className="capitalize">{a.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(apptsQuery.data ?? []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">No appointments found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Prescriptions */}
      <Card className="border-2 shadow-lg glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Pill className="size-5 text-primary" />
              </div>
              <CardTitle>Prescriptions</CardTitle>
            </div>
            <Button asChild variant="outline" className="gap-2">
              <Link to={`/prescriptions?patient=${p?.id}`}>
                <Eye className="size-4" />
                View All
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {rxQuery.isLoading ? (
            <div className="flex items-center gap-2"><Spinner className="size-5" /> Loading…</div>
          ) : rxQuery.error ? (
            <div className="text-destructive">{(rxQuery.error as Error).message}</div>
          ) : (
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-muted/50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Doctor</TableHead>
                    <TableHead className="font-semibold">Created At</TableHead>
                    <TableHead className="font-semibold">Next Review</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(rxQuery.data ?? []).map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/50 transition-colors border-muted/30">
                      <TableCell className="flex items-center gap-2">
                        <Pill className="size-4 text-muted-foreground" />
                        <span className="font-mono text-sm text-muted-foreground">#{r.id}</span>
                      </TableCell>
                      <TableCell className="text-sm">{r.doctorId ? `Dr ${r.doctorId}` : '-'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{/* createdAt not in shape; show placeholder */ '-'} </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.nextReview ? format(parseISO(r.nextReview), 'PPP') : '-'}</TableCell>
                    </TableRow>
                  ))}
                  {(rxQuery.data ?? []).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">No prescriptions found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. Account Details */}
      <Card className="border-2 shadow-lg glass-effect">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserCircle className="size-5 text-primary" />
            </div>
            <CardTitle>Account Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium text-muted-foreground">Linked User</span>
              {user?.id ? (
                <Link className="underline underline-offset-4 hover:text-primary text-sm font-mono" to={`/users/${user.id}`}>#{user.id}</Link>
              ) : (
                <span className="text-sm text-muted-foreground">-</span>
              )}
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium text-muted-foreground">Role</span>
              <Badge className="capitalize">{user?.role ?? '-'}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium text-muted-foreground">Type</span>
              <Badge variant="outline" className="capitalize">{user?.type ?? '-'}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium text-muted-foreground">Last Updated</span>
              <span className="text-sm text-muted-foreground">{user?.updatedAt ? format(parseISO(user.updatedAt), 'PPP p') : (p?.updatedAt ? format(parseISO(p.updatedAt), 'PPP p') : '-')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
