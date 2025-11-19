import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Users, Search } from "lucide-react";

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
    <Card className="border-2 shadow-lg glass-effect">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="size-5 text-primary" />
            </div>
            Staff Fulfillments
          </CardTitle>
          <div className="relative w-full sm:w-auto sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search name, role, ID..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 border-2"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto max-h-[500px]">
          <Table>
            <TableHeader>
              <TableRow className="border-muted/50">
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Staff</TableHead>
                <TableHead className="font-semibold">Role</TableHead>
                <TableHead className="font-semibold">Start</TableHead>
                <TableHead className="font-semibold">End</TableHead>
                <TableHead className="font-semibold">Requirement</TableHead>
                <TableHead className="font-semibold">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id} className="hover:bg-muted/50 transition-colors border-muted/30">
                  <TableCell className="whitespace-nowrap font-mono text-sm text-muted-foreground">#{r.id}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-muted-foreground" />
                      <span className="font-medium">{r.staffName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="capitalize">{r.staffRole}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{fmt(r.startAt)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{fmt(r.endAt)}</TableCell>
                  <TableCell className="whitespace-nowrap font-mono text-sm">#{r.requirementId}</TableCell>
                  <TableCell className="max-w-[320px] truncate text-sm">{r.notes ?? "—"}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No staff fulfillments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
