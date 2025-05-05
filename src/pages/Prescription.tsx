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
import { getCollection, addDocument } from '@/lib/firebase-utils';
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
}

interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  medicines: { name: string; quantity: number }[];
  bloodBottles: number;
  date: Date;
}

export default function Prescription() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [medicineName, setMedicineName] = useState('');   
  const [medicineQuantity, setMedicineQuantity] = useState('');
  const [bloodBottles, setBloodBottles] = useState('');
  const [medicines, setMedicines] = useState<{ name: string; quantity: number }[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const patientsData = await getCollection('patients');
        const prescriptionsData = await getCollection('prescriptions');
        if (patientsData) {
          setPatients(patientsData as Patient[]);
        }
        if (prescriptionsData) {
          setPrescriptions(prescriptionsData as Prescription[]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const addMedicine = () => {
    if (medicineName && medicineQuantity) {
      setMedicines([...medicines, { name: medicineName, quantity: parseInt(medicineQuantity) }]);
      setMedicineName('');
      setMedicineQuantity('');
    }
  };

  const handleSubmit = async () => {
    if (!selectedPatient || medicines.length === 0) return;

    const selectedPatientData = patients.find(p => p.id === selectedPatient);
    if (!selectedPatientData) return;

    const newPrescription: Omit<Prescription, 'id'> = {
      patientId: selectedPatient,
      patientName: selectedPatientData.name,
      medicines,
      bloodBottles: parseInt(bloodBottles) || 0,
      date: new Date()
    };

    try {
      const docRef = await addDocument('prescriptions', newPrescription);
      setPrescriptions([{ id: docRef, ...newPrescription }, ...prescriptions]);
      
      // Reset form and close dialog
      setSelectedPatient('');
      setMedicines([]);
      setBloodBottles('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error adding prescription:', error);
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
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell>{prescription.patientName}</TableCell>
                  <TableCell>
                    {prescription.medicines.map((med, index) => (
                      <div key={index}>
                        {med.name} ({med.quantity})
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>{prescription.bloodBottles}</TableCell>
                  <TableCell>{new Date(prescription.date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}