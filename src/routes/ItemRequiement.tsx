import { useState, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

/* -------------------------------- MOCK DATA -------------------------------- */

const MOCK_REQUIREMENTS = [
  {
    id: "REQ_001",
    kind: "Surgical Supplies",
    quantity: "100 units",
    status: "Pending",
    askedBy: "user_123",
  },
  {
    id: "REQ_002",
    kind: "Surgical Supplies",
    quantity: "500 pills",
    status: "Approved",
    askedBy: "user_123",
  },
  {
    id: "REQ_003",
    kind: "Medication",
    quantity: "500 pills",
    status: "Pending",
    askedBy: "user_123",
  },
  {
    id: "REQ_004",
    kind: "Equipment",
    quantity: "20 reams",
    status: "Ordered",
    askedBy: "user_125",
  },
  {
    id: "REQ_005",
    kind: "Surgical Supplies",
    quantity: "250 units",
    status: "Pending",
    askedBy: "user_123",
  },
];

/* --------------------------------------------------------------------------- */

export default function ItemRequirementsManagement() {
  /* ------------------------- Filters ------------------------- */
  const [kind, setKind] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [askedBy, setaskedBy] = useState<string>("");

  /* ------------------------- Pagination ------------------------- */
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  /* ------------------------- Filter Logic ------------------------- */
  const filtered = useMemo(() => {
    return MOCK_REQUIREMENTS.filter((r) => {
      if (kind && r.kind !== kind) return false;
      if (status && r.status !== status) return false;
      if (askedBy && !r.askedBy.includes(askedBy)) return false;
      return true;
    });
  }, [kind, status, askedBy]);

  const start = (page - 1) * rowsPerPage;
  const end = Math.min(start + rowsPerPage, filtered.length);
  const rows = filtered.slice(start, end);

  function resetFilters() {
    setKind("");
    setStatus("");
    setaskedBy("");
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6">
      <h1 className="text-2xl font-semibold">Item Requirements Management</h1>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">

        {/* -------------------------- LEFT FILTER PANEL -------------------------- */}
        <Card>
          <CardContent className="pt-6 space-y-6">

            {/* Kind Filter */}
            <div>
              <p className="font-medium mb-2">Kind</p>
              <RadioGroup value={kind} onValueChange={setKind} className="space-y-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Surgical Supplies" id="kind1" />
                  <Label htmlFor="kind1">Surgical Supplies</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Medication" id="kind2" />
                  <Label htmlFor="kind2">Medication</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Office Supplies" id="kind3" />
                  <Label htmlFor="kind3">Office Supplies</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Status Filter */}
            <div>
              <p className="font-medium mb-2">Status</p>
              <RadioGroup value={status} onValueChange={setStatus} className="space-y-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Pending" id="st1" />
                  <Label htmlFor="st1">Pending</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Ordered" id="st2" />
                  <Label htmlFor="st2">Ordered</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Received" id="st3" />
                  <Label htmlFor="st3">Received</Label>
                </div>
              </RadioGroup>
            </div>

            {/* askedBy Filter */}
            <div>
              <p className="font-medium mb-2">askedBy (User ID)</p>
              <Input
                placeholder="Search askedBy..."
                value={askedBy}
                onChange={(e) => setaskedBy(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button className="w-full">Apply Filters</Button>
              <Button variant="outline" className="w-full" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* -------------------------- RIGHT TABLE PANEL -------------------------- */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-xl">Current Item Requirements</CardTitle>

            <Dialog>
              <DialogTrigger asChild>
                <Button>+ Add New Requirement</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Requirement (Demo)</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">Form goes here…</p>
                <DialogFooter>
                  <Button>Create (Demo)</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent>
            {/* Table */}
            <div className="overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Kind</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>askedBy</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.id}</TableCell>
                      <TableCell>{r.kind}</TableCell>
                      <TableCell>{r.quantity}</TableCell>
                      <TableCell>{r.status}</TableCell>
                      <TableCell>{r.askedBy}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm">Update</Button>
                        <Button size="sm" variant="destructive">Delete</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 text-sm">
              <p>Page 1 of 10</p>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">{'<'}</Button>
                <Button variant="outline" size="sm">{'>'}</Button>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
