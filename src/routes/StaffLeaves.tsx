import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, UserCheck, UserX, CheckCircle, XCircle, ChevronLeft, ChevronRight, Users } from "lucide-react";

export default function StaffLeaveManagement() {
  /* ---------------------------------- Filters ---------------------------------- */
  const [role, setRole] = useState("all");
  const [specialtyId, setSpecialtyId] = useState("all");
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  /* -------------------------------- Pagination -------------------------------- */
  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* --------------------------------- Query ------------------------------------ */
  const leavesQ = useQuery({
    queryKey: ["staff-leaves", role, specialtyId, status, from, to],
    queryFn: async () => {
      const res = await api.get("/staff/leaves", {
        params: {
          role: role !== "all" ? role : undefined,
          specialtyId: specialtyId !== "all" ? specialtyId : undefined,
          status: status !== "all" ? status : undefined,
          from: from || undefined,
          to: to || undefined,
        },
      });
      return res.data as {
        staffId: string;
        name: string;
        role: string;
        leaves: {
          id: string;
          startDate: string;
          endDate: string;
          status: string;
          reason?: string;
          notes?: string;
        }[];
      }[];
    },
    staleTime: 30000,
  });

  /* ------------------------ Flatten leaves list for table ----------------------- */
  const rows = useMemo(() => {
    if (!leavesQ.data) return [];

    const out: any[] = [];
    leavesQ.data.forEach((s) => {
      s.leaves.forEach((leave) => {
        out.push({
          staffId: s.staffId,
          name: s.name,
          role: s.role,
          ...leave,
        });
      });
    });
    return out;
  }, [leavesQ.data]);

  /* -------------------------------- Pagination -------------------------------- */
  const total = rows.length;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const paged = rows.slice(start, end);

  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-slide-in-bottom">
      {/* Enhanced Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20">
          <Calendar className="size-4 text-warning" />
          <span className="text-sm font-medium text-warning">Leave Requests</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text">
          Staff Leave Management
        </h1>
      </div>

      {/* ------------------------------- Filters ------------------------------- */}
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
            
            {/* Role */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Staff Role</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="nurse">Nurse</SelectItem>
                  <SelectItem value="assistant">Assistant</SelectItem>
                  <SelectItem value="labTech">Lab Tech</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Specialty */}
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

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Pending" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-semibold">Start Date</label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border-2" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">End Date</label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border-2" />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={() => leavesQ.refetch()} className="gap-2">
              <Filter className="size-4" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------- Table ------------------------------- */}
      <Card className="border-2 shadow-lg glass-effect">
        <CardHeader className="flex flex-row justify-between items-center flex-wrap gap-3">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <UserCheck className="size-5 text-primary" />
            </div>
            Leave Records
          </CardTitle>

          <Button className="gap-2">
            <Calendar className="size-4" />
            Add New Leave
          </Button>
        </CardHeader>

        <CardContent>
          <div className="overflow-auto max-h-[500px]">
            <Table>
              <TableHeader>
                <TableRow className="border-muted/50">
                  <TableHead className="font-semibold">#</TableHead>
                  <TableHead className="font-semibold">Staff Name</TableHead>
                  <TableHead className="font-semibold">Start Date</TableHead>
                  <TableHead className="font-semibold">End Date</TableHead>
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
                    <TableCell className="text-sm text-muted-foreground">{r.startDate}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.endDate}</TableCell>
                    <TableCell>
                      {r.status === "pending" && (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                      {r.status === "approved" && (
                        <Badge variant="default">Approved</Badge>
                      )}
                      {r.status === "rejected" && (
                        <Badge variant="destructive">Rejected</Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        {r.status === "pending" && (
                          <>
                            <Button size="sm" variant="default" className="gap-1">
                              <CheckCircle className="size-3" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="gap-1"
                            >
                              <XCircle className="size-3" />
                              Reject
                            </Button>
                          </>
                        )}

                        {r.status === "approved" && (
                          <Button size="sm" variant="outline">Edit</Button>
                        )}

                        <Button size="sm" variant="destructive">Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No leave records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* ------------------------------ Pagination ------------------------------ */}
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
          <div className="flex justify-between items-center mt-4 text-sm">
            <div>
              Showing {rows.length === 0 ? 0 : start + 1}–{end} of {rows.length}
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                {"< Prev"}
              </Button>

              <Button
                size="sm"
                variant="outline"
                disabled={end >= rows.length}
                onClick={() => setPage((p) => p + 1)}
              >
                {"Next >"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
