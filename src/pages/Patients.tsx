
import { useState } from "react";
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

const patients = [
  {
    id: "P001",
    name: "John Smith",
    issues: ["Chest Pain", "High Blood Pressure"],
    type: "Emergency",
    date: new Date(2023, 3, 21),
    ipd_no: "IPD2023042101",
    doctor: "Dr. Sarah Johnson",
    staff: ["Nurse Amy", "Tech Rob"],
    medicines: ["Aspirin", "Lisinopril"],
  },
  {
    id: "P002",
    name: "Emily Davis",
    issues: ["Annual Checkup"],
    type: "Regular",
    date: new Date(2023, 3, 20),
    ipd_no: "IPD2023042001",
    doctor: "Dr. Michael Brown",
    staff: ["Nurse Tom"],
    medicines: [],
  },
  {
    id: "P003",
    name: "Robert Wilson",
    issues: ["Appendicitis"],
    type: "Surgery",
    date: new Date(2023, 3, 19),
    ipd_no: "IPD2023041901",
    doctor: "Dr. Jessica Martinez",
    staff: ["Nurse Emma", "Nurse Dave", "Tech Samantha"],
    medicines: ["Antibiotics", "Painkillers", "IV Fluids"],
  },
  {
    id: "P004",
    name: "Lisa Thompson",
    issues: ["Respiratory Failure", "Pneumonia"],
    type: "ICU",
    date: new Date(2023, 3, 18),
    ipd_no: "IPD2023041801",
    doctor: "Dr. David Lee",
    staff: ["Nurse Alex", "Nurse Maria", "Tech James"],
    medicines: ["Ventolin", "Antibiotics", "Steroids", "Oxygen Therapy"],
  },
  {
    id: "P005",
    name: "Michael Johnson",
    issues: ["Broken Arm", "Concussion"],
    type: "Emergency",
    date: new Date(2023, 3, 17),
    ipd_no: "IPD2023041701",
    doctor: "Dr. Patricia Wilson",
    staff: ["Nurse Bob", "Tech Lucy"],
    medicines: ["Painkillers", "Anti-inflammatory"],
  },
  {
    id: "P006",
    name: "Jennifer Brown",
    issues: ["Pregnancy Checkup"],
    type: "Regular",
    date: new Date(2023, 3, 16),
    ipd_no: "IPD2023041601",
    doctor: "Dr. Elizabeth Chen",
    staff: ["Nurse Kelly"],
    medicines: ["Prenatal Vitamins"],
  },
  {
    id: "P007",
    name: "David Miller",
    issues: ["Heart Surgery", "Coronary Artery Disease"],
    type: "Surgery",
    date: new Date(2023, 3, 15),
    ipd_no: "IPD2023041501",
    doctor: "Dr. Robert Taylor",
    staff: ["Nurse Sarah", "Nurse John", "Tech Diana", "Tech George"],
    medicines: ["Blood Thinners", "Beta Blockers", "Pain Medication", "Antibiotics"],
  },
  {
    id: "P008",
    name: "Susan Anderson",
    issues: ["Stroke", "Hypertension"],
    type: "ICU",
    date: new Date(2023, 3, 14),
    ipd_no: "IPD2023041401",
    doctor: "Dr. James Wilson",
    staff: ["Nurse Emily", "Nurse Michael", "Tech Robert"],
    medicines: ["Blood Thinners", "Anti-hypertensives", "Statins"],
  },
];

export default function Patients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      searchTerm === "" ||
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.ipd_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.doctor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === null || patient.type === filterType;

    return matchesSearch && matchesFilter;
  });

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
                <Input id="type" className="col-span-3" />
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
                {filteredPatients.map((patient) => (
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
                    <TableCell>{format(patient.date, "PP")}</TableCell>
                    <TableCell>{patient.doctor}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {patient.issues.map((issue) => (
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
