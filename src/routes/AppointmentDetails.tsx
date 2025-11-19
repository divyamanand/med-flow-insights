import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { CalendarCheck, User, Stethoscope, Clock, FileText, Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";

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
    <div className="flex flex-col gap-6 sm:gap-8 animate-slide-in-bottom">
      {/* Enhanced Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <CalendarCheck className="size-4 text-primary" />
          <span className="text-sm font-medium text-primary">Appointment Details</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text">
          Appointment #{appt.id}
        </h1>
      </div>

      {/* Status & Action Buttons */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect">
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Label className="font-semibold">Status:</Label>
              <Select value={status} onValueChange={(v) => setStatusDemo(v)}>
                <SelectTrigger className="min-w-40 border-2 focus:border-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator orientation="vertical" className="h-8" />

            <Button onClick={() => setStatusDemo("confirmed")} variant="outline" className="gap-2">
              <CheckCircle className="size-4" />
              Confirm
            </Button>
            <Button onClick={() => setStatusDemo("checked-in")} variant="outline" className="gap-2">
              <User className="size-4" />
              Check In
            </Button>
            <Button onClick={() => setStatusDemo("completed")} variant="default" className="gap-2">
              <CheckCircle className="size-4" />
              Complete
            </Button>
            <Button
              variant="destructive"
              onClick={() => setStatusDemo("cancelled")}
              className="gap-2"
            >
              <XCircle className="size-4" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 3-Column Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Column 1 — Info */}
        <Card className="border-2 border-border/50 shadow-lg glass-effect">
          <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              Appointment Info
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Patient */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-semibold">
                  <User className="size-4 text-primary" />
                  Patient
                </div>
                <DemoEdit label="Edit" />
              </div>
              <Separator className="my-2" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{appt.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono text-xs">{appt.patientId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="text-xs">{format(parseISO(appt.createdAt), "PPp")}</span>
                </div>
              </div>
            </section>

            {/* Doctor */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-semibold">
                  <Stethoscope className="size-4 text-accent" />
                  Doctor
                </div>
                <DemoEdit label="Edit" />
              </div>
              <Separator className="my-2" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">Dr {appt.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono text-xs">{appt.doctorId}</span>
                </div>
              </div>
            </section>

            {/* Time */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 font-semibold">
                  <Clock className="size-4 text-primary" />
                  Time Window
                </div>
                <DemoEdit
                  label="Edit"
                  time
                  initial={{ startAt: appt.startAt, endAt: appt.endAt }}
                />
              </div>
              <Separator className="my-2" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start:</span>
                  <Badge variant="outline">{format(parseISO(appt.startAt), "PPp")}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End:</span>
                  <Badge variant="outline">{format(parseISO(appt.endAt), "PPp")}</Badge>
                </div>
              </div>
            </section>

            {/* Issues */}
            <section>
              <div className="font-semibold mb-2">Issues</div>
              <Separator className="my-2" />
              {appt.issues ? (
                <div className="text-sm bg-muted/50 p-3 rounded-lg">{appt.issues}</div>
              ) : (
                <div className="text-sm text-muted-foreground italic">No issues reported</div>
              )}
            </section>
          </CardContent>
        </Card>

        {/* Column 2 — Audit Log */}
        <Card className="border-2 border-border/50 shadow-lg glass-effect">
          <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              Audit Log
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="max-h-96 overflow-auto space-y-3">
              {logs.map((l, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <div className="size-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div className="flex-1 text-sm">
                    <div className="text-muted-foreground text-xs mb-1">
                      {format(parseISO(l.ts), "yyyy-MM-dd HH:mm")}
                    </div>
                    <div>{l.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Column 3 — Controls */}
        <Card className="border-2 border-border/50 shadow-lg glass-effect">
          <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
            <CardTitle className="flex items-center gap-2">
              <Edit2 className="size-5 text-primary" />
              Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <DemoEdit label="Edit Appointment" full />
            <DemoEdit
              label="Update Doctor/Time"
              time
              initial={{ startAt: appt.startAt, endAt: appt.endAt }}
            />
            <DemoJsonPatch />
            <Separator />
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
        <Button 
          variant={full ? "default" : "ghost"} 
          size={full ? "default" : "sm"}
          className={full ? "w-full" : ""}
        >
          {!full && <Edit2 className="size-4 mr-1" />}
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
              <div className="space-y-2">
                <Label className="font-semibold">Start At</Label>
                <Input
                  type="datetime-local"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-semibold">End At</Label>
                <Input
                  type="datetime-local"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                  className="border-2"
                />
              </div>
            </>
          ) : (
            <>
              <Label className="font-semibold">Notes</Label>
              <Textarea placeholder="Update notes (demo)" className="min-h-32" />
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
        <Button variant={hard ? "destructive" : "outline"} className="w-full gap-2">
          <Trash2 className="size-4" />
          {hard ? "Hard Delete (Admin Only)" : "Delete"}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {hard ? "Hard Delete Appointment" : "Delete Appointment"} (Demo)
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm">Are you sure you want to proceed? This action cannot be undone.</p>

        <DialogFooter>
          <Button variant="ghost">Cancel</Button>
          <Button variant={hard ? "destructive" : "default"} className="gap-2">
            <Trash2 className="size-4" />
            {hard ? "Hard Delete" : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
