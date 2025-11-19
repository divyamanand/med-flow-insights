import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Package, Search } from "lucide-react";

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
    <Card className="border-2 shadow-lg glass-effect">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="size-5 text-primary" />
            </div>
            Item Fulfillments
          </CardTitle>
          <div className="relative w-full sm:w-auto sm:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search item, ID, notes..."
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
                <TableHead className="font-semibold">Requirement</TableHead>
                <TableHead className="font-semibold">Item</TableHead>
                <TableHead className="font-semibold">Quantity</TableHead>
                <TableHead className="font-semibold">Start</TableHead>
                <TableHead className="font-semibold">End</TableHead>
                <TableHead className="font-semibold">Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, idx) => (
                <TableRow key={`${r.requirementId}-${r.itemId}-${idx}`} className="hover:bg-muted/50 transition-colors border-muted/30">
                  <TableCell className="whitespace-nowrap font-mono text-sm text-muted-foreground">#{r.requirementId}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Package className="size-4 text-muted-foreground" />
                      <Badge variant="secondary">{r.itemName}</Badge>
                      <span className="text-xs text-muted-foreground">{r.itemId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{r.quantity}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{fmt(r.startTime)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{fmt(r.endTime)}</TableCell>
                  <TableCell className="max-w-[320px] truncate text-sm">{r.notes ?? "—"}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No item fulfillments found
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
