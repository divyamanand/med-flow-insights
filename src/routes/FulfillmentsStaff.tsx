import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

type StaffRow = {
  id: string;
  requirementId: string;
  staffId: string;
  startAt: string | null;
  endAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  staffName: string;
  staffRole: string;
};

function fmt(dt: string | null | undefined) {
  if (!dt) return "—";
  try {
    const d = new Date(dt);
    if (Number.isNaN(d.getTime())) return dt;
    return d.toLocaleString();
  } catch {
    return dt ?? "—";
  }
}

export default function FulfillmentsStaffPage() {
  const [query, setQuery] = useState("");
  const staffQ = useQuery({
    queryKey: ["fulfillments", "staff"],
    queryFn: async (): Promise<StaffRow[]> => {
      const res = await api.get("/fulfillments/staff");
      return res.data;
    },
    staleTime: 30_000,
  });

  const q = query.trim().toLowerCase();
  const rows = useMemo(() => {
    const src = staffQ.data ?? [];
    if (!q) return src;
    return src.filter((r) =>
      [r.staffName, r.staffRole, r.staffId, r.requirementId, r.id, r.notes ?? ""].some((v) => v.toLowerCase().includes(q))
    );
  }, [staffQ.data, q]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Staff Fulfillments</CardTitle>
        <Input
          placeholder="Search name, role, ID..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-md"
        />
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Requirement</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="whitespace-nowrap">{r.id}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.staffName}</TableCell>
                  <TableCell><Badge variant="secondary">{r.staffRole}</Badge></TableCell>
                  <TableCell>{fmt(r.startAt)}</TableCell>
                  <TableCell>{fmt(r.endAt)}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.requirementId}</TableCell>
                  <TableCell className="max-w-[320px] truncate">{r.notes ?? "—"}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>No staff fulfillments.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
