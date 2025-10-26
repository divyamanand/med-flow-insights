
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RobotStatusCardProps {
  location: string;
  status: "Active" | "Idle" | "Charging" | "Maintenance";
  battery: number;
  time: string;
  supplies: string[];
}

export function RobotStatusCard({
  location,
  status,
  battery,
  time,
  supplies,
}: RobotStatusCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Robot Status</CardTitle>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
              status === "Active"
                ? "bg-green-50 text-green-700"
                : status === "Idle"
                ? "bg-blue-50 text-blue-700"
                : status === "Charging"
                ? "bg-amber-50 text-amber-700"
                : "bg-red-50 text-red-700"
            )}
          >
            {status}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">Last updated: {time}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span>Battery</span>
              <span
                className={cn(
                  "font-medium",
                  battery < 20
                    ? "text-red-500"
                    : battery < 50
                    ? "text-amber-500"
                    : "text-green-500"
                )}
              >
                {battery}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full",
                  battery < 20
                    ? "animate-pulse-battery bg-red-500"
                    : battery < 50
                    ? "bg-amber-500"
                    : "bg-green-500"
                )}
                style={{ width: `${battery}%` }}
              />
            </div>
          </div>
          <div>
            <p className="mb-1 text-sm">Location</p>
            <p className="font-medium">{location}</p>
          </div>
          <div>
            <p className="mb-1 text-sm">Supplies</p>
            <div className="flex flex-wrap gap-1">
              {supplies.map((supply) => (
                <span
                  key={supply}
                  className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium"
                >
                  {supply}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
