import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Package, Filter, Eye, CheckCircle, XCircle, Link as LinkIcon, ChevronLeft, ChevronRight } from "lucide-react";

/* ---------------- Types matching your backend ---------------- */
type ItemRequirement = {
  id: string;
  primaryUserId: string;
  kind: "equipment" | "blood";
  quantity: number;
  fulfilled?: number;
  notes?: string;
  status: "open" | "inProgress" | "fulfilled" | "cancelled";
};

const KIND_OPTIONS = ["equipment", "blood"];

/* ------------------------------------------------------------------ */
export default function ItemRequirementsManagement() {
  const queryClient = useQueryClient();

  /* ---------------- Filters ---------------- */
  const [filterKind, setFilterKind] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterUser, setFilterUser] = useState("");

  /* ---------------- Pagination ---------------- */
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  /* ---------------- Fetch Requirements ---------------- */
  const reqQ = useQuery({
    queryKey: ["item-reqs"],
    queryFn: async (): Promise<ItemRequirement[]> => {
      const res = await api.get("/requirements/items");
      return res.data;
    },
    staleTime: 30000,
  });

  /* ---------------- Create Mutation ---------------- */
  const createReq = useMutation({
    mutationFn: (body: {
      primaryUserId: string;
      kind: "equipment" | "blood";
      quantity: number;
      notes?: string;
    }) => api.post("/requirements/items", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["item-reqs"] }),
  });

  /* ---------------- Update Mutation ---------------- */
  const updateReq = useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: Partial<ItemRequirement>;
    }) => api.patch(`/requirements/items/${id}`, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["item-reqs"] }),
  });

  /* ---------------- Filtering Logic ---------------- */
  const filtered = useMemo(() => {
    let data = reqQ.data ?? [];

    if (filterKind !== "all") data = data.filter((r) => r.kind === filterKind);
    if (filterStatus !== "all") data = data.filter((r) => r.status === filterStatus);

    if (filterUser.trim())
      data = data.filter((r) =>
        r.primaryUserId.toLowerCase().includes(filterUser.toLowerCase())
      );

    return data;
  }, [reqQ.data, filterKind, filterStatus, filterUser]);

  /* ---------------- Pagination ---------------- */
  const start = (page - 1) * rowsPerPage;
  const end = Math.min(start + rowsPerPage, filtered.length);
  const rows = filtered.slice(start, end);

  function resetFilters() {
    setFilterKind("all");
    setFilterStatus("all");
    setFilterUser("");
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-6 sm:gap-8">
      {/* Top bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight gradient-text flex-1">
          Item Requirements
        </h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Package className="size-4" />
              Add Requirement
            </Button>
          </DialogTrigger>
          <DialogContent className="border-2 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="size-5 text-primary" />
                Create Item Requirement
              </DialogTitle>
              <DialogDescription>
                Create a new item requirement for equipment or blood supplies.
              </DialogDescription>
            </DialogHeader>
            <CreateItemForm onSubmit={createReq.mutate} />
            <DialogFooter>
              <Button>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* ---------------- LEFT FILTER PANEL ---------------- */}
        <Card className="border-2 shadow-lg glass-effect h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Filter className="size-5 text-accent" />
              </div>
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Kind Filter */}
            <div>
              <p className="font-semibold mb-3">Kind</p>
              <RadioGroup
                value={filterKind}
                onValueChange={setFilterKind}
                className="space-y-2"
              >
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="all" id="kind-all" />
                  <Label htmlFor="kind-all" className="cursor-pointer flex-1">All</Label>
                </div>
                {KIND_OPTIONS.map((k) => (
                  <div key={k} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={k} id={`kind-${k}`} />
                    <Label htmlFor={`kind-${k}`} className="cursor-pointer flex-1 capitalize">{k}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Status Filter */}
            <div>
              <p className="font-semibold mb-3">Status</p>
              <RadioGroup
                value={filterStatus}
                onValueChange={setFilterStatus}
                className="space-y-2"
              >
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="all" id="st-all" />
                  <Label htmlFor="st-all" className="cursor-pointer flex-1">All</Label>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="open" id="st-open" />
                  <Label htmlFor="st-open" className="cursor-pointer flex-1">Open</Label>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="inProgress" id="st-inp" />
                  <Label htmlFor="st-inp" className="cursor-pointer flex-1">In Progress</Label>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="fulfilled" id="st-ful" />
                  <Label htmlFor="st-ful" className="cursor-pointer flex-1">Fulfilled</Label>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="cancelled" id="st-cancel" />
                  <Label htmlFor="st-cancel" className="cursor-pointer flex-1">Cancelled</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Primary User Filter */}
            <div>
              <p className="font-semibold mb-3">Requested By</p>
              <Input
                placeholder="Search user..."
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="border-2"
              />
            </div>

            <div className="flex gap-2">
              <Button className="w-full gap-2">
                <Filter className="size-4" />
                Apply
              </Button>
              <Button variant="outline" className="w-full" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ---------------- RIGHT TABLE PANEL ---------------- */}
        <Card className="border-2 shadow-lg glass-effect">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="size-5 text-primary" />
              </div>
              Current Item Requirements
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Table */}
            <div className="overflow-auto max-h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow className="border-muted/50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Quantity</TableHead>
                    <TableHead className="font-semibold">Fulfilled</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Requested By</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/50 transition-colors border-muted/30">
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-muted-foreground">#{r.id}</span>
                          <Badge variant="secondary" className="capitalize">{r.kind}</Badge>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant="outline">{r.quantity}</Badge></TableCell>
                      <TableCell><Badge variant="outline">{r.fulfilled ?? 0}</Badge></TableCell>
                      <TableCell>
                        {r.status === "fulfilled" && <Badge variant="default">Completed</Badge>}
                        {r.status === "inProgress" && <Badge variant="secondary">In Progress</Badge>}
                        {r.status === "open" && <Badge variant="outline">Pending</Badge>}
                        {r.status === "cancelled" && <Badge variant="destructive">Cancelled</Badge>}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.primaryUserId}</TableCell>

                      <TableCell className="text-right space-x-2">
                        {/* View */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-1">
                              <Eye className="size-3" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="border-2 shadow-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Eye className="size-5 text-primary" />
                                Item Requirement Details
                              </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium text-muted-foreground">ID</span>
                                <span className="font-mono text-sm">#{r.id}</span>
                              </div>
                              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium text-muted-foreground">Kind</span>
                                <Badge className="capitalize">{r.kind}</Badge>
                              </div>
                              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium text-muted-foreground">Quantity</span>
                                <Badge variant="outline">{r.quantity}</Badge>
                              </div>
                              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium text-muted-foreground">Status</span>
                                <Badge>{r.status}</Badge>
                              </div>
                              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium text-muted-foreground">Requested By</span>
                                <span className="text-sm">{r.primaryUserId}</span>
                              </div>
                              <div className="p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium text-muted-foreground block mb-2">Notes</span>
                                <p className="text-sm">{r.notes || "—"}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Fulfillments */}
                        <Button asChild size="sm" variant="outline" className="gap-1">
                          <Link to={`/requirements/items/${r.id}/fulfillments`}>
                            <LinkIcon className="size-3" />
                            Fulfillments
                          </Link>
                        </Button>

                        {/* Approve */}
                        <Button
                          size="sm"
                          variant="default"
                          className="gap-1"
                          onClick={() =>
                            updateReq.mutate({
                              id: r.id,
                              body: { status: "inProgress" },
                            })
                          }
                        >
                          <CheckCircle className="size-3" />
                          Approve
                        </Button>

                        {/* Cancel */}
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1"
                          onClick={() =>
                            updateReq.mutate({
                              id: r.id,
                              body: { status: "cancelled" },
                            })
                          }
                        >
                          <XCircle className="size-3" />
                          Cancel
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 text-sm">
              <p className="text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{start + 1}</span> to <span className="font-semibold text-foreground">{end}</span> of <span className="font-semibold text-foreground">{filtered.length}</span> results
              </p>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)} className="gap-1">
                  <ChevronLeft className="size-4" />
                  Previous
                </Button>
                <div className="px-3 py-1 bg-muted rounded-md font-medium">{page}</div>
                <Button variant="outline" size="sm" disabled={end >= filtered.length} onClick={() => setPage(page + 1)} className="gap-1">
                  Next
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Create Item Form ---------------- */
function CreateItemForm({
  onSubmit,
}: {
  onSubmit: (data: any) => void;
}) {
  const [primaryUserId, setPrimaryUserId] = useState("");
  const [kind, setKind] = useState<"equipment" | "blood">("equipment");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  return (
    <div className="flex flex-col gap-4 py-2">
      <Input
        placeholder="Primary User ID"
        value={primaryUserId}
        onChange={(e) => setPrimaryUserId(e.target.value)}
      />

      <RadioGroup
        value={kind}
        onValueChange={(v: any) => setKind(v)}
        className="space-y-2"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="equipment" id="kind-eq" />
          <Label htmlFor="kind-eq">Equipment</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="blood" id="kind-blood" />
          <Label htmlFor="kind-blood">Blood</Label>
        </div>
      </RadioGroup>

      <Input
        type="number"
        min={1}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />

      <Input
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <Button
        onClick={() =>
          onSubmit({
            primaryUserId,
            kind,
            quantity,
            notes: notes || undefined,
          })
        }
      >
        Create
      </Button>
    </div>
  );
}
