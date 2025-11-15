import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

/* ---------------- Types ---------------- */
type StaffReq = {
  id: string;
  roleNeeded: string;
  count: number;
  status: string;
  creator: string;
};

/* ---------------- Mock data ---------------- */
const MOCK_STAFF_REQS: StaffReq[] = [
  { id: "REQ001", roleNeeded: "Nurse (ICU)", count: 2, status: "Open", creator: "Dr. Lee" },
  { id: "REQ002", roleNeeded: "Physician Assistant", count: 2, status: "Open", creator: "Dr. Lee" },
  { id: "REQ003", roleNeeded: "Anesthesiologist", count: 1, status: "Pending Approval", creator: "Dr. Sharma" },
  { id: "REQ004", roleNeeded: "Medical Assistant", count: 3, status: "Open", creator: "Dr. Chen" },
  { id: "REQ005", roleNeeded: "Radiology Technician", count: 1, status: "Open", creator: "Dr. Gupta" },
  { id: "REQ006", roleNeeded: "Surgeon (Ortho)", count: 1, status: "Closed", creator: "Dr. Singh" },
];

/* ---------------- Component ---------------- */
export default function StaffingRequirements() {
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("Open");
  const [creatorSearch, setCreatorSearch] = useState<string>("");

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // query (mocked)
  const q = useQuery({
    queryKey: ["staff-reqs"],
    queryFn: async (): Promise<StaffReq[]> => {
      await new Promise((r) => setTimeout(r, 150));
      return MOCK_STAFF_REQS;
    },
    staleTime: 30_000,
  });

  const rows = useMemo(() => {
    let data = q.data ?? [];
    if (roleFilter !== "all") data = data.filter((r) => r.roleNeeded === roleFilter);
    if (statusFilter) data = data.filter((r) => r.status === statusFilter);
    if (creatorSearch.trim()) data = data.filter((r) => r.creator.toLowerCase().includes(creatorSearch.trim().toLowerCase()));
    return data;
  }, [q.data, roleFilter, statusFilter, creatorSearch]);

  const total = rows.length;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const paged = rows.slice(start, end);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Staffing Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="min-w-[200px]">
              <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Role Needed" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Nurse (ICU)">Nurse (ICU)</SelectItem>
                  <SelectItem value="Physician Assistant">Physician Assistant</SelectItem>
                  <SelectItem value="Anesthesiologist">Anesthesiologist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[200px]">
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Input placeholder="Creator name..." value={creatorSearch} onChange={(e) => { setCreatorSearch(e.target.value); setPage(1); }} />

            <Button onClick={() => q.refetch()}>Apply Filters</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Role Needed</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paged.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.roleNeeded}</TableCell>
                    <TableCell>{r.status}</TableCell>
                    <TableCell>{r.creator}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild><Button size="sm" variant="outline">View</Button></DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>View Staffing Request</DialogTitle></DialogHeader>
                            <div className="text-sm">
                              <p><strong>ID:</strong> {r.id}</p>
                              <p><strong>Role:</strong> {r.roleNeeded}</p>
                              <p><strong>Count:</strong> {r.count}</p>
                              <p><strong>Status:</strong> {r.status}</p>
                              <p><strong>Creator:</strong> {r.creator}</p>
                            </div>
                            <DialogFooter><Button>Close</Button></DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Button size="sm">Edit</Button>
                        <Button size="sm" variant={r.status === "Closed" ? "outline" : "destructive"}>
                          {r.status === "Closed" ? "Reopen" : "Close"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4 text-sm">
            <div>{total === 0 ? "Showing 0 of 0" : `Showing ${start + 1}-${end} of ${total}`}</div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>{'<'}</Button>
              <Button size="sm" variant="outline" disabled={end >= total} onClick={() => setPage((p) => p + 1)}>{'>'}</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
