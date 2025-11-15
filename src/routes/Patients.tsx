import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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

type Patient = {
  id: string
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

  useEffect(() => {
    setMinAgeInput(ageRange[0])
    setMaxAgeInput(ageRange[1])
  }, [ageRange])

  const { data, isLoading, error } = useQuery<Patient[]>({
    queryKey: ['patients', { search, ...applied }],
    queryFn: () =>
      api.get<Patient[]>('/patients', {
        search,
        gender: applied.gender === 'all' ? '' : applied.gender,
        minAge: applied.minAge,
        maxAge: applied.maxAge,
      }),
  })

  const [page, setPage] = useState(1)
  const pageSize = 10
  const rows = data ?? []
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const pageSafe = Math.min(page, pageCount)
  const paged = rows.slice((pageSafe - 1) * pageSize, pageSafe * pageSize)

  function applyFilters() {
    const [min, max] = ageRange
    const _min = Math.max(0, Math.min(min, max))
    const _max = Math.max(_min, Math.min(max, 150))
    setApplied({ gender, minAge: _min, maxAge: _max })
    setPage(1)
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
              setSearch(e.target.value)
              setPage(1)
            }}
          />
          <AddPatientDialog />
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            {/* Gender */}
            <div className="grid gap-2">
              <Label>Gender</Label>
              <RadioGroup
                value={gender}
                onValueChange={(v) => setGender(v as any)}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="g-all" value="all" />
                  <Label htmlFor="g-all">All</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="g-female" value="female" />
                  <Label htmlFor="g-female">Female</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="g-male" value="male" />
                  <Label htmlFor="g-male">Male</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Age */}
            <div className="grid gap-2">
              <Label>Age Range</Label>
              <div className="grid gap-3 sm:grid-cols-[100px_1fr_100px] sm:items-center">
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
                />
                <div className="px-2">
                  <Slider
                    min={0}
                    max={120}
                    value={ageRange}
                    onValueChange={(v) => setAgeRange(v as [number, number])}
                  />
                </div>
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
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={applyFilters}>Apply Filters</Button>
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
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell className="capitalize">{p.gender}</TableCell>
                      <TableCell>{p.dateOfBirth}</TableCell>
                      <TableCell>{p.age}</TableCell>
                      <TableCell>{p.createdAt}</TableCell>
                      <TableCell>{p.appointmentsCount}</TableCell>
                      <TableCell>{p.prescriptionsCount}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <RowActions />
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
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </Button>
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

/* ---------- Dialogs ---------- */

function AddPatientDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>+ Add Patient</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Patient (Demo)</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <div>
            <Label>Name</Label>
            <Input placeholder="Peter Patient" />
          </div>
          <div>
            <Label>Date of Birth</Label>
            <Input type="date" />
          </div>
        </div>

        <DialogFooter>
          <Button>Save (Demo)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RowActions() {
  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">View</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Patient (Demo)</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">Edit</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Patient (Demo)</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">Delete</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Patient (Demo)</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost">Cancel</Button>
            <Button variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
