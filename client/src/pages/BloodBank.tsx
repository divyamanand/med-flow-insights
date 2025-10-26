import { useState, useEffect } from "react";
import { getCollection } from "@/lib/firestore";
import {
  BloodInventory,
  DonationStat,
  DonorAgeGroup,
  MonthlyDonation,
  BloodRequest,
  BloodGroup,
} from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { AlertCircle, Heart } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const bloodInventory = {
  "A+": { available: 35, critical: 20 },
  "A-": { available: 12, critical: 10 },
  "B+": { available: 28, critical: 20 },
  "B-": { available: 8, critical: 10 },
  "AB+": { available: 15, critical: 10 },
  "AB-": { available: 5, critical: 5 },
  "O+": { available: 42, critical: 25 },
  "O-": { available: 18, critical: 15 }
};

export default function BloodBank() {
  const [activeTab, setActiveTab] = useState("inventory");

  const [donationStats, setDonationStats] = useState<DonationStat[]>([]);
  const [donorAgeData, setDonorAgeData] = useState<DonorAgeGroup[]>([]);
  const [monthlyDonations, setMonthlyDonations] = useState<MonthlyDonation[]>([]);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [
          
          donationStatsData,
          donorAgeDataRaw,
          monthlyDonationsData,
          bloodRequestsData,
        ] = await Promise.all([
          
          getCollection("donation_states"),
          getCollection("donarAgeData"),
          getCollection("monthlyDonations"),
          getCollection("bloodRequests"),
        ]);

        setDonationStats(donationStatsData as DonationStat[]);
        setDonorAgeData(donorAgeDataRaw as DonorAgeGroup[]);
        setMonthlyDonations(monthlyDonationsData as MonthlyDonation[]);
        setBloodRequests(bloodRequestsData as BloodRequest[]);
        setError(null);
      } catch (err: any) {
        setError("Failed to fetch data from Firestore.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const criticalBloodTypes = Object.entries(bloodInventory)
    .filter(([_, data]) => data.available <= data.critical)
    .map(([type, _]) => type);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Blood Bank</h1>
        <p className="text-muted-foreground">
          Manage blood inventory and donation tracking
        </p>
      </div>
      {criticalBloodTypes.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-medium">Critical Blood Supply Alert</p>
                <p className="text-sm">
                  The following blood types are at or below critical levels: {criticalBloodTypes.join(", ")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="inventory" onValueChange={setActiveTab}>
        <TabsList className="mb-4 grid w-full max-w-[600px] grid-cols-3">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="requests">Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blood Inventory Status</CardTitle>
              <CardDescription>
                Current blood units available by blood group
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {Object.entries(bloodInventory).map(([type, data]) => (
                  <div
                    key={type}
                    className={cn(
                      "flex flex-col gap-2 rounded-lg border p-4",
                      data.available <= data.critical
                        ? "border-red-200 bg-red-50"
                        : "border-border bg-background"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart
                          className={cn(
                            "h-5 w-5",
                            data.available <= data.critical
                              ? "text-red-500"
                              : "text-primary"
                          )}
                        />
                        <h4 className="font-bold">{type}</h4>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          data.available <= data.critical
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        )}
                      >
                        {data.available <= data.critical ? "Critical" : "Sufficient"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Available Units: {data.available}</span>
                        <span>Critical Level: {data.critical}</span>
                      </div>
                      <Progress
                        value={(data.available / (data.critical * 2)) * 100}
                        className={cn(
                          "h-2",
                          data.available <= data.critical
                            ? "bg-muted text-red-500"
                            : "bg-muted text-green-500"
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Blood Type Distribution</CardTitle>
                <CardDescription>Available units by blood type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(bloodInventory).map(([name, data]) => ({
                          name,
                          value: data.available,
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {Object.entries(bloodInventory).map(([name, _], index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={[
                              "#ef4444",
                              "#f97316",
                              "#f59e0b",
                              "#eab308",
                              "#84cc16",
                              "#22c55e",
                              "#14b8a6",
                              "#0ea5e9",
                            ][index % 8]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donation Type Distribution</CardTitle>
                <CardDescription>Blood product types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donationStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {donationStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="donations" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Donor Demographics</CardTitle>
                <CardDescription>Age distribution of donors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donorAgeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {donorAgeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest blood donations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">John Smith</p>
                        <p className="text-sm text-muted-foreground">A+ • Whole Blood • 1 Unit</p>
                      </div>
                      <span className="text-sm text-muted-foreground">Today, 10:45 AM</span>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Emily Davis</p>
                        <p className="text-sm text-muted-foreground">O- • Platelets • 1 Unit</p>
                      </div>
                      <span className="text-sm text-muted-foreground">Today, 09:30 AM</span>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Michael Johnson</p>
                        <p className="text-sm text-muted-foreground">B+ • Whole Blood • 1 Unit</p>
                      </div>
                      <span className="text-sm text-muted-foreground">Yesterday, 2:15 PM</span>
                    </div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Sarah Wilson</p>
                        <p className="text-sm text-muted-foreground">AB+ • Plasma • 1 Unit</p>
                      </div>
                      <span className="text-sm text-muted-foreground">Yesterday, 11:20 AM</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Schedule Donation Campaign</CardTitle>
              <CardDescription>Organize a blood donation drive</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Campaign Title</label>
                    <input
                      type="text"
                      placeholder="Spring Blood Drive 2023"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Location</label>
                    <input
                      type="text"
                      placeholder="Main Hospital Lobby"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Date</label>
                    <input
                      type="date"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Time</label>
                    <div className="flex gap-2">
                      <input
                        type="time"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                      <span className="flex items-center">to</span>
                      <input
                        type="time"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Provide details about the blood donation campaign"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <Button>Schedule Campaign</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Blood Requests</CardTitle>
              <CardDescription>Manage blood transfusion requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bloodRequests.map((request) => (
                  <div
                    key={request.id}
                    className={cn(
                      "rounded-lg border p-4",
                      request.status === "Pending"
                        ? request.priority === "High"
                          ? "border-red-200 bg-red-50"
                          : "border-amber-200 bg-amber-50"
                        : "border-green-200 bg-green-50"
                    )}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{request.id}</h4>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-xs font-medium",
                              request.priority === "High"
                                ? "bg-red-100 text-red-700"
                                : request.priority === "Medium"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-blue-100 text-blue-700"
                            )}
                          >
                            {request.priority}
                          </span>
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-xs font-medium",
                              request.status === "Pending"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            )}
                          >
                            {request.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm">
                          <span className="font-semibold">{request.bloodGroup}</span> • {request.quantity} {request.quantity > 1 ? "units" : "unit"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {request.department} • Requested by {request.requester}
                        </p>
                      </div>
                      {request.status === "Pending" && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Reject
                          </Button>
                          <Button size="sm">Fulfill Request</Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create New Blood Request</CardTitle>
              <CardDescription>Request blood for a patient</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Blood Group</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Units Required</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="1"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Priority</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>Select Priority</option>
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">Department</label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>Select Department</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Surgery">Surgery</option>
                      <option value="ICU">ICU</option>
                      <option value="General Ward">General Ward</option>
                      <option value="Oncology">Oncology</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Required By</label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      type="date"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                    <input
                      type="time"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Patient Information</label>
                  <textarea
                    rows={3}
                    placeholder="Enter relevant patient details"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <Button>Submit Request</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}






