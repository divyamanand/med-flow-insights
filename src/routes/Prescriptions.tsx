import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { format, startOfToday, subDays, startOfMonth } from "date-fns";
import { Eye, Pencil, Plus, Trash2, FileText, Filter, Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";
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

/* ---------------- Types based on API response ---------------- */

type Patient = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string | null;
    gender: string;
    phone: string;
    role: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
};

type Doctor = {
  id: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string | null;
    gender: string;
    phone: string;
    role: string;
    type: string;
    createdAt: string;
    updatedAt: string;
  };
};

type Prescription = {
  id: string;
  patient: Patient | null;
  doctor: Doctor | null;
  nextReview: string | null;
  diagnosis: string | null;
  notes: string | null;
  items: {
    id: string;
    name: string;
    dosage: string;
    duration: string;
    quantity: number;
    dayDivide: string;
    method: string;
    createdAt: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
};

type DeletePrescriptionResponse = {
  id: string;
  removed: boolean;
};

type CreatePrescriptionRequest = {
  patientId: string;
  doctorId?: string;
  nextReview?: string;
  diagnosis?: string;
  items?: {
    name: string;
    dosage: string;
    duration: string;
    quantity: number;
    dayDivide: string;
    method: string;
  }[];
};

const datePresets = [
  { key: "all", label: "All Time" },
  { key: "today", label: "Today" },
  { key: "last7", label: "Last 7 Days" },
  { key: "thisMonth", label: "This Month" },
];

export default function Prescriptions() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  /* ------- Filters ------- */
  const [patientSearch, setPatientSearch] = useState("");
  const [doctorSearch, setDoctorSearch] = useState("");
  const [range, setRange] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  /* ------- Dialog State ------- */
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    diagnosis: "",
    nextReview: "",
    items: [] as {
      name: string;
      dosage: string;
      duration: string;
      quantity: number;
      dayDivide: string;
      method: string;
    }[],
  });

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
      { effectiveFrom, effectiveTo },
    ],
    queryFn: () =>
      api.get("/prescriptions", {
        from: effectiveFrom,
        to: effectiveTo,
      }),
  });

  /* ------- Delete Mutation ------- */
  const deleteMutation = useMutation<DeletePrescriptionResponse, Error, string>({
    mutationFn: (id) => api.delete(`/prescriptions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
    },
  });

  /* ------- Create Mutation ------- */
  const createMutation = useMutation<Prescription, Error, CreatePrescriptionRequest>({
    mutationFn: (data) => api.post("/prescriptions", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      setCreateDialogOpen(false);
      resetForm();
    },
  });

  /* ------- Local filtering for patient and doctor names ------- */
  const filtered = useMemo(() => {
    let list = prescriptionsQ.data ?? [];

    if (patientSearch.trim()) {
      const q = patientSearch.toLowerCase();
      list = list.filter((x) => {
        if (!x.patient?.user) return false;
        const fullName = `${x.patient.user.firstName} ${x.patient.user.lastName}`.toLowerCase();
        return fullName.includes(q);
      });
    }

    if (doctorSearch.trim()) {
      const q = doctorSearch.toLowerCase();
      list = list.filter((x) => {
        if (!x.doctor?.user) return false;
        const fullName = `${x.doctor.user.firstName} ${x.doctor.user.lastName}`.toLowerCase();
        return fullName.includes(q);
      });
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

  function handleDelete(id: string, patientName: string) {
    if (confirm(`Are you sure you want to delete the prescription for ${patientName}?`)) {
      deleteMutation.mutate(id);
    }
  }

  const resetForm = () => {
    setFormData({
      patientId: "",
      doctorId: "",
      diagnosis: "",
      nextReview: "",
      items: [],
    });
  };

  const handleCreate = () => {
    if (!formData.patientId.trim()) return;

    const payload: CreatePrescriptionRequest = {
      patientId: formData.patientId.trim(),
    };

    if (formData.doctorId?.trim()) payload.doctorId = formData.doctorId.trim();
    if (formData.diagnosis?.trim()) payload.diagnosis = formData.diagnosis.trim();
    if (formData.nextReview) payload.nextReview = formData.nextReview;
    if (formData.items.length > 0) payload.items = formData.items;

    createMutation.mutate(payload);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          name: "",
          dosage: "",
          duration: "",
          quantity: 1,
          dayDivide: "000",
          method: "after food",
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({ ...formData, items: newItems });
  };

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
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2" onClick={resetForm}>
                  <Plus className="size-4" />
                  Add Prescription
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Prescription</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {/* Patient ID */}
                  <div className="space-y-2">
                    <Label htmlFor="create-patientId">Patient ID *</Label>
                    <Input
                      id="create-patientId"
                      placeholder="Enter patient UUID"
                      value={formData.patientId}
                      onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    />
                  </div>

                  {/* Doctor ID */}
                  <div className="space-y-2">
                    <Label htmlFor="create-doctorId">Doctor ID (Optional)</Label>
                    <Input
                      id="create-doctorId"
                      placeholder="Enter doctor UUID"
                      value={formData.doctorId}
                      onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                    />
                  </div>

                  {/* Diagnosis */}
                  <div className="space-y-2">
                    <Label htmlFor="create-diagnosis">Diagnosis (Optional)</Label>
                    <Textarea
                      id="create-diagnosis"
                      placeholder="Enter diagnosis..."
                      value={formData.diagnosis}
                      onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                      rows={3}
                    />
                  </div>

                  {/* Next Review */}
                  <div className="space-y-2">
                    <Label htmlFor="create-nextReview">Next Review Date (Optional)</Label>
                    <Input
                      id="create-nextReview"
                      type="date"
                      value={formData.nextReview}
                      onChange={(e) => setFormData({ ...formData, nextReview: e.target.value })}
                    />
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Prescription Items (Optional)</Label>
                      <Button type="button" size="sm" onClick={addItem} className="gap-2">
                        <Plus className="size-4" />
                        Add Item
                      </Button>
                    </div>

                    {formData.items.map((item, index) => (
                      <Card key={index} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">Item {index + 1}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="size-4" />
                            </Button>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1">
                              <Label>Name *</Label>
                              <Input
                                placeholder="Medicine name"
                                value={item.name}
                                onChange={(e) => updateItem(index, "name", e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label>Dosage *</Label>
                              <Input
                                placeholder="e.g., 500mg"
                                value={item.dosage}
                                onChange={(e) => updateItem(index, "dosage", e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-3">
                            <div className="space-y-1">
                              <Label>Duration *</Label>
                              <Input
                                placeholder="e.g., 7 days"
                                value={item.duration}
                                onChange={(e) => updateItem(index, "duration", e.target.value)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label>Quantity *</Label>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label>Method *</Label>
                              <Select
                                value={item.method}
                                onValueChange={(value) => updateItem(index, "method", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="before food">Before Food</SelectItem>
                                  <SelectItem value="after food">After Food</SelectItem>
                                  <SelectItem value="with food">With Food</SelectItem>
                                  <SelectItem value="empty stomach">Empty Stomach</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <Label>Day Divide (Morning-Afternoon-Night) *</Label>
                            <Input
                              placeholder="e.g., 101 (morning and night)"
                              value={item.dayDivide}
                              onChange={(e) => updateItem(index, "dayDivide", e.target.value)}
                              maxLength={3}
                            />
                            <p className="text-xs text-muted-foreground">
                              Use 3 digits: 1=yes, 0=no. Example: 101 means morning and night only
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  {createMutation.isError && (
                    <div className="text-sm text-destructive">
                      Error: {createMutation.error?.message}
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setCreateDialogOpen(false)}
                    disabled={createMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreate}
                    disabled={!formData.patientId.trim() || createMutation.isPending}
                    className="gap-2"
                  >
                    {createMutation.isPending ? (
                      <>
                        <Spinner className="size-4" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="size-4" />
                        Create Prescription
                      </>
                    )}
                  </Button>
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
                      <TableHead className="font-bold">Patient</TableHead>
                      <TableHead className="font-bold">Doctor</TableHead>
                      <TableHead className="font-bold">Date</TableHead>
                      <TableHead className="text-right font-bold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {pageRows.map((rx) => {
                      const patientName = rx.patient?.user
                        ? `${rx.patient.user.firstName} ${rx.patient.user.lastName}`
                        : "Unknown Patient";
                      const doctorName = rx.doctor?.user
                        ? `Dr. ${rx.doctor.user.firstName} ${rx.doctor.user.lastName}`
                        : "No Doctor Assigned";

                      return (
                        <TableRow key={rx.id} className="hover:bg-primary/5 transition-colors">
                          <TableCell className="font-semibold">{patientName}</TableCell>
                          <TableCell>{doctorName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {format(new Date(rx.createdAt), "PP")}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-primary/10"
                                onClick={() => navigate(`/prescriptions/${rx.id}`)}
                              >
                                <Eye className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-destructive/10"
                                onClick={() => handleDelete(rx.id, patientName)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="size-4 text-destructive" />
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
