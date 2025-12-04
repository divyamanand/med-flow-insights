import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  DoorClosed,
  Plus,
  Edit2,
  CalendarClock,
  CheckCircle2,
  AlertCircle,
  Hash
} from "lucide-react";
import { format } from "date-fns";

/* ---------------- Types ---------------- */

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
};

type Room = {
  id: string;
  name: string;
  type: string;
  status: string;
};

type Fulfillment = {
  id: string;
  requirement: RoomRequirement;
  room: Room;
  startAt: string | null;
  endAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

/* ---------------- Helper: DateTime Local Format ---------------- */
function toLocalISO(isoString: string | null) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  // Format: YYYY-MM-DDThh:mm
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function RoomFulfillments() {
  const { id } = useParams<{ id: string }>(); // Requirement ID
  const queryClient = useQueryClient();

  /* ---------------- Queries ---------------- */
  
  // 1. Fetch the Requirement Details
  const reqQ = useQuery<RoomRequirement>({
    queryKey: ["room-req", id],
    queryFn: async () => {
      const res = await api.get(`/requirements/rooms/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // 2. Fetch the Fulfillments List
  const fulfillQ = useQuery<Fulfillment[]>({
    queryKey: ["room-req-fulfillments", id],
    queryFn: async () => {
      const res = await api.get(`/requirements/rooms/${id}/fulfillments`);
      return res.data;
    },
    enabled: !!id,
  });

  // 3. Fetch Available Rooms (for the Add dropdown)
  // We assume a generic /rooms endpoint exists. 
  const roomsQ = useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await api.get("/rooms");
      return res.data;
    },
  });

  /* ---------------- Mutations ---------------- */

  const createMutation = useMutation({
    mutationFn: async (body: any) => {
      return api.post(`/requirements/rooms/${id}/fulfillments`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room-req-fulfillments", id] });
      queryClient.invalidateQueries({ queryKey: ["room-req", id] }); // Update fulfilled count
      setAddOpen(false);
      resetAddForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ fid, body }: { fid: string; body: any }) => {
      return api.patch(`/requirements/rooms/fulfillments/${fid}`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room-req-fulfillments", id] });
      setEditOpen(false);
      setEditingItem(null);
    },
  });

  /* ---------------- State ---------------- */

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    roomId: "",
    startAt: "",
    endAt: "",
    notes: "",
  });

  const [editOpen, setEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Fulfillment | null>(null);
  const [editForm, setEditForm] = useState({
    startAt: "",
    endAt: "",
    notes: "",
  });

  /* ---------------- Handlers ---------------- */

  const resetAddForm = () => {
    setAddForm({ roomId: "", startAt: "", endAt: "", notes: "" });
  };

  const handleCreate = () => {
    if (!addForm.roomId) return;
    createMutation.mutate({
      roomId: addForm.roomId,
      startAt: addForm.startAt ? new Date(addForm.startAt).toISOString() : null,
      endAt: addForm.endAt ? new Date(addForm.endAt).toISOString() : null,
      notes: addForm.notes || null,
    });
  };

  const openEdit = (item: Fulfillment) => {
    setEditingItem(item);
    setEditForm({
      startAt: toLocalISO(item.startAt),
      endAt: toLocalISO(item.endAt),
      notes: item.notes || "",
    });
    setEditOpen(true);
  };

  const handleUpdate = () => {
    if (!editingItem) return;
    updateMutation.mutate({
      fid: editingItem.id,
      body: {
        startAt: editForm.startAt ? new Date(editForm.startAt).toISOString() : null,
        endAt: editForm.endAt ? new Date(editForm.endAt).toISOString() : null,
        notes: editForm.notes || null,
      },
    });
  };

  /* ---------------- Loading/Error ---------------- */

  if (reqQ.isLoading) return <div className="p-8">Loading requirement...</div>;
  if (reqQ.isError) return <div className="p-8 text-destructive">Error loading requirement.</div>;
  
  const req = reqQ.data;
  const fulfillments = fulfillQ.data || [];
  const rooms = roomsQ.data || [];

  // Filter rooms to match requirement type if desired, or show all
  const filteredRooms = rooms.filter(
    (r) => !req?.roomType || r.type.toLowerCase() === req.roomType.toLowerCase()
  );
  // Fallback to all rooms if filter returns empty (or if types don't match exactly)
  const roomOptions = filteredRooms.length > 0 ? filteredRooms : rooms;

  return (
    <div className="flex flex-col gap-6 p-2 md:p-4 max-w-7xl mx-auto w-full">
      {/* Back Button */}
      <div>
        <Button variant="ghost" asChild className="gap-2 pl-0 hover:pl-2 transition-all">
          <Link to="/requirements/rooms">
            <ArrowLeft className="size-4" />
            Back to Room Requirements
          </Link>
        </Button>
      </div>

      {/* Header Card */}
      <Card className="border-l-4 border-l-primary shadow-md bg-gradient-to-r from-card to-secondary/5">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                Room Requirement
                <Badge variant="outline" className="ml-2 font-mono">#{req?.id.slice(0, 8)}</Badge>
              </CardTitle>
              <CardDescription className="mt-1 flex items-center gap-2">
                Requested by <span className="font-semibold text-foreground">{req?.primaryUserId}</span> on {req?.createdAt && format(new Date(req.createdAt), "PPP")}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
               <Badge className={`text-sm px-3 py-1 capitalize ${
                  req?.status === 'fulfilled' ? 'bg-green-500 hover:bg-green-600' :
                  req?.status === 'cancelled' ? 'bg-red-500 hover:bg-red-600' : 
                  req?.status === 'inProgress' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-secondary text-secondary-foreground'
                }`}>
                  {req?.status === 'inProgress' ? 'In Progress' : req?.status}
               </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-background/50 rounded-lg border">
              <div className="text-sm text-muted-foreground mb-1">Room Type</div>
              <div className="font-semibold text-lg capitalize flex items-center gap-2">
                <DoorClosed className="size-4 text-primary" />
                {req?.roomType}
              </div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg border">
              <div className="text-sm text-muted-foreground mb-1">Requested Qty</div>
              <div className="font-semibold text-lg flex items-center gap-2">
                <AlertCircle className="size-4 text-primary" />
                {req?.quantity}
              </div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg border">
              <div className="text-sm text-muted-foreground mb-1">Fulfilled Qty</div>
              <div className="font-semibold text-lg flex items-center gap-2">
                <CheckCircle2 className={`size-4 ${req?.fulfilledCount && req.fulfilledCount >= (req.quantity || 0) ? "text-green-500" : "text-yellow-500"}`} />
                {req?.fulfilledCount} / {req?.quantity}
              </div>
            </div>
            <div className="p-3 bg-background/50 rounded-lg border">
              <div className="text-sm text-muted-foreground mb-1">Target Start</div>
              <div className="font-medium text-sm flex items-center gap-2 h-7">
                <CalendarClock className="size-4 text-primary" />
                {req?.startTime ? format(new Date(req.startTime), "PP p") : "Not specified"}
              </div>
            </div>
          </div>
          {req?.notes && (
            <div className="mt-4 p-3 bg-muted/30 rounded-lg text-sm border-l-2 border-l-muted-foreground/50">
              <span className="font-semibold mr-2">Note:</span>
              {req.notes}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          Fulfillments
          <Badge variant="secondary" className="rounded-full px-2 text-xs">{fulfillments.length}</Badge>
        </h2>
        
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button disabled={req?.status === 'cancelled' || req?.status === 'fulfilled'}>
              <Plus className="size-4 mr-2" />
              Add Fulfillment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Fulfillment</DialogTitle>
              <DialogDescription>
                Assign a room to fulfill this requirement.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Room</label>
                <Select
                  value={addForm.roomId}
                  onValueChange={(v) => setAddForm({ ...addForm, roomId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room..." />
                  </SelectTrigger>
                  <SelectContent>
                    {roomOptions.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                         {r.name} <span className="text-muted-foreground text-xs ml-2">({r.type})</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Start At</label>
                  <Input 
                    type="datetime-local" 
                    value={addForm.startAt} 
                    onChange={(e) => setAddForm({...addForm, startAt: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">End At</label>
                  <Input 
                    type="datetime-local" 
                    value={addForm.endAt} 
                    onChange={(e) => setAddForm({...addForm, endAt: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea 
                  placeholder="Optional notes..."
                  value={addForm.notes}
                  onChange={(e) => setAddForm({...addForm, notes: e.target.value})}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending || !addForm.roomId}>
                {createMutation.isPending ? "Assigning..." : "Assign Room"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Fulfillments Table */}
      <Card className="shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Time Range</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fulfillments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No rooms assigned yet. Click "Add Fulfillment" to start.
                  </TableCell>
                </TableRow>
              ) : (
                fulfillments.map((f) => (
                  <TableRow key={f.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {f.id.slice(0, 4)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium flex items-center gap-2">
                        <DoorClosed className="size-4 text-muted-foreground" />
                        {f.room?.name || "Unknown Room"}
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">{f.room?.type}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-green-600 w-8">START</span>
                          {f.startAt ? format(new Date(f.startAt), "PP p") : <span className="text-muted-foreground">—</span>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-red-500 w-8">END</span>
                          {f.endAt ? format(new Date(f.endAt), "PP p") : <span className="text-muted-foreground">—</span>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground">
                      {f.notes || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(f)}>
                        <Edit2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Fulfillment</DialogTitle>
            <DialogDescription>
              Update timing or notes for {editingItem?.room?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Start At</label>
                <Input 
                  type="datetime-local" 
                  value={editForm.startAt} 
                  onChange={(e) => setEditForm({...editForm, startAt: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">End At</label>
                <Input 
                  type="datetime-local" 
                  value={editForm.endAt} 
                  onChange={(e) => setEditForm({...editForm, endAt: e.target.value})}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea 
                placeholder="Optional notes..."
                value={editForm.notes}
                onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}