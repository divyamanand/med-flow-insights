import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

/* ---------------- Types matching your backend ---------------- */
type StaffRequirement = {
  id: string;
  primaryUserId: string;
  roleNeeded: string;
  quantity: number;
  fulfilled?: number;
  notes?: string;
  status: "open" | "inProgress" | "fulfilled" | "cancelled";
  createdAt: string;
};

const ROLES = [
  "nurse",
  "labTech",
  "doctor",
  "surgeon",
  "pharmacist",
  "assistant",
];

/* ------------------------------------------------------------------ */
export default function StaffingRequirements() {
  const queryClient = useQueryClient();

  /* ---------------- Filters ---------------- */
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  /* ---------------- Pagination ---------------- */
  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* ---------------- Fetch requirements ---------------- */
  const q = useQuery({
    queryKey: ["staff-reqs"],
    queryFn: async (): Promise<StaffRequirement[]> => {
      const res = await api.get("/requirements/staff");
      return res.data;
    },
    staleTime: 30000,
  });

  /* ---------------- Mutations ---------------- */
  const createReq = useMutation({
    mutationFn: (body: {
      primaryUserId: string;
      roleNeeded: string;
      quantity: number;
      notes?: string;
    }) => api.post("/requirements/staff", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff-reqs"] }),
  });

  const updateReq = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Partial<StaffRequirement>;
    }) => api.patch(`/requirements/staff/${id}`, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff-reqs"] }),
  });

  /* ---------------- Filtering ---------------- */
  const rows = useMemo(() => {
    let data = q.data ?? [];

    if (roleFilter !== "all") data = data.filter((r) => r.roleNeeded === roleFilter);
    if (statusFilter !== "all") data = data.filter((r) => r.status === statusFilter);

    if (search.trim()) {
      const t = search.trim().toLowerCase();
      data = data.filter(
        (r) =>
          r.primaryUserId.toLowerCase().includes(t) ||
          r.id.toLowerCase().includes(t)
      );
    }

    return data;
  }, [q.data, roleFilter, statusFilter, search]);

  /* ---------------- Pagination ---------------- */
  const total = rows.length;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const paged = rows.slice(start, end);

  return (
    <div className="flex flex-col gap-6">
      {/* ---------------- Filters + Create Button ---------------- */}
      <Card>
        <CardHeader>
          <CardTitle>Staffing Requirements</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            {/* Role Filter */}
            <div className="min-w-[200px]">
              <Select
                value={roleFilter}
                onValueChange={(v) => {
                  setRoleFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger><SelectValue placeholder="Role Needed" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="min-w-[200px]">
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v);
                  setPage(1);
                }}
              >
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="inProgress">In Progress</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <Input
              placeholder="Search by ID or primaryUserId..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            {/* Create new requirement */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-auto">+ New Request</Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Staff Requirement</DialogTitle>
                </DialogHeader>

                <CreateStaffForm onSubmit={createReq.mutate} />

                <DialogFooter>
                  <Button>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* ---------------- Table ---------------- */}
      <Card>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Role Needed</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Fulfilled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paged.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.roleNeeded}</TableCell>
                    <TableCell>{r.quantity}</TableCell>
                    <TableCell>{r.fulfilled ?? 0}</TableCell>
                    <TableCell>{r.status}</TableCell>
                    <TableCell>{r.primaryUserId}</TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        {/* View */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">View</Button>
                          </DialogTrigger>

                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Staff Requirement</DialogTitle>
                            </DialogHeader>

                            <div className="text-sm space-y-2">
                              <p><b>ID:</b> {r.id}</p>
                              <p><b>Role:</b> {r.roleNeeded}</p>
                              <p><b>Quantity:</b> {r.quantity}</p>
                              <p><b>Status:</b> {r.status}</p>
                              <p><b>Requested by:</b> {r.primaryUserId}</p>
                              <p><b>Notes:</b> {r.notes || "—"}</p>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Fulfillments */}
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/requirements/staff/${r.id}/fulfillments`}>Fulfillments</Link>
                        </Button>

                        {/* Approve   */}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            updateReq.mutate({
                              id: r.id,
                              body: { status: "inProgress" },
                            })
                          }
                        >
                          Approve
                        </Button>

                        {/* Cancel */}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            updateReq.mutate({
                              id: r.id,
                              body: { status: "cancelled" },
                            })
                          }
                        >
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-sm">
            <div>
              {total === 0
                ? "Showing 0 of 0"
                : `Showing ${start + 1} - ${end} of ${total}`}
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
                disabled={end >= total}
                onClick={() => setPage((p) => p + 1)}
              >
                {">"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------- Create Staff Form ---------------- */
function CreateStaffForm({
  onSubmit,
}: {
  onSubmit: (data: any) => void;
}) {
  const [primaryUserId, setPrimaryUserId] = useState("");
  const [roleNeeded, setRoleNeeded] = useState("nurse");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  return (
    <div className="flex flex-col gap-4 py-4">
      <Input
        placeholder="Primary User ID"
        value={primaryUserId}
        onChange={(e) => setPrimaryUserId(e.target.value)}
      />

      <Select value={roleNeeded} onValueChange={setRoleNeeded}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {ROLES.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />

      <Input
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <Button
        onClick={() =>
          onSubmit({
            primaryUserId,
            roleNeeded,
            quantity,
            notes: notes || undefined,
          })
        }
      >
        Create
      </Button>
    </div>
  );
}
