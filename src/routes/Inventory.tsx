import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, isBefore, parseISO } from "date-fns";

import { api } from "@/lib/axios";
import { useAuth } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Package, Search, Plus, Filter, AlertCircle, Calendar, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

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
    <div className="flex flex-col gap-6 sm:gap-8 animate-slide-in-bottom">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Package className="size-4 text-primary" />
            <span className="text-sm font-medium text-primary">Stock Management</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text">
            Inventory Management
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Track medicines, equipment, and supplies
          </p>
        </div>
      </div>

      {!allowed && (
        <Card className="border-2 border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="size-5" />
              <span className="font-medium">You do not have access to view inventory. (Allowed: admin, pharmacist, inventory)</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modern Filters Card */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-primary" />
            <CardTitle>Filters & Actions</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            {/* Search */}
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                className="pl-10 border-2 focus:border-primary transition-colors"
                placeholder="Search by Name…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Low Stock */}
              <Badge
                className={`cursor-pointer px-3 py-1.5 ${
                  lowStock ? "bg-warning text-warning-foreground hover:bg-warning/90" : "bg-muted hover:bg-muted/80"
                }`}
                onClick={toggleLowStock}
              >
                {lowStock ? `Low Stock <${lowStock}` : "All Stock"}
              </Badge>

              {/* Type */}
              <Badge 
                className="cursor-pointer bg-accent text-accent-foreground hover:bg-accent/90 px-3 py-1.5 capitalize" 
                onClick={cycleType}
              >
                Type: {typeFilter}
              </Badge>

              {/* Expiry Filter */}
              <Badge
                className={`cursor-pointer px-3 py-1.5 gap-1.5 ${
                  expiryBefore ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-muted hover:bg-muted/80"
                }`}
                onClick={toggleExpiry}
              >
                <Calendar className="size-3" />
                {expiryBefore ? `Expires before ${expiryBefore}` : "All Expiry"}
              </Badge>
            </div>
          </div>

          {/* Add New Item */}
          <div className="flex justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="size-4" />
                  Add Inventory Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Inventory Item (Demo)</DialogTitle>
                  <DialogDescription>
                    Add a new item to the hospital inventory.
                  </DialogDescription>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                  Placeholder form here…
                </p>
                <DialogFooter>
                  <Button>Create (Demo)</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Modern Inventory Table */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
          <div className="flex items-center gap-2">
            <Package className="size-5 text-primary" />
            <CardTitle>Inventory Items</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 p-12">
              <Spinner className="size-6 text-primary" />
              <span className="text-lg font-medium">Loading inventory...</span>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <div className="text-destructive font-medium">
                {(error as Error).message}
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-bold">Name</TableHead>
                      <TableHead className="font-bold">Quantity</TableHead>
                      <TableHead className="font-bold">Unit</TableHead>
                      <TableHead className="font-bold">Expiry</TableHead>
                      <TableHead className="text-right font-bold">Actions</TableHead>
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
                          className={`transition-colors ${
                            expired ? "bg-destructive/10 hover:bg-destructive/20" : "hover:bg-primary/5"
                          }`}
                        >
                          <TableCell className="font-medium">{item.name}</TableCell>

                          <TableCell>
                            <Badge
                              variant={item.quantity === 0 ? "destructive" : item.quantity < 20 ? "outline" : "secondary"}
                              className="font-semibold"
                            >
                              {item.quantity}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-muted-foreground">{item.unit ?? "N/A"}</TableCell>

                          <TableCell>
                            {item.expiry ? (
                              <div className={`flex items-center gap-2 ${expired ? 'text-destructive font-semibold' : ''}`}>
                                <Calendar className="size-4" />
                                <span>{format(parseISO(item.expiry), "yyyy-MM-dd")}</span>
                                {expired && <AlertCircle className="size-4" />}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </TableCell>

                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                              <Trash2 className="size-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Modern Pagination */}
              <div className="border-t border-border/50 bg-muted/20 px-6 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-sm font-medium">
                    {total
                      ? `Showing ${start + 1}–${end} of ${total} items`
                      : "No items"}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="border-2"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-sm px-3">Page {page}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={end >= total}
                      onClick={() => setPage(page + 1)}
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
