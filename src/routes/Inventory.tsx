import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, isBefore, parseISO } from "date-fns";

import { api } from "@/lib/axios";
import { useAuth } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

import { Separator } from "@/components/ui/separator";

/* ---------------- Types ---------------- */

type InventoryItem = {
  name: string;
  quantity: number;
  unit: string | null;
  expiry: string | null;
};

/* ---------------- Component ---------------- */

export default function InventoryManagement() {
  const { user } = useAuth();
  /* ---------------- Filters ---------------- */
  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] = useState<
    "all" | "medicine" | "blood" | "equipment"
  >("all");

  const [lowStock, setLowStock] = useState<number | null>(null);

  const [expiryBefore, setExpiryBefore] = useState<string>("");

  /* ---------------- Pagination ---------------- */
  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* ---------------- Query /inventory ---------------- */
  const { data, isLoading, error } = useQuery<InventoryItem[]>({
    queryKey: ["inventory", { typeFilter, lowStock, expiryBefore }],
    queryFn: () =>
      api.get("/inventory", {
        type: typeFilter === "all" ? undefined : typeFilter,
        lowStock: lowStock ?? undefined,
        expiryBefore: expiryBefore || undefined,
      }),
  });

  /* ---------------- Client Search Filter ---------------- */
  const filtered = useMemo(() => {
    let rows = data ?? [];

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => r.name.toLowerCase().includes(q));
    }

    return rows;
  }, [data, search]);

  /* ---------------- Pagination Logic ---------------- */
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const rows = filtered.slice(start, end);

  /* ---------------- Helpers ---------------- */
  const today = new Date();

  const toggleLowStock = () => {
    if (lowStock === null) setLowStock(20);
    else if (lowStock === 20) setLowStock(50);
    else setLowStock(null);
    setPage(1);
  };

  const cycleType = () => {
    setPage(1);
    if (typeFilter === "all") return setTypeFilter("medicine");
    if (typeFilter === "medicine") return setTypeFilter("blood");
    if (typeFilter === "blood") return setTypeFilter("equipment");
    return setTypeFilter("all");
  };

  const toggleExpiry = () => {
    if (!expiryBefore) setExpiryBefore("2025-12-31");
    else setExpiryBefore("");
    setPage(1);
  };

  /* ---------------- UI ---------------- */
  // Basic role-based access (frontend-only; backend enforces real auth)
  const allowed = user?.role === "admin" || user?.role === "pharmacist" || user?.role === "inventory";

  return (
    <div className="flex flex-col gap-6">
      {/* Header Container */}
      <Card className="rounded-xl shadow-md">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl sm:text-2xl">
            Inventory Management
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-4 pb-6 space-y-4">
          {!allowed && (
            <div className="text-sm text-destructive">
              You do not have access to view inventory. (Allowed: admin, pharmacist, inventory)
            </div>
          )}
          {/* Top Filters */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            {/* Search */}
            <Input
              className="max-w-xs"
              placeholder="Search by Name…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            <div className="flex gap-2">
              {/* Low Stock */}
              <Badge
                className={`cursor-pointer px-3 py-1 ${
                  lowStock ? "bg-green-700 text-white" : "bg-green-200"
                }`}
                onClick={toggleLowStock}
              >
                Low Stock {lowStock ? `<${lowStock}` : ""}
              </Badge>

              {/* Type */}
              <Badge className="cursor-pointer bg-blue-200 px-3 py-1" onClick={cycleType}>
                Type: {typeFilter}
              </Badge>

              {/* Expiry Filter */}
              <Badge
                className="cursor-pointer bg-yellow-200 px-3 py-1"
                onClick={toggleExpiry}
              >
                Expiry: {expiryBefore ? `Before ${expiryBefore}` : "All"}
              </Badge>
            </div>
          </div>

          {/* Add New Item */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white">+ Add Inventory Item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Inventory Item (Demo)</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                Placeholder form here…
              </p>
              <DialogFooter>
                <Button>Create (Demo)</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="text-center py-8">Loading…</div>
          ) : error ? (
            <div className="text-destructive py-4">
              {(error as Error).message}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Expiry</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {rows.map((item, idx) => {
                    let expired = false;
                    try {
                      expired = !!(item.expiry && isBefore(parseISO(item.expiry), today));
                    } catch {
                      expired = false;
                    }

                    return (
                      <TableRow
                        key={idx}
                        className={expired ? "bg-red-100" : ""}
                      >
                        <TableCell>{item.name}</TableCell>

                        <TableCell
                          className={
                            item.quantity === 0
                              ? "text-red-600 font-semibold"
                              : ""
                          }
                        >
                          {item.quantity}
                        </TableCell>

                        <TableCell>{item.unit ?? "N/A"}</TableCell>

                        <TableCell>
                          {item.expiry
                            ? format(parseISO(item.expiry), "yyyy-MM-dd")
                            : "N/A"}
                        </TableCell>

                        <TableCell>
                          <Button variant="ghost" className="text-red-500">
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <Separator className="my-4" />

              {/* Pagination */}
              <div className="flex items-center justify-between text-sm">
                <span>
                  {total
                    ? `Rows per page: ${pageSize} | ${start + 1}-${end} of ${total}`
                    : "No items"}
                </span>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    {"<"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={end >= total}
                    onClick={() => setPage(page + 1)}
                  >
                    {">"}
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
