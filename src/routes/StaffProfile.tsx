import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format, parseISO } from 'date-fns'
import { UserCircle, Phone, Mail, Edit2, Plus, Clock, Calendar, X, Eye, Save, ChevronLeft, AlertCircle } from 'lucide-react'

import { api } from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'

type Specialty = { 
  id: string
  specialtyId?: string
  name: string
  code?: string
  description?: string
  primary?: boolean
}
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

type Timing = { 
  id: string
  staffId: string
  weekday: number
  startTime: string
  endTime: string
  isAvailable: boolean
  notes: string | null
  createdAt: string
  updatedAt: string
}
type Leave = { 
  id: string
  staffId: string
  startDate: string
  endDate: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  notes: string | null
  createdAt: string
  updatedAt: string
}
type Appointment = {
  id: string
  patientId: string | null
  doctorId: string | null
  patientName: string | null
  doctorName: string | null
  startAt: Date
  endAt: Date
  status: string
  issues: string[]
  createdAt: Date
  updatedAt: Date
}

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
    queryFn: () => api.get<Appointment[]>(`/appointments/doctor/${id}`),
    enabled: !!id && role === 'doctor',
  })

  // Fetch staff specialties
  const specialtiesQuery = useQuery<Specialty[]>({
    queryKey: ['staff', id, 'specialties'],
    queryFn: () => api.get<Specialty[]>(`/staff/${id}/specialties`),
    enabled: !!id,
  })

  // Local editable state for demo actions (notes)
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
              <EditStaffDialog staff={localStaff} staffId={id} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Specialties Card */}
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
              <AddSpecialtyDialog staffId={id} />
            </div>
          </div>
          <Separator className="my-3" />
          {specialtiesQuery.isLoading ? (
            <div className="flex items-center gap-2"><Spinner className="size-4" /> Loading specialties...</div>
          ) : specialtiesQuery.error ? (
            <div className="text-destructive text-sm">{(specialtiesQuery.error as Error).message}</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {(specialtiesQuery.data ?? []).length === 0 ? (
                <div className="text-sm text-muted-foreground">No specialties assigned</div>
              ) : (
                (specialtiesQuery.data ?? []).map((s) => (
                  <SpecialtyChip key={s.id} s={s} staffId={id} />
                ))
              )}
            </div>
          )}
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
                    {(timingsQuery.data ?? []).sort((a, b) => a.weekday - b.weekday).map((t) => (
                      <TableRow key={t.id} className="hover:bg-muted/50 transition-colors border-muted/30">
                        <TableCell className="flex items-center gap-2">
                          <Calendar className="size-4 text-muted-foreground" />
                          <span className="font-medium">{weekday(t.weekday)}</span>
                        </TableCell>
                        <TableCell className="text-sm">{t.startTime}</TableCell>
                        <TableCell className="text-sm">{t.endTime}</TableCell>
                        <TableCell>
                          {t.isAvailable ? (
                            <Badge variant="default">Yes</Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{t.notes ?? '-'}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <TimingActionButtons timing={t} staffId={id} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <AddTimingDialog staffId={id} />
                <BulkUploadTimingsDialog staffId={id} />
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
                      <TableHead className="font-semibold">Reason</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Notes</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(leavesQuery.data ?? []).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()).map((l) => (
                      <TableRow key={l.id} className="hover:bg-muted/50 transition-colors border-muted/30">
                        <TableCell className="text-sm text-muted-foreground">{l.startDate}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{l.endDate}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{l.reason}</TableCell>
                        <TableCell>
                          {l.status === 'approved' && <Badge variant="default">Approved</Badge>}
                          {l.status === 'pending' && <Badge variant="secondary">Pending</Badge>}
                          {l.status === 'rejected' && <Badge variant="destructive">Rejected</Badge>}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{l.notes ?? '-'}</TableCell>
                        <TableCell className="whitespace-nowrap"><LeaveActionButtons leave={l} staffId={id} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-4">
                <AddLeaveDialog staffId={id} />
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
                        <TableCell className="flex items-center gap-2">
                          <Calendar className="size-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{a.startAt ? format(parseISO(a.startAt.toString()), 'PPp') : '-'}</span>
                        </TableCell>
                        <TableCell className="text-sm">{a.patientName ? a.patientName : (a.patientId ? `#${a.patientId}` : '-')}</TableCell>
                        <TableCell>
                          <Badge className="capitalize">{a.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(appointmentsQuery.data ?? []).length === 0 && (
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
      ) : null}
    </div>
  )
}

function SpecialtyChip({ s, staffId }: { s: Specialty; staffId: string }) {
  const queryClient = useQueryClient()
  const removeMutation = useMutation({
    mutationFn: () => api.delete(`/staff/${staffId}/specialties/${s.specialtyId || s.id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', staffId, 'specialties'] })
    }
  })

  return (
    <div className="flex items-center gap-2 rounded-full border-2 px-4 py-2 text-sm bg-muted/30 hover:bg-muted/50 transition-colors">
      <span className="font-medium">{s.name}</span>
      {s.primary ? <Badge variant="default" className="text-xs">Primary</Badge> : null}
      <Button 
        size="sm" 
        variant="ghost" 
        onClick={() => removeMutation.mutate()} 
        disabled={removeMutation.isPending}
        className="gap-1 h-6 px-2"
      >
        {removeMutation.isPending ? <Spinner className="size-3" /> : <X className="size-3" />}
      </Button>
    </div>
  )
}

function AddSpecialtyDialog({ staffId }: { staffId: string }) {
  const [open, setOpen] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState<{ id: string; name: string } | null>(null)
  const [primary, setPrimary] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  
  const queryClient = useQueryClient()
  
  // Search specialties from API as user types
  type SearchResult = { id: string; name: string }
  const searchQuery = useQuery<SearchResult[]>({
    queryKey: ['specialties', 'search', searchKeyword],
    queryFn: () => api.get<SearchResult[]>('/specialties/search', { keyword: searchKeyword || undefined }),
    enabled: open && searchKeyword.length > 0,
  })

  const assignMutation = useMutation({
    mutationFn: (data: { specialtyId: string; primary: boolean }) => 
      api.post(`/staff/${staffId}/specialties`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', staffId, 'specialties'] })
      setOpen(false)
      setSearchKeyword('')
      setSelectedSpecialty(null)
      setPrimary(false)
    }
  })

  const handleAssignSpecialty = () => {
    if (!selectedSpecialty) return
    assignMutation.mutate({ specialtyId: selectedSpecialty.id, primary })
  }

  const handleSelectSpecialty = (specialty: SearchResult) => {
    setSelectedSpecialty(specialty)
    setSearchKeyword(specialty.name)
    setShowDropdown(false)
  }

  const searchResults = searchQuery.data ?? []
  const noResultsFound = searchKeyword.length > 0 && !searchQuery.isLoading && searchResults.length === 0

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) {
          setSearchKeyword('')
          setSelectedSpecialty(null)
          setPrimary(false)
          setShowDropdown(false)
        }
      }}>
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
              Assign Specialty
            </DialogTitle>
            <DialogDescription>
              Search and select a specialty to assign to this staff member.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {assignMutation.error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>
                  {(assignMutation.error as any)?.response?.data?.message || 'Failed to assign specialty'}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2 relative">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label className="font-semibold">Search Specialty</Label>
                  <div className="relative">
                    <Input
                      className="border-2 pr-10"
                      value={searchKeyword}
                      onChange={(e) => {
                        setSearchKeyword(e.target.value)
                        setSelectedSpecialty(null)
                        setShowDropdown(true)
                      }}
                      onFocus={() => setShowDropdown(true)}
                      placeholder="Type to search (e.g., cardio)"
                    />
                    {noResultsFound && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2 gap-1 text-primary hover:text-primary"
                        onClick={() => setShowCreateDialog(true)}
                      >
                        <Plus className="size-3" />
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Search Results Dropdown */}
              {showDropdown && searchKeyword.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-background border-2 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {searchQuery.isLoading ? (
                    <div className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                      <Spinner className="size-4" />
                      Searching...
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-1">
                      {searchResults.map((specialty) => (
                        <button
                          key={specialty.id}
                          onClick={() => handleSelectSpecialty(specialty)}
                          className="w-full text-left px-3 py-2 hover:bg-muted transition-colors text-sm"
                        >
                          {specialty.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-sm text-muted-foreground text-center">
                      No specialties found for "{searchKeyword}"
                    </div>
                  )}
                </div>
              )}
              
              {selectedSpecialty && (
                <div className="flex items-center gap-2 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                  <Badge variant="default">{selectedSpecialty.name}</Badge>
                  <button
                    onClick={() => {
                      setSelectedSpecialty(null)
                      setSearchKeyword('')
                    }}
                    className="ml-auto text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground">
                Type keywords to search. Click "Add" if not found to create a new specialty.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <input 
                id="primary-spec" 
                type="checkbox" 
                checked={primary} 
                onChange={(e) => setPrimary(e.target.checked)} 
                className="size-4" 
              />
              <Label htmlFor="primary-spec" className="font-medium cursor-pointer">
                Set as Primary Specialty
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="gap-2"
              disabled={!selectedSpecialty || assignMutation.isPending}
              onClick={handleAssignSpecialty}
            >
              {assignMutation.isPending ? <Spinner className="size-4" /> : <Save className="size-4" />}
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create specialty dialog */}
      {showCreateDialog && (
        <CreateSpecialtyDialog 
          open={showCreateDialog}
          initialName={searchKeyword}
          onOpenChange={setShowCreateDialog}
          onSuccess={(newSpecialty) => {
            setShowCreateDialog(false)
            // Automatically select the newly created specialty
            setSelectedSpecialty(newSpecialty)
            setSearchKeyword(newSpecialty.name)
            queryClient.invalidateQueries({ queryKey: ['specialties', 'search'] })
          }}
        />
      )}
    </>
  )
}

function CreateSpecialtyDialog({ 
  open, 
  onOpenChange, 
  onSuccess,
  initialName = ''
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (newSpecialty: { id: string; name: string }) => void
  initialName?: string
}) {
  const [code, setCode] = useState('')
  const [name, setName] = useState(initialName)
  const [description, setDescription] = useState('')
  
  const queryClient = useQueryClient()
  
  // Update name when initialName changes
  useEffect(() => {
    setName(initialName)
  }, [initialName])
  
  const createMutation = useMutation({
    mutationFn: (data: { code: string; name: string; description?: string }) => 
      api.post<{ id: string; name: string }>('/specialties', data),
    onSuccess: (newSpecialty) => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] })
      onSuccess(newSpecialty)
      setCode('')
      setName('')
      setDescription('')
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-2 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="size-5 text-primary" />
            Create New Specialty
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {createMutation.error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                {(createMutation.error as any)?.response?.data?.message || 'Failed to create specialty'}
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label className="font-semibold">Code *</Label>
            <Input 
              className="border-2" 
              value={code} 
              onChange={(e) => setCode(e.target.value)} 
              placeholder="e.g., CARDIO" 
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Name *</Label>
            <Input 
              className="border-2" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g., Cardiology" 
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Description</Label>
            <Input 
              className="border-2" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Optional description" 
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            className="gap-2"
            disabled={!code.trim() || !name.trim() || createMutation.isPending}
            onClick={() => createMutation.mutate({ code, name, description: description || undefined })}
          >
            {createMutation.isPending ? <Spinner className="size-4" /> : <Save className="size-4" />}
            Create
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

// Timing Management Components
function TimingActionButtons({ timing, staffId }: { timing: Timing; staffId: string }) {
  return (
    <div className="flex items-center gap-2">
      <EditTimingDialog timing={timing} staffId={staffId} />
      <DeleteTimingButton timingId={timing.id} staffId={staffId} />
    </div>
  )
}

function AddTimingDialog({ staffId }: { staffId: string }) {
  const [open, setOpen] = useState(false)
  const [weekday, setWeekday] = useState('1')
  const [startTime, setStartTime] = useState('09:00:00')
  const [endTime, setEndTime] = useState('17:00:00')
  const [isAvailable, setIsAvailable] = useState(true)
  const [notes, setNotes] = useState('')
  
  const queryClient = useQueryClient()
  
  const createMutation = useMutation({
    mutationFn: (data: { weekday: number; startTime: string; endTime: string; isAvailable?: boolean; notes?: string }) => 
      api.post(`/staff/${staffId}/timings/single`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', staffId, 'timings'] })
      setOpen(false)
      setWeekday('1')
      setStartTime('09:00:00')
      setEndTime('17:00:00')
      setIsAvailable(true)
      setNotes('')
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            Add Timing
          </DialogTitle>
          <DialogDescription>Add a new timing schedule for this staff member.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {createMutation.error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                {(createMutation.error as any)?.response?.data?.message || 'Failed to create timing'}
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label className="font-semibold">Day of Week</Label>
            <select
              value={weekday}
              onChange={(e) => setWeekday(e.target.value)}
              className="w-full border-2 rounded-md px-3 py-2"
            >
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Start Time</Label>
            <Input 
              type="time" 
              step="1"
              className="border-2" 
              value={startTime} 
              onChange={(e) => setStartTime(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">End Time</Label>
            <Input 
              type="time" 
              step="1"
              className="border-2" 
              value={endTime} 
              onChange={(e) => setEndTime(e.target.value)} 
            />
          </div>
          <div className="flex items-center gap-2">
            <input 
              id="is-available" 
              type="checkbox" 
              checked={isAvailable} 
              onChange={(e) => setIsAvailable(e.target.checked)} 
              className="size-4" 
            />
            <Label htmlFor="is-available" className="font-medium cursor-pointer">
              Staff is available during this time
            </Label>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Notes</Label>
            <Textarea 
              className="border-2" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Optional notes about this timing"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="gap-2"
            disabled={createMutation.isPending}
            onClick={() => createMutation.mutate({ 
              weekday: parseInt(weekday), 
              startTime, 
              endTime,
              isAvailable,
              notes: notes.trim() || undefined
            })}
          >
            {createMutation.isPending ? <Spinner className="size-4" /> : <Save className="size-4" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditTimingDialog({ timing, staffId }: { timing: Timing; staffId: string }) {
  const [open, setOpen] = useState(false)
  const [weekday, setWeekday] = useState(String(timing.weekday))
  const [startTime, setStartTime] = useState(timing.startTime)
  const [endTime, setEndTime] = useState(timing.endTime)
  const [isAvailable, setIsAvailable] = useState(timing.isAvailable)
  const [notes, setNotes] = useState(timing.notes ?? '')
  
  const queryClient = useQueryClient()
  
  const updateMutation = useMutation({
    mutationFn: (data: { weekday?: number; startTime?: string; endTime?: string; isAvailable?: boolean; notes?: string }) => 
      api.put(`/staff/${staffId}/timings/${timing.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', staffId, 'timings'] })
      setOpen(false)
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            Edit Timing
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {updateMutation.error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                {(updateMutation.error as any)?.response?.data?.message || 'Failed to update timing'}
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label className="font-semibold">Day of Week</Label>
            <select
              value={weekday}
              onChange={(e) => setWeekday(e.target.value)}
              className="w-full border-2 rounded-md px-3 py-2"
            >
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Start Time</Label>
            <Input 
              type="time" 
              step="1"
              className="border-2" 
              value={startTime.slice(0, 8)} 
              onChange={(e) => setStartTime(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">End Time</Label>
            <Input 
              type="time" 
              step="1"
              className="border-2" 
              value={endTime.slice(0, 8)} 
              onChange={(e) => setEndTime(e.target.value)} 
            />
          </div>
          <div className="flex items-center gap-2">
            <input 
              id="edit-is-available" 
              type="checkbox" 
              checked={isAvailable} 
              onChange={(e) => setIsAvailable(e.target.checked)} 
              className="size-4" 
            />
            <Label htmlFor="edit-is-available" className="font-medium cursor-pointer">
              Staff is available during this time
            </Label>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Notes</Label>
            <Textarea 
              className="border-2" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Optional notes about this timing"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="gap-2"
            disabled={updateMutation.isPending}
            onClick={() => updateMutation.mutate({ 
              weekday: parseInt(weekday), 
              startTime, 
              endTime,
              isAvailable,
              notes: notes.trim() || undefined
            })}
          >
            {updateMutation.isPending ? <Spinner className="size-4" /> : <Save className="size-4" />}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteTimingButton({ timingId, staffId }: { timingId: string; staffId: string }) {
  const queryClient = useQueryClient()
  
  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/staff/${staffId}/timings/${timingId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', staffId, 'timings'] })
    }
  })

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-1"
      disabled={deleteMutation.isPending}
      onClick={() => {
        if (confirm('Are you sure you want to delete this timing?')) {
          deleteMutation.mutate()
        }
      }}
    >
      {deleteMutation.isPending ? <Spinner className="size-3" /> : <X className="size-3" />}
      Delete
    </Button>
  )
}

function BulkUploadTimingsDialog({ staffId }: { staffId: string }) {
  const [open, setOpen] = useState(false)
  const [timings, setTimings] = useState<Array<{ weekday: number; startTime: string; endTime: string; isAvailable: boolean }>>([
    { weekday: 1, startTime: '09:00:00', endTime: '17:00:00', isAvailable: true },
    { weekday: 2, startTime: '09:00:00', endTime: '17:00:00', isAvailable: true },
    { weekday: 3, startTime: '09:00:00', endTime: '17:00:00', isAvailable: true },
    { weekday: 4, startTime: '09:00:00', endTime: '17:00:00', isAvailable: true },
    { weekday: 5, startTime: '09:00:00', endTime: '17:00:00', isAvailable: true },
  ])
  
  const queryClient = useQueryClient()
  
  const bulkMutation = useMutation({
    mutationFn: (data: Array<{ weekday: number; startTime: string; endTime: string; isAvailable?: boolean }>) => 
      api.post(`/staff/${staffId}/timings`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', staffId, 'timings'] })
      setOpen(false)
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Clock className="size-4" />
          Bulk Upload Timings
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 shadow-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="size-5 text-primary" />
            Bulk Upload Timings
          </DialogTitle>
          <DialogDescription>
            Upload multiple timing schedules at once (Monday to Friday by default).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          {bulkMutation.error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                {(bulkMutation.error as any)?.response?.data?.message || 'Failed to upload timings'}
              </AlertDescription>
            </Alert>
          )}
          {timings.map((t, idx) => (
            <div key={idx} className="grid grid-cols-4 gap-2 p-3 border-2 rounded-md">
              <div className="space-y-1">
                <Label className="text-xs">Day</Label>
                <select
                  value={t.weekday}
                  onChange={(e) => {
                    const updated = [...timings]
                    updated[idx].weekday = parseInt(e.target.value)
                    setTimings(updated)
                  }}
                  className="w-full border rounded px-2 py-1 text-sm"
                >
                  <option value="0">Sun</option>
                  <option value="1">Mon</option>
                  <option value="2">Tue</option>
                  <option value="3">Wed</option>
                  <option value="4">Thu</option>
                  <option value="5">Fri</option>
                  <option value="6">Sat</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Start</Label>
                <Input 
                  type="time" 
                  className="text-sm h-8" 
                  value={t.startTime.slice(0, 5)} 
                  onChange={(e) => {
                    const updated = [...timings]
                    updated[idx].startTime = e.target.value + ':00'
                    setTimings(updated)
                  }} 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">End</Label>
                <Input 
                  type="time" 
                  className="text-sm h-8" 
                  value={t.endTime.slice(0, 5)} 
                  onChange={(e) => {
                    const updated = [...timings]
                    updated[idx].endTime = e.target.value + ':00'
                    setTimings(updated)
                  }} 
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Available</Label>
                <div className="flex items-center h-8">
                  <input 
                    type="checkbox" 
                    checked={t.isAvailable}
                    onChange={(e) => {
                      const updated = [...timings]
                      updated[idx].isAvailable = e.target.checked
                      setTimings(updated)
                    }}
                    className="size-4" 
                  />
                </div>
              </div>
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setTimings([...timings, { weekday: 1, startTime: '09:00:00', endTime: '17:00:00', isAvailable: true }])}
          >
            <Plus className="size-3" />
            Add Day
          </Button>
        </div>
        <DialogFooter>
          <Button
            className="gap-2"
            disabled={bulkMutation.isPending}
            onClick={() => bulkMutation.mutate(timings)}
          >
            {bulkMutation.isPending ? <Spinner className="size-4" /> : <Save className="size-4" />}
            Upload All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Leave Management Components
function LeaveActionButtons({ leave, staffId }: { leave: Leave; staffId: string }) {
  return (
    <div className="flex items-center gap-2">
      <EditLeaveDialog leave={leave} staffId={staffId} />
      <DeleteLeaveButton leaveId={leave.id} staffId={staffId} />
    </div>
  )
}

function AddLeaveDialog({ staffId }: { staffId: string }) {
  const [open, setOpen] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reason, setReason] = useState('')
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending')
  const [notes, setNotes] = useState('')
  
  const queryClient = useQueryClient()
  
  const createMutation = useMutation({
    mutationFn: (data: { startDate: string; endDate: string; reason: string; status: string; notes?: string }) => 
      api.post(`/staff/${staffId}/leaves`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', staffId, 'leaves'] })
      setOpen(false)
      setStartDate('')
      setEndDate('')
      setReason('')
      setStatus('pending')
      setNotes('')
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            Request Leave
          </DialogTitle>
          <DialogDescription>Submit a leave request for this staff member.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          {createMutation.error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                {(createMutation.error as any)?.response?.data?.message || 'Failed to create leave request'}
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label className="font-semibold">Start Date *</Label>
            <Input 
              type="date" 
              className="border-2" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">End Date *</Label>
            <Input 
              type="date" 
              className="border-2" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Reason *</Label>
            <Textarea 
              className="border-2" 
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
              placeholder="Enter reason for leave"
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'pending' | 'approved' | 'rejected')}
              className="w-full border-2 rounded-md px-3 py-2"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Notes</Label>
            <Textarea 
              className="border-2" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Optional additional notes"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="gap-2"
            disabled={!startDate || !endDate || !reason.trim() || createMutation.isPending}
            onClick={() => createMutation.mutate({ 
              startDate, 
              endDate, 
              reason, 
              status,
              notes: notes.trim() || undefined
            })}
          >
            {createMutation.isPending ? <Spinner className="size-4" /> : <Save className="size-4" />}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function EditLeaveDialog({ leave, staffId }: { leave: Leave; staffId: string }) {
  const [open, setOpen] = useState(false)
  const [startDate, setStartDate] = useState(leave.startDate.split('T')[0])
  const [endDate, setEndDate] = useState(leave.endDate.split('T')[0])
  const [reason, setReason] = useState(leave.reason)
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>(leave.status)
  const [notes, setNotes] = useState(leave.notes ?? '')
  
  const queryClient = useQueryClient()
  
  const updateMutation = useMutation({
    mutationFn: (data: { startDate?: string; endDate?: string; reason?: string; status?: string; notes?: string }) => 
      api.put(`/staff/${staffId}/leaves/${leave.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', staffId, 'leaves'] })
      setOpen(false)
    }
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            Edit Leave
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          {updateMutation.error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                {(updateMutation.error as any)?.response?.data?.message || 'Failed to update leave'}
              </AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label className="font-semibold">Start Date</Label>
            <Input 
              type="date" 
              className="border-2" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">End Date</Label>
            <Input 
              type="date" 
              className="border-2" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Reason</Label>
            <Textarea 
              className="border-2" 
              value={reason} 
              onChange={(e) => setReason(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'pending' | 'approved' | 'rejected')}
              className="w-full border-2 rounded-md px-3 py-2"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label className="font-semibold">Notes</Label>
            <Textarea 
              className="border-2" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Optional additional notes"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="gap-2"
            disabled={updateMutation.isPending}
            onClick={() => updateMutation.mutate({ 
              startDate, 
              endDate, 
              reason, 
              status,
              notes: notes.trim() || undefined
            })}
          >
            {updateMutation.isPending ? <Spinner className="size-4" /> : <Save className="size-4" />}
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteLeaveButton({ leaveId, staffId }: { leaveId: string; staffId: string }) {
  const queryClient = useQueryClient()
  
  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/staff/${staffId}/leaves/${leaveId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', staffId, 'leaves'] })
    }
  })

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="gap-1"
      disabled={deleteMutation.isPending}
      onClick={() => {
        if (confirm('Are you sure you want to delete this leave request?')) {
          deleteMutation.mutate()
        }
      }}
    >
      {deleteMutation.isPending ? <Spinner className="size-3" /> : <X className="size-3" />}
      Delete
    </Button>
  )
}

function EditStaffDialog({ staff, staffId }: { staff: Staff | null; staffId: string }) {
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

  const { data: userData, isLoading: userLoading } = useQuery<UserDetail>({
    queryKey: ['user', staff?.userId, 'detail'],
    queryFn: () => api.get<UserDetail>(`/users/${staff?.userId}`),
    enabled: open && !!staff?.userId,
  })

  const { data: staffData, isLoading: staffLoading } = useQuery<Staff>({
    queryKey: ['staff', staffId, 'detail'],
    queryFn: () => api.get<Staff>(`/staff/${staffId}`),
    enabled: open,
  })

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gender, setGender] = useState<string>('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName ?? (staff?.firstName ?? ''))
      setLastName(userData.lastName ?? (staff?.lastName ?? ''))
      setPhone(userData.phone ?? (staff?.phone ?? ''))
      setDateOfBirth(userData.dateOfBirth ?? '')
      setGender((userData.gender ?? '').toString())
      setAvatarUrl(userData.avatarUrl ?? '')
      setEmail(userData.email ?? '')
    } else if (staff) {
      setFirstName(staff.firstName ?? '')
      setLastName(staff.lastName ?? '')
      setPhone(staff.phone ?? '')
      setEmail(staff.email ?? '')
    }
    if (staffData) {
      setNotes(staffData.notes ?? '')
    } else if (staff) {
      setNotes(staff.notes ?? '')
    }
  }, [userData, staffData, staff])

  const updateUserMut = useMutation({
    mutationFn: async () => {
      if (!staff?.userId) return
      const body: Record<string, string> = {}
      if (firstName) body.firstName = firstName
      if (lastName) body.lastName = lastName
      if (phone) body.phone = phone
      if (dateOfBirth) body.dateOfBirth = dateOfBirth
      if (gender) body.gender = gender
      if (avatarUrl) body.avatarUrl = avatarUrl
      return api.put(`/users/${staff.userId}`, body)
    },
  })

  const updateStaffMut = useMutation({
    mutationFn: async () => {
      const body: Record<string, string> = {}
      if (notes !== undefined) body.notes = notes
      return api.put(`/staff/${staffId}`, body)
    },
  })

  const updateMut = useMutation({
    mutationFn: async () => {
      await Promise.all([
        updateUserMut.mutateAsync(),
        updateStaffMut.mutateAsync(),
      ])
    },
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ['staff', staffId] }),
        qc.invalidateQueries({ queryKey: ['user', staff?.userId, 'detail'] }),
        qc.invalidateQueries({ queryKey: ['staff', staffId, 'detail'] }),
      ])
      setOpen(false)
    },
  })

  const isLoading = userLoading || staffLoading
  const canSave = true

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Edit2 className="size-4" />
          Edit Staff
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto border-2 shadow-2xl">
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

            <div>
              <Label className="font-semibold">Email</Label>
              <Input type="email" value={email} disabled className="border-2 bg-muted cursor-not-allowed" />
              <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
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
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="border-2">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-semibold">Avatar URL</Label>
                <Input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="border-2" placeholder="https://..." />
              </div>
            </div>

            <div>
              <Label className="font-semibold">Notes</Label>
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} className="border-2" placeholder="Additional notes..." />
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
