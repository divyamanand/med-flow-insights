
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import { PatientStatusChart } from "@/components/dashboard/PatientStatusChart";
import { DoctorAvailabilityChart } from "@/components/dashboard/DoctorAvailabilityChart";
import { RecentPatients } from "@/components/dashboard/RecentPatients";
import { RobotStatusCard } from "@/components/dashboard/RobotStatusCard";
import { InventoryExpiryChart } from "@/components/dashboard/InventoryExpiryChart";
import { Bed, Heart, Hospital, User, Users } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Hospital overview and key metrics</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Patients"
          value="1,284"
          icon={User}
          description="Active patients in system"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Available Doctors"
          value="32"
          icon={Users}
          description="On duty today"
          trend={{ value: 4, isPositive: true }}
        />
        <StatCard
          title="Occupied Beds"
          value="142/180"
          icon={Bed}
          description="Current occupancy"
          trend={{ value: 7, isPositive: false }}
        />
        <StatCard
          title="Blood Units"
          value="328"
          icon={Heart}
          description="Available in inventory"
          trend={{ value: 3, isPositive: true }}
        />
      </div>

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
