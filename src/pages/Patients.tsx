import { useState, useEffect } from 'react';
import { Patient } from '@/lib/types';
import { getPatientDate } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Search, Filter, MoreHorizontal, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Backend needs GET /api/patients endpoint
    // For now using demo data
    const demoPatients: Patient[] = [
      {
        id: '1',
        name: 'John Smith',
        ipd_no: 'IPD001',
        type: 'Regular',
        date: new Date(),
        doctor: 'Dr. Sarah Johnson',
        issues: ['Fever', 'Cough'],
        staff: [],
        medicines: []
      },
      {
        id: '2',
        name: 'Emma Wilson',
        ipd_no: 'IPD002',
        type: 'Emergency',
        date: new Date(),
        doctor: 'Dr. Michael Brown',
        issues: ['Fracture'],
        staff: [],
        medicines: []
      }
    ];
    setPatients(demoPatients);
    setLoading(false);
  }, []);

  const filteredPatients: Patient[] = (patients || []).filter((patient) => {
    const name = patient?.name?.toLowerCase() || '';
    const ipdNo = patient?.ipd_no?.toLowerCase() || '';
    const doctor = patient?.doctor?.toLowerCase() || '';
    const type = patient?.type || '';

    const matchesSearch =
      searchTerm === "" ||
      name.includes(searchTerm.toLowerCase()) ||
      ipdNo.includes(searchTerm.toLowerCase()) ||
      doctor.includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === null || type === filterType;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-lg font-medium">Loading patients...</p>
        </div>
      </div>
  }

  if (error) {
    return <div className="flex justify-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patients</h1>
          <p className="text-muted-foreground">Manage and view patient records</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Patient
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Patient</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ipd-no" className="text-right">
                  IPD No
                </Label>
                <Input id="ipd-no" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <select id="type" className="col-span-3 border border-input rounded-md px-3 py-2">
                  <option value="">Select type</option>
                  <option value="Regular">Regular</option>
                  <option value="Emergency">Emergency</option>
                  <option value="Surgery">Surgery</option>
                  <option value="ICU">ICU</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="doctor" className="text-right">
                  Doctor
                </Label>
                <Input id="doctor" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="issues" className="text-right">
                  Issues
                </Label>
                <Textarea id="issues" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
          <CardDescription>Viewing all patients in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search patients..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  {filterType || "Filter"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterType(null)}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("Emergency")}>
                  Emergency
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("Regular")}>
                  Regular
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("Surgery")}>
                  Surgery
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("ICU")}>
                  ICU
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>IPD No</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Issues</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No patients found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell>{patient.ipd_no}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            patient.type === "Emergency"
                              ? "border-red-200 bg-red-50 text-red-500"
                              : patient.type === "ICU"
                              ? "border-amber-200 bg-amber-50 text-amber-500"
                              : patient.type === "Surgery"
                              ? "border-blue-200 bg-blue-50 text-blue-500"
                              : "border-green-200 bg-green-50 text-green-500"
                          }
                        >
                          {patient.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {patient.date ? format(getPatientDate(patient), "PP") : "N/A"}
                      </TableCell>
                      <TableCell>{patient.doctor}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {patient.issues?.map((issue) => (
                            <Badge key={issue} variant="secondary" className="text-xs">
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Patient</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
