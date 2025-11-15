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
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">Staff Timings Overview</h1>

      {/* FILTER CARD */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">

            {/* Role Filter */}
            <div>
              <label className="text-sm font-medium">Role</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
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
            <div>
              <label className="text-sm font-medium">Specialty</label>
              <Select value={specialtyId} onValueChange={setSpecialtyId}>
                <SelectTrigger>
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
            <div>
              <label className="text-sm font-medium">Weekday</label>
              <Select value={weekday} onValueChange={setWeekday}>
                <SelectTrigger>
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
            <div>
              <label className="text-sm font-medium">From</label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>

            {/* To Date */}
            <div>
              <label className="text-sm font-medium">To</label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={() => timingsQ.refetch()}>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Staff Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paged.map((r, idx) => (
                  <TableRow key={r.id}>
                    <TableCell>{start + idx + 1}</TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.role}</TableCell>
                    <TableCell>{WEEKDAYS.find((d) => d.value === r.weekday)?.label}</TableCell>
                    <TableCell>{r.startTime}</TableCell>
                    <TableCell>{r.endTime}</TableCell>
                    <TableCell>
                      {r.isActive ? (
                        <span className="text-green-600">Available</span>
                      ) : (
                        <span className="text-red-600">Off Duty</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="destructive">Remove</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      No timings found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-sm">
            <div>
              Showing {rows.length === 0 ? 0 : start + 1}-{end} of {rows.length}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                {"<"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={end >= rows.length}
                onClick={() => setPage((p) => p + 1)}
              >
                {">"}
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
