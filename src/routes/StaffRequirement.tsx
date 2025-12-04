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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { Users, Filter, Eye, CheckCircle, XCircle, Link as LinkIcon, ChevronLeft, ChevronRight, UserPlus, Edit2 } from "lucide-react";

type StaffRequirement = {
  id: string;
  primaryUserId: string;
  roleNeeded: string;
  quantity: number;
  fulfilledCount: number;
  startTime: string | null;
  estimatedEndTime: string | null;
  status: "open" | "inProgress" | "fulfilled" | "cancelled";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

const ROLES = [
  "nurse",
  "labTech",
  "doctor",
  "surgeon",
  "pharmacist",
  "assistant",
];

export default function StaffingRequirements() {
  const queryClient = useQueryClient();

  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingReq, setEditingReq] = useState<StaffRequirement | null>(null);
  const [editFormData, setEditFormData] = useState({
    status: "open" as "open" | "inProgress" | "fulfilled" | "cancelled",
    roleNeeded: "",
    quantity: 1,
    notes: "",
    startTime: "",
    estimatedEndTime: "",
  });

  const q = useQuery<StaffRequirement[]>({
    queryKey: ["staff-reqs"],
    queryFn: async () => {
        const res = await api.get("/requirements/staff");
        return res.data;
    },
    staleTime: 30000,
  });

  const createReq = useMutation<StaffRequirement, Error, {
    primaryUserId: string;
    roleNeeded: string;
    quantity: number;
    notes?: string | null;
    startTime?: string | null;
    estimatedEndTime?: string | null;
  }>({
    mutationFn: async (body) => {
        const res = await api.post("/requirements/staff", body);
        return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff-reqs"] }),
  });

  const updateReq = useMutation<StaffRequirement, Error, {
    id: string;
    body: {
      status?: "open" | "inProgress" | "fulfilled" | "cancelled";
      notes?: string | null;
      quantity?: number;
      roleNeeded?: string;
      startTime?: string | null;
      estimatedEndTime?: string | null;
    };
  }>({
    mutationFn: async ({ id, body }) => {
        const res = await api.patch(`/requirements/staff/${id}`, body);
        return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff-reqs"] }),
  });

  const rows = useMemo(() => {
    const rawData = q.data;
    let data = Array.isArray(rawData) ? rawData : [];

    if (roleFilter !== "all") data = data.filter((r) => r.roleNeeded === roleFilter);
    if (statusFilter !== "all") data = data.filter((r) => r.status === statusFilter);

    if (search.trim()) {
      const t = search.trim().toLowerCase();
      data = data.filter(
        (r) =>
          r.primaryUserId.toLowerCase().includes(t) ||
          r.id.toLowerCase().includes(t)
      );
    }

    return data;
  }, [q.data, roleFilter, statusFilter, search]);

  const total = Array.isArray(rows) ? rows.length : 0;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const paged = Array.isArray(rows) ? rows.slice(start, end) : [];

  const openEditDialog = (req: StaffRequirement) => {
    setEditingReq(req);
    setEditFormData({
      status: req.status,
      roleNeeded: req.roleNeeded,
      quantity: req.quantity,
      notes: req.notes || "",
      startTime: req.startTime ? req.startTime.substring(0, 16) : "",
      estimatedEndTime: req.estimatedEndTime ? req.estimatedEndTime.substring(0, 16) : "",
    });
    setEditDialogOpen(true);
  };

  const handleEdit = () => {
    if (!editingReq) return;

    const body: any = {};
    
    if (editFormData.status !== editingReq.status) {
      body.status = editFormData.status;
    }
    if (editFormData.roleNeeded !== editingReq.roleNeeded) {
      body.roleNeeded = editFormData.roleNeeded;
    }
    if (editFormData.quantity !== editingReq.quantity) {
      body.quantity = editFormData.quantity;
    }
    if (editFormData.notes !== (editingReq.notes || "")) {
      body.notes = editFormData.notes || null;
    }
    if (editFormData.startTime) {
      body.startTime = new Date(editFormData.startTime).toISOString();
    }
    if (editFormData.estimatedEndTime) {
      body.estimatedEndTime = new Date(editFormData.estimatedEndTime).toISOString();
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
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight gradient-text flex-1">Staff Requirements</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="size-4" />
                Add Requirement
              </Button>
            </DialogTrigger>
            <DialogContent className="border-2 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="size-5 text-primary" />
                  Add New Staff Requirement
                </DialogTitle>
                <DialogDescription>
                  Create a new staffing requirement request.
                </DialogDescription>
              </DialogHeader>
              <CreateStaffForm onSubmit={createReq.mutate} />
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Search by ID or User ID..."
            className="max-w-md border-2"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      <Card className="border-2 shadow-lg glass-effect">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-accent" />
              <span className="text-sm font-semibold">Filter by:</span>
            </div>
            <div className="min-w-[220px]">
              <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
                <SelectTrigger className="border-2"><SelectValue placeholder="Filter by Role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[220px]">
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="border-2"><SelectValue placeholder="Filter by Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="inProgress">In Progress</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="ghost" className="text-muted-foreground gap-2" onClick={() => { setRoleFilter("all"); setStatusFilter("all"); setSearch(""); setPage(1); }}>
              <XCircle className="size-4" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 shadow-lg glass-effect">
        <CardContent>
          <div className="overflow-auto max-h-[600px]">
            <Table>
              <TableHeader>
                <TableRow className="border-muted/50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Role Needed</TableHead>
                  <TableHead className="font-semibold">Quantity</TableHead>
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
                        <Users className="size-4 text-muted-foreground" />
                        <span className="font-mono text-sm text-muted-foreground">#{r.id.slice(0, 8)}...</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge className="capitalize">{r.roleNeeded}</Badge></TableCell>
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
                                Staff Requirement Details
                              </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium text-muted-foreground">ID</span>
                                <span className="font-mono text-sm">#{r.id}</span>
                              </div>
                              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium text-muted-foreground">Role Needed</span>
                                <Badge className="capitalize">{r.roleNeeded}</Badge>
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

                        <Button asChild size="sm" variant="outline" className="gap-1">
                          <Link to={`/requirements/staff/${r.id}/fulfillments`}>
                            <LinkIcon className="size-3" />
                            Fulfillments
                          </Link>
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1"
                          onClick={() => openEditDialog(r)}
                        >
                          <Edit2 className="size-3" />
                          Edit
                        </Button>

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

          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <div className="font-semibold">
              {total === 0
                ? "Showing 0 of 0 results"
                : `Showing ${start + 1} to ${end} of ${total} results`}
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              <div className="px-3 py-1 text-sm font-medium bg-muted rounded-md">{page}</div>
              <Button size="sm" variant="outline" disabled={end >= total} onClick={() => setPage((p) => p + 1)}>
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="border-2 shadow-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="size-5 text-primary" />
              Edit Staff Requirement
            </DialogTitle>
            <DialogDescription>
              Update staff requirement for {editingReq?.roleNeeded} (ID: {editingReq?.id?.slice(0, 8)})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Role Needed</label>
              <Select
                value={editFormData.roleNeeded}
                onValueChange={(value) => setEditFormData({ ...editFormData, roleNeeded: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                min={1}
                value={editFormData.quantity}
                onChange={(e) => setEditFormData({ ...editFormData, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time</label>
              <Input
                type="datetime-local"
                value={editFormData.startTime}
                onChange={(e) => setEditFormData({ ...editFormData, startTime: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estimated End Time</label>
              <Input
                type="datetime-local"
                value={editFormData.estimatedEndTime}
                onChange={(e) => setEditFormData({ ...editFormData, estimatedEndTime: e.target.value })}
              />
            </div>

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

function CreateStaffForm({
  onSubmit,
}: {
  onSubmit: (data: any) => void;
}) {
  const { user } = useAuth();
  const [roleNeeded, setRoleNeeded] = useState("nurse");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [startTime, setStartTime] = useState("");
  const [estimatedEndTime, setEstimatedEndTime] = useState("");

  return (
    <div className="flex flex-col gap-4 py-4">

      <div className="space-y-2">
        <label className="text-sm font-medium">Role Needed *</label>
        <Select value={roleNeeded} onValueChange={setRoleNeeded}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {ROLES.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
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

      <div className="flex justify-end mt-4">
        <Button
            onClick={() => {
            const data: any = {
                primaryUserId: user?.id,
                roleNeeded,
                quantity,
            };
            if (notes) data.notes = notes;
            if (startTime) data.startTime = new Date(startTime).toISOString();
            if (estimatedEndTime) data.estimatedEndTime = new Date(estimatedEndTime).toISOString();
            onSubmit(data);
            }}
            disabled={!user?.id}
        >
            Create Requirement
        </Button>
      </div>
    </div>
  );
}