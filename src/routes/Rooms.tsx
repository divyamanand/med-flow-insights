import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableHeader, TableHead, TableRow, TableCell, TableBody } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DoorClosed, Filter, Plus, ChevronLeft, ChevronRight, Edit2, Trash2, X } from "lucide-react";

/* ---------------- Types ---------------- */

type Room = {
  id: string;
  name: string;
  type: "consultation" | "operation" | "ward" | "icu" | "emergency";
  floor: number;
  capacity: number;
  status: "available" | "occupied" | "maintenance" | "reserved";
  equipment: string[];
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type CreateRoomRequest = {
  name: string;
  type: "consultation" | "operation" | "ward" | "icu" | "emergency";
  floor: number;
  capacity: number;
  status?: "available" | "occupied" | "maintenance" | "reserved";
  equipment?: string[];
  notes?: string;
};

type UpdateRoomRequest = {
  name?: string;
  type?: "consultation" | "operation" | "ward" | "icu" | "emergency";
  floor?: number;
  capacity?: number;
  status?: "available" | "occupied" | "maintenance" | "reserved";
  equipment?: string[];
  notes?: string;
};

type DeleteRoomResponse = {
  id: string;
  removed: boolean;
};

/* ---------------- Component ---------------- */

export default function RoomsList() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  /* ---------------------- Filters ---------------------- */
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [floor, setFloor] = useState("");

  /* ---------------------- Pagination ---------------------- */
  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* ---------------------- Dialog State ---------------------- */
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  /* ---------------------- Form State ---------------------- */
  const [formData, setFormData] = useState<CreateRoomRequest>({
    name: "",
    type: "consultation",
    floor: 1,
    capacity: 1,
    status: "available",
    equipment: [],
    notes: "",
  });

  const [equipmentInput, setEquipmentInput] = useState("");

  /* ---------------------- Load Rooms ---------------------- */
  const roomsQ = useQuery<Room[]>({
    queryKey: ["rooms", { type, status, floor }],
    queryFn: () =>
      api.get("/rooms", {
        type: type !== "all" ? type : undefined,
        status: status !== "all" ? status : undefined,
        floor: floor ? parseInt(floor) : undefined,
      }),
  });

  /* ---------------------- Create Room Mutation ---------------------- */
  const createRoomMutation = useMutation<Room, Error, CreateRoomRequest>({
    mutationFn: (data) => api.post("/rooms", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      setCreateDialogOpen(false);
      resetForm();
    },
  });

  /* ---------------------- Update Room Mutation ---------------------- */
  const updateRoomMutation = useMutation<Room, Error, { id: string; data: UpdateRoomRequest }>({
    mutationFn: ({ id, data }) => api.put(`/rooms/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      setEditDialogOpen(false);
      setEditingRoom(null);
      resetForm();
    },
  });

  /* ---------------------- Delete Room Mutation ---------------------- */
  const deleteRoomMutation = useMutation<DeleteRoomResponse, Error, string>({
    mutationFn: (id) => api.delete(`/rooms/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  /* ---------------------- Handlers ---------------------- */
  const resetForm = () => {
    setFormData({
      name: "",
      type: "consultation",
      floor: 1,
      capacity: 1,
      status: "available",
      equipment: [],
      notes: "",
    });
    setEquipmentInput("");
  };

  const handleCreate = () => {
    if (!formData.name.trim()) return;

    const payload: CreateRoomRequest = {
      name: formData.name.trim(),
      type: formData.type,
      floor: formData.floor,
      capacity: formData.capacity,
    };

    if (formData.status) payload.status = formData.status;
    if (formData.equipment && formData.equipment.length > 0) payload.equipment = formData.equipment;
    if (formData.notes?.trim()) payload.notes = formData.notes.trim();

    createRoomMutation.mutate(payload);
  };

  const handleEdit = () => {
    if (!editingRoom) return;

    const payload: UpdateRoomRequest = {};

    if (formData.name?.trim() && formData.name !== editingRoom.name) {
      payload.name = formData.name.trim();
    }
    if (formData.type !== editingRoom.type) payload.type = formData.type;
    if (formData.floor !== editingRoom.floor) payload.floor = formData.floor;
    if (formData.capacity !== editingRoom.capacity) payload.capacity = formData.capacity;
    if (formData.status !== editingRoom.status) payload.status = formData.status;
    if (JSON.stringify(formData.equipment) !== JSON.stringify(editingRoom.equipment)) {
      payload.equipment = formData.equipment;
    }
    if ((formData.notes?.trim() || null) !== editingRoom.notes) {
      payload.notes = formData.notes?.trim() || undefined;
    }

    if (Object.keys(payload).length === 0) {
      setEditDialogOpen(false);
      return;
    }

    updateRoomMutation.mutate({ id: editingRoom.id, data: payload });
  };

  const handleDelete = (room: Room) => {
    if (confirm(`Are you sure you want to delete room "${room.name}"?`)) {
      deleteRoomMutation.mutate(room.id);
    }
  };

  const openEditDialog = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      name: room.name,
      type: room.type,
      floor: room.floor,
      capacity: room.capacity,
      status: room.status,
      equipment: room.equipment || [],
      notes: room.notes || "",
    });
    setEditDialogOpen(true);
  };

  const addEquipment = () => {
    if (equipmentInput.trim() && !formData.equipment?.includes(equipmentInput.trim())) {
      setFormData({
        ...formData,
        equipment: [...(formData.equipment || []), equipmentInput.trim()],
      });
      setEquipmentInput("");
    }
  };

  const removeEquipment = (item: string) => {
    setFormData({
      ...formData,
      equipment: formData.equipment?.filter((e) => e !== item) || [],
    });
  };

  const rows = roomsQ.data ?? [];

  /* ---------------------- Pagination Logic ---------------------- */
  const total = rows.length;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const paged = rows.slice(start, end);

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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* TYPE FILTER */}
            <div className="space-y-2">
              <Label className="font-semibold">Room Type</Label>
              <Select
                value={type}
                onValueChange={(v) => {
                  setType(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="border-2 focus:border-primary">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="operation">Operation</SelectItem>
                  <SelectItem value="ward">Ward</SelectItem>
                  <SelectItem value="icu">ICU</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* STATUS FILTER */}
            <div className="space-y-2">
              <Label className="font-semibold">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => {
                  setStatus(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="border-2 focus:border-primary">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* FLOOR FILTER */}
            <div className="space-y-2">
              <Label className="font-semibold">Floor</Label>
              <Input
                type="number"
                value={floor}
                onChange={(e) => {
                  setFloor(e.target.value);
                  setPage(1);
                }}
                placeholder="Floor number"
                className="border-2 focus:border-primary"
              />
            </div>

            {/* ACTIONS */}
            <div className="space-y-2">
              <Label className="font-semibold opacity-0">Actions</Label>
              <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="gap-2 w-full"
                    onClick={() => resetForm()}
                  >
                    <Plus className="size-4" />
                    Add Room
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Room</DialogTitle>
                    <DialogDescription>Create a new room in the hospital facility.</DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="create-name">Room Name *</Label>
                      <Input
                        id="create-name"
                        placeholder="e.g., Room 101, OR-1"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    {/* Type */}
                    <div className="space-y-2">
                      <Label htmlFor="create-type">Room Type *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, type: value as CreateRoomRequest["type"] })
                        }
                      >
                        <SelectTrigger id="create-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="operation">Operation</SelectItem>
                          <SelectItem value="ward">Ward</SelectItem>
                          <SelectItem value="icu">ICU</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Floor & Capacity */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="create-floor">Floor *</Label>
                        <Input
                          id="create-floor"
                          type="number"
                          min="0"
                          value={formData.floor}
                          onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="create-capacity">Capacity *</Label>
                        <Input
                          id="create-capacity"
                          type="number"
                          min="1"
                          value={formData.capacity}
                          onChange={(e) =>
                            setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })
                          }
                        />
                      </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                      <Label htmlFor="create-status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          setFormData({ ...formData, status: value as CreateRoomRequest["status"] })
                        }
                      >
                        <SelectTrigger id="create-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="occupied">Occupied</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="reserved">Reserved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Equipment */}
                    <div className="space-y-2">
                      <Label>Equipment</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add equipment"
                          value={equipmentInput}
                          onChange={(e) => setEquipmentInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEquipment())}
                        />
                        <Button type="button" onClick={addEquipment} size="sm">
                          <Plus className="size-4" />
                        </Button>
                      </div>
                      {formData.equipment && formData.equipment.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.equipment.map((item) => (
                            <Badge key={item} variant="secondary" className="gap-1">
                              {item}
                              <button
                                type="button"
                                onClick={() => removeEquipment(item)}
                                className="ml-1 hover:text-destructive"
                              >
                                <X className="size-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="create-notes">Notes</Label>
                      <Textarea
                        id="create-notes"
                        placeholder="Optional notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                      />
                    </div>

                    {createRoomMutation.isError && (
                      <div className="text-sm text-destructive">
                        Error: {createRoomMutation.error?.message}
                      </div>
                    )}
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setCreateDialogOpen(false)}
                      disabled={createRoomMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreate}
                      disabled={!formData.name.trim() || createRoomMutation.isPending}
                      className="gap-2"
                    >
                      {createRoomMutation.isPending ? (
                        <>
                          <Spinner className="size-4" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Plus className="size-4" />
                          Create Room
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
            <Badge variant="outline" className="px-3 py-1">
              {total} Rooms
            </Badge>
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
                      <TableHead className="font-bold">Floor</TableHead>
                      <TableHead className="font-bold">Capacity</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="text-right font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paged.map((room) => (
                      <TableRow key={room.id} className="hover:bg-primary/5 transition-colors">
                        <TableCell>
                          <button
                            className="font-semibold text-primary hover:underline text-left"
                            onClick={() => navigate(`/rooms/${room.id}`)}
                          >
                            {room.name}
                          </button>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {room.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">Floor {room.floor}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{room.capacity}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              room.status === "available"
                                ? "default"
                                : room.status === "occupied"
                                ? "destructive"
                                : room.status === "reserved"
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
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-primary hover:bg-primary/10"
                              onClick={() => openEditDialog(room)}
                            >
                              <Edit2 className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleDelete(room)}
                              disabled={deleteRoomMutation.isPending}
                            >
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
                    {total === 0 ? "No rooms found" : `Showing ${start + 1} to ${end} of ${total}`}
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

      {/* Edit Room Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>Update room information for {editingRoom?.name}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="edit-name">Room Name *</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Room 101, OR-1"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="edit-type">Room Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value as CreateRoomRequest["type"] })
                }
              >
                <SelectTrigger id="edit-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consultation</SelectItem>
                  <SelectItem value="operation">Operation</SelectItem>
                  <SelectItem value="ward">Ward</SelectItem>
                  <SelectItem value="icu">ICU</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Floor & Capacity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-floor">Floor *</Label>
                <Input
                  id="edit-floor"
                  type="number"
                  min="0"
                  value={formData.floor}
                  onChange={(e) => setFormData({ ...formData, floor: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-capacity">Capacity *</Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as CreateRoomRequest["status"] })
                }
              >
                <SelectTrigger id="edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="occupied">Occupied</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="reserved">Reserved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Equipment */}
            <div className="space-y-2">
              <Label>Equipment</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add equipment"
                  value={equipmentInput}
                  onChange={(e) => setEquipmentInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEquipment())}
                />
                <Button type="button" onClick={addEquipment} size="sm">
                  <Plus className="size-4" />
                </Button>
              </div>
              {formData.equipment && formData.equipment.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.equipment.map((item) => (
                    <Badge key={item} variant="secondary" className="gap-1">
                      {item}
                      <button
                        type="button"
                        onClick={() => removeEquipment(item)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                placeholder="Optional notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            {updateRoomMutation.isError && (
              <div className="text-sm text-destructive">
                Error: {updateRoomMutation.error?.message}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={updateRoomMutation.isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={updateRoomMutation.isPending} className="gap-2">
              {updateRoomMutation.isPending ? (
                <>
                  <Spinner className="size-4" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit2 className="size-4" />
                  Update Room
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
