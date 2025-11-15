import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { Label } from "@/components/ui/label";

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
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-md bg-primary/10" />
          <div className="text-lg font-semibold">Appointments List</div>
        </div>
        <Avatar>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-[200px_1fr_180px_180px_auto_auto] sm:items-end">
            {/* Doctor Filter */}
            <div>
              <Label>Doctor</Label>
              <Input
                placeholder="Doctor ID (optional)"
                value={doctorId}
                onChange={(e) => {
                  setDoctorId(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Patient Search */}
            <div>
              <Label>Patient</Label>
              <Input
                placeholder="Search patient..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                onBlur={() => setPage(1)}
              />
            </div>

            {/* Status */}
            <div>
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => {
                  setStatus(v === status ? "" : v);
                  setPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            {/* Timeframe */}
            <div className="min-w-40">
              <Label>Timeframe</Label>
              <ToggleGroup
                type="single"
                value={timeframe}
                onValueChange={(v) => v && setTimeframe(v as any)}
              >
                <ToggleGroupItem value="day">day</ToggleGroupItem>
                <ToggleGroupItem value="month">month</ToggleGroupItem>
                <ToggleGroupItem value="year">year</ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Add New */}
            <div className="justify-self-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>+ Add New</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Appointment (Demo)</DialogTitle>
                  </DialogHeader>
                  <DialogFooter>
                    <Button>Save (Demo)</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments</CardTitle>
        </CardHeader>

        <CardContent>
          {apptsQ.isLoading ? (
            <div className="flex items-center gap-2">
              <Spinner className="size-5" /> Loading…
            </div>
          ) : apptsQ.error ? (
            <div className="text-destructive">
              {(apptsQ.error as Error).message}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paged.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell>{a.patientName}</TableCell>
                      <TableCell>{a.doctorName}</TableCell>
                      <TableCell>
                        {format(parseISO(a.startAt), "PP p")}
                      </TableCell>
                      <TableCell>
                        {format(parseISO(a.endAt), "PP p")}
                      </TableCell>
                      <TableCell className="capitalize">{a.status}</TableCell>
                      <TableCell>
                        <RowActions />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span>Rows per page:</span>
                  <Select
                    value={String(rowsPerPage)}
                    onValueChange={(v) => {
                      setRowsPerPage(Number(v));
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20">
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
                  <span>
                    {total ? `${start + 1}–${end} of ${total}` : "0 of 0"}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      disabled={pageSafe <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      {"<"}
                    </Button>
                    <Button
                      variant="ghost"
                      disabled={pageSafe >= pageCount}
                      onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                    >
                      {">"}
                    </Button>
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
