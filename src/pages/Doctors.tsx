import { addDoctor} from "@/lib/firestore";
import { useState, useRef,useEffect } from "react";
import { Doctor } from "@/lib/types";
import { getCollection } from '@/lib/firestore'
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
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function Doctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAvailable, setFilterAvailable] = useState<boolean | null>(null);
  // Collect form data
  const nameRef = useRef<HTMLInputElement>(null);
  const specialityRef = useRef<HTMLInputElement>(null);
  const timingsRef = useRef<HTMLInputElement>(null);
  const roomRef = useRef<HTMLInputElement>(null);
  const [available, setAvailable] = useState(false);

   const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
        const data = await getCollection("doctor");
        setDoctors(data as Doctor[]);
        setLoading(false);
      };
  
      fetchDoctors();
  }, []);

  const saveDoctor = async () => {
    const doctorData = {
      name: nameRef.current?.value || "",
      speciality: specialityRef.current?.value?.split(",").map(s => s.trim()) || [],
      timings: timingsRef.current?.value || "",
      room_no: roomRef.current?.value || "",
      available,
    };

    try {
      await addDoctor(doctorData);
      alert("Doctor added successfully");

      // Clear form
      if (nameRef.current) nameRef.current.value = "";
      if (specialityRef.current) specialityRef.current.value = "";
      if (timingsRef.current) timingsRef.current.value = "";
      if (roomRef.current) roomRef.current.value = "";
      setAvailable(false);
    } catch (error) {
      console.error("Error adding doctor:", error);
      alert("Failed to add doctor");
    }
};

  

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      searchTerm === "" ||
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.speciality.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ||
      doctor.room_no.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterAvailable === null || doctor.available === filterAvailable;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-lg font-medium">Connecting to Firebase...</p>
        </div>
      </div>
  }


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
              <Input id="name" className="col-span-3" ref={nameRef} />
            </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="speciality" className="text-right">
                    Speciality
                  </Label>
                  <Input id="speciality" className="col-span-3" ref={specialityRef} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="timings" className="text-right">
                    Timings
                  </Label>
                  <Input id="timings" className="col-span-3" ref={timingsRef} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="room" className="text-right">
                    Room No
                  </Label>
                  <Input id="room" className="col-span-3" ref={roomRef} />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="available" className="text-right">
                    Available
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Switch 
                      id="available" 
                      checked={available} 
                      onCheckedChange={setAvailable} 
                    />
                    <Label htmlFor="available">Available for appointments</Label>
                  </div>
                </div>
              </div>
            <DialogFooter>
              <Button onClick={()=>saveDoctor()} type="submit">Save</Button>
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
                            {doctor.name}
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
                          <button onClick={()=>{}}>remove</button>
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
