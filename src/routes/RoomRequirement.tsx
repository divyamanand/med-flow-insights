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
import { Badge } from "@/components/ui/badge";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DoorClosed, Filter, Eye, CheckCircle, XCircle, Link as LinkIcon, ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Top bar: title, search, add button */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight gradient-text flex-1">Room Requirements</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <DoorClosed className="size-4" />
                Add Requirement
              </Button>
            </DialogTrigger>
            <DialogContent className="border-2 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <DoorClosed className="size-5 text-primary" />
                  Add New Room Requirement
                </DialogTitle>
                <DialogDescription>
                  Create a new room allocation request.
                </DialogDescription>
              </DialogHeader>
              <CreateRequirementForm onSubmit={createReq.mutate} />
              <DialogFooter>
                <Button>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search by ID or Requester..."
            className="max-w-md border-2"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* Filter row */}
      <Card className="border-2 shadow-lg glass-effect">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-accent" />
              <span className="text-sm font-semibold">Filter by:</span>
            </div>
            <div className="min-w-[220px]">
              <Select value={roomType} onValueChange={(v) => { setRoomType(v); setPage(1); }}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Select Room Type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Rooms</SelectItem>
                  {ROOM_TYPES.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[220px]">
              <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Select Status..." />
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
            <Button variant="ghost" className="text-muted-foreground" onClick={() => { setRoomType("all"); setStatus("all"); setSearch(""); setPage(1); }}>Clear Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-2 shadow-lg glass-effect">
        <CardContent>
          <div className="overflow-auto max-h-[600px]">
            <Table>
              <TableHeader>
                <TableRow className="border-muted/50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Qty</TableHead>
                  <TableHead className="font-semibold">Fulfilled</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Requested By</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paged.map((r) => (
                  <TableRow key={r.id} className="hover:bg-muted/50 transition-colors border-muted/30">
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <DoorClosed className="size-4 text-muted-foreground" />
                        <span className="font-mono text-sm text-muted-foreground">#{r.id}</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="secondary" className="capitalize">{r.roomType}</Badge></TableCell>
                    <TableCell><Badge variant="outline">{r.quantity}</Badge></TableCell>
                    <TableCell><Badge variant="outline">{r.fulfilled ?? 0}</Badge></TableCell>
                    <TableCell>
                      {r.status === "fulfilled" && <Badge variant="default">Fulfilled</Badge>}
                      {r.status === "inProgress" && <Badge variant="secondary">In Progress</Badge>}
                      {r.status === "open" && <Badge variant="outline">Open</Badge>}
                      {r.status === "cancelled" && <Badge variant="destructive">Cancelled</Badge>}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{r.primaryUserId}</TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        {/* View */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-1">
                              <Eye className="size-3" />
                              View
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="border-2 shadow-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Eye className="size-5 text-primary" />
                                Room Requirement Details
                              </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium text-muted-foreground">ID</span>
                                <span className="font-mono text-sm">#{r.id}</span>
                              </div>
                              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium text-muted-foreground">Room Type</span>
                                <Badge className="capitalize">{r.roomType}</Badge>
                              </div>
                              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium text-muted-foreground">Quantity</span>
                                <Badge variant="outline">{r.quantity}</Badge>
                              </div>
                              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium text-muted-foreground">Status</span>
                                <Badge>{r.status}</Badge>
                              </div>
                              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium text-muted-foreground">Requested By</span>
                                <span className="text-sm">{r.primaryUserId}</span>
                              </div>
                              <div className="p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium text-muted-foreground block mb-2">Notes</span>
                                <p className="text-sm">{r.notes || "—"}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Fulfillments */}
                        <Button asChild size="sm" variant="outline" className="gap-1">
                          <Link to={`/requirements/rooms/${r.id}/fulfillments`}>
                            <LinkIcon className="size-3" />
                            Fulfillments
                          </Link>
                        </Button>

                        {/* Approve (set status=inProgress) */}
                        <Button
                          size="sm"
                          variant="default"
                          className="gap-1"
                          onClick={() =>
                            updateReq.mutate({
                              id: r.id,
                              body: { status: "inProgress" },
                            })
                          }
                        >
                          <CheckCircle className="size-3" />
                          Approve
                        </Button>

                        {/* Cancel */}
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1"
                          onClick={() =>
                            updateReq.mutate({
                              id: r.id,
                              body: { status: "cancelled" },
                            })
                          }
                        >
                          <XCircle className="size-3" />
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
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <div className="font-semibold">
              {total === 0 ? (
                "Showing 0 of 0 results"
              ) : (
                `Showing ${start + 1} to ${end} of ${total} results`
              )}
            </div>

            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="gap-1">
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              <div className="px-3 py-1 bg-muted rounded-md font-medium">{page}</div>
              <Button size="sm" variant="outline" disabled={end >= total} onClick={() => setPage((p) => p + 1)} className="gap-1">
                Next
                <ChevronRight className="size-4" />
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
