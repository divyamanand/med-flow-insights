
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, AreaChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Ambulance, BriefcaseMedical, PillIcon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

// Sample robot tracking data 
const robotsData = [
  {
    id: "MR-001",
    name: "MedBot One",
    status: "Active",
    battery: 78,
    location: "East Wing, Floor 3",
    lastUpdated: "10:45 AM",
    supplies: ["Medications", "Lab Samples", "IV Fluids"],
    type: "Supply Delivery",
    taskCompletion: 67,
  },
  {
    id: "MR-002",
    name: "SurgBot",
    status: "Idle",
    battery: 100,
    location: "Surgical Wing, Floor 2",
    lastUpdated: "10:30 AM",
    supplies: ["Surgical Tools", "Sterilized Equipment"],
    type: "Surgical Assistant",
    taskCompletion: 100,
  },
  {
    id: "MR-003",
    name: "PharmBot",
    status: "Charging",
    battery: 35,
    location: "Charging Station, Floor 1",
    lastUpdated: "10:25 AM",
    supplies: ["Medications"],
    type: "Pharmacy Delivery",
    taskCompletion: 45,
  },
  {
    id: "MR-004",
    name: "CleanBot",
    status: "Maintenance",
    battery: 0,
    location: "Maintenance Room, Basement",
    lastUpdated: "09:15 AM",
    supplies: [],
    type: "Cleaning",
    taskCompletion: 0,
  },
];

// Sample robot historical data for charts
const batteryHistory = [
  { time: "8:00 AM", MR001: 100, MR002: 90, MR003: 80, MR004: 30 },
  { time: "9:00 AM", MR001: 95, MR002: 95, MR003: 65, MR004: 15 },
  { time: "10:00 AM", MR001: 85, MR002: 100, MR003: 50, MR004: 0 },
  { time: "11:00 AM", MR001: 78, MR002: 100, MR003: 35, MR004: 0 },
];

const taskHistory = [
  { day: "Monday", completed: 42, total: 50 },
  { day: "Tuesday", completed: 53, total: 60 },
  { day: "Wednesday", completed: 58, total: 70 },
  { day: "Thursday", completed: 69, total: 75 },
  { day: "Friday", completed: 65, total: 80 },
  { day: "Saturday", completed: 45, total: 50 },
  { day: "Sunday", completed: 30, total: 40 },
];

export default function Robots() {
  const [activeRobots, setActiveRobots] = useState(0);
  const [chargingRobots, setChargingRobots] = useState(0);
  const [maintenanceRobots, setMaintenanceRobots] = useState(0);

  useEffect(() => {
    // Calculate robot status counts
    const active = robotsData.filter((robot) => robot.status === "Active").length;
    const charging = robotsData.filter((robot) => robot.status === "Charging").length;
    const maintenance = robotsData.filter((robot) => robot.status === "Maintenance").length;
    
    setActiveRobots(active);
    setChargingRobots(charging);
    setMaintenanceRobots(maintenance);
  }, []);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Robot Management</h1>
        <p className="text-muted-foreground">
          Monitor and control hospital automation robots
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total Robots</span>
                <Monitor className="h-5 w-5 text-primary" />
              </div>
              <span className="text-3xl font-bold">{robotsData.length}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Active</span>
                <Ambulance className="h-5 w-5 text-green-500" />
              </div>
              <span className="text-3xl font-bold">{activeRobots}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Charging</span>
                <BriefcaseMedical className="h-5 w-5 text-amber-500" />
              </div>
              <span className="text-3xl font-bold">{chargingRobots}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Maintenance</span>
                <PillIcon className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-3xl font-bold">{maintenanceRobots}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Robot Fleet Status</CardTitle>
          <CardDescription>Current status of all hospital robots</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Battery</TableHead>
                  <TableHead>Current Location</TableHead>
                  <TableHead>Task</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {robotsData.map((robot) => (
                  <TableRow key={robot.id}>
                    <TableCell className="font-medium">{robot.id}</TableCell>
                    <TableCell>{robot.name}</TableCell>
                    <TableCell>{robot.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          robot.status === "Active"
                            ? "border-green-200 bg-green-50 text-green-700"
                            : robot.status === "Idle"
                            ? "border-blue-200 bg-blue-50 text-blue-700"
                            : robot.status === "Charging"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-red-200 bg-red-50 text-red-700"
                        )}
                      >
                        {robot.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>{robot.battery}%</span>
                        </div>
                        <Progress 
                          value={robot.battery} 
                          className={cn(
                            robot.battery < 20
                              ? "bg-muted text-red-500"
                              : robot.battery < 50
                              ? "bg-muted text-amber-500"
                              : "bg-muted text-green-500"
                          )}
                        />
                      </div>
                    </TableCell>
                    <TableCell>{robot.location}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs">
                          <span>Task Completion:</span>
                          <span>{robot.taskCompletion}%</span>
                        </div>
                        <Progress value={robot.taskCompletion} className="bg-muted" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="battery">
        <TabsList className="mb-4 grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="battery">Battery Levels</TabsTrigger>
          <TabsTrigger value="tasks">Task Completion</TabsTrigger>
        </TabsList>
        <Card>
          <TabsContent value="battery">
            <CardHeader>
              <CardTitle>Battery Level History</CardTitle>
              <CardDescription>24-hour battery level tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={batteryHistory}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="time" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="MR001"
                      name="MedBot One"
                      stroke="#0ea5e9"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="MR002"
                      name="SurgBot"
                      stroke="#10b981"
                    />
                    <Line
                      type="monotone"
                      dataKey="MR003"
                      name="PharmBot"
                      stroke="#f59e0b"
                    />
                    <Line
                      type="monotone"
                      dataKey="MR004"
                      name="CleanBot"
                      stroke="#ef4444"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </TabsContent>
          <TabsContent value="tasks">
            <CardHeader>
              <CardTitle>Task Completion Rate</CardTitle>
              <CardDescription>Weekly task completion statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={taskHistory}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="total"
                      name="Total Tasks"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      opacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      name="Completed Tasks"
                      stackId="2"
                      stroke="#10b981"
                      fill="#10b981"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
}
