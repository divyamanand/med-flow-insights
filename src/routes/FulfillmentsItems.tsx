import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

type ItemRow = {
  requirementId: string;
  quantity: number;
  notes: string | null;
  startTime: string | null;
  endTime: string | null;
  itemId: string;
  itemName: string;
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

export default function FulfillmentsItemsPage() {
  const [query, setQuery] = useState("");
  const itemsQ = useQuery({
    queryKey: ["fulfillments", "items"],
    queryFn: async (): Promise<ItemRow[]> => {
      const res = await api.get("/fulfillments/items");
      return res.data;
    },
    staleTime: 30_000,
  });

  const q = query.trim().toLowerCase();
  const rows = useMemo(() => {
    const src = itemsQ.data ?? [];
    if (!q) return src;
    return src.filter((r) =>
      [r.itemName, r.itemId, r.requirementId, r.notes ?? ""].some((v) => v.toLowerCase().includes(q))
    );
  }, [itemsQ.data, q]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Item Fulfillments</CardTitle>
        <Input
          placeholder="Search item, ID, notes..."
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
                <TableHead>Requirement</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, idx) => (
                <TableRow key={`${r.requirementId}-${r.itemId}-${idx}`}>
                  <TableCell className="whitespace-nowrap">{r.requirementId}</TableCell>
                  <TableCell className="whitespace-nowrap flex items-center gap-2">
                    <Badge variant="secondary">{r.itemName}</Badge>
                    <span className="text-muted-foreground">{r.itemId}</span>
                  </TableCell>
                  <TableCell>{r.quantity}</TableCell>
                  <TableCell>{fmt(r.startTime)}</TableCell>
                  <TableCell>{fmt(r.endTime)}</TableCell>
                  <TableCell className="max-w-[320px] truncate">{r.notes ?? "—"}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>No item fulfillments.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
