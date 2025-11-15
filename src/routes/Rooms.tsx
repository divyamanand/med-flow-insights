import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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
    <div className="flex flex-col gap-6">

      {/* HEADER */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Hospital Room Management</CardTitle>
        </CardHeader>
      </Card>

      {/* FILTERS */}
      <Card>
        <CardContent className="pt-6 space-y-4">

          <div className="flex flex-wrap items-center gap-4">

            {/* TYPE FILTER */}
            <div>
              <div className="text-xs font-semibold mb-1">Room Type</div>
              <Select value={type} onValueChange={(v) => { setType(v); setPage(1) }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="double">Double</SelectItem>
                  <SelectItem value="icu">ICU</SelectItem>
                  <SelectItem value="storage">Storage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* STATUS FILTER */}
            <div>
              <div className="text-xs font-semibold mb-1">Status</div>
              <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1) }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* CAPACITY RANGE */}
            <div>
              <div className="text-xs font-semibold mb-1">Capacity Min</div>
              <Input type="number" value={capacityMin} onChange={(e) => setCapacityMin(e.target.value)} className="w-[120px]" />
            </div>

            <div>
              <div className="text-xs font-semibold mb-1">Capacity Max</div>
              <Input type="number" value={capacityMax} onChange={(e) => setCapacityMax(e.target.value)} className="w-[120px]" />
            </div>

            {/* APPLY FILTERS */}
            <Button onClick={() => roomsQ.refetch()}>Apply</Button>

            {/* ADD ROOM */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-auto bg-blue-600 text-white">+ Add Room</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Room (Demo)</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <Button>Create (Demo)</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

          </div>

        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardContent className="pt-6">

          {roomsQ.isLoading ? (
            <div className="p-6 text-center">Loading…</div>
          ) : (
            <>
              <div className="overflow-auto w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paged.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell>{room.name}</TableCell>
                        <TableCell className="capitalize">{room.type}</TableCell>
                        <TableCell>{room.capacity}</TableCell>
                        <TableCell>
                          <span className={statusColor(room.status)}>
                            {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell className="space-x-2">
                          <Button variant="link" className="text-blue-600 p-0">Edit</Button>
                          <Button variant="link" className="text-red-600 p-0">Delete</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                </Table>
              </div>

              {/* PAGINATION */}
              <div className="flex items-center justify-between mt-4 px-1 text-sm">
                <div>
                  {total === 0
                    ? "Showing 0 of 0"
                    : `Showing ${start + 1} to ${end} of ${total}`}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    {"<"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={end >= total}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    {">"}
                  </Button>
                </div>
              </div>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
