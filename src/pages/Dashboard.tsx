import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { PatientStatusChart } from "@/components/dashboard/PatientStatusChart";
import { DoctorAvailabilityChart } from "@/components/dashboard/DoctorAvailabilityChart";
import { RecentPatients } from "@/components/dashboard/RecentPatients";
import { RobotStatusCard } from "@/components/dashboard/RobotStatusCard";
import { InventoryExpiryChart } from "@/components/dashboard/InventoryExpiryChart";
import { Bed, Hospital, User, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardService } from "@/services/dashboard.service";
import { useToast } from "@/hooks/use-toast";
import { PageHeader } from "@/shared/components/PageHeader";
import { LoadingOverlay } from "@/shared/components/LoadingOverlay";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      let data;
      
      switch (user.role.toLowerCase()) {
        case 'admin':
          data = await dashboardService.adminView();
          break;
        case 'receptionist':
          data = await dashboardService.receptionView();
          break;
        case 'doctor':
          data = await dashboardService.doctorView(user.id.toString());
          break;
        default:
          data = await dashboardService.receptionView();
      }
      
      setDashboardData(data.data || data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch dashboard data',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingOverlay label="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={
          (user?.role === 'admin' && 'System overview and management') ||
          (user?.role === 'receptionist' && 'Reception desk overview') ||
          (user?.role === 'doctor' && 'Your schedule and patients') || undefined
        }
        breadcrumbs={[{ label: 'Home', href: '/app' }, { label: 'Dashboard' }]}
      />

      {/* Role-based stats */}
      {user?.role === 'admin' && dashboardData && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Rooms"
            value={dashboardData.rooms?.toString() || '0'}
            icon={Bed}
            description="Hospital rooms"
          />
          <StatCard
            title="Doctors"
            value={dashboardData.doctors?.toString() || '0'}
            icon={Users}
            description="Active doctors"
          />
          <StatCard
            title="Staff Members"
            value={dashboardData.staff?.toString() || '0'}
            icon={User}
            description="Total staff"
          />
        </div>
      )}

      {user?.role === 'receptionist' && dashboardData && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Admitted Patients"
            value={dashboardData.admittedCount?.toString() || '0'}
            icon={User}
            description="Currently admitted"
          />
          <StatCard
            title="Available Doctors"
            value={dashboardData.doctorsCount?.toString() || '0'}
            icon={Users}
            description="On duty"
          />
          <StatCard
            title="Staff Members"
            value={dashboardData.staffCount?.toString() || '0'}
            icon={Users}
            description="Total staff"
          />
          <StatCard
            title="Room Status"
            value={Object.keys(dashboardData.roomsSummary || {}).length.toString()}
            icon={Hospital}
            description="Room types"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <PatientStatusChart />
        <DoctorAvailabilityChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentPatients />
        </div>
        <RobotStatusCard
          status="Active"
          battery={78}
          location="East Wing, Floor 3"
          time="10:45 AM"
          supplies={["Medications", "Lab Samples", "IV Fluids"]}
        />
      </div>

      <InventoryExpiryChart />
    </div>
  );
}
