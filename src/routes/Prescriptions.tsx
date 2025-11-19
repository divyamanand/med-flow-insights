import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, startOfToday, subDays, startOfMonth } from "date-fns";
import { Eye, Pencil, Plus, Trash2, FileText, Filter, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="flex flex-col gap-6 sm:gap-8 animate-slide-in-bottom">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <FileText className="size-4 text-primary" />
            <span className="text-sm font-medium text-primary">Medical Records</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text">
            Prescription Management
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            View, manage, and track patient prescriptions
          </p>
        </div>
      </div>

      {/* Modern Filters Card */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="size-5 text-primary" />
            <CardTitle>Filters & Search</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label className="font-semibold">Patient Name</Label>
              <Input
                placeholder="Search patient..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="border-2 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Doctor Name</Label>
              <Input
                placeholder="Search doctor..."
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="border-2 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Date Range</Label>
              <Select value={range} onValueChange={(v) => setRange(v)}>
                <SelectTrigger className="border-2 focus:border-primary">
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
          <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto_auto] items-end">
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
            <Button onClick={applyFilters} variant="default">Apply</Button>
            <Button variant="outline" onClick={clearFilters}>
              Clear
            </Button>
          </div>

          {/* Add New */}
          <div className="flex justify-end pt-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="size-4" />
                  Add Prescription
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
          </div>
        </CardContent>
      </Card>

      {/* Modern Prescriptions Table */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="size-5 text-primary" />
              <CardTitle>Prescriptions List</CardTitle>
            </div>
            <Badge variant="outline" className="px-3 py-1">{total} Total</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {prescriptionsQ.isLoading ? (
            <div className="flex items-center justify-center gap-3 p-12">
              <Spinner className="size-6 text-primary" />
              <span className="text-lg font-medium">Loading prescriptions...</span>
            </div>
          ) : prescriptionsQ.error ? (
            <div className="p-12 text-center">
              <div className="text-destructive font-medium">
                {(prescriptionsQ.error as Error).message}
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="font-bold">ID</TableHead>
                      <TableHead className="font-bold">Patient</TableHead>
                      <TableHead className="font-bold">Doctor</TableHead>
                      <TableHead className="font-bold">Diagnosis</TableHead>
                      <TableHead className="font-bold">Date</TableHead>
                      <TableHead className="text-right font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {pageRows.map((rx) => (
                      <TableRow key={rx.id} className="hover:bg-primary/5 transition-colors">
                        <TableCell className="font-mono text-muted-foreground">{rx.id}</TableCell>
                        <TableCell className="font-semibold">{rx.patientName ?? "-"}</TableCell>
                        <TableCell>{rx.doctorName ?? "-"}</TableCell>
                        <TableCell className="max-w-xs truncate">{rx.diagnosis ?? "-"}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {format(new Date(rx.date), "PP")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                              <Eye className="size-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="hover:bg-accent/10">
                              <Pencil className="size-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="hover:bg-destructive/10">
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </div>
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
                    Showing {total === 0 ? 0 : start + 1} to {end} of {total} entries
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="border-2"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <span className="text-sm px-3">Page {page}</span>
                    <Button
                      variant="outline"
                      size="sm"
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
