
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

const recentPatients = [
  {
    id: "P001",
    name: "John Smith",
    type: "Emergency",
    date: new Date(2023, 3, 21),
    doctor: "Dr. Sarah Johnson",
    issues: ["Chest Pain", "High Blood Pressure"],
  },
  {
    id: "P002",
    name: "Emily Davis",
    type: "Regular",
    date: new Date(2023, 3, 20),
    doctor: "Dr. Michael Brown",
    issues: ["Annual Checkup"],
  },
  {
    id: "P003",
    name: "Robert Wilson",
    type: "Surgery",
    date: new Date(2023, 3, 19),
    doctor: "Dr. Jessica Martinez",
    issues: ["Appendicitis"],
  },
  {
    id: "P004",
    name: "Lisa Thompson",
    type: "ICU",
    date: new Date(2023, 3, 18),
    doctor: "Dr. David Lee",
    issues: ["Respiratory Failure", "Pneumonia"],
  },
];

export function RecentPatients() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Patients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentPatients.map((patient) => (
            <div
              key={patient.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.name}`} />
                  <AvatarFallback>
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(patient.date, "PPP")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={
                    patient.type === "Emergency"
                      ? "border-red-200 bg-red-50 text-red-500"
                      : patient.type === "ICU"
                      ? "border-amber-200 bg-amber-50 text-amber-500"
                      : patient.type === "Surgery"
                      ? "border-blue-200 bg-blue-50 text-blue-500"
                      : "border-green-200 bg-green-50 text-green-500"
                  }
                >
                  {patient.type}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
