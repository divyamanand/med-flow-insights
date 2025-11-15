import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfToday, subDays, startOfMonth } from "date-fns";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";

import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

/* ---------------- Types based ONLY on API response ---------------- */

type Prescription = {
  id: string;
  patientName: string | null;
  doctorName: string | null;
  date: string;
  diagnosis?: string | null;
};

const datePresets = [
  { key: "all", label: "All Time" },
  { key: "today", label: "Today" },
  { key: "last7", label: "Last 7 Days" },
  { key: "thisMonth", label: "This Month" },
];

export default function Prescriptions() {
  /* ------- Filters ------- */
  const [patientSearch, setPatientSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [range, setRange] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  /* ------- Pagination ------- */
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* ------- Computed Date Range ------- */
  const computedRange = useMemo(() => {
    if (range === "today") {
      const d = startOfToday();
      return {
        from: format(d, "yyyy-MM-dd"),
        to: format(d, "yyyy-MM-dd"),
      };
    }
    if (range === "last7") {
      const end = startOfToday();
      const start = subDays(end, 6);
      return {
        from: format(start, "yyyy-MM-dd"),
        to: format(end, "yyyy-MM-dd"),
      };
    }
    if (range === "thisMonth") {
      const start = startOfMonth(new Date());
      const end = startOfToday();
      return {
        from: format(start, "yyyy-MM-dd"),
        to: format(end, "yyyy-MM-dd"),
      };
    }
    return { from: "", to: "" };
  }, [range]);

  const effectiveFrom = from || computedRange.from || undefined;
  const effectiveTo = to || computedRange.to || undefined;

  /* ------- Single API Call ------- */
  const prescriptionsQ = useQuery<Prescription[]>({
    queryKey: [
      "prescriptions",
      { patientSearch, doctorSearch, effectiveFrom, effectiveTo },
    ],
    queryFn: () =>
      api.get("/prescriptions", {
        searchPatient: patientSearch || undefined,
        searchDoctor: doctorSearch || undefined,
        from: effectiveFrom,
        to: effectiveTo,
      }),
  });

  /* ------- Local filtering since API gives names directly ------- */
  const filtered = useMemo(() => {
    let list = prescriptionsQ.data ?? [];

    if (patientSearch.trim()) {
      const q = patientSearch.toLowerCase();
      list = list.filter((x) =>
        (x.patientName ?? "").toLowerCase().includes(q)
      );
    }

    if (doctorSearch.trim()) {
      const q = doctorSearch.toLowerCase();
      list = list.filter((x) =>
        (x.doctorName ?? "").toLowerCase().includes(q)
      );
    }

    return list;
  }, [prescriptionsQ.data, patientSearch, doctorSearch]);

  /* ------- Pagination logic ------- */
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const pageRows = filtered.slice(start, end);

  /* ------- Reset pagination on filter ------- */
  function applyFilters() {
    setPage(1);
    prescriptionsQ.refetch();
  }

  function clearFilters() {
    setPatientSearch("");
    setDoctorSearch("");
    setRange("all");
    setFrom("");
    setTo("");
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">
            Prescription Management
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Patient Name
              </div>
              <Input
                placeholder="Search patient..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
              />
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Doctor Name
              </div>
              <Input
                placeholder="Search doctor..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
              />
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">
                Date Range
              </div>
              <Select value={range} onValueChange={(v) => setRange(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Range" />
                </SelectTrigger>
                <SelectContent>
                  {datePresets.map((p) => (
                    <SelectItem key={p.key} value={p.key}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date inputs */}
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto] items-end">
            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
            <Input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            <Button onClick={applyFilters}>Apply</Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </div>

          {/* Add New */}
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 size-4" /> Add Prescription
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Prescription (Demo)</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                Add form goes here.
              </p>
              <DialogFooter>
                <Button>Create (Demo)</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {prescriptionsQ.isLoading ? (
            <div className="flex justify-center p-10">
              <Spinner className="size-6" />
            </div>
          ) : prescriptionsQ.error ? (
            <div className="text-destructive">
              {(prescriptionsQ.error as Error).message}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {pageRows.map((rx) => (
                    <TableRow key={rx.id}>
                      <TableCell>{rx.id}</TableCell>
                      <TableCell>{rx.patientName ?? "-"}</TableCell>
                      <TableCell>{rx.doctorName ?? "-"}</TableCell>
                      <TableCell>{rx.diagnosis ?? ""}</TableCell>
                      <TableCell>
                        {format(new Date(rx.date), "PP")}
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="size-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Pencil className="size-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Separator className="my-4" />

              {/* Pagination */}
              <div className="flex items-center justify-between">
                <div>
                  Showing {total === 0 ? 0 : start + 1} to {end} of {total}{" "}
                  entries
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    {"<"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={end >= total}
                    onClick={() => setPage((p) => p + 1)}
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
