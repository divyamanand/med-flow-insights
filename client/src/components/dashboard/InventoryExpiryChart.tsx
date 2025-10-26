
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  {
    name: "Jan",
    supplies: 30,
    blood: 24,
  },
  {
    name: "Feb",
    supplies: 25,
    blood: 13,
  },
  {
    name: "Mar",
    supplies: 15,
    blood: 18,
  },
  {
    name: "Apr",
    supplies: 40,
    blood: 28,
  },
  {
    name: "May",
    supplies: 22,
    blood: 15,
  },
  {
    name: "Jun",
    supplies: 18,
    blood: 12,
  },
];

export function InventoryExpiryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Expiring This Month</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
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
              <Line type="monotone" dataKey="supplies" name="Medical Supplies" stroke="#0ea5e9" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="blood" name="Blood Units" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
