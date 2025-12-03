import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO, isBefore } from "date-fns";

import { api } from "@/lib/axios";
import { useAuth } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
  Package, 
  ArrowLeft, 
  AlertCircle, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  FileText,
  Building2,
  Info
} from "lucide-react";

/* ---------------- Types ---------------- */

type InventoryItemDetail = {
  id: string;
  name: string;
  type: "medicine" | "equipment" | "blood" | "supply";
  manufacturer: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type StockEntry = {
  stockId: string;
  itemId: string;
  name: string;
  quantity: number;
  expiry: string | null;
  notes: string | null;
  created: Date;
  updated: Date;
};

/* ---------------- Component ---------------- */

export default function InventoryItemDetail() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  /* ---------------- Pagination ---------------- */
  const [page, setPage] = useState(1);
  const pageSize = 10;

  /* ---------------- Query Item Details ---------------- */
  const { data: itemDetails, isLoading: isLoadingItem, error: itemError } = useQuery<InventoryItemDetail[]>({
    queryKey: ["inventory-item-by-name", name],
    queryFn: () => api.get(`/inventory/by-name/${encodeURIComponent(name || "")}`),
    enabled: !!name,
  });

  const item = itemDetails?.[0]; // Get first match

  /* ---------------- Query Stock Entries ---------------- */
  const { data: stockData, isLoading: isLoadingStock } = useQuery<StockEntry[]>({
    queryKey: ["inventory", {}],
    queryFn: () => api.get("/inventory", {}),
    enabled: !!item,
  });

  /* ---------------- Filter stock entries for this item ---------------- */
  const itemStocks = useMemo(() => {
    if (!stockData || !item) return [];
    return stockData.filter(stock => stock.itemId === item.id);
  }, [stockData, item]);

  /* ---------------- Calculate total quantity ---------------- */
  const totalQuantity = useMemo(() => {
    return itemStocks.reduce((sum, stock) => sum + stock.quantity, 0);
  }, [itemStocks]);

  /* ---------------- Pagination Logic ---------------- */
  const total = itemStocks.length;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const rows = itemStocks.slice(start, end);

  /* ---------------- Helpers ---------------- */
  const today = new Date();

  const allowed = user?.role === "admin" || user?.role === "pharmacist" || user?.role === "inventory";

  /* ---------------- UI ---------------- */
  if (isLoadingItem) {
    return (
      <div className="flex items-center justify-center gap-3 p-12">
        <Spinner className="size-6 text-primary" />
        <span className="text-lg font-medium">Loading item details...</span>
      </div>
    );
  }

  if (itemError || !item) {
    return (
      <div className="flex flex-col gap-6 sm:gap-8 animate-slide-in-bottom">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/inventory")}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Back to Inventory
          </Button>
        </div>
        <Card className="border-2 border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="size-5" />
              <span className="font-medium">Item not found</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-slide-in-bottom">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/inventory")}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Back to Inventory
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Package className="size-4 text-primary" />
            <span className="text-sm font-medium text-primary capitalize">{item.type}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text">
            {item.name}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Item details and stock information
          </p>
        </div>
      </div>

      {!allowed && (
        <Card className="border-2 border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="size-5" />
              <span className="font-medium">You do not have access to view inventory details.</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Item Details Card */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Details */}
        <Card className="border-2 border-border/50 shadow-lg glass-effect">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="size-5 text-primary" />
              <CardTitle>Item Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="text-sm font-semibold text-muted-foreground">Item Type</div>
                <Badge variant="outline" className="mt-1 capitalize">{item.type}</Badge>
              </div>

              {item.manufacturer && (
                <div>
                  <div className="text-sm font-semibold text-muted-foreground flex items-center gap-1">
                    <Building2 className="size-3" />
                    Manufacturer
                  </div>
                  <div className="mt-1 font-medium">{item.manufacturer}</div>
                </div>
              )}

              {item.description && (
                <div>
                  <div className="text-sm font-semibold text-muted-foreground">Description</div>
                  <div className="mt-1 text-sm">{item.description}</div>
                </div>
              )}

              <div>
                <div className="text-sm font-semibold text-muted-foreground">Created</div>
                <div className="mt-1 text-sm">{format(new Date(item.createdAt), "PPP")}</div>
              </div>

              <div>
                <div className="text-sm font-semibold text-muted-foreground">Last Updated</div>
                <div className="mt-1 text-sm">{format(new Date(item.updatedAt), "PPP")}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Summary */}
        <Card className="border-2 border-border/50 shadow-lg glass-effect">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Package className="size-5 text-primary" />
              <CardTitle>Stock Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="text-sm font-semibold text-muted-foreground">Total Quantity</div>
                <div className="mt-2">
                  <Badge
                    variant={totalQuantity === 0 ? "destructive" : totalQuantity < 20 ? "outline" : "default"}
                    className="text-2xl font-bold px-4 py-2"
                  >
                    {totalQuantity}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-muted-foreground">Stock Entries</div>
                <div className="mt-1 text-lg font-semibold">{itemStocks.length}</div>
              </div>

              {itemStocks.some(stock => stock.expiry && isBefore(parseISO(stock.expiry), today)) && (
                <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md">
                  <AlertCircle className="size-5" />
                  <span className="font-medium text-sm">Some stock entries have expired</span>
                </div>
              )}
            </div>

            <div className="pt-4">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => navigate(`/inventory/transactions?itemId=${item.id}`)}
              >
                <FileText className="size-4" />
                View Transaction History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Entries Table */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
          <div className="flex items-center gap-2">
            <Package className="size-5 text-primary" />
            <CardTitle>Stock Entries</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoadingStock ? (
            <div className="flex items-center justify-center gap-3 p-12">
              <Spinner className="size-6 text-primary" />
              <span className="text-lg font-medium">Loading stock entries...</span>
            </div>
          ) : itemStocks.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-muted-foreground">No stock entries found for this item</div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-bold">Stock ID</TableHead>
                      <TableHead className="font-bold">Quantity</TableHead>
                      <TableHead className="font-bold">Expiry Date</TableHead>
                      <TableHead className="font-bold">Notes</TableHead>
                      <TableHead className="font-bold">Created</TableHead>
                      <TableHead className="font-bold">Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {rows.map((stock) => {
                      let expired = false;
                      try {
                        expired = !!(stock.expiry && isBefore(parseISO(stock.expiry), today));
                      } catch {
                        expired = false;
                      }

                      return (
                        <TableRow
                          key={stock.stockId}
                          className={`transition-colors ${
                            expired ? "bg-destructive/10 hover:bg-destructive/20" : "hover:bg-primary/5"
                          }`}
                        >
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            {stock.stockId.slice(0, 8)}...
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant={stock.quantity === 0 ? "destructive" : stock.quantity < 20 ? "outline" : "secondary"}
                              className="font-semibold"
                            >
                              {stock.quantity}
                            </Badge>
                          </TableCell>

                          <TableCell>
                            {stock.expiry ? (
                              <div className={`flex items-center gap-2 ${expired ? 'text-destructive font-semibold' : ''}`}>
                                <Calendar className="size-4" />
                                <span>{format(parseISO(stock.expiry), "yyyy-MM-dd")}</span>
                                {expired && <AlertCircle className="size-4" />}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </TableCell>

                          <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                            {stock.notes || "—"}
                          </TableCell>

                          <TableCell className="text-muted-foreground text-sm">
                            {format(new Date(stock.created), "yyyy-MM-dd HH:mm")}
                          </TableCell>

                          <TableCell className="text-muted-foreground text-sm">
                            {format(new Date(stock.updated), "yyyy-MM-dd HH:mm")}
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
                      ? `Showing ${start + 1}–${end} of ${total} entries`
                      : "No entries"}
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
