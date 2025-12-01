import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";

import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarDays, CalendarCheck, Plus, Filter, Search as SearchIcon, Sparkles, Clock, User, UserRound, XCircle, ChevronLeft, ChevronRight, AlertCircle, Stethoscope, Calendar } from "lucide-react";

/* ---------------- Types ---------------- */

type Appointment = {
  id: string;
  patientId: string;
  doctorId: string;

  patientName: string;
  doctorName: string;

  startAt: string;
  endAt: string;
  status: string;
  issues?: string | null;

  createdAt: string;
  updatedAt: string;
};

const statusOptions = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
  "rescheduled",
] as const;

/* ------------------------------------------------ */

export default function AppointmentsList() {
  /* ------------ Filters -------------- */
  const [doctorId, setDoctorId] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [timeframe, setTimeframe] = useState<"day" | "month" | "year">("day");

  /* ------------ Pagination ------------ */
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  /* ------------ Single API Call ------------ */

  const apptsQ = useQuery<Appointment[]>({
    queryKey: [
      "appointments",
      { doctorId, patientSearch, status, from, timeframe },
    ],
    queryFn: () =>
      api.get<Appointment[]>("/appointments", {
        doctorId: doctorId || undefined,
        status: status || undefined,
        search: patientSearch || undefined,
        from: from || undefined,
        timeframe: from ? timeframe : undefined,
      }),
  });

  /* ------------ Pagination Logic ------------ */

  const rows = apptsQ.data ?? [];
  const total = rows.length;
  const pageCount = Math.max(1, Math.ceil(total / rowsPerPage));
  const pageSafe = Math.min(page, pageCount);

  const start = (pageSafe - 1) * rowsPerPage;
  const end = Math.min(start + rowsPerPage, total);
  const paged = rows.slice(start, end);

  /* ------------ UI ------------ */

  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-slide-in-bottom">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <CalendarDays className="size-4 text-primary" />
            <span className="text-sm font-medium text-primary">Appointments</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text">
            Appointment Management
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Schedule, track, and manage patient appointments
          </p>
        </div>
      </div>

      {/* Modern Filters Card */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="size-5 text-primary" />
              <CardTitle>Filters & Search</CardTitle>
            </div>
            <Badge variant="outline" className="px-3 py-1">{total} Total</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {/* Doctor Filter */}
            <div className="space-y-2">
              <Label className="font-semibold">Doctor ID</Label>
              <Input
                placeholder="Enter Doctor ID..."
                value={doctorId}
                onChange={(e) => {
                  setDoctorId(e.target.value);
                  setPage(1);
                }}
                className="border-2 focus:border-primary transition-colors"
              />
            </div>

            {/* Patient Search */}
            <div className="space-y-2">
              <Label className="font-semibold">Patient Search</Label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search patient..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  onBlur={() => setPage(1)}
                  className="pl-10 border-2 focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="font-semibold">Status</Label>
              <Select
                value={status || "all"}
                onValueChange={(v) => {
                  setStatus(v === "all" ? "" : v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="border-2 focus:border-primary">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <Label className="font-semibold">Date</Label>
              <Input
                type="date"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setPage(1);
                }}
                className="border-2 focus:border-primary transition-colors"
              />
            </div>

            {/* Timeframe */}
            <div className="space-y-2">
              <Label className="font-semibold">Timeframe</Label>
              <ToggleGroup
                type="single"
                value={timeframe}
                onValueChange={(v) => v && setTimeframe(v as any)}
                className="justify-start border-2 border-border rounded-lg p-1"
              >
                <ToggleGroupItem value="day" className="capitalize">Day</ToggleGroupItem>
                <ToggleGroupItem value="month" className="capitalize">Month</ToggleGroupItem>
                <ToggleGroupItem value="year" className="capitalize">Year</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {/* Add New Button */}
          <div className="flex justify-end pt-2">
            <CreateAppointmentDialog />
          </div>
        </CardContent>
      </Card>

      {/* Modern Appointments Table */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
          <div className="flex items-center gap-2">
            <CalendarCheck className="size-5 text-primary" />
            <CardTitle>Appointments List</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {apptsQ.isLoading ? (
            <div className="flex items-center justify-center gap-3 p-12">
              <Spinner className="size-6 text-primary" />
              <span className="text-lg font-medium">Loading appointments...</span>
            </div>
          ) : apptsQ.error ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
                <XCircle className="size-5 text-destructive" />
                <span className="text-destructive font-medium">
                  {(apptsQ.error as Error).message}
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-bold">Patient</TableHead>
                      <TableHead className="font-bold">Doctor</TableHead>
                      <TableHead className="font-bold">Start Time</TableHead>
                      <TableHead className="font-bold">End Time</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                      <TableHead className="font-bold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paged.map((a) => (
                      <TableRow key={a.id} className="hover:bg-primary/5 transition-colors">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="size-4 text-primary" />
                            </div>
                            {a.patientName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="size-8 rounded-full bg-accent/10 flex items-center justify-center">
                              <UserRound className="size-4 text-accent" />
                            </div>
                            {a.doctorName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="size-4 text-muted-foreground" />
                            <span className="text-sm">{format(parseISO(a.startAt), "PP p")}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="size-4 text-muted-foreground" />
                            <span className="text-sm">{format(parseISO(a.endAt), "PP p")}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              a.status === "scheduled"
                                ? "default"
                                : a.status === "completed"
                                ? "outline"
                                : "secondary"
                            }
                            className="capitalize"
                          >
                            {a.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <RowActions appointment={a} />
                        </TableCell>
                      </TableRow>
                    ))}
                    {paged.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <CalendarDays className="size-12 opacity-20" />
                            <p className="text-lg font-medium">No appointments found</p>
                            <p className="text-sm">Try adjusting your filters or create a new appointment</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Modern Pagination */}
              <div className="border-t border-border/50 bg-muted/20 px-6 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Rows per page:</span>
                    <Select
                      value={String(rowsPerPage)}
                      onValueChange={(v) => {
                        setRowsPerPage(Number(v));
                        setPage(1);
                      }}
                    >
                      <SelectTrigger className="w-20 h-9 border-2 focus:border-primary">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[10, 20, 50].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">
                      {total ? `${start + 1}–${end} of ${total}` : "0 of 0"}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pageSafe <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="border-2"
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, pageCount) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <Button
                              key={pageNum}
                              variant={pageSafe === pageNum ? "default" : "ghost"}
                              size="sm"
                              onClick={() => setPage(pageNum)}
                              className="w-9"
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pageSafe >= pageCount}
                        onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                        className="border-2"
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------- Misc Components ------------------- */

function RowActions({ appointment }: { appointment: Appointment }) {
  return (
    <div className="flex items-center gap-2">
      <ViewAppointmentDialog appointment={appointment} />
      <EditAppointmentDialog appointment={appointment} />
      <DeleteAppointmentDialog appointment={appointment} />
    </div>
  );
}

function ViewAppointmentDialog({ appointment }: { appointment: Appointment }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarCheck className="size-5 text-primary" />
            Appointment Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Patient</Label>
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                <User className="size-4 text-primary" />
                <span className="font-medium">{appointment.patientName}</span>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Doctor</Label>
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                <UserRound className="size-4 text-accent" />
                <span className="font-medium">{appointment.doctorName}</span>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Start Time</Label>
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                <Clock className="size-4" />
                <span className="text-sm">{format(parseISO(appointment.startAt), "PPp")}</span>
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">End Time</Label>
              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                <Clock className="size-4" />
                <span className="text-sm">{format(parseISO(appointment.endAt), "PPp")}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Status</Label>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  appointment.status === "scheduled"
                    ? "default"
                    : appointment.status === "completed"
                    ? "outline"
                    : "secondary"
                }
                className="capitalize"
              >
                {appointment.status}
              </Badge>
            </div>
          </div>

          {appointment.issues && (
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Health Issues</Label>
              <div className="p-3 bg-muted/50 rounded text-sm">
                {appointment.issues}
              </div>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Created:</span> {format(parseISO(appointment.createdAt), "PPp")}
            </div>
            <div>
              <span className="font-medium">Updated:</span> {format(parseISO(appointment.updatedAt), "PPp")}
            </div>
          </div>

          {/* Status Transition Buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            <StatusTransitionButtons appointment={appointment} onSuccess={() => setOpen(false)} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditAppointmentDialog({ appointment }: { appointment: Appointment }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  
  const [status, setStatus] = useState(appointment.status);
  const [startAt, setStartAt] = useState(appointment.startAt.slice(0, 16));
  const [endAt, setEndAt] = useState(appointment.endAt.slice(0, 16));
  const [issuesText, setIssuesText] = useState(appointment.issues || "");

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.put(`/appointments/${appointment.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: any = {
      status,
      startAt: new Date(startAt).toISOString(),
      endAt: new Date(endAt).toISOString(),
    };

    if (issuesText.trim()) {
      payload.issues = issuesText.trim();
    }

    updateMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarCheck className="size-5 text-primary" />
            Edit Appointment
          </DialogTitle>
          <DialogDescription>
            Modify the appointment details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          {updateMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                {(updateMutation.error as any)?.response?.data?.message ||
                  (updateMutation.error as Error)?.message ||
                  "Failed to update appointment"}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label className="font-semibold">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s} className="capitalize">
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="font-semibold">Start Time</Label>
              <Input
                type="datetime-local"
                className="border-2"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="font-semibold">End Time</Label>
              <Input
                type="datetime-local"
                className="border-2"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-semibold">Issues / Health Concerns</Label>
            <Textarea
              className="border-2 min-h-[80px]"
              value={issuesText}
              onChange={(e) => setIssuesText(e.target.value)}
              placeholder="Health concerns or issues"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? (
                <>
                  <Spinner className="size-4" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteAppointmentDialog({ appointment }: { appointment: Appointment }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  const cancelMutation = useMutation({
    mutationFn: async () => {
      if (reason.trim()) {
        return api.post(`/appointments/${appointment.id}/cancel`, { reason });
      }
      return api.delete(`/appointments/${appointment.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          Cancel
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="size-5 text-destructive" />
            Cancel Appointment
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this appointment? This action will update the status to cancelled.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {cancelMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                {(cancelMutation.error as any)?.response?.data?.message ||
                  (cancelMutation.error as Error)?.message ||
                  "Failed to cancel appointment"}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label className="font-semibold">Cancellation Reason (Optional)</Label>
            <Textarea
              className="border-2 min-h-[80px]"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for cancellation..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={cancelMutation.isPending}
          >
            Keep Appointment
          </Button>
          <Button
            variant="destructive"
            onClick={() => cancelMutation.mutate()}
            disabled={cancelMutation.isPending}
          >
            {cancelMutation.isPending ? (
              <>
                <Spinner className="size-4" />
                Cancelling...
              </>
            ) : (
              "Cancel Appointment"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatusTransitionButtons({ appointment, onSuccess }: { appointment: Appointment; onSuccess?: () => void }) {
  const queryClient = useQueryClient();

  const transitionMutation = useMutation({
    mutationFn: async (action: string) => {
      return api.post(`/appointments/${appointment.id}/${action}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      onSuccess?.();
    },
  });

  const canConfirm = appointment.status === "scheduled";
  const canCheckin = appointment.status === "confirmed";
  const canComplete = appointment.status === "confirmed" || appointment.status === "scheduled";

  return (
    <>
      {canConfirm && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => transitionMutation.mutate("confirm")}
          disabled={transitionMutation.isPending}
          className="gap-1"
        >
          {transitionMutation.isPending ? <Spinner className="size-3" /> : <CalendarCheck className="size-3" />}
          Confirm
        </Button>
      )}
      {canCheckin && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => transitionMutation.mutate("checkin")}
          disabled={transitionMutation.isPending}
          className="gap-1"
        >
          {transitionMutation.isPending ? <Spinner className="size-3" /> : <User className="size-3" />}
          Check In
        </Button>
      )}
      {canComplete && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => transitionMutation.mutate("complete")}
          disabled={transitionMutation.isPending}
          className="gap-1"
        >
          {transitionMutation.isPending ? <Spinner className="size-3" /> : <CalendarCheck className="size-3" />}
          Mark Complete
        </Button>
      )}
    </>
  );
}

/* ------------------- Create Appointment Component ------------------- */

type MatchingDoctor = {
  doctorId: string;
  score: number;
  specialties: Array<{ id: string; name: string }>;
};

type TimeSlot = {
  startDatetime: string;
  endDatetime: string;
  slotDurationMinutes: number;
};

function CreateAppointmentDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  
  // Step 1: Choose booking method
  const [bookingMethod, setBookingMethod] = useState<"issues" | "doctor" | null>(null);
  
  // Step 2: Issues-based flow
  const [issuesText, setIssuesText] = useState("");
  const [matchingDoctors, setMatchingDoctors] = useState<MatchingDoctor[]>([]);
  
  // Step 3: Doctor selection
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  
  // Step 4: Date selection for slots
  const [selectedDate, setSelectedDate] = useState("");
  
  // Step 5: Slot selection
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  
  // Step 6: Patient ID (optional)
  const [patientId, setPatientId] = useState("");

  // Find matching doctors mutation
  const findDoctorsMut = useMutation({
    mutationFn: async (issues: string[]) => {
      return api.post<MatchingDoctor[]>("/appointments/findMatchingDoctorsForIssues", { issues });
    },
    onSuccess: (data) => {
      setMatchingDoctors(data);
    },
  });

  // Fetch available slots query
  const slotsQuery = useQuery<TimeSlot[]>({
    queryKey: ["appointments", "slots", selectedDoctorId, selectedDate],
    queryFn: () => 
      api.get<TimeSlot[]>(`/appointments/doctor/${selectedDoctorId}/next3Slots`, {
        date: selectedDate || undefined,
      }),
    enabled: !!selectedDoctorId && bookingMethod !== null,
  });

  // Create appointment mutation
  const createMutation = useMutation({
    mutationFn: async (data: {
      patientId?: string;
      doctorId?: string;
      startAt: string;
      endAt: string;
      issues?: string[];
    }) => {
      return api.post("/appointments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      handleReset();
      setOpen(false);
    },
  });

  const handleFindDoctors = () => {
    const issues = issuesText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    
    if (issues.length === 0) return;
    findDoctorsMut.mutate(issues);
  };

  const handleBookAppointment = () => {
    if (!selectedSlot) return;

    const issues = issuesText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const payload: {
      patientId?: string;
      doctorId?: string;
      startAt: string;
      endAt: string;
      issues?: string[];
    } = {
      startAt: selectedSlot.startDatetime,
      endAt: selectedSlot.endDatetime,
    };

    if (patientId) payload.patientId = patientId;
    if (selectedDoctorId) payload.doctorId = selectedDoctorId;
    if (issues.length > 0) payload.issues = issues;

    createMutation.mutate(payload);
  };

  const handleReset = () => {
    setBookingMethod(null);
    setIssuesText("");
    setMatchingDoctors([]);
    setSelectedDoctorId("");
    setSelectedDate("");
    setSelectedSlot(null);
    setPatientId("");
  };

  const handleBack = () => {
    if (selectedSlot) {
      setSelectedSlot(null);
    } else if (selectedDoctorId && slotsQuery.data) {
      setSelectedDoctorId("");
      setSelectedDate("");
    } else if (matchingDoctors.length > 0) {
      setMatchingDoctors([]);
    } else {
      setBookingMethod(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) handleReset();
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Add Appointment
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarDays className="size-5 text-primary" />
            Book New Appointment
          </DialogTitle>
          <DialogDescription>
            {!bookingMethod && "Choose how you'd like to book an appointment"}
            {bookingMethod === "issues" && !matchingDoctors.length && "Tell us your health concerns"}
            {bookingMethod === "issues" && matchingDoctors.length > 0 && !selectedDoctorId && "Choose a doctor from recommendations"}
            {bookingMethod === "doctor" && !selectedDoctorId && "Enter doctor ID directly"}
            {selectedDoctorId && !selectedSlot && "Select an available time slot"}
            {selectedSlot && "Confirm appointment details"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Error Display */}
          {(findDoctorsMut.isError || createMutation.isError) && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>
                {(findDoctorsMut.error as any)?.response?.data?.message ||
                  (createMutation.error as any)?.response?.data?.message ||
                  (findDoctorsMut.error as Error)?.message ||
                  (createMutation.error as Error)?.message ||
                  "An error occurred"}
              </AlertDescription>
            </Alert>
          )}

          {/* Step 1: Choose Booking Method */}
          {!bookingMethod && (
            <div className="grid gap-3">
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2 hover:border-primary hover:bg-primary/5"
                onClick={() => setBookingMethod("issues")}
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="size-5 text-primary" />
                  <span className="font-semibold text-lg">Tell Us Your Issues</span>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Describe your health concerns and we'll find the best matching doctors for you
                </p>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2 hover:border-primary hover:bg-primary/5"
                onClick={() => setBookingMethod("doctor")}
              >
                <div className="flex items-center gap-2">
                  <Stethoscope className="size-5 text-primary" />
                  <span className="font-semibold text-lg">Search Doctor</span>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  Already know which doctor? Enter their ID directly
                </p>
              </Button>
            </div>
          )}

          {/* Step 2a: Issues Input (AI Matching) */}
          {bookingMethod === "issues" && matchingDoctors.length === 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold">Health Concerns / Issues</Label>
                <Textarea
                  className="border-2 min-h-[120px]"
                  value={issuesText}
                  onChange={(e) => setIssuesText(e.target.value)}
                  placeholder="Enter your health concerns (one per line)&#10;e.g.,&#10;Persistent headache&#10;High blood pressure&#10;Chest pain"
                />
                <p className="text-xs text-muted-foreground">
                  Enter one issue per line. We'll match you with the best doctors.
                </p>
              </div>

              <Button
                onClick={handleFindDoctors}
                disabled={!issuesText.trim() || findDoctorsMut.isPending}
                className="w-full gap-2"
              >
                {findDoctorsMut.isPending ? (
                  <>
                    <Spinner className="size-4" />
                    Finding Doctors...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Find Matching Doctors
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Step 2b: Matching Doctors List */}
          {bookingMethod === "issues" && matchingDoctors.length > 0 && !selectedDoctorId && (
            <div className="space-y-3">
              <Label className="font-semibold">Recommended Doctors</Label>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {matchingDoctors.map((doc) => (
                  <button
                    key={doc.doctorId}
                    onClick={() => setSelectedDoctorId(doc.doctorId)}
                    className="w-full p-3 border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="size-4 text-primary" />
                        <span className="font-medium">Doctor ID: {doc.doctorId.slice(0, 8)}...</span>
                      </div>
                      <Badge variant="outline">Match: {(doc.score * 100).toFixed(0)}%</Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {doc.specialties.map((spec) => (
                        <Badge key={spec.id} variant="secondary" className="text-xs">
                          {spec.name}
                        </Badge>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2c: Direct Doctor ID Input */}
          {bookingMethod === "doctor" && !selectedDoctorId && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold">Doctor ID</Label>
                <Input
                  className="border-2"
                  placeholder="Enter doctor ID"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const value = (e.target as HTMLInputElement).value;
                      if (value.trim()) setSelectedDoctorId(value.trim());
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Press Enter after typing the doctor ID
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Date Selection + Available Slots */}
          {selectedDoctorId && !selectedSlot && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="font-semibold">Select Date (Optional)</Label>
                <Input
                  type="date"
                  className="border-2"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to see next available slots
                </p>
              </div>

              {slotsQuery.isLoading && (
                <div className="flex items-center gap-2 justify-center py-4">
                  <Spinner className="size-4" />
                  <span className="text-sm">Loading available slots...</span>
                </div>
              )}

              {slotsQuery.data && slotsQuery.data.length === 0 && (
                <Alert>
                  <AlertCircle className="size-4" />
                  <AlertDescription>
                    No available slots found. Try selecting a different date.
                  </AlertDescription>
                </Alert>
              )}

              {slotsQuery.data && slotsQuery.data.length > 0 && (
                <div className="space-y-2">
                  <Label className="font-semibold">Available Time Slots</Label>
                  <div className="space-y-2">
                    {slotsQuery.data.map((slot, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSlot(slot)}
                        className="w-full p-3 border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="size-4 text-primary" />
                            <span className="font-medium">
                              {format(parseISO(slot.startDatetime), "PPp")}
                            </span>
                          </div>
                          <Badge variant="outline">{slot.slotDurationMinutes} min</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ends at {format(parseISO(slot.endDatetime), "p")}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirmation + Patient ID */}
          {selectedSlot && (
            <div className="space-y-4">
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
                <Label className="font-semibold">Selected Slot</Label>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  <span className="text-sm">
                    {format(parseISO(selectedSlot.startDatetime), "PPp")} - {format(parseISO(selectedSlot.endDatetime), "p")}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">
                  Patient ID
                  <span className="text-xs text-muted-foreground ml-2">
                    (Optional - leave empty to book for yourself)
                  </span>
                </Label>
                <Input
                  className="border-2"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="Enter patient ID or leave empty"
                />
              </div>

              <Button
                onClick={handleBookAppointment}
                disabled={createMutation.isPending}
                className="w-full gap-2"
              >
                {createMutation.isPending ? (
                  <>
                    <Spinner className="size-4" />
                    Booking...
                  </>
                ) : (
                  <>
                    <CalendarCheck className="size-4" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          {bookingMethod && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={findDoctorsMut.isPending || createMutation.isPending}
            >
              Back
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            disabled={findDoctorsMut.isPending || createMutation.isPending}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
