import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

/* ---------------- NEW TYPES (MATCH API EXACTLY) ---------------- */

type Appointment = {
  id: string;

  patientId: string;
  doctorId: string;

  patientName: string;
  doctorName: string;

  startAt: string;
  endAt: string;

  status: string;
  issues?: string;

  createdAt: string;
  updatedAt: string;
};

const statuses = [
  "scheduled",
  "confirmed",
  "checked-in",
  "completed",
  "cancelled",
] as const;

/* ---------------------------------------------------------------- */

export default function AppointmentDetails() {
  const { id = "" } = useParams();

  const apptQ = useQuery<Appointment>({
    queryKey: ["appointments", id],
    queryFn: () => api.get<Appointment>(`/appointments/${id}`),
    enabled: !!id,
  });

  /* ---------- Local Status Simulation (Demo) ---------- */
  const [status, setStatus] = useState<string>("scheduled");

  useEffect(() => {
    if (apptQ.data?.status) setStatus(apptQ.data.status);
  }, [apptQ.data?.status]);

  /* ---------- Local Audit Log (Demo-Only) ---------- */
  const [logs, setLogs] = useState<{ ts: string; text: string }[]>([]);

  useEffect(() => {
    if (apptQ.data) {
      setLogs([
        {
          ts: apptQ.data.createdAt,
          text: "Appointment created (demo)",
        },
      ]);
    }
  }, [apptQ.data?.id]);

  function appendLog(text: string) {
    setLogs((prev) => [
      { ts: new Date().toISOString(), text },
      ...prev,
    ]);
  }

  function setStatusDemo(next: string) {
    setStatus(next);
    appendLog(`Status changed to ${next}`);
  }

  if (apptQ.isLoading)
    return (
      <div className="flex items-center justify-center p-10">
        <Spinner className="size-6" />
      </div>
    );

  if (apptQ.error)
    return <div className="text-destructive">{(apptQ.error as Error).message}</div>;

  const appt = apptQ.data!;

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* 1. Status + Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={status} onValueChange={(v) => setStatusDemo(v)}>
              <SelectTrigger className="min-w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={() => setStatusDemo("confirmed")}>Confirm</Button>
            <Button onClick={() => setStatusDemo("checked-in")}>Check In</Button>
            <Button onClick={() => setStatusDemo("completed")}>Complete</Button>
            <Button
              variant="destructive"
              onClick={() => setStatusDemo("cancelled")}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2. Main 3-Column Layout */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Column 1 — Info */}
        <Card>
          <CardHeader>
            <CardTitle>Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Patient */}
            <section>
              <div className="flex items-center justify-between">
                <div className="font-medium">Patient</div>
                <DemoEdit label="Edit Patient" />
              </div>
              <Separator className="my-2" />

              <div className="text-sm">Name: {appt.patientName}</div>
              <div className="text-sm">ID: {appt.patientId}</div>
              <div className="text-sm">
                Created: {format(parseISO(appt.createdAt), "PPp")}
              </div>
            </section>

            {/* Doctor */}
            <section>
              <div className="flex items-center justify-between">
                <div className="font-medium">Doctor</div>
                <DemoEdit label="Edit Doctor" />
              </div>
              <Separator className="my-2" />

              <div className="text-sm">Name: Dr {appt.doctorName}</div>
              <div className="text-sm">ID: {appt.doctorId}</div>
            </section>

            {/* Time */}
            <section>
              <div className="flex items-center justify-between">
                <div className="font-medium">Time Window</div>
                <DemoEdit
                  label="Edit Time"
                  time
                  initial={{ startAt: appt.startAt, endAt: appt.endAt }}
                />
              </div>
              <Separator className="my-2" />

              <div className="text-sm">
                Start: {format(parseISO(appt.startAt), "PPp")}
              </div>
              <div className="text-sm">
                End: {format(parseISO(appt.endAt), "PPp")}
              </div>
            </section>

            {/* Issues */}
            <section>
              <div className="font-medium">Issues</div>
              <Separator className="my-2" />
              {appt.issues ? (
                <div className="text-sm">{appt.issues}</div>
              ) : (
                <div className="text-sm text-muted-foreground">No issues</div>
              )}
            </section>
          </CardContent>
        </Card>

        {/* Column 2 — Audit Log */}
        <Card>
          <CardHeader>
            <CardTitle>Audit Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 overflow-auto text-sm space-y-2">
              {logs.map((l, i) => (
                <p key={i}>
                  <span className="text-muted-foreground">
                    {format(parseISO(l.ts), "yyyy-MM-dd HH:mm")}
                  </span>{" "}
                  — {l.text}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Column 3 — Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <DemoEdit label="Edit Appointment" full />
            <DemoEdit
              label="Doctor/Time"
              time
              initial={{ startAt: appt.startAt, endAt: appt.endAt }}
            />
            <DemoJsonPatch />
            <DemoDelete hard />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* -------------------- Dialog Components -------------------- */

function DemoEdit({
  label,
  time,
  full,
  initial,
}: {
  label: string;
  time?: boolean;
  full?: boolean;
  initial?: { startAt: string; endAt: string };
}) {
  const [startAt, setStartAt] = useState(initial?.startAt ?? "");
  const [endAt, setEndAt] = useState(initial?.endAt ?? "");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={full ? "default" : "ghost"} size={full ? "default" : "sm"}>
          {label}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label} (Demo)</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          {time ? (
            <>
              <div>
                <label className="text-sm">Start At</label>
                <Input
                  type="datetime-local"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm">End At</label>
                <Input
                  type="datetime-local"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                />
              </div>
            </>
          ) : (
            <>
              <label className="text-sm">Notes</label>
              <Textarea placeholder="Update notes (demo)" />
            </>
          )}
        </div>

        <DialogFooter>
          <Button>Save (Demo)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DemoJsonPatch() {
  const [json, setJson] = useState(
    `{\n  "startAt": "2025-11-16T11:00:00Z",\n  "endAt": "2025-11-16T11:30:00Z"\n}`
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Patch (JSON)</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Patch JSON (Demo)</DialogTitle>
        </DialogHeader>

        <Textarea
          className="min-h-40"
          value={json}
          onChange={(e) => setJson(e.target.value)}
        />

        <DialogFooter>
          <Button>Submit (Demo)</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DemoDelete({ hard }: { hard?: boolean }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={hard ? "destructive" : "outline"}>
          {hard ? "Hard Delete (Admin Only)" : "Delete"}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {hard ? "Hard Delete Appointment" : "Delete Appointment"} (Demo)
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm">Are you sure?</p>

        <DialogFooter>
          <Button variant="ghost">Cancel</Button>
          <Button variant={hard ? "destructive" : "default"}>
            {hard ? "Hard Delete" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
