import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isBefore, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Package, Search, Plus, Filter, AlertCircle, Calendar, Trash2, ChevronLeft, ChevronRight, Edit, FileText } from "lucide-react";

/* ---------------- Types ---------------- */

type InventoryItem = {
  stockId: string;
  itemId: string;
  name: string;
  quantity: number;
  expiry: string | null;
  notes: string | null;
  created: Date;
  updated: Date;
};

type AddItemRequest = {
  name: string;
  type: "medicine" | "equipment" | "blood" | "supply";
  manufacturer?: string;
  description?: string;
};

type AddItemResponse = {
  id: string;
  name: string;
  type: string;
  manufacturer: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type ItemSearchResult = {
  id: string;
  name: string;
  type: string;
  manufacturer: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type AddStockRequest = {
  quantity: number;
  expiry?: string;
  notes?: string;
};

type AddStockResponse = {
  id: string;
  inventoryItem: {
    id: string;
    name: string;
    type: "medicine" | "equipment" | "blood" | "supply";
    manufacturer: string | null;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  quantity: number;
  expiry: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type UpdateStockRequest = {
  quantity?: number;
  expiry?: string;
  notes?: string;
};

type UpdateStockResponse = {
  id: string;
  inventoryItem: {
    id: string;
    name: string;
    type: "medicine" | "equipment" | "blood" | "supply";
    manufacturer: string | null;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  quantity: number;
  expiry: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type DeleteStockResponse = {
  id: string;
  removed: boolean;
};

type RemoveExpiredResponse = {
  removed: number;
  ids: string[];
};

/* ---------------- Component ---------------- */

export default function InventoryManagement() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  /* ---------------- Add Item Dialog State ---------------- */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<AddItemRequest>({
    name: "",
    type: "medicine",
    manufacturer: "",
    description: "",
  });
  
  /* ---------------- Add Stock Dialog State ---------------- */
  const [stockDialogOpen, setStockDialogOpen] = useState(false);
  const [itemSearchQuery, setItemSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ItemSearchResult | null>(null);
  const [newStock, setNewStock] = useState<AddStockRequest>({
    quantity: 0,
    expiry: "",
    notes: "",
  });
  
  /* ---------------- Edit Stock Dialog State ---------------- */
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<InventoryItem | null>(null);
  const [editStock, setEditStock] = useState<UpdateStockRequest>({
    quantity: undefined,
    expiry: "",
    notes: "",
  });
  
  /* ---------------- Remove Expired Dialog State ---------------- */
  const [removeExpiredDialogOpen, setRemoveExpiredDialogOpen] = useState(false);
  
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
        itemType: typeFilter === "all" ? undefined : typeFilter,
        lowStock: lowStock ?? undefined,
        expiry: expiryBefore || undefined,
      }),
  });

  /* ---------------- Add Item Mutation ---------------- */
  const addItemMutation = useMutation<AddItemResponse, Error, AddItemRequest>({
    mutationFn: (itemData) => api.post("/inventory", itemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setDialogOpen(false);
      setNewItem({
        name: "",
        type: "medicine",
        manufacturer: "",
        description: "",
      });
    },
  });

  const handleAddItem = () => {
    if (!newItem.name.trim()) return;
    
    const payload: AddItemRequest = {
      name: newItem.name.trim(),
      type: newItem.type,
    };
    
    if (newItem.manufacturer?.trim()) {
      payload.manufacturer = newItem.manufacturer.trim();
    }
    
    if (newItem.description?.trim()) {
      payload.description = newItem.description.trim();
    }
    
    addItemMutation.mutate(payload);
  };

  /* ---------------- Item Search Query ---------------- */
  const { data: searchResults, isLoading: isSearching } = useQuery<ItemSearchResult[]>({
    queryKey: ["inventory-search", itemSearchQuery],
    queryFn: () => api.get(`/inventory/by-name/${encodeURIComponent(itemSearchQuery)}`),
    enabled: itemSearchQuery.trim().length > 0,
  });

  /* ---------------- Add Stock Mutation ---------------- */
  const addStockMutation = useMutation<AddStockResponse, Error, { itemId: string; data: AddStockRequest }>({
    mutationFn: ({ itemId, data }) => api.post(`/inventory/${itemId}/stock`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setStockDialogOpen(false);
      setItemSearchQuery("");
      setSelectedItem(null);
      setNewStock({
        quantity: 0,
        expiry: "",
        notes: "",
      });
    },
  });

  const handleAddStock = () => {
    if (!selectedItem || newStock.quantity <= 0) return;
    
    const payload: AddStockRequest = {
      quantity: newStock.quantity,
    };
    
    if (newStock.expiry?.trim()) {
      payload.expiry = newStock.expiry.trim();
    }
    
    if (newStock.notes?.trim()) {
      payload.notes = newStock.notes.trim();
    }
    
    addStockMutation.mutate({ itemId: selectedItem.id, data: payload });
  };

  /* ---------------- Update Stock Mutation ---------------- */
  const updateStockMutation = useMutation<UpdateStockResponse, Error, { itemId: string; stockId: string; data: UpdateStockRequest }>({
    mutationFn: ({ itemId, stockId, data }) => api.put(`/inventory/${itemId}/stock/${stockId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setEditDialogOpen(false);
      setEditingStock(null);
      setEditStock({
        quantity: undefined,
        expiry: "",
        notes: "",
      });
    },
  });

  const handleUpdateStock = () => {
    if (!editingStock) return;
    
    const payload: UpdateStockRequest = {};
    
    if (editStock.quantity !== undefined && editStock.quantity > 0) {
      payload.quantity = editStock.quantity;
    }
    
    if (editStock.expiry?.trim()) {
      payload.expiry = editStock.expiry.trim();
    }
    
    if (editStock.notes?.trim()) {
      payload.notes = editStock.notes.trim();
    }
    
    // Only proceed if there's something to update
    if (Object.keys(payload).length === 0) return;
    
    updateStockMutation.mutate({ 
      itemId: editingStock.itemId, 
      stockId: editingStock.stockId, 
      data: payload 
    });
  };

  /* ---------------- Delete Stock Mutation ---------------- */
  const deleteStockMutation = useMutation<DeleteStockResponse, Error, { itemId: string; stockId: string }>({
    mutationFn: ({ itemId, stockId }) => api.delete(`/inventory/${itemId}/stock/${stockId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  const handleDeleteStock = (item: InventoryItem) => {
    if (confirm(`Are you sure you want to delete stock for "${item.name}"? This will remove ${item.quantity} units.`)) {
      deleteStockMutation.mutate({ itemId: item.itemId, stockId: item.stockId });
    }
  };

  /* ---------------- Remove Expired Mutation ---------------- */
  const removeExpiredMutation = useMutation<RemoveExpiredResponse, Error>({
    mutationFn: () => api.post("/inventory/remove-expired", {}),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      setRemoveExpiredDialogOpen(false);
      alert(`Successfully removed ${data.removed} expired stock item(s).`);
    },
  });

  const handleRemoveExpired = () => {
    removeExpiredMutation.mutate();
  };

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
        
        {/* View Transaction Logs Button */}
        <div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate("/inventory/transactions")}
          >
            <FileText className="size-4" />
            View Transaction Logs
          </Button>
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

          {/* Add New Item & Stock */}
          <div className="flex justify-between items-center gap-2">
            {/* Remove Expired Button */}
            <Dialog open={removeExpiredDialogOpen} onOpenChange={setRemoveExpiredDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <AlertCircle className="size-4" />
                  Remove Expired
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Remove Expired Stock</DialogTitle>
                  <DialogDescription>
                    This will permanently remove all stock items that have expired. This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <div className="flex items-center gap-2 text-warning">
                    <AlertCircle className="size-5" />
                    <span className="font-medium">Warning: This action is irreversible</span>
                  </div>
                  
                  {removeExpiredMutation.isError && (
                    <div className="mt-4 text-sm text-destructive">
                      Error: {removeExpiredMutation.error?.message}
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setRemoveExpiredDialogOpen(false)}
                    disabled={removeExpiredMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleRemoveExpired}
                    disabled={removeExpiredMutation.isPending}
                    className="gap-2"
                  >
                    {removeExpiredMutation.isPending ? (
                      <>
                        <Spinner className="size-4" />
                        Removing...
                      </>
                    ) : (
                      <>
                        <Trash2 className="size-4" />
                        Remove Expired
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="flex gap-2">
            <Dialog open={stockDialogOpen} onOpenChange={setStockDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Package className="size-4" />
                  Add Stock
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Stock to Item</DialogTitle>
                  <DialogDescription>
                    Search for an item and add stock quantity.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  {/* Item Search */}
                  <div className="space-y-2">
                    <Label htmlFor="item-search">Search Item *</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                      <Input
                        id="item-search"
                        className="pl-10"
                        placeholder="Search by item name..."
                        value={itemSearchQuery}
                        onChange={(e) => {
                          setItemSearchQuery(e.target.value);
                          setSelectedItem(null);
                        }}
                      />
                    </div>
                    
                    {/* Search Results */}
                    {isSearching && itemSearchQuery && (
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <Spinner className="size-3" />
                        Searching...
                      </div>
                    )}
                    
                    {searchResults && searchResults.length > 0 && !selectedItem && (
                      <div className="border rounded-md max-h-48 overflow-y-auto">
                        {searchResults.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 hover:bg-accent cursor-pointer border-b last:border-b-0"
                            onClick={() => {
                              setSelectedItem(item);
                              setItemSearchQuery(item.name);
                            }}
                          >
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {item.type} {item.manufacturer && `• ${item.manufacturer}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {searchResults && searchResults.length === 0 && itemSearchQuery && !isSearching && (
                      <div className="text-sm text-muted-foreground">No items found</div>
                    )}
                    
                    {/* Selected Item */}
                    {selectedItem && (
                      <div className="border rounded-md p-3 bg-accent/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{selectedItem.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {selectedItem.type} {selectedItem.manufacturer && `• ${selectedItem.manufacturer}`}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(null);
                              setItemSearchQuery("");
                            }}
                          >
                            Change
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor="stock-quantity">Quantity *</Label>
                    <Input
                      id="stock-quantity"
                      type="number"
                      min="1"
                      placeholder="Enter quantity"
                      value={newStock.quantity || ""}
                      onChange={(e) => setNewStock({ ...newStock, quantity: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  {/* Expiry Date */}
                  <div className="space-y-2">
                    <Label htmlFor="stock-expiry">Expiry Date</Label>
                    <Input
                      id="stock-expiry"
                      type="date"
                      value={newStock.expiry}
                      onChange={(e) => setNewStock({ ...newStock, expiry: e.target.value })}
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="stock-notes">Notes</Label>
                    <Textarea
                      id="stock-notes"
                      placeholder="Optional notes"
                      value={newStock.notes}
                      onChange={(e) => setNewStock({ ...newStock, notes: e.target.value })}
                      rows={3}
                    />
                  </div>

                  {addStockMutation.isError && (
                    <div className="text-sm text-destructive">
                      Error: {addStockMutation.error?.message}
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setStockDialogOpen(false)}
                    disabled={addStockMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddStock}
                    disabled={!selectedItem || newStock.quantity <= 0 || addStockMutation.isPending}
                    className="gap-2"
                  >
                    {addStockMutation.isPending ? (
                      <>
                        <Spinner className="size-4" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Package className="size-4" />
                        Add Stock
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Stock Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Edit Stock</DialogTitle>
                  <DialogDescription>
                    Update stock details for {editingStock?.name}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-quantity">Quantity</Label>
                    <Input
                      id="edit-quantity"
                      type="number"
                      min="0"
                      placeholder="Enter quantity"
                      value={editStock.quantity ?? ""}
                      onChange={(e) => setEditStock({ ...editStock, quantity: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  {/* Expiry Date */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-expiry">Expiry Date</Label>
                    <Input
                      id="edit-expiry"
                      type="date"
                      value={editStock.expiry}
                      onChange={(e) => setEditStock({ ...editStock, expiry: e.target.value })}
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="edit-notes">Notes</Label>
                    <Textarea
                      id="edit-notes"
                      placeholder="Optional notes"
                      value={editStock.notes}
                      onChange={(e) => setEditStock({ ...editStock, notes: e.target.value })}
                      rows={3}
                    />
                  </div>

                  {updateStockMutation.isError && (
                    <div className="text-sm text-destructive">
                      Error: {updateStockMutation.error?.message}
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setEditDialogOpen(false)}
                    disabled={updateStockMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateStock}
                    disabled={updateStockMutation.isPending}
                    className="gap-2"
                  >
                    {updateStockMutation.isPending ? (
                      <>
                        <Spinner className="size-4" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="size-4" />
                        Update Stock
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="size-4" />
                  Add Inventory Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Inventory Item</DialogTitle>
                  <DialogDescription>
                    Add a new item to the hospital inventory system.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="item-name">Name *</Label>
                    <Input
                      id="item-name"
                      placeholder="e.g., Paracetamol 500mg"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <Label htmlFor="item-type">Type *</Label>
                    <Select
                      value={newItem.type}
                      onValueChange={(value) => setNewItem({ ...newItem, type: value as AddItemRequest["type"] })}
                    >
                      <SelectTrigger id="item-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medicine">Medicine</SelectItem>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="blood">Blood</SelectItem>
                        <SelectItem value="supply">Supply</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Manufacturer */}
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      placeholder="Optional"
                      value={newItem.manufacturer}
                      onChange={(e) => setNewItem({ ...newItem, manufacturer: e.target.value })}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Optional notes or description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  {addItemMutation.isError && (
                    <div className="text-sm text-destructive">
                      Error: {addItemMutation.error?.message}
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    disabled={addItemMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddItem}
                    disabled={!newItem.name.trim() || addItemMutation.isPending}
                    className="gap-2"
                  >
                    {addItemMutation.isPending ? (
                      <>
                        <Spinner className="size-4" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="size-4" />
                        Create Item
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            </div>
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
                      <TableHead className="font-bold">Expiry</TableHead>
                      <TableHead className="font-bold">Notes</TableHead>
                      <TableHead className="font-bold">Created</TableHead>
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
                          key={item.stockId}
                          className={`transition-colors ${
                            expired ? "bg-destructive/10 hover:bg-destructive/20" : "hover:bg-primary/5"
                          }`}
                        >
                          <TableCell>
                            <button
                              className="font-medium text-primary hover:underline text-left"
                              onClick={() => navigate(`/inventory/item/${encodeURIComponent(item.name)}`)}
                            >
                              {item.name}
                            </button>
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant={item.quantity === 0 ? "destructive" : item.quantity < 20 ? "outline" : "secondary"}
                              className="font-semibold"
                            >
                              {item.quantity}
                            </Badge>
                          </TableCell>

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

                          <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                            {item.notes || "—"}
                          </TableCell>

                          <TableCell className="text-muted-foreground text-sm">
                            {format(new Date(item.created), "yyyy-MM-dd")}
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-primary hover:bg-primary/10"
                                onClick={() => {
                                  setEditingStock(item);
                                  setEditStock({
                                    quantity: item.quantity,
                                    expiry: item.expiry ? format(parseISO(item.expiry), "yyyy-MM-dd") : "",
                                    notes: item.notes || "",
                                  });
                                  setEditDialogOpen(true);
                                }}
                              >
                                <Edit className="size-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteStock(item)}
                                disabled={deleteStockMutation.isPending}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
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
