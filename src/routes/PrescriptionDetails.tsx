import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { useState } from "react";

import { api } from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { FileText, User, Stethoscope, Calendar, Pill, Clock, Activity, Edit2, Trash2, Plus, X, ChevronLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

/* --------------------- API Response Type --------------------- */

type Patient = {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: {
    id: string;
    email: string;
    passwordHash: string;
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
    passwordHash: string;
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

type PrescriptionItem = {
  id: string;
  name: string;
  dosage: string;
  duration: string;
  quantity: number;
  dayDivide: string;
  method: string;
  createdAt: string;
  updatedAt: string;
};

type PrescriptionDetails = {
  id: string;
  patient: Patient | null;
  doctor: Doctor | null;
  nextReview: string | null;
  diagnosis: string | null;
  notes: string | null;
  items: PrescriptionItem[];
  createdAt: string;
  updatedAt: string;
};

type UpdatePrescriptionRequest = {
  patientId?: string;
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

type DeletePrescriptionResponse = {
  id: string;
  removed: boolean;
};

/* --------------------- Component ---------------------------- */

export default function PrescriptionDetails() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /* ------- State ------- */
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
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

  /* ------- Query ------- */
  const rxQ = useQuery<PrescriptionDetails>({
    queryKey: ["prescriptions", id],
    queryFn: () => api.get(`/prescriptions/${id}`),
    enabled: !!id,
  });

  /* ------- Update Mutation ------- */
  const updateMutation = useMutation<PrescriptionDetails, Error, UpdatePrescriptionRequest>({
    mutationFn: (data) => api.put(`/prescriptions/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions", id] });
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      setEditDialogOpen(false);
    },
  });

  /* ------- Delete Mutation ------- */
  const deleteMutation = useMutation<DeletePrescriptionResponse, Error, string>({
    mutationFn: (id) => api.delete(`/prescriptions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prescriptions"] });
      navigate("/prescriptions");
    },
  });

  /* ------- Handlers ------- */
  const openEditDialog = () => {
    if (!rxQ.data) return;
    setFormData({
      diagnosis: rxQ.data.diagnosis || "",
      nextReview: rxQ.data.nextReview || "",
      items: rxQ.data.items.map((item) => ({
        name: item.name,
        dosage: item.dosage,
        duration: item.duration,
        quantity: item.quantity,
        dayDivide: item.dayDivide,
        method: item.method,
      })),
    });
    setEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!rxQ.data) return;

    const payload: UpdatePrescriptionRequest = {};

    if (formData.diagnosis !== (rxQ.data.diagnosis || "")) {
      payload.diagnosis = formData.diagnosis || undefined;
    }

    if (formData.nextReview !== (rxQ.data.nextReview || "")) {
      payload.nextReview = formData.nextReview || undefined;
    }

    // Always include items if they've been modified
    if (JSON.stringify(formData.items) !== JSON.stringify(rxQ.data.items.map(i => ({
      name: i.name,
      dosage: i.dosage,
      duration: i.duration,
      quantity: i.quantity,
      dayDivide: i.dayDivide,
      method: i.method,
    })))) {
      payload.items = formData.items;
    }

    if (Object.keys(payload).length === 0) {
      setEditDialogOpen(false);
      return;
    }

    updateMutation.mutate(payload);
  };

  const handleDelete = () => {
    deleteMutation.mutate(id);
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

  if (rxQ.isLoading)
    return (
      <div className="flex items-center justify-center p-10">
        <Spinner className="size-6" />
      </div>
    );

  if (rxQ.error)
    return (
      <div className="text-destructive p-6">
        {(rxQ.error as Error).message}
      </div>
    );

  const rx = rxQ.data!;

  return (
    <div className="flex flex-col gap-6 sm:gap-8 animate-slide-in-bottom">
      {/* Enhanced Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
          <FileText className="size-4 text-primary" />
          <span className="text-sm font-medium text-primary">Prescription Details</span>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text">
            Prescription #{rx.id.slice(0, 8)}
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/prescriptions")} className="gap-2">
              <ChevronLeft className="size-4" />
              Back
            </Button>
            <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)} className="gap-2">
              <Trash2 className="size-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Header Card - Patient & Doctor Info */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect">
        <CardContent className="p-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Patient */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-semibold">
                <User className="size-5 text-primary" />
                Patient Information
              </div>
              <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
                {rx.patient?.user ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{rx.patient.user.firstName} {rx.patient.user.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="text-xs">{rx.patient.user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="text-xs">{rx.patient.user.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gender:</span>
                      <span className="capitalize">{rx.patient.user.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <span className="capitalize">{rx.patient.user.role}</span>
                    </div>
                  </>
                ) : (
                  <div className="text-muted-foreground italic">Patient record deleted</div>
                )}
              </div>
            </div>

            {/* Doctor */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-semibold">
                <Stethoscope className="size-5 text-accent" />
                Doctor Information
              </div>
              <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
                {rx.doctor?.user ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">Dr. {rx.doctor.user.firstName} {rx.doctor.user.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <span className="capitalize">{rx.doctor.user.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="text-xs">{rx.doctor.user.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="text-xs">{rx.doctor.user.phone}</span>
                    </div>
                    {rx.doctor.notes && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Notes:</span>
                        <span className="text-xs italic">{rx.doctor.notes}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-muted-foreground italic">No doctor assigned</div>
                )}
              </div>
            </div>
          </div>

          {/* Diagnosis & Review */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-semibold">
                <Activity className="size-5 text-primary" />
                Diagnosis
              </div>
              <div className="text-sm bg-muted/50 p-4 rounded-lg">
                {rx.diagnosis || <span className="text-muted-foreground italic">No diagnosis recorded</span>}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 font-semibold">
                <Calendar className="size-5 text-primary" />
                Next Review Date
              </div>
              <div className="text-sm bg-muted/50 p-4 rounded-lg">
                {rx.nextReview ? (
                  <Badge variant="secondary">{format(parseISO(rx.nextReview), "PPP")}</Badge>
                ) : (
                  <span className="text-muted-foreground italic">Not scheduled</span>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          {rx.notes && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-semibold">
                <FileText className="size-5 text-primary" />
                Notes
              </div>
              <div className="text-sm bg-muted/50 p-4 rounded-lg">
                {rx.notes}
              </div>
            </div>
          )}

          {/* Edit Button */}
          <Button className="w-full md:w-auto gap-2" onClick={openEditDialog}>
            <Edit2 className="size-4" />
            Edit Prescription
          </Button>
        </CardContent>
      </Card>

      {/* Items List */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect">
        <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2">
            <Pill className="size-5 text-primary" />
            Medication Items
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b-2 border-border/50 hover:bg-transparent">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Dosage</TableHead>
                <TableHead className="font-semibold">Duration</TableHead>
                <TableHead className="font-semibold">Quantity</TableHead>
                <TableHead className="font-semibold">Day Divide</TableHead>
                <TableHead className="font-semibold">Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rx.items.map((item) => (
                <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.dosage}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="size-3 text-muted-foreground" />
                      {item.duration}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.quantity}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{item.dayDivide}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{item.method}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Inventory Linkage Placeholder */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect">
        <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2">
            <Activity className="size-5 text-primary" />
            Inventory Linkage
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground text-center py-8">
            No inventory transactions linked for this prescription yet.
            <br />
            <span className="text-xs">(Placeholder - Feature coming soon)</span>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card className="border-2 border-border/50 shadow-lg glass-effect">
        <CardHeader className="border-b border-border/50 bg-linear-to-r from-primary/5 to-accent/5">
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5 text-primary" />
            Audit Log
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3 max-h-96 overflow-auto">
            <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
              <div className="size-2 rounded-full bg-primary mt-2 shrink-0" />
              <div className="flex-1 text-sm">
                <div className="text-muted-foreground text-xs mb-1">
                  {format(new Date(rx.createdAt), "PPp")}
                </div>
                <div>Prescription created</div>
              </div>
            </div>
            
            {rx.items.map((i) => (
              <div key={i.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                <div className="size-2 rounded-full bg-accent mt-2 shrink-0" />
                <div className="flex-1 text-sm">
                  <div className="text-muted-foreground text-xs mb-1">
                    {format(new Date(rx.createdAt), "PPp")}
                  </div>
                  <div>Added medication: <span className="font-medium">{i.name}</span></div>
                </div>
              </div>
            ))}

            {rx.diagnosis && (
              <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
                <div className="size-2 rounded-full bg-success mt-2 shrink-0" />
                <div className="flex-1 text-sm">
                  <div className="text-muted-foreground text-xs mb-1">
                    {format(new Date(rx.createdAt), "PPp")}
                  </div>
                  <div>Diagnosis: {rx.diagnosis}</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Prescription</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Diagnosis */}
            <div className="space-y-2">
              <Label htmlFor="edit-diagnosis">Diagnosis</Label>
              <Textarea
                id="edit-diagnosis"
                placeholder="Enter diagnosis..."
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                rows={3}
              />
            </div>

            {/* Next Review */}
            <div className="space-y-2">
              <Label htmlFor="edit-nextReview">Next Review Date</Label>
              <Input
                id="edit-nextReview"
                type="date"
                value={formData.nextReview}
                onChange={(e) => setFormData({ ...formData, nextReview: e.target.value })}
              />
            </div>

            {/* Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Prescription Items</Label>
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

            {updateMutation.isError && (
              <div className="text-sm text-destructive">
                Error: {updateMutation.error?.message}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
              className="gap-2"
            >
              {updateMutation.isPending ? (
                <>
                  <Spinner className="size-4" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit2 className="size-4" />
                  Update
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Prescription</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this prescription? This action cannot be undone.
          </p>
          {deleteMutation.isError && (
            <div className="text-sm text-destructive">
              Error: {deleteMutation.error?.message}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="gap-2"
            >
              {deleteMutation.isPending ? (
                <>
                  <Spinner className="size-4" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="size-4" />
                  Delete
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
