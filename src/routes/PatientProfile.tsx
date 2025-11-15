import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'

import { api } from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'

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
    <div className="flex flex-col gap-6">
      {/* 1. Patient Header */}
      <Card>
        <CardHeader>
          <CardTitle>Patient: {fullName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
            <div className="space-y-2">
              <div>
                <span className="font-medium">DOB:</span>{' '}
                {user?.dateOfBirth ? format(parseISO(user.dateOfBirth), 'yyyy-MM-dd') : '-'}
              </div>
              <div><span className="font-medium">Gender:</span> {user?.gender ?? '-'}</div>
              <div><span className="font-medium">Phone:</span> {user?.phone ?? '-'}</div>
              <div>
                <span className="font-medium">Email:</span>{' '}
                {user?.email ? (
                  <a className="underline underline-offset-4" href={`mailto:${user.email}`}>{user.email}</a>
                ) : '-'}
              </div>
              <div><span className="font-medium">Account created:</span>{' '}
                {user?.createdAt ? format(parseISO(user.createdAt), 'PPP p') : (p?.createdAt ? format(parseISO(p.createdAt), 'PPP p') : '-')}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Edit Patient</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Patient (Demo)</DialogTitle>
                  </DialogHeader>

                  <div className="grid gap-3">
                    <div>
                      <Label>Phone</Label>
                      <Input value={localPhone} onChange={(e) => setLocalPhone(e.target.value)} />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input value={localEmail} onChange={(e) => setLocalEmail(e.target.value)} />
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

      {/* 2. Primary Physician */}
      <Card>
        <CardHeader>
          <CardTitle>Primary Physician</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>{p?.primaryPhysician?.name ?? <span className="text-muted-foreground">Not assigned</span>}</div>
            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Change</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Primary Physician (Demo)</DialogTitle>
                  </DialogHeader>
                  <DialogFooter>
                    <Button>Save (Demo)</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Appointments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Appointments</CardTitle>
            <Button asChild variant="outline">
              <Link to={`/appointments?patient=${p?.id}`}>View all</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {apptsQuery.isLoading ? (
            <div className="flex items-center gap-2"><Spinner className="size-5" /> Loading…</div>
          ) : apptsQuery.error ? (
            <div className="text-destructive">{(apptsQuery.error as Error).message}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(apptsQuery.data ?? []).map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.startAt ? format(parseISO(a.startAt), 'PPp') : '-'}</TableCell>
                    <TableCell>{a.doctorId ? `Dr ${a.doctorId}` : '-'}</TableCell>
                    <TableCell className="capitalize">{a.status}</TableCell>
                  </TableRow>
                ))}
                {(apptsQuery.data ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3}>No appointments found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 4. Prescriptions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Prescriptions</CardTitle>
            <Button asChild variant="outline">
              <Link to={`/prescriptions?patient=${p?.id}`}>View all</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {rxQuery.isLoading ? (
            <div className="flex items-center gap-2"><Spinner className="size-5" /> Loading…</div>
          ) : rxQuery.error ? (
            <div className="text-destructive">{(rxQuery.error as Error).message}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Next Review</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(rxQuery.data ?? []).map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.doctorId ? `Dr ${r.doctorId}` : '-'}</TableCell>
                    <TableCell>{/* createdAt not in shape; show placeholder */ '-'} </TableCell>
                    <TableCell>{r.nextReview ? format(parseISO(r.nextReview), 'PPP') : '-'}</TableCell>
                  </TableRow>
                ))}
                {(rxQuery.data ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>No prescriptions found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 5. Account Details */}
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <div>
              <span className="font-medium">Linked User:</span>{' '}
              {user?.id ? (
                <Link className="underline underline-offset-4" to={`/users/${user.id}`}>{user.id}</Link>
              ) : '-'}
            </div>
            <div><span className="font-medium">Role:</span> {user?.role ?? '-'}</div>
            <div><span className="font-medium">Type:</span> {user?.type ?? '-'}</div>
            <div><span className="font-medium">Last updated:</span> {user?.updatedAt ? format(parseISO(user.updatedAt), 'PPP p') : (p?.updatedAt ? format(parseISO(p.updatedAt), 'PPP p') : '-')}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
