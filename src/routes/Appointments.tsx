import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { CalendarDays, CalendarCheck, Plus, Filter, Search as SearchIcon, Sparkles, Clock, User, UserRound, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

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
        timeframe,
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
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="size-4" />
                  Add Appointment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Appointment (Demo)</DialogTitle>
                  <DialogDescription>
                    Create a new appointment for a patient.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button>Save (Demo)</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                          <RowActions />
                        </TableCell>
                      </TableRow>
                    ))}
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

function RowActions() {
  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            View
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Appointment (Demo)</DialogTitle>
            <DialogDescription>
              View appointment details and information.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Appointment (Demo)</DialogTitle>
            <DialogDescription>
              Modify the appointment details below.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            Delete
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Appointment (Demo)</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost">Cancel</Button>
            <Button variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
