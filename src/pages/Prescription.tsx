import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { getCollection, updateDocument } from '@/lib/firebase-utils';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Patient {
  id: string;
  name: string;
  prescriptions?: Prescription[];
}

interface Prescription {
  medicines: { name: string; quantity: number; status: boolean }[];
  bloodBottles: number;
  bloodGroup: string;
  date: Date;
}

export default function Prescription() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [medicineName, setMedicineName] = useState('');
  const [medicineQuantity, setMedicineQuantity] = useState('');
  const [bloodBottles, setBloodBottles] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [medicines, setMedicines] = useState<{ name: string; quantity: number; status: boolean }[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsData = await getCollection('patient');
        if (patientsData) {
          setPatients(patientsData as Patient[]);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      }
    };
    fetchData();
  }, []);

  const addMedicine = () => {
    if (medicineName && medicineQuantity) {
      setMedicines([...medicines, { name: medicineName, quantity: parseInt(medicineQuantity),status: false }]);
      setMedicineName('');
      setMedicineQuantity('');
    }
  };

  const handleSubmit = async () => {
    if (!selectedPatient || medicines.length === 0 || !bloodGroup) return;

    const selectedPatientData = patients.find(p => p.id === selectedPatient);
    if (!selectedPatientData) return;

    const newPrescription: Prescription = {
      medicines,
      bloodBottles: parseInt(bloodBottles) || 0,
      bloodGroup,
      date: new Date(),
    };

    try {
      const updatedPrescriptions = [
        ...(selectedPatientData.prescriptions || []),
        newPrescription
      ];

      await updateDocument('patient', selectedPatient, {
        prescriptions: updatedPrescriptions
      });

      setPatients(prev =>
        prev.map(p =>
          p.id === selectedPatient ? { ...p, prescriptions: updatedPrescriptions } : p
        )
      );

      setSelectedPatient('');
      setMedicines([]);
      setBloodBottles('');
      setBloodGroup('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error updating patient with new prescription:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Prescriptions</h1>
          <p className="text-muted-foreground">Manage and view prescriptions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Create New Prescription</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="patient">Select Patient</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Medicines</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Medicine name"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Quantity"
                    value={medicineQuantity}
                    onChange={(e) => setMedicineQuantity(e.target.value)}
                  />
                  <Button onClick={addMedicine}>Add</Button>
                </div>
                {medicines.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-medium mb-2">Added Medicines:</h4>
                    <ul className="list-disc pl-4">
                      {medicines.map((med, index) => (
                        <li key={index}>
                          {med.name} - Quantity: {med.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="blood">Blood Bottles Required</Label>
                <Input
                  id="blood"
                  type="number"
                  placeholder="Number of blood bottles"
                  value={bloodBottles}
                  onChange={(e) => setBloodBottles(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="blood-group">Blood Group</Label>
                <Select value={bloodGroup} onValueChange={setBloodGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSubmit}>Create Prescription</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Prescriptions</CardTitle>
          <CardDescription>View all prescriptions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Medicines</TableHead>
                <TableHead>Blood Bottles</TableHead>
                <TableHead>Blood Group</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients
                .filter(p => p.prescriptions && p.prescriptions.length > 0)
                .flatMap(patient =>
                  patient.prescriptions!.map((prescription, index) => (
                    <TableRow key={`${patient.id}-${index}`}>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>
                        {prescription.medicines.map((med, i) => (
                          <div key={i}>{med.name} ({med.quantity})</div>
                        ))}
                      </TableCell>
                      <TableCell>{prescription.bloodBottles}</TableCell>
                      <TableCell>{prescription.bloodGroup}</TableCell>
                      <TableCell>
                        {prescription.medicines.every(med => med.status) ? 'Completed' : 'Pending'}
                      </TableCell>
                      <TableCell>{new Date(prescription.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))
                )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
