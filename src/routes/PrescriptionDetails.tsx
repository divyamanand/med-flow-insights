import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

import { api } from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { FileText, User, Stethoscope, Calendar, Pill, Clock, Activity, Edit2 } from "lucide-react";

/* --------------------- API Response Type --------------------- */

type PrescriptionDetails = {
  id: string;
  patientId: string;
  doctorId: string;

  patientName: string;
  doctorName: string;

  diagnosis?: string | null;
  notes?: string | null;

  items: {
    id: string;
    name: string;
    dosage: string;
    duration: string;
    quantity: number;
    dayDivide: string;
    method: string;
  }[];

  date: string; // created at
  nextReview?: string;
};

/* --------------------- Component ---------------------------- */

export default function PrescriptionDetails() {
  const { id = "" } = useParams();

  const rxQ = useQuery<PrescriptionDetails>({
    queryKey: ["prescriptions", id],
    queryFn: () => api.get(`/prescriptions/${id}`),
    enabled: !!id,
  });

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
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight gradient-text">
          Prescription #{rx.id}
        </h1>
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{rx.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono text-xs">{rx.patientId}</span>
                </div>
              </div>
            </div>

            {/* Doctor */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-semibold">
                <Stethoscope className="size-5 text-accent" />
                Doctor Information
              </div>
              <div className="space-y-2 text-sm bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">Dr {rx.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono text-xs">{rx.doctorId}</span>
                </div>
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

          {/* Edit Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto gap-2">
                <Edit2 className="size-4" />
                Edit Prescription
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Prescription (Demo)</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                This is a placeholder. Add form here.
              </p>
              <DialogFooter>
                <Button>Save (Demo)</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                  {format(parseISO(rx.date), "yyyy-MM-dd HH:mm")}
                </div>
                <div>Prescription created</div>
              </div>
            </div>
            
            {rx.items.map((i) => (
              <div key={i.id} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                <div className="size-2 rounded-full bg-accent mt-2 shrink-0" />
                <div className="flex-1 text-sm">
                  <div className="text-muted-foreground text-xs mb-1">
                    {format(parseISO(rx.date), "yyyy-MM-dd HH:mm")}
                  </div>
                  <div>Added medication: <span className="font-medium">{i.name}</span></div>
                </div>
              </div>
            ))}

            {rx.notes && (
              <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
                <div className="size-2 rounded-full bg-success mt-2 shrink-0" />
                <div className="flex-1 text-sm">
                  <div className="text-muted-foreground text-xs mb-1">
                    {format(parseISO(rx.date), "yyyy-MM-dd HH:mm")}
                  </div>
                  <div>Notes added: {rx.notes}</div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
