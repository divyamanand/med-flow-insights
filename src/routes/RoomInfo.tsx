import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableCell, TableBody } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DoorClosed, Users, Edit2, Activity, History, ChevronLeft } from "lucide-react";

export default function RoomDetails() {
  const { id = "" } = useParams();

  /* --------------------- Load Room --------------------- */
  const roomQ = useQuery({
    queryKey: ["room", id],
    queryFn: async () => {
      const response: any = await api.get(`/rooms/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

  /* ------------------ Local state for status update ------------------ */
  const [status, setStatus] = useState<string>("available");

  /* ------------------ Mock Fulfillment History ------------------ */
  const history = [
    {
      date: "2024-10-26",
      slot: "10:00 - 10:30",
      patient: "John Doe",
      doctor: "Dr. Smith",
      status: "Completed",
    },
    {
      date: "2024-10-26",
      slot: "10:30 - 11:00",
      patient: "John Doe",
      doctor: "Dr. Smith",
      status: "Completed",
    },
    {
      date: "2024-10-26",
      slot: "11:00 - 11:30",
      patient: "Jane Lee",
      doctor: "Dr. Jones",
      status: "Occupied",
    },
    {
      date: "2024-10-26",
      slot: "11:30 - 12:00",
      patient: "David Chen",
      doctor: "Dr. Jones",
      status: "Reserved",
    },
    {
      date: "2024-10-26",
      slot: "12:00 - 12:30",
      patient: "Maria Rodriguez",
      doctor: "Dr. Jmith",
      status: "Reserved",
    },
    {
      date: "2024-10-26",
      slot: "13:00 - 13:30",
      patient: "Ahmed Khan",
      doctor: "Dr. Smith",
      status: "Available",
    },
  ];

  if (roomQ.isLoading)
    return <div className="flex items-center justify-center p-10"><Spinner className="size-6" /></div>;

  if (roomQ.error)
    return <div className="text-destructive p-6">{(roomQ.error as Error).message}</div>;

  const room = roomQ.data as any;

  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-slide-in-bottom">
      {/* Enhanced Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <DoorClosed className="size-4 text-primary" />
          <span className="text-sm font-medium text-primary">Room Information</span>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text">
            {room.name}
          </h1>
          <Button variant="outline" asChild className="gap-2">
            <a href="/rooms">
              <ChevronLeft className="size-4" />
              Back to Rooms
            </a>
          </Button>
        </div>
      </div>

      {/* Top Grid */}
      <div className="grid sm:grid-cols-2 gap-6">

        {/* LEFT CARD: INFO */}
        <Card className="border-2 shadow-lg glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DoorClosed className="size-5 text-primary" />
              </div>
              Room Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="font-semibold">{room.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Type</p>
                <Badge variant="outline" className="capitalize">{room.type}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Capacity</p>
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-muted-foreground" />
                  <span className="font-semibold">{room.capacity}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Current Status</p>
                <Badge className="capitalize">{room.status}</Badge>
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full gap-2">
                  <Edit2 className="size-4" />
                  Edit Room
                </Button>
              </DialogTrigger>
              <DialogContent className="border-2 shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Edit2 className="size-5 text-primary" />
                    Edit Room (Demo)
                  </DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">Form goes here...</p>
                <DialogFooter>
                  <Button>Save (Demo)</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* RIGHT CARD: CHANGE STATUS */}
        <Card className="border-2 shadow-lg glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Activity className="size-5 text-accent" />
              </div>
              Change Room Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={status} onValueChange={setStatus} className="space-y-3">

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="available" id="st1" />
                <Label htmlFor="st1" className="cursor-pointer flex-1 font-medium">Available</Label>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="reserved" id="st2" />
                <Label htmlFor="st2" className="cursor-pointer flex-1 font-medium">Reserved</Label>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="occupied" id="st3" />
                <Label htmlFor="st3" className="cursor-pointer flex-1 font-medium">Occupied</Label>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="maintenance" id="st4" />
                <Label htmlFor="st4" className="cursor-pointer flex-1 font-medium">Maintenance</Label>
              </div>

            </RadioGroup>

            <Button className="mt-4 w-full gap-2">
              <Edit2 className="size-4" />
              Update Status (Demo)
            </Button>
          </CardContent>
        </Card>

      </div>

      {/* ROOM HISTORY */}
      <Card className="border-2 shadow-lg glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-success/10 rounded-lg">
              <History className="size-5 text-success" />
            </div>
            Room Fulfillment History
          </CardTitle>
        </CardHeader>
        <CardContent>

          <div className="overflow-auto max-h-[400px]">
            <Table>
              <TableHeader>
                <TableRow className="border-muted/50">
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Time Slot</TableHead>
                  <TableHead className="font-semibold">Patient Name</TableHead>
                  <TableHead className="font-semibold">Doctor/Staff</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {history.map((h, i) => (
                  <TableRow key={i} className="hover:bg-muted/50 transition-colors border-muted/30">
                    <TableCell className="text-sm text-muted-foreground">{h.date}</TableCell>
                    <TableCell className="font-medium">{h.slot}</TableCell>
                    <TableCell className="font-medium">{h.patient}</TableCell>
                    <TableCell className="text-sm">{h.doctor}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          h.status === "Completed" ? "default" : 
                          h.status === "Occupied" ? "secondary" : 
                          h.status === "Reserved" ? "outline" : 
                          "secondary"
                        }
                        className="capitalize"
                      >
                        {h.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </div>

          <p className="text-right text-sm text-muted-foreground mt-3">
            Showing {history.length} results
          </p>

        </CardContent>
      </Card>
    </div>
  );
}
