import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

/* ---------------- Types (from your backend) ---------------- */
type RoomRequirement = {
  id: string;
  primaryUserId: string;
  roomType: string;
  quantity: number;
  fulfilled?: number;
  notes?: string;
  status: "open" | "inProgress" | "fulfilled" | "cancelled";
  createdAt: string;
};

const ROOM_TYPES = ["ICU", "general", "operating", "lab"];

/* ------------------------------------------------------------------ */
export default function RoomRequirementsManagement() {
  const queryClient = useQueryClient();

  /* ---------------- Filters ---------------- */
  const [roomType, setRoomType] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");

  /* ---------------- Pagination ---------------- */
  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* ---------------- Queries ---------------- */
  const reqQ = useQuery({
    queryKey: ["room-reqs"],
    queryFn: async (): Promise<RoomRequirement[]> => {
      const res = await api.get("/requirements/rooms");
      return res.data;
    },
    staleTime: 30000,
  });

  /* ---------------- Mutations ---------------- */
  const createReq = useMutation({
    mutationFn: (body: {
      primaryUserId: string;
      roomType: string;
      quantity: number;
      notes?: string;
    }) => api.post("/requirements/rooms", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["room-reqs"] }),
  });

  const updateReq = useMutation({
    mutationFn: ({ id, body }: { id: string; body: any }) =>
      api.patch(`/requirements/rooms/${id}`, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["room-reqs"] }),
  });

  /* ---------------- Filtered Rows ---------------- */
  const rows = useMemo(() => {
    let data = reqQ.data ?? [];

    if (roomType !== "all") data = data.filter((r) => r.roomType === roomType);
    if (status !== "all") data = data.filter((r) => r.status === status);

    if (search.trim()) {
      const s = search.trim().toLowerCase();
      data = data.filter(
        (r) =>
          r.id.toLowerCase().includes(s) ||
          r.primaryUserId.toLowerCase().includes(s)
      );
    }

    return data;
  }, [reqQ.data, roomType, status, search]);

  /* ---------------- Pagination logic ---------------- */
  const total = rows.length;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const paged = rows.slice(start, end);

  return (
    <div className="flex flex-col gap-6">
      {/* ---------------- Filters + Create Button ---------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Room Requirements Management</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            {/* Room Type Filter */}
            <div className="min-w-[200px]">
              <Select
                value={roomType}
                onValueChange={(v) => {
                  setRoomType(v);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Room Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rooms</SelectItem>
                  {ROOM_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="min-w-[200px]">
              <Select
                value={status}
                onValueChange={(v) => {
                  setStatus(v);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="inProgress">In Progress</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <Input
              placeholder="Search by ID or primaryUserId..."
              className="min-w-[300px]"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            {/* Create Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-auto">+ New Requirement</Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Room Requirement</DialogTitle>
                </DialogHeader>

                <CreateRequirementForm onSubmit={createReq.mutate} />

                <DialogFooter>
                  <Button onClick={() => {}}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* ---------------- Table ---------------- */}
      <Card>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Fulfilled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paged.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.roomType}</TableCell>
                    <TableCell>{r.quantity}</TableCell>
                    <TableCell>{r.fulfilled ?? 0}</TableCell>
                    <TableCell>{r.status}</TableCell>
                    <TableCell>{r.primaryUserId}</TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        {/* View */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Room Requirement</DialogTitle>
                            </DialogHeader>

                            <div className="text-sm space-y-2">
                              <p><b>ID:</b> {r.id}</p>
                              <p><b>Room Type:</b> {r.roomType}</p>
                              <p><b>Quantity:</b> {r.quantity}</p>
                              <p><b>Status:</b> {r.status}</p>
                              <p><b>Requested By:</b> {r.primaryUserId}</p>
                              <p><b>Notes:</b> {r.notes || "—"}</p>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Fulfillments */}
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/requirements/rooms/${r.id}/fulfillments`}>Fulfillments</Link>
                        </Button>

                        {/* Approve (set status=inProgress) */}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            updateReq.mutate({
                              id: r.id,
                              body: { status: "inProgress" },
                            })
                          }
                        >
                          Approve
                        </Button>

                        {/* Cancel */}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            updateReq.mutate({
                              id: r.id,
                              body: { status: "cancelled" },
                            })
                          }
                        >
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-sm">
            <div>
              {total === 0
                ? "Showing 0 of 0"
                : `Showing ${start + 1}-${end} of ${total}`}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                {"<"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={end >= total}
                onClick={() => setPage((p) => p + 1)}
              >
                {">"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Create Requirement Form ---------------- */

function CreateRequirementForm({
  onSubmit,
}: {
  onSubmit: (v: any) => void;
}) {
  const [primaryUserId, setPrimaryUserId] = useState("");
  const [roomType, setRoomType] = useState("ICU");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  return (
    <div className="flex flex-col gap-4 py-2">
      <Input
        placeholder="Primary User ID"
        value={primaryUserId}
        onChange={(e) => setPrimaryUserId(e.target.value)}
      />

      <Select value={roomType} onValueChange={setRoomType}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="ICU">ICU</SelectItem>
          <SelectItem value="general">General</SelectItem>
          <SelectItem value="operating">Operating</SelectItem>
          <SelectItem value="lab">Lab</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />

      <Input
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <Button
        onClick={() =>
          onSubmit({
            primaryUserId,
            roomType,
            quantity,
            notes: notes || undefined,
          })
        }
      >
        Create
      </Button>
    </div>
  );
}
