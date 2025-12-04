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
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Filter, Eye, CheckCircle, XCircle, Link as LinkIcon, ChevronLeft, ChevronRight, Edit2 } from "lucide-react";

type ItemRequirement = {
  id: string;
  primaryUserId: string;
  kind: "equipment" | "blood";
  quantity: number;
  fulfilledCount: number;
  startTime: string | null;
  estimatedEndTime: string | null;
  status: "open" | "inProgress" | "fulfilled" | "cancelled";
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

const KIND_OPTIONS = ["equipment", "blood"];

export default function ItemRequirementsManagement() {
  const queryClient = useQueryClient();

  const [filterKind, setFilterKind] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterUser, setFilterUser] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingReq, setEditingReq] = useState<ItemRequirement | null>(null);
  const [editFormData, setEditFormData] = useState({
    status: "open" as "open" | "inProgress" | "fulfilled" | "cancelled",
    quantity: 1,
    notes: "",
    startTime: "",
    estimatedEndTime: "",
  });

  const reqQ = useQuery<ItemRequirement[]>({
    queryKey: ["item-reqs"],
    queryFn: async () => {
        const res = await api.get("/requirements/items");
        return res.data;
    },
    staleTime: 30000,
  });

  const createReq = useMutation<ItemRequirement, Error, {
    primaryUserId: string;
    kind: "equipment" | "blood";
    quantity: number;
    notes?: string | null;
    startTime?: string | null;
    estimatedEndTime?: string | null;
  }>({
    mutationFn: async (body) => {
        const res = await api.post("/requirements/items", body);
        return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["item-reqs"] }),
  });

  const updateReq = useMutation<ItemRequirement, Error, {
    id: string;
    body: {
      status?: "open" | "inProgress" | "fulfilled" | "cancelled";
      notes?: string | null;
      quantity?: number;
      startTime?: string | null;
      estimatedEndTime?: string | null;
    };
  }>({
    mutationFn: async ({ id, body }) => {
        const res = await api.patch(`/requirements/items/${id}`, body);
        return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["item-reqs"] }),
  });

  const filtered = useMemo(() => {
    const rawData = reqQ.data;
    let data = Array.isArray(rawData) ? rawData : [];

    if (filterKind !== "all") data = data.filter((r) => r.kind === filterKind);
    if (filterStatus !== "all") data = data.filter((r) => r.status === filterStatus);

    if (filterUser.trim())
      data = data.filter((r) =>
        r.primaryUserId.toLowerCase().includes(filterUser.toLowerCase())
      );

    return data;
  }, [reqQ.data, filterKind, filterStatus, filterUser]);

  const start = (page - 1) * rowsPerPage;
  const end = Math.min(start + rowsPerPage, filtered.length);
  const rows = Array.isArray(filtered) ? filtered.slice(start, end) : [];

  function resetFilters() {
    setFilterKind("all");
    setFilterStatus("all");
    setFilterUser("");
    setPage(1);
  }

  const openEditDialog = (req: ItemRequirement) => {
    setEditingReq(req);
    setEditFormData({
      status: req.status,
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
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight gradient-text flex-1">
          Item Requirements
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Package className="size-4" />
              Add Requirement
            </Button>
          </DialogTrigger>
          <DialogContent className="border-2 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="size-5 text-primary" />
                Create Item Requirement
              </DialogTitle>
              <DialogDescription>
                Create a new item requirement for equipment or blood supplies.
              </DialogDescription>
            </DialogHeader>
            <CreateItemForm onSubmit={createReq.mutate} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <Card className="border-2 shadow-lg glass-effect h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Filter className="size-5 text-accent" />
              </div>
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="font-semibold mb-3">Kind</p>
              <RadioGroup
                value={filterKind}
                onValueChange={setFilterKind}
                className="space-y-2"
              >
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="all" id="kind-all" />
                  <Label htmlFor="kind-all" className="cursor-pointer flex-1">All</Label>
                </div>
                {KIND_OPTIONS.map((k) => (
                  <div key={k} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={k} id={`kind-${k}`} />
                    <Label htmlFor={`kind-${k}`} className="cursor-pointer flex-1 capitalize">{k}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <p className="font-semibold mb-3">Status</p>
              <RadioGroup
                value={filterStatus}
                onValueChange={setFilterStatus}
                className="space-y-2"
              >
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="all" id="st-all" />
                  <Label htmlFor="st-all" className="cursor-pointer flex-1">All</Label>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="open" id="st-open" />
                  <Label htmlFor="st-open" className="cursor-pointer flex-1">Open</Label>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="inProgress" id="st-inp" />
                  <Label htmlFor="st-inp" className="cursor-pointer flex-1">In Progress</Label>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="fulfilled" id="st-ful" />
                  <Label htmlFor="st-ful" className="cursor-pointer flex-1">Fulfilled</Label>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="cancelled" id="st-cancel" />
                  <Label htmlFor="st-cancel" className="cursor-pointer flex-1">Cancelled</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <p className="font-semibold mb-3">Requested By</p>
              <Input
                placeholder="Search user..."
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="border-2"
              />
            </div>

            <div className="flex gap-2">
              <Button className="w-full gap-2">
                <Filter className="size-4" />
                Apply
              </Button>
              <Button variant="outline" className="w-full" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="size-5 text-primary" />
              </div>
              Current Item Requirements
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="overflow-auto max-h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-muted/50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Quantity</TableHead>
                    <TableHead className="font-semibold">Fulfilled</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Requested By</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/50 transition-colors border-muted/30">
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-muted-foreground">#{r.id.slice(0, 8)}...</span>
                          <Badge variant="secondary" className="capitalize">{r.kind}</Badge>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{r.quantity}</Badge></TableCell>
                      <TableCell><Badge variant="outline">{r.fulfilledCount}</Badge></TableCell>
                      <TableCell>
                        {r.status === "fulfilled" && <Badge variant="default">Completed</Badge>}
                        {r.status === "inProgress" && <Badge variant="secondary">In Progress</Badge>}
                        {r.status === "open" && <Badge variant="outline">Pending</Badge>}
                        {r.status === "cancelled" && <Badge variant="destructive">Cancelled</Badge>}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.primaryUserId}</TableCell>

                      <TableCell className="text-right space-x-2">
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
                                Item Requirement Details
                              </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium text-muted-foreground">ID</span>
                                <span className="font-mono text-sm">#{r.id}</span>
                              </div>
                              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium text-muted-foreground">Kind</span>
                                <Badge className="capitalize">{r.kind}</Badge>
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
                          <Link to={`/requirements/items/${r.id}/fulfillments`}>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between mt-4 text-sm">
              <p className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filtered.length > 0 ? start + 1 : 0}</span> to <span className="font-semibold text-foreground">{end}</span> of <span className="font-semibold text-foreground">{filtered.length}</span> results
              </p>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)} className="gap-1">
                  <ChevronLeft className="size-4" />
                  Previous
                </Button>
                <div className="px-3 py-1 bg-muted rounded-md font-medium">{page}</div>
                <Button variant="outline" size="sm" disabled={end >= filtered.length} onClick={() => setPage(page + 1)} className="gap-1">
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="border-2 shadow-2xl max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit2 className="size-5 text-primary" />
              Edit Item Requirement
            </DialogTitle>
            <DialogDescription>
              Update item requirement details for {editingReq?.kind} (ID: {editingReq?.id?.slice(0, 8)})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editFormData.status}
                onValueChange={(value: any) => setEditFormData({ ...editFormData, status: value })}
              >
                <SelectTrigger id="edit-status">
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
              <Label htmlFor="edit-quantity">Quantity</Label>
              <Input
                id="edit-quantity"
                type="number"
                min={1}
                value={editFormData.quantity}
                onChange={(e) => setEditFormData({ ...editFormData, quantity: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-startTime">Start Time</Label>
              <Input
                id="edit-startTime"
                type="datetime-local"
                value={editFormData.startTime}
                onChange={(e) => setEditFormData({ ...editFormData, startTime: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-estimatedEndTime">Estimated End Time</Label>
              <Input
                id="edit-estimatedEndTime"
                type="datetime-local"
                value={editFormData.estimatedEndTime}
                onChange={(e) => setEditFormData({ ...editFormData, estimatedEndTime: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
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

function CreateItemForm({
  onSubmit,
}: {
  onSubmit: (data: any) => void;
}) {
  const { user } = useAuth();
  const [kind, setKind] = useState<"equipment" | "blood">("equipment");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [startTime, setStartTime] = useState("");
  const [estimatedEndTime, setEstimatedEndTime] = useState("");

  return (
    <div className="flex flex-col gap-4 py-2">
      <div className="space-y-2">
        <Label>Kind *</Label>
        <RadioGroup
          value={kind}
          onValueChange={(v: any) => setKind(v)}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="equipment" id="kind-eq" />
            <Label htmlFor="kind-eq">Equipment</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="blood" id="kind-blood" />
            <Label htmlFor="kind-blood">Blood</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label>Quantity *</Label>
        <Input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label>Start Time (Optional)</Label>
        <Input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Estimated End Time (Optional)</Label>
        <Input
          type="datetime-local"
          value={estimatedEndTime}
          onChange={(e) => setEstimatedEndTime(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Notes (Optional)</Label>
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
                kind,
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