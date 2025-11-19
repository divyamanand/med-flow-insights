import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DoorClosed, Filter, Plus, ChevronLeft, ChevronRight, Edit2, Trash2 } from "lucide-react";

type Room = {
  id: string;
  name: string;
  type: string;
  status: string;
  capacity: number;
};

export default function RoomsList() {
  /* ---------------------- Filters ---------------------- */
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [capacityMin, setCapacityMin] = useState("");
  const [capacityMax, setCapacityMax] = useState("");

  /* ---------------------- Pagination ---------------------- */
  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* ---------------------- Load Rooms ---------------------- */
  const roomsQ = useQuery<Room[]>({
    queryKey: ["rooms", { type, status, capacityMin, capacityMax }],
    queryFn: () =>
      api.get("/rooms", {
        type: type !== "all" ? type : undefined,
        status: status !== "all" ? status : undefined,
        capacityMin: capacityMin || undefined,
        capacityMax: capacityMax || undefined,
      }),
  });

  const rows = roomsQ.data ?? [];

  /* ---------------------- Pagination Logic ---------------------- */
  const total = rows.length;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const paged = rows.slice(start, end);

  /* ---------------------- UI Helpers ---------------------- */
  const statusColor = (st: string) => {
    switch (st) {
      case "available":
        return "bg-green-500 text-white px-3 py-1 rounded-full text-xs";
      case "occupied":
        return "bg-orange-500 text-white px-3 py-1 rounded-full text-xs";
      case "maintenance":
      case "under_maintenance":
        return "bg-yellow-500 text-white px-3 py-1 rounded-full text-xs";
      default:
        return "bg-gray-400 text-white px-3 py-1 rounded-full text-xs";
    }
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-slide-in-bottom">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <DoorClosed className="size-4 text-primary" />
            <span className="text-sm font-medium text-primary">Facility Management</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text">
            Room Management
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Track room availability, capacity, and maintenance status
          </p>
        </div>
      </div>

      {/* Modern Filters Card */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-primary" />
            <CardTitle>Filters & Actions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* TYPE FILTER */}
            <div className="space-y-2">
              <Label className="font-semibold">Room Type</Label>
              <Select value={type} onValueChange={(v) => { setType(v); setPage(1) }}>
                <SelectTrigger className="border-2 focus:border-primary">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="icu">ICU</SelectItem>
                  <SelectItem value="storage">Storage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* STATUS FILTER */}
            <div className="space-y-2">
              <Label className="font-semibold">Status</Label>
              <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1) }}>
                <SelectTrigger className="border-2 focus:border-primary">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* CAPACITY RANGE */}
            <div className="space-y-2">
              <Label className="font-semibold">Min Capacity</Label>
              <Input 
                type="number" 
                value={capacityMin} 
                onChange={(e) => setCapacityMin(e.target.value)} 
                placeholder="Min"
                className="border-2 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Max Capacity</Label>
              <Input 
                type="number" 
                value={capacityMax} 
                onChange={(e) => setCapacityMax(e.target.value)} 
                placeholder="Max"
                className="border-2 focus:border-primary"
              />
            </div>

            {/* ACTIONS */}
            <div className="space-y-2">
              <Label className="font-semibold opacity-0">Actions</Label>
              <div className="flex gap-2">
                <Button onClick={() => roomsQ.refetch()} variant="outline" className="flex-1">
                  Apply
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="size-4" />
                      Add
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Room (Demo)</DialogTitle>
                      <DialogDescription>
                        Create a new room in the hospital.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button>Create (Demo)</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modern Rooms Table */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DoorClosed className="size-5 text-primary" />
              <CardTitle>Rooms Directory</CardTitle>
            </div>
            <Badge variant="outline" className="px-3 py-1">{total} Rooms</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {roomsQ.isLoading ? (
            <div className="flex items-center justify-center gap-3 p-12">
              <Spinner className="size-6 text-primary" />
              <span className="text-lg font-medium">Loading rooms...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-bold">Room Name</TableHead>
                      <TableHead className="font-bold">Type</TableHead>
                      <TableHead className="font-bold">Capacity</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="text-right font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paged.map((room) => (
                      <TableRow key={room.id} className="hover:bg-primary/5 transition-colors">
                        <TableCell className="font-semibold">{room.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{room.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{room.capacity} beds</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              room.status === "available"
                                ? "default"
                                : room.status === "occupied"
                                ? "outline"
                                : "secondary"
                            }
                            className="capitalize"
                          >
                            {room.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                              <Edit2 className="size-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Modern Pagination */}
              <div className="border-t border-border/50 bg-muted/20 px-6 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-sm font-medium">
                    {total === 0
                      ? "No rooms found"
                      : `Showing ${start + 1} to ${end} of ${total}`}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="border-2"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-sm px-3">Page {page}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={end >= total}
                      onClick={() => setPage((p) => p + 1)}
                      className="border-2"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
