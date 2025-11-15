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
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-semibold">Staff Leave Management</h1>

      {/* ------------------------------- Filters ------------------------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            
            {/* Role */}
            <div>
              <label className="text-sm font-medium">Staff Role</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
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

            {/* Status */}
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
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
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>

            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={() => leavesQ.refetch()}>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* ------------------------------- Table ------------------------------- */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>Leave Records</CardTitle>

          <Button>Add New Leave</Button>
        </CardHeader>

        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Staff Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paged.map((r, idx) => (
                  <TableRow key={r.id}>
                    <TableCell>{start + idx + 1}</TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.startDate}</TableCell>
                    <TableCell>{r.endDate}</TableCell>
                    <TableCell>
                      {r.status === "pending" && (
                        <span className="text-yellow-500 font-medium">Pending</span>
                      )}
                      {r.status === "approved" && (
                        <span className="text-green-600 font-medium">Approved</span>
                      )}
                      {r.status === "rejected" && (
                        <span className="text-red-600 font-medium">Rejected</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        {r.status === "pending" && (
                          <>
                            <Button size="sm" className="bg-green-600 text-white hover:bg-green-700">
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
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
                    <TableCell colSpan={6} className="text-center py-6">
                      No leave records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* ------------------------------ Pagination ------------------------------ */}
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
