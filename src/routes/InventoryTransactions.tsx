import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

import { api } from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ArrowDownToLine, Filter, Calendar, Package, TrendingUp, TrendingDown, Eye, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

type InventoryTx = {
  id: string;
  type: "in" | "out" | "adjust" | "fulfill";
  quantity: number;
  reason: string | null;
  createdAt: string;

  inventoryItem: {
    id: string;
    name: string;
    type: string;
    manufacturer: string | null;
    description: string | null;
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
    <div className="flex flex-col gap-6 sm:gap-8 animate-slide-in-bottom">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Package className="size-4 text-primary" />
            <span className="text-sm font-medium text-primary">Transaction History</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text">
            Inventory Transactions
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Track all inventory movements and adjustments
          </p>
        </div>
      </div>

      {/* Modern Filters Card */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-primary" />
            <CardTitle>Filters & Actions</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Row 1: Item + Type */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Item Filter */}
            <div className="space-y-2">
              <Label className="font-semibold">Item</Label>
              <Select value={itemId} onValueChange={(v) => { setItemId(v); setPage(1) }}>
                <SelectTrigger className="border-2 focus:border-primary">
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
            <div className="space-y-2">
              <Label className="font-semibold">Transaction Type</Label>
              <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
                <SelectTrigger className="border-2 focus:border-primary">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="in">Stock In</SelectItem>
                  <SelectItem value="out">Stock Out</SelectItem>
                  <SelectItem value="adjust">Adjustment</SelectItem>
                  <SelectItem value="fulfill">Fulfill</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* From Date */}
            <div className="space-y-2">
              <Label className="font-semibold">From Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                  type="date" 
                  value={from} 
                  onChange={(e) => setFrom(e.target.value)} 
                  className="pl-10 border-2 focus:border-primary"
                />
              </div>
            </div>

            {/* To Date */}
            <div className="space-y-2">
              <Label className="font-semibold">To Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                  type="date" 
                  value={to} 
                  onChange={(e) => setTo(e.target.value)}
                  className="pl-10 border-2 focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Actions Row */}
          <div className="flex flex-wrap gap-3 justify-between items-center pt-2">
            <Button onClick={() => transactionsQ.refetch()} variant="outline">
              Apply Filters
            </Button>
            <Button className="gap-2" onClick={exportCSV}>
              <ArrowDownToLine className="size-4" />
              Export to CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modern Transactions Table */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="size-5 text-primary" />
              <CardTitle>Transaction History</CardTitle>
            </div>
            <Badge variant="outline" className="px-3 py-1">{total} Records</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {transactionsQ.isLoading ? (
            <div className="flex items-center justify-center gap-3 p-12">
              <Spinner className="size-6 text-primary" />
              <span className="text-lg font-medium">Loading transactions...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-bold">Item Name</TableHead>
                      <TableHead className="font-bold">Transaction Type</TableHead>
                      <TableHead className="font-bold">Item Type</TableHead>
                      <TableHead className="font-bold">Quantity</TableHead>
                      <TableHead className="font-bold">Manufacturer</TableHead>
                      <TableHead className="font-bold">Reason</TableHead>
                      <TableHead className="font-bold">Created At</TableHead>
                      <TableHead className="text-right font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {paged.map((tx) => (
                      <TableRow key={tx.id} className="hover:bg-primary/5 transition-colors">
                        <TableCell>
                          <div className="font-semibold">{tx.inventoryItem.name}</div>
                          {tx.inventoryItem.description && (
                            <div className="text-xs text-muted-foreground truncate max-w-xs">
                              {tx.inventoryItem.description}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              tx.type === "in"
                                ? "default"
                                : tx.type === "out"
                                ? "destructive"
                                : tx.type === "fulfill"
                                ? "outline"
                                : "secondary"
                            }
                            className="gap-1.5 capitalize"
                          >
                            {tx.type === "in" && <TrendingUp className="size-3" />}
                            {tx.type === "out" && <TrendingDown className="size-3" />}
                            {tx.type === "fulfill" && <Package className="size-3" />}
                            {tx.type === "adjust" && <RefreshCw className="size-3" />}
                            {tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {tx.inventoryItem.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-semibold ${
                              tx.type === "in"
                                ? "text-green-600"
                                : tx.type === "out" || tx.type === "fulfill"
                                ? "text-red-600"
                                : ""
                            }`}
                          >
                            {tx.type === "in" ? "+" : tx.type === "out" || tx.type === "fulfill" ? "-" : ""}{tx.quantity}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {tx.inventoryItem.manufacturer || "-"}
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                          {tx.reason || "-"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {format(parseISO(tx.createdAt), "yyyy-MM-dd hh:mm a")}
                        </TableCell>
                        <TableCell className="text-right">
                          <TxViewDialog tx={tx}>
                            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                              <Eye className="size-4" />
                            </Button>
                          </TxViewDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Modern Pagination */}
              <div className="border-t border-border/50 bg-muted/20 px-6 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-sm font-medium">
                    {total ? `${start + 1}-${end} of ${total}` : "No records"}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      disabled={page === 1} 
                      onClick={() => setPage((p) => p - 1)}
                      className="border-2"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-sm px-3">Page {page}</span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      disabled={end >= total} 
                      onClick={() => setPage((p) => p + 1)}
                      className="border-2"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
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
          <p><strong>Item Type:</strong> {tx.inventoryItem.type}</p>
          <p><strong>Manufacturer:</strong> {tx.inventoryItem.manufacturer || "-"}</p>
          {tx.inventoryItem.description && (
            <p><strong>Description:</strong> {tx.inventoryItem.description}</p>
          )}
          <p><strong>Transaction Type:</strong> {tx.type}</p>
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
