import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

import { api } from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type InventoryTx = {
  id: string;
  type: "in" | "out" | "adjust";
  quantity: number;
  reason: string | null;
  createdAt: string;

  inventoryItem: {
    id: string;
    name: string;
    type: string;
    unit: string | null;
  };
};

export default function InventoryTransactions() {
  /* ---------------------- FILTERS ---------------------- */
  const [itemId, setItemId] = useState("all");
  const [type, setType] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  /* ---------------------- PAGINATION ---------------------- */
  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* ---------------------- LOAD ALL ITEMS FOR FILTER ---------------------- */
  const itemsQ = useQuery<{ id?: string; name: string }[]>({
    queryKey: ["inventory-items"],
    queryFn: () => api.get<{ id?: string; name: string }[]>("/inventory"),
  });

  /* ---------------------- LOAD TRANSACTIONS ---------------------- */
  const transactionsQ = useQuery<InventoryTx[]>({
    queryKey: ["inventory-transactions", { itemId, type, from, to }],
    queryFn: () =>
      api.get("/inventory/transactions", {
        itemId: itemId !== "all" ? itemId : undefined,
        type: type !== "all" ? type : undefined,
        from: from || undefined,
        to: to || undefined,
      }),
  });

  const rows: InventoryTx[] = (transactionsQ.data ?? []) as InventoryTx[];

  /* ---------------------- PAGINATION ---------------------- */
  const total = rows.length;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const paged = rows.slice(start, end);

  /* ---------------------- EXPORT CSV ---------------------- */
  function exportCSV() {
    const header = ["ID", "Item Name", "Type", "Adjust", "Reason", "Created At"].join(",");
    const body = rows
      .map((tx) =>
        [
          tx.id,
          tx.inventoryItem.name,
          tx.type,
          tx.quantity,
          tx.reason ?? "",
          format(parseISO(tx.createdAt), "yyyy-MM-dd HH:mm"),
        ].join(",")
      )
      .join("\n");

    const blob = new Blob([header + "\n" + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory-transactions.csv";
    a.click();
  }

  /* ---------------------- UI ---------------------- */
  return (
    <div className="flex flex-col gap-6">

      {/* HEADER */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">Inventory Transactions</CardTitle>
        </CardHeader>
      </Card>

      {/* FILTERS */}
      <Card>
        <CardContent className="pt-6 space-y-4">

          {/* Row 1: Item + Type */}
          <div className="flex flex-wrap gap-4">

            {/* Item Filter */}
            <div className="min-w-[220px]">
              <label className="text-xs text-muted-foreground">Item</label>
              <Select value={itemId} onValueChange={(v) => { setItemId(v); setPage(1) }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Item" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  {(itemsQ.data ?? []).map((it: any) => (
                    <SelectItem key={it.name} value={it.id ?? it.name}>
                      {it.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div className="min-w-[150px]">
              <label className="text-xs text-muted-foreground">Type</label>
              <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="in">In</SelectItem>
                  <SelectItem value="out">Out</SelectItem>
                  <SelectItem value="adjust">Adjust</SelectItem>
                </SelectContent>
              </Select>
            </div>

          </div>

          {/* Row 2: Dates */}
          <div className="flex flex-wrap gap-4">

            <div>
              <label className="text-xs text-muted-foreground">From</label>
              <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>

            <div>
              <label className="text-xs text-muted-foreground">To</label>
              <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>

            <Button onClick={() => transactionsQ.refetch()}>Apply Filters</Button>
          </div>

          {/* Export */}
          <Button className="bg-blue-600 text-white" onClick={exportCSV}>
            Export to CSV
          </Button>

        </CardContent>
      </Card>

      {/* TABLE */}
      <Card>
        <CardContent className="pt-6">
          {transactionsQ.isLoading ? (
            <div className="p-8 text-center">Loading…</div>
          ) : (
            <>
              <div className="w-full overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Item Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Adjust</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead>View</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paged.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>{tx.id}</TableCell>
                        <TableCell>{tx.inventoryItem.name}</TableCell>
                        <TableCell className="capitalize">{tx.type}</TableCell>
                        <TableCell>{tx.quantity}</TableCell>
                        <TableCell>{tx.reason || "-"}</TableCell>
                        <TableCell>{format(parseISO(tx.createdAt), "yyyy-MM-dd hh:mm a")}</TableCell>
                        <TableCell>
                          <TxViewDialog tx={tx}>
                            <Button size="sm" className="bg-blue-500 text-white">View</Button>
                          </TxViewDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm">
                  {total ? `${start + 1}-${end} of ${total}` : "No records"}
                </span>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                    Previous
                  </Button>
                  <Button size="sm" variant="outline" disabled={end >= total} onClick={() => setPage((p) => p + 1)}>
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------------- VIEW DETAILS MODAL ---------------------- */

function TxViewDialog({ children, tx }: { children: React.ReactNode; tx: InventoryTx }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p><strong>ID:</strong> {tx.id}</p>
          <p><strong>Item:</strong> {tx.inventoryItem.name}</p>
          <p><strong>Type:</strong> {tx.type}</p>
          <p><strong>Quantity:</strong> {tx.quantity}</p>
          <p><strong>Reason:</strong> {tx.reason || "-"}</p>
          <p><strong>Created At:</strong> {format(parseISO(tx.createdAt), "PPPpp")}</p>
        </div>

        <DialogFooter>
          <Button>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
