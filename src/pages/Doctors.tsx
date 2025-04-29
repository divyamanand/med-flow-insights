
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Search, Filter, MoreHorizontal, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const doctors = [
  {
    id: "D001",
    name: "Dr. Sarah Johnson",
    speciality: ["Cardiology"],
    timings: "9:00 AM - 5:00 PM",
    room_no: "203",
    available: true,
  },
  {
    id: "D002",
    name: "Dr. Michael Brown",
    speciality: ["General Medicine", "Family Practice"],
    timings: "8:00 AM - 4:00 PM",
    room_no: "101",
    available: true,
  },
  {
    id: "D003",
    name: "Dr. Jessica Martinez",
    speciality: ["Surgery", "Orthopedics"],
    timings: "10:00 AM - 6:00 PM",
    room_no: "305",
    available: false,
  },
  {
    id: "D004",
    name: "Dr. David Lee",
    speciality: ["Pulmonology", "Critical Care"],
    timings: "7:00 AM - 7:00 PM",
    room_no: "ICU-2",
    available: true,
  },
  {
    id: "D005",
    name: "Dr. Patricia Wilson",
    speciality: ["Emergency Medicine", "Trauma"],
    timings: "Night Shift: 8:00 PM - 8:00 AM",
    room_no: "ER-1",
    available: true,
  },
  {
    id: "D006",
    name: "Dr. Elizabeth Chen",
    speciality: ["Obstetrics", "Gynecology"],
    timings: "9:00 AM - 3:00 PM",
    room_no: "204",
    available: false,
  },
  {
    id: "D007",
    name: "Dr. Robert Taylor",
    speciality: ["Cardiothoracic Surgery"],
    timings: "8:00 AM - 4:00 PM",
    room_no: "OR-3",
    available: true,
  },
  {
    id: "D008",
    name: "Dr. James Wilson",
    speciality: ["Neurology", "Stroke Care"],
    timings: "10:00 AM - 6:00 PM",
    room_no: "302",
    available: true,
  },
];

export default function Doctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailable, setFilterAvailable] = useState<boolean | null>(null);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      searchTerm === "" ||
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.speciality.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ||
      doctor.room_no.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterAvailable === null || doctor.available === filterAvailable;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Doctors</h1>
          <p className="text-muted-foreground">Manage doctor directory and availability</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Doctor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Doctor</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Full Name
                </Label>
                <Input id="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="speciality" className="text-right">
                  Speciality
                </Label>
                <Input id="speciality" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="timings" className="text-right">
                  Timings
                </Label>
                <Input id="timings" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room" className="text-right">
                  Room No
                </Label>
                <Input id="room" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="available" className="text-right">
                  Available
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch id="available" />
                  <Label htmlFor="available">Available for appointments</Label>
                </div>
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
          <CardTitle>Doctor Directory</CardTitle>
          <CardDescription>Manage the hospital's medical staff</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search doctors..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  {filterAvailable === true 
                    ? "Available" 
                    : filterAvailable === false 
                    ? "Unavailable" 
                    : "Filter"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by Availability</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setFilterAvailable(null)}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterAvailable(true)}>
                  Available
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterAvailable(false)}>
                  Unavailable
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Speciality</TableHead>
                  <TableHead>Timings</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDoctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.name}`} />
                          <AvatarFallback>
                            {doctor.name
                              .split(" ")[1][0]}
                            {doctor.name
                              .split(" ")[2]?.[0] ?? ""}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{doctor.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {doctor.speciality.map((spec) => (
                          <Badge key={spec} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{doctor.timings}</TableCell>
                    <TableCell>{doctor.room_no}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          doctor.available
                            ? "border-green-200 bg-green-50 text-green-500"
                            : "border-red-200 bg-red-50 text-red-500"
                        }
                      >
                        {doctor.available ? "Available" : "Unavailable"}
                      </Badge>
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
                          <DropdownMenuItem>View Schedule</DropdownMenuItem>
                          <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            Remove
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
