import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuth } from "@/lib/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { DoorClosed, Filter, Eye, CheckCircle, XCircle, Link as LinkIcon, ChevronLeft, ChevronRight, Edit2 } from "lucide-react";

/* ---------------- Types (from your backend) ---------------- */
type RoomRequirement = {
  id: string;
  primaryUserId: string;
  roomType: string;
  quantity: number;
  fulfilledCount: number;
  startTime: string | null;
  estimatedEndTime: string | null;
  status: "open" | "inProgress" | "fulfilled" | "cancelled";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
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

  /* ---------------- Edit Dialog State ---------------- */
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingReq, setEditingReq] = useState<RoomRequirement | null>(null);
  const [editFormData, setEditFormData] = useState({
    status: "open" as "open" | "inProgress" | "fulfilled" | "cancelled",
    roomType: "",
    quantity: 1,
    notes: "",
    startTime: "",
    estimatedEndTime: "",
  });

  /* ---------------- Queries ---------------- */
  const reqQ = useQuery<RoomRequirement[]>({
    queryKey: ["room-reqs"],
    queryFn: () => api.get("/requirements/rooms"),
    staleTime: 30000,
  });

  /* ---------------- Mutations ---------------- */
  const createReq = useMutation<RoomRequirement, Error, {
    primaryUserId: string;
    roomType: string;
    quantity: number;
    notes?: string | null;
    startTime?: string | null;
    estimatedEndTime?: string | null;
  }>({
    mutationFn: (body) => api.post("/requirements/rooms", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["room-reqs"] }),
  });

  const updateReq = useMutation<RoomRequirement, Error, {
    id: string;
    body: {
      status?: "open" | "inProgress" | "fulfilled" | "cancelled";
      notes?: string | null;
      quantity?: number;
      roomType?: string;
      startTime?: string | null;
      estimatedEndTime?: string | null;
    };
  }>({
    mutationFn: ({ id, body }) => api.patch(`/requirements/rooms/${id}`, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["room-reqs"] }),
  });

  /* ---------------- Filtered Rows ---------------- */
  const rows = useMemo(() => {
    const rawData = reqQ.data;
    let data = Array.isArray(rawData) ? rawData : [];

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
  const total = Array.isArray(rows) ? rows.length : 0;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const paged = Array.isArray(rows) ? rows.slice(start, end) : [];

  const openEditDialog = (req: RoomRequirement) => {
    setEditingReq(req);
    setEditFormData({
      status: req.status,
      roomType: req.roomType,
      quantity: req.quantity,
      notes: req.notes || "",
      startTime: req.startTime ? req.startTime.split("T")[0] + "T" + req.startTime.split("T")[1].substring(0, 5) : "",
      estimatedEndTime: req.estimatedEndTime ? req.estimatedEndTime.split("T")[0] + "T" + req.estimatedEndTime.split("T")[1].substring(0, 5) : "",
    });
    setEditDialogOpen(true);
  };

  const handleEdit = () => {
    if (!editingReq) return;

    const body: any = {};
    
    if (editFormData.status !== editingReq.status) {
      body.status = editFormData.status;
    }
    if (editFormData.roomType !== editingReq.roomType) {
      body.roomType = editFormData.roomType;
    }
    if (editFormData.quantity !== editingReq.quantity) {
      body.quantity = editFormData.quantity;
    }
    if (editFormData.notes !== (editingReq.notes || "")) {
      body.notes = editFormData.notes || null;
    }
    if (editFormData.startTime) {
      body.startTime = editFormData.startTime;
    }
    if (editFormData.estimatedEndTime) {
      body.estimatedEndTime = editFormData.estimatedEndTime;
    }

    if (Object.keys(body).length > 0) {
      updateReq.mutate(
        { id: editingReq.id, body },
        {
          onSuccess: () => {
            setEditDialogOpen(false);
            setEditingReq(null);
          },
        }
      );
    } else {
      setEditDialogOpen(false);
    }
  };

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
                    <TableCell><Badge variant="outline">{r.fulfilledCount}</Badge></TableCell>
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
                                <span className="text-sm font-medium text-muted-foreground">Fulfilled Count</span>
                                <Badge variant="outline">{r.fulfilledCount}</Badge>
                              </div>
                              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium text-muted-foreground">Status</span>
                                <Badge>{r.status}</Badge>
                              </div>
                              {r.startTime && (
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                  <span className="text-sm font-medium text-muted-foreground">Start Time</span>
                                  <span className="text-sm">{new Date(r.startTime).toLocaleString()}</span>
                                </div>
                              )}
                              {r.estimatedEndTime && (
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                  <span className="text-sm font-medium text-muted-foreground">Estimated End</span>
                                  <span className="text-sm">{new Date(r.estimatedEndTime).toLocaleString()}</span>
                                </div>
                              )}
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

                        {/* Edit */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => openEditDialog(r)}
                        >
                          <Edit2 className="size-3" />
                          Edit
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

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="border-2 shadow-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="size-5 text-primary" />
              Edit Room Requirement
            </DialogTitle>
            <DialogDescription>
              Update room requirement for {editingReq?.roomType} (ID: {editingReq?.id?.slice(0, 8)})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={editFormData.status}
                onValueChange={(value: any) => setEditFormData({ ...editFormData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="inProgress">In Progress</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Room Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Room Type</label>
              <Select
                value={editFormData.roomType}
                onValueChange={(value) => setEditFormData({ ...editFormData, roomType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROOM_TYPES.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                min={1}
                value={editFormData.quantity}
                onChange={(e) => setEditFormData({ ...editFormData, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Input
                type="datetime-local"
                value={editFormData.startTime}
                onChange={(e) => setEditFormData({ ...editFormData, startTime: e.target.value })}
              />
            </div>

            {/* Estimated End Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Estimated End Time</label>
              <Input
                type="datetime-local"
                value={editFormData.estimatedEndTime}
                onChange={(e) => setEditFormData({ ...editFormData, estimatedEndTime: e.target.value })}
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                placeholder="Additional notes..."
                value={editFormData.notes}
                onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                rows={3}
              />
            </div>

            {updateReq.isError && (
              <div className="text-sm text-destructive">
                Error: {updateReq.error?.message}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={updateReq.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEdit}
              disabled={updateReq.isPending}
              className="gap-2"
            >
              {updateReq.isPending ? "Updating..." : "Update Requirement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ---------------- Create Requirement Form ---------------- */

function CreateRequirementForm({
  onSubmit,
}: {
  onSubmit: (v: any) => void;
}) {
  const { user } = useAuth();
  const [roomType, setRoomType] = useState("ICU");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [startTime, setStartTime] = useState("");
  const [estimatedEndTime, setEstimatedEndTime] = useState("");

  return (
    <div className="flex flex-col gap-4 py-2">

      <div className="space-y-2">
        <label className="text-sm font-medium">Room Type *</label>
        <Select value={roomType} onValueChange={setRoomType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ICU">ICU</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="operating">Operating</SelectItem>
            <SelectItem value="lab">Lab</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Quantity *</label>
        <Input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Start Time (Optional)</label>
        <Input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Estimated End Time (Optional)</label>
        <Input
          type="datetime-local"
          value={estimatedEndTime}
          onChange={(e) => setEstimatedEndTime(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Notes (Optional)</label>
        <Textarea
          placeholder="Additional notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <Button
        onClick={() => {
          const data: any = {
            primaryUserId: user?.id,
            roomType,
            quantity,
          };
          if (notes) data.notes = notes;
          if (startTime) data.startTime = startTime;
          if (estimatedEndTime) data.estimatedEndTime = estimatedEndTime;
          onSubmit(data);
        }}
        disabled={!user?.id}
      >
        Create Requirement
      </Button>
    </div>
  );
}
