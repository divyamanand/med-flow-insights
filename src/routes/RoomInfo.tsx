import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { DoorClosed, Users, Edit2, Activity, History, ChevronLeft, Wrench } from "lucide-react";

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

export default function RoomDetails() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* --------------------- Load Room --------------------- */
  const roomQ = useQuery<Room>({
    queryKey: ["room", id],
    queryFn: () => api.get(`/rooms/${id}`),
    enabled: !!id,
  });

  /* ------------------ Local state for status update ------------------ */
  const [status, setStatus] = useState<string>(roomQ.data?.status || "available");

  // Update local status when room data changes
  useEffect(() => {
    if (roomQ.data?.status) {
      setStatus(roomQ.data.status);
    }
  }, [roomQ.data?.status]);

  /* ------------------ Update Status Mutation ------------------ */
  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) => 
      api.put(`/rooms/${id}`, { status: newStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room", id] });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  const handleUpdateStatus = () => {
    if (status !== roomQ.data?.status) {
      updateStatusMutation.mutate(status);
    }
  };

  if (roomQ.isLoading)
    return <div className="flex items-center justify-center p-10"><Spinner className="size-6" /></div>;

  if (roomQ.error)
    return <div className="text-destructive p-6">{(roomQ.error as Error).message}</div>;

  const room = roomQ.data;

  if (!room) return null;

  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-slide-in-bottom">
      {/* Enhanced Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <DoorClosed className="size-4 text-primary" />
          <span className="text-sm font-medium text-primary">Room Information</span>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text">
            {room.name}
          </h1>
          <Button variant="outline" className="gap-2" onClick={() => navigate("/rooms")}>
            <ChevronLeft className="size-4" />
            Back to Rooms
          </Button>
        </div>
      </div>

      {/* Top Grid */}
      <div className="grid sm:grid-cols-2 gap-6">

        {/* LEFT CARD: INFO */}
        <Card className="border-2 shadow-lg glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DoorClosed className="size-5 text-primary" />
              </div>
              Room Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="font-semibold">{room.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Type</p>
                <Badge variant="outline" className="capitalize">{room.type}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Floor</p>
                <span className="font-semibold">Floor {room.floor}</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Capacity</p>
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-muted-foreground" />
                  <span className="font-semibold">{room.capacity}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Current Status</p>
              <Badge 
                variant={
                  room.status === "available" ? "default" : 
                  room.status === "occupied" ? "destructive" : 
                  room.status === "reserved" ? "outline" : 
                  "secondary"
                } 
                className="capitalize"
              >
                {room.status}
              </Badge>
            </div>

            {room.equipment && room.equipment.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Equipment</p>
                <div className="flex flex-wrap gap-2">
                  {room.equipment.map((item) => (
                    <Badge key={item} variant="secondary" className="gap-1">
                      <Wrench className="size-3" />
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {room.notes && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                <p className="text-sm">{room.notes}</p>
              </div>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full gap-2">
                  <Edit2 className="size-4" />
                  Edit Room
                </Button>
              </DialogTrigger>
              <DialogContent className="border-2 shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Edit2 className="size-5 text-primary" />
                    Edit Room
                  </DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">Navigate back to the Rooms page to edit room details.</p>
                <DialogFooter>
                  <Button onClick={() => navigate("/rooms")}>Go to Rooms</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* RIGHT CARD: CHANGE STATUS */}
        <Card className="border-2 shadow-lg glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Activity className="size-5 text-accent" />
              </div>
              Change Room Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={status} onValueChange={setStatus} className="space-y-3">

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="available" id="st1" />
                <Label htmlFor="st1" className="cursor-pointer flex-1 font-medium">Available</Label>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="reserved" id="st2" />
                <Label htmlFor="st2" className="cursor-pointer flex-1 font-medium">Reserved</Label>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="occupied" id="st3" />
                <Label htmlFor="st3" className="cursor-pointer flex-1 font-medium">Occupied</Label>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="maintenance" id="st4" />
                <Label htmlFor="st4" className="cursor-pointer flex-1 font-medium">Maintenance</Label>
              </div>

            </RadioGroup>

            {updateStatusMutation.isError && (
              <div className="text-sm text-destructive">
                Error: {updateStatusMutation.error?.message}
              </div>
            )}

            <Button 
              className="w-full gap-2"
              onClick={handleUpdateStatus}
              disabled={status === room.status || updateStatusMutation.isPending}
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Spinner className="size-4" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit2 className="size-4" />
                  Update Status
                </>
              )}
            </Button>
          </CardContent>
        </Card>

      </div>

      {/* ROOM METADATA */}
      <Card className="border-2 shadow-lg glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-accent/10 rounded-lg">
              <History className="size-5 text-accent" />
            </div>
            Room Metadata
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p className="font-medium">
                {new Date(room.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p className="font-medium">
                {new Date(room.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
