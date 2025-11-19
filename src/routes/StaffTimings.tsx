import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, Filter, Edit2, Trash2, ChevronLeft, ChevronRight, Calendar, Users } from "lucide-react";

// Weekday map
const WEEKDAYS = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
  { label: "Sunday", value: 0 },
];

export default function StaffTimingsOverview() {
  /* ---------------- Filters ---------------- */
  const [role, setRole] = useState("all");
  const [specialtyId, setSpecialtyId] = useState("all");
  const [weekday, setWeekday] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  /* ---------------- Pagination ---------------- */
  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* ---------------- API Fetch ---------------- */
  const timingsQ = useQuery({
    queryKey: ["staff-timings", role, specialtyId, weekday, from, to],
    queryFn: async () => {
      const res = await api.get("/staff/timings", {
        params: {
          role: role !== "all" ? role : undefined,
          specialtyId: specialtyId !== "all" ? specialtyId : undefined,
          weekday: weekday !== "all" ? Number(weekday) : undefined,
          from: from || undefined,
          to: to || undefined,
        },
      });
      return res.data as {
        staffId: string;
        name: string;
        role: string;
        timings: {
          id: string;
          weekday: number;
          startTime: string;
          endTime: string;
          location?: string;
          notes?: string;
          isActive?: boolean;
        }[];
      }[];
    },
    staleTime: 30_000,
  });

  const rows = useMemo(() => {
    if (!timingsQ.data) return [];

    const flat: any[] = [];
    timingsQ.data.forEach((s) => {
      s.timings.forEach((t) => {
        flat.push({
          staffId: s.staffId,
          name: s.name,
          role: s.role,
          ...t,
        });
      });
    });

    return flat;
  }, [timingsQ.data]);

  const total = rows.length;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const paged = rows.slice(start, end);

  /* ---------------- UI ---------------- */
  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-slide-in-bottom">
      {/* Enhanced Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <Clock className="size-4 text-primary" />
          <span className="text-sm font-medium text-primary">Schedule Management</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text">
          Staff Timings
        </h1>
      </div>

      {/* FILTER CARD */}
      <Card className="border-2 shadow-lg glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Filter className="size-5 text-accent" />
            </div>
            Filters
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">

            {/* Role Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Role</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                  <SelectItem value="assistant">Assistant</SelectItem>
                  <SelectItem value="labTech">Lab Tech</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Specialty Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Specialty</label>
              <Select value={specialtyId} onValueChange={setSpecialtyId}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Select Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="uuid-cardiology">Cardiology</SelectItem>
                  <SelectItem value="uuid-neuro">Neurology</SelectItem>
                  <SelectItem value="uuid-ortho">Orthopedics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Weekday */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Weekday</label>
              <Select value={weekday} onValueChange={setWeekday}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Select Day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {WEEKDAYS.map((w) => (
                    <SelectItem key={w.value} value={String(w.value)}>
                      {w.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* From Date */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">From</label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border-2" />
            </div>

            {/* To Date */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">To</label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border-2" />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={() => timingsQ.refetch()} className="gap-2">
              <Filter className="size-4" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="border-2 shadow-lg glass-effect">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="size-5 text-primary" />
            </div>
            Schedule Results
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-auto max-h-[500px]">
            <Table>
              <TableHeader>
                <TableRow className="border-muted/50">
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Staff Name</TableHead>
                  <TableHead className="font-semibold">Role</TableHead>
                  <TableHead className="font-semibold">Day</TableHead>
                  <TableHead className="font-semibold">Start</TableHead>
                  <TableHead className="font-semibold">End</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paged.map((r, idx) => (
                  <TableRow key={r.id} className="hover:bg-muted/50 transition-colors border-muted/30">
                    <TableCell className="font-mono text-sm text-muted-foreground">#{start + idx + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="size-4 text-muted-foreground" />
                        <span className="font-medium">{r.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="capitalize">{r.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-muted-foreground" />
                        <span className="text-sm">{WEEKDAYS.find((d) => d.value === r.weekday)?.label}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.startTime}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.endTime}</TableCell>
                    <TableCell>
                      {r.isActive ? (
                        <Badge variant="default">Available</Badge>
                      ) : (
                        <Badge variant="secondary">Off Duty</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-1">
                          <Edit2 className="size-3" />
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" className="gap-1">
                          <Trash2 className="size-3" />
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No timings found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <div className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{rows.length === 0 ? 0 : start + 1}</span> to <span className="font-semibold text-foreground">{end}</span> of <span className="font-semibold text-foreground">{rows.length}</span> results
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="gap-1"
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={end >= rows.length}
                onClick={() => setPage((p) => p + 1)}
                className="gap-1"
              >
                Next
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button className="mt-4">Export Data</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
