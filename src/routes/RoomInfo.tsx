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
    <div className="flex flex-col gap-6">

      {/* PAGE TITLE */}
      <div>
        <h1 className="text-3xl font-semibold">Room Details: {room.name}</h1>
        <p className="text-sm text-blue-600 cursor-pointer mt-1">Back to Room List</p>
      </div>

      {/* TOP GRID */}
      <div className="grid sm:grid-cols-2 gap-6">

        {/* LEFT CARD: INFO */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Info Card</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Name:</strong> {room.name}</p>
            <p><strong>Type:</strong> {room.type}</p>
            <p><strong>Capacity:</strong> {room.capacity}</p>
            <p><strong>Status:</strong> {room.status}</p>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="mt-3">Edit Room</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Room (Demo)</DialogTitle>
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
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Change Room Status</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={status} onValueChange={setStatus} className="space-y-3">

              <div className="flex items-center gap-2">
                <RadioGroupItem value="available" id="st1" />
                <Label htmlFor="st1">Available</Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem value="reserved" id="st2" />
                <Label htmlFor="st2">Reserved</Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem value="occupied" id="st3" />
                <Label htmlFor="st3">Occupied</Label>
              </div>

              <div className="flex items-center gap-2">
                <RadioGroupItem value="maintenance" id="st4" />
                <Label htmlFor="st4">Maintenance</Label>
              </div>

            </RadioGroup>

            <Button className="mt-4">Update Status (Demo)</Button>
          </CardContent>
        </Card>

      </div>

      {/* ROOM HISTORY */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Room Fulfillment History</CardTitle>
        </CardHeader>
        <CardContent>

          <div className="overflow-auto max-h-[350px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Doctor/Staff</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {history.map((h, i) => (
                  <TableRow key={i}>
                    <TableCell>{h.date}</TableCell>
                    <TableCell>{h.slot}</TableCell>
                    <TableCell>{h.patient}</TableCell>
                    <TableCell>{h.doctor}</TableCell>
                    <TableCell>{h.status}</TableCell>
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
