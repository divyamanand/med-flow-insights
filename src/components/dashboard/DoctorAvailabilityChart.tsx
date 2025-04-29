
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  {
    name: "Morning",
    available: 8,
    total: 10,
  },
  {
    name: "Afternoon",
    available: 6,
    total: 10,
  },
  {
    name: "Evening",
    available: 7,
    total: 10,
  },
  {
    name: "Night",
    available: 4,
    total: 10,
  },
];

export function DoctorAvailabilityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doctor Availability</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="available" name="Available" fill="#0ea5e9" />
              <Bar dataKey="total" name="Total" fill="#e2e8f0" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
