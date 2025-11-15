import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

/* ---------------- Types ---------------- */
type RoomReq = {
  id: string;
  roomType: string;
  quantity: number;
  status: string;
  asked_by: string;
};

/* ---------------- Mock data (can replace with api.get later) ---------------- */
const MOCK_ROOM_REQS: RoomReq[] = [
  { id: "REQ001", roomType: "Patient Room", quantity: 15, status: "Pending", asked_by: "Dr. Sharma" },
  { id: "REQ002", roomType: "Operating Room", quantity: 3, status: "Pending", asked_by: "Dr. Lee" },
  { id: "REQ003", roomType: "Operating Room", quantity: 3, status: "Approved", asked_by: "Dr. Kim" },
  { id: "REQ004", roomType: "Patient Room", quantity: 5, status: "Ordered", asked_by: "Dr. Chen" },
  { id: "REQ005", roomType: "Laboratory", quantity: 8, status: "Pending", asked_by: "Dr. Khan" },
  { id: "REQ006", roomType: "Patient Room", quantity: 12, status: "Closed", asked_by: "Dr. Khan" },
];

/* ---------------- Component ---------------- */
export default function RoomRequirementsManagement() {
  // filters
  const [roomType, setRoomType] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [asked_bySearch, setasked_bySearch] = useState<string>("");

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // query (mocked for now)
  const reqQ = useQuery({
    queryKey: ["room-reqs"],
    queryFn: async (): Promise<RoomReq[]> => {
      // Replace this with: return api.get('/requirements/rooms') later
      await new Promise((r) => setTimeout(r, 200)); // simulate latency
      return MOCK_ROOM_REQS;
    },
    staleTime: 30_000,
  });

  const rows = useMemo(() => {
    let data = reqQ.data ?? [];
    if (roomType !== "all") data = data.filter((r) => r.roomType === roomType);
    if (status !== "all") data = data.filter((r) => r.status === status);
    if (asked_bySearch.trim()) data = data.filter((r) => r.asked_by.toLowerCase().includes(asked_bySearch.trim().toLowerCase()));
    return data;
  }, [reqQ.data, roomType, status, asked_bySearch]);

  const total = rows.length;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const paged = rows.slice(start, end);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Room Requirements Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="min-w-[200px]">
              <Select value={roomType} onValueChange={(v) => { setRoomType(v); setPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Room Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patient Room</SelectItem>
                  <SelectItem value="Patient Room">Patient Room</SelectItem>
                  <SelectItem value="Operating Room">Operating Room</SelectItem>
                  <SelectItem value="Laboratory">Laboratory</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[200px]">
              <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pending</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Ordered">Ordered</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Input placeholder="Search by asked_by or ID..." className="min-w-[300px]" value={asked_bySearch} onChange={(e) => { setasked_bySearch(e.target.value); setPage(1); }} />

            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-auto">+ New Requirement</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Create Requirement (Demo)</DialogTitle></DialogHeader>
                <div className="text-sm">Form placeholder — integrate API when ready.</div>
                <DialogFooter><Button>Save (Demo)</Button></DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Room Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>ASKED BY</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paged.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.roomType}</TableCell>
                    <TableCell>{r.quantity}</TableCell>
                    <TableCell>{r.status}</TableCell>
                    <TableCell>{r.asked_by}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild><Button size="sm" variant="outline">View</Button></DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>View Requirement</DialogTitle></DialogHeader>
                            <div className="text-sm">
                              <p><strong>ID:</strong> {r.id}</p>
                              <p><strong>Room Type:</strong> {r.roomType}</p>
                              <p><strong>Quantity:</strong> {r.quantity}</p>
                              <p><strong>Status:</strong> {r.status}</p>
                              <p><strong>asked_by:</strong> {r.asked_by}</p>
                            </div>
                            <DialogFooter><Button>Close</Button></DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button size="sm">Approve</Button>
                        <Button size="sm" variant="destructive">Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm">
            <div>{total === 0 ? "Showing 0 of 0" : `Showing ${start + 1}-${end} of ${total}`}</div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>{'<'}</Button>
              <Button size="sm" variant="outline" disabled={end >= total} onClick={() => setPage((p) => p + 1)}>{'>'}</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
