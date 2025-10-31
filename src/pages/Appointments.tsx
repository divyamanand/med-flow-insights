import { useEffect, useState } from 'react';
import { Plus, Calendar, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { appointmentService } from '@/services/appointment.service';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function Appointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.list();
      setAppointments(response.data || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch appointments',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter(apt => 
    apt.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.doctor?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.doctor?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">Manage patient appointments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <CardTitle>All Appointments</CardTitle>
            <div className="relative flex-1 ml-auto max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell>
                      {format(new Date(apt.timestamp), 'MMM dd, yyyy HH:mm')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {apt.patient?.firstName} {apt.patient?.lastName}
                    </TableCell>
                    <TableCell>
                      Dr. {apt.doctor?.firstName} {apt.doctor?.lastName}
                    </TableCell>
                    <TableCell>{apt.duration} min</TableCell>
                    <TableCell>
                      <Badge variant="outline">{apt.status || 'Scheduled'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
