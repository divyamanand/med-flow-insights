import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

import { api } from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

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
    <div className="flex flex-col gap-6">
      {/* Header Card */}
      <Card>
        <CardContent className="p-6 space-y-2 bg-[#f4f9ff] rounded-md">
          <div className="flex justify-between items-start">
            <div className="space-y-1 text-sm">
              <div>
                <span className="font-semibold">Patient</span>:{" "}
                {rx.patientName}
              </div>

              <div>
                <span className="font-semibold">Doctor</span>:{" "}
                {rx.doctorName}
              </div>

              <div>
                <span className="font-semibold">Diagnosis</span>:{" "}
                {rx.diagnosis ?? "-"}
              </div>

              <div>
                <span className="font-semibold">Next Review Date</span>:{" "}
                {rx.nextReview ? format(parseISO(rx.nextReview), "yyyy-MM-dd") : "-"}
              </div>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button>Edit Prescription</Button>
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
          </div>
        </CardContent>
      </Card>

      {/* Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Items List</CardTitle>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Day Divide</TableHead>
                <TableHead>Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rx.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.dosage}</TableCell>
                  <TableCell>{item.duration}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.dayDivide}</TableCell>
                  <TableCell>{item.method}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Inventory Linkage Placeholder ( until backend adds real data ) */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Linkage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            No inventory transactions linked for this prescription yet.
            (Placeholder)
          </div>
        </CardContent>
      </Card>

      {/* Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>{format(parseISO(rx.date), "yyyy-MM-dd HH:mm")} — Prescription created.</p>
          {rx.items.map((i, idx) => (
            <p key={i.id}>
              {format(parseISO(rx.date), "yyyy-MM-dd HH:mm")} — Added item: {i.name}.
            </p>
          ))}
          {rx.notes && (
            <p>
              {format(parseISO(rx.date), "yyyy-MM-dd HH:mm")} — Notes added:{" "}
              {rx.notes}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
