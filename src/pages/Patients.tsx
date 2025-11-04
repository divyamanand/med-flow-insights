import { useState, useEffect } from 'react';
import { Patient } from '@/lib/types';
import { getPatientDate } from '@/lib/utils';
import { patientService } from '@/services/patient.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, ColumnDef } from "@/shared/components/DataTable";
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
import { MoreHorizontal, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/shared/components/PageHeader";
import { ResourceToolbar } from "@/shared/components/ResourceToolbar";
import { EmptyState } from "@/shared/components/EmptyState";
import { LoadingOverlay } from "@/shared/components/LoadingOverlay";

export default function Patients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  
  const columns: ColumnDef<Patient>[] = [
    { id: 'name', header: 'Name', accessor: (p) => <span className="font-medium">{p.name}</span> },
    { id: 'ipd', header: 'IPD No', accessor: (p) => p.ipd_no },
    { id: 'type', header: 'Type', cell: (p) => (
      <Badge
        variant="outline"
        className={
          p.type === 'Emergency'
            ? 'border-red-200 bg-red-50 text-red-500'
            : p.type === 'ICU'
            ? 'border-amber-200 bg-amber-50 text-amber-500'
            : p.type === 'Surgery'
            ? 'border-blue-200 bg-blue-50 text-blue-500'
            : 'border-green-200 bg-green-50 text-green-500'
        }
      >
        {p.type}
      </Badge>
    ) },
    { id: 'date', header: 'Date', accessor: (p) => (p.date ? format(getPatientDate(p), 'PP') : 'N/A') },
    { id: 'doctor', header: 'Doctor', accessor: (p) => p.doctor },
    { id: 'issues', header: 'Issues', cell: (p) => (
      <div className="flex flex-wrap gap-1">
        {p.issues?.map((issue) => (
          <Badge key={issue} variant="secondary" className="text-xs">{issue}</Badge>
        ))}
      </div>
    ) },
    { id: 'actions', header: '', className: 'w-[64px]', cell: (p) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Edit Patient</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ) },
  ];

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const data = await patientService.list();
        setPatients(data.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch patients');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
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
    return <LoadingOverlay label="Loading patients..." />
  }

  if (error) {
    return <div className="flex justify-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Patients"
        description="Manage and view patient records"
        breadcrumbs={[{ label: 'Home', href: '/app' }, { label: 'Patients' }]}
        actions={(
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Patient
          </Button>
        )}
      />
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Patient</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <input id="name" className="col-span-3 border border-input rounded-md px-3 py-2 bg-background" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ipd-no" className="text-right">IPD No</Label>
              <input id="ipd-no" className="col-span-3 border border-input rounded-md px-3 py-2 bg-background" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <select id="type" className="col-span-3 border border-input rounded-md px-3 py-2 bg-background">
                <option value="">Select type</option>
                <option value="Regular">Regular</option>
                <option value="Emergency">Emergency</option>
                <option value="Surgery">Surgery</option>
                <option value="ICU">ICU</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doctor" className="text-right">Doctor</Label>
              <input id="doctor" className="col-span-3 border border-input rounded-md px-3 py-2 bg-background" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="issues" className="text-right">Issues</Label>
              <Textarea id="issues" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Patient Records</CardTitle>
          <CardDescription>Viewing all patients in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <ResourceToolbar
            search={{ value: searchTerm, onChange: setSearchTerm, placeholder: 'Search patients...' }}
            filter={{
              label: filterType ?? 'Filter',
              value: filterType,
              onChange: setFilterType,
              options: [
                { label: 'Emergency', value: 'Emergency' },
                { label: 'Regular', value: 'Regular' },
                { label: 'Surgery', value: 'Surgery' },
                { label: 'ICU', value: 'ICU' },
              ],
            }}
          />

          <DataTable
            columns={columns}
            data={filteredPatients}
            rowKey={(p) => p.id}
            empty={<EmptyState title="No patients found" description="Try adjusting your search or filters." />}
          />
        </CardContent>
      </Card>
    </div>
  );
}
