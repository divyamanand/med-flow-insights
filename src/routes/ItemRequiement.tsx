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
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      {/* Top bar */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold flex-1">Hospital Supply Management System</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>+ Add New Requirement</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Item Requirement</DialogTitle>
            </DialogHeader>
            <CreateItemForm onSubmit={createReq.mutate} />
            <DialogFooter>
              <Button>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* ---------------- LEFT FILTER PANEL ---------------- */}
        <Card>
          <CardContent className="pt-6 space-y-6">
            <p className="text-sm font-semibold tracking-wide text-muted-foreground">FILTERS</p>
            {/* Kind Filter */}
            <div>
              <p className="font-medium mb-2">Kind</p>
              <RadioGroup
                value={filterKind}
                onValueChange={setFilterKind}
                className="space-y-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="all" id="kind-all" />
                  <Label htmlFor="kind-all">All</Label>
                </div>
                {KIND_OPTIONS.map((k) => (
                  <div key={k} className="flex items-center gap-2">
                    <RadioGroupItem value={k} id={`kind-${k}`} />
                    <Label htmlFor={`kind-${k}`}>{k}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Status Filter */}
            <div>
              <p className="font-medium mb-2">Status</p>
              <RadioGroup
                value={filterStatus}
                onValueChange={setFilterStatus}
                className="space-y-2"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="all" id="st-all" />
                  <Label htmlFor="st-all">All</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="open" id="st-open" />
                  <Label htmlFor="st-open">Open</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="inProgress" id="st-inp" />
                  <Label htmlFor="st-inp">In Progress</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="fulfilled" id="st-ful" />
                  <Label htmlFor="st-ful">Fulfilled</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="cancelled" id="st-cancel" />
                  <Label htmlFor="st-cancel">Cancelled</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Primary User Filter */}
            <div>
              <p className="font-medium mb-2">Requested By (primaryUserId)</p>
              <Input
                placeholder="Search user..."
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button className="w-full">Apply</Button>
              <Button variant="outline" className="w-full" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ---------------- RIGHT TABLE PANEL ---------------- */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Current Item Requirements</CardTitle>
          </CardHeader>

          <CardContent>
            {/* Table */}
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Fulfilled</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="whitespace-nowrap flex items-center gap-2">
                        <span>{r.id}</span>
                        <Badge variant="secondary">{r.kind}</Badge>
                      </TableCell>
                      <TableCell>{r.quantity}</TableCell>
                      <TableCell>{r.fulfilled ?? 0}</TableCell>
                      <TableCell>
                        {r.status === "fulfilled" && <Badge>{"Completed"}</Badge>}
                        {r.status === "inProgress" && <Badge variant="secondary">In Progress</Badge>}
                        {r.status === "open" && <Badge variant="outline">Pending</Badge>}
                        {r.status === "cancelled" && <Badge variant="destructive">Cancelled</Badge>}
                      </TableCell>
                      <TableCell>{r.primaryUserId}</TableCell>

                      <TableCell className="text-right space-x-2">
                        {/* View */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">View</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Item Requirement</DialogTitle>
                            </DialogHeader>

                            <div className="text-sm space-y-2">
                              <p><b>ID:</b> {r.id}</p>
                              <p><b>Kind:</b> {r.kind}</p>
                              <p><b>Quantity:</b> {r.quantity}</p>
                              <p><b>Status:</b> {r.status}</p>
                              <p><b>Requested By:</b> {r.primaryUserId}</p>
                              <p><b>Notes:</b> {r.notes || "—"}</p>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Fulfillments */}
                        <Button asChild size="sm" variant="outline">
                          <Link to={`/requirements/items/${r.id}/fulfillments`}>Fulfillments</Link>
                        </Button>

                        {/* Approve */}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            updateReq.mutate({
                              id: r.id,
                              body: { status: "inProgress" },
                            })
                          }
                        >
                          Approve
                        </Button>

                        {/* Cancel */}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            updateReq.mutate({
                              id: r.id,
                              body: { status: "cancelled" },
                            })
                          }
                        >
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
              <p>
                Showing {start + 1}–{end} of {filtered.length}
              </p>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>« Prev</Button>
                <div className="px-2">{page}</div>
                <Button variant="outline" size="sm" disabled={end >= filtered.length} onClick={() => setPage(page + 1)}>Next »</Button>
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
