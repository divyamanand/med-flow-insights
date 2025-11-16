import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/axios";

type RoomRow = {
  id: string;
  requirementId: string;
  roomId: string;
  startAt: string | null;
  endAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  roomName: string;
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

export default function FulfillmentsRoomsPage() {
  const [query, setQuery] = useState("");
  const roomsQ = useQuery({
    queryKey: ["fulfillments", "rooms"],
    queryFn: async (): Promise<RoomRow[]> => {
      const res = await api.get("/fulfillments/rooms");
      return res.data;
    },
    staleTime: 30_000,
  });

  const q = query.trim().toLowerCase();
  const rows = useMemo(() => {
    const src = roomsQ.data ?? [];
    if (!q) return src;
    return src.filter((r) =>
      [r.roomName, r.roomId, r.requirementId, r.id, r.notes ?? ""].some((v) => v.toLowerCase().includes(q))
    );
  }, [roomsQ.data, q]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Room Fulfillments</CardTitle>
        <Input
          placeholder="Search room, ID, notes..."
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
                <TableHead>Room</TableHead>
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
                  <TableCell className="whitespace-nowrap flex items-center gap-2">
                    <Badge variant="secondary">{r.roomName}</Badge>
                    <span className="text-muted-foreground">{r.roomId}</span>
                  </TableCell>
                  <TableCell>{fmt(r.startAt)}</TableCell>
                  <TableCell>{fmt(r.endAt)}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.requirementId}</TableCell>
                  <TableCell className="max-w-[320px] truncate">{r.notes ?? "—"}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>No room fulfillments.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
