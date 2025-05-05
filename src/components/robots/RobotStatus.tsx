
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface RobotStatusProps {
  className?: string;
}

export function RobotStatus({ className }: RobotStatusProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>MedBot One</CardTitle>
          <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Model</p>
            <p className="font-medium">MR-001</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Location</p>
            <p className="font-medium">East Wing, Floor 3</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Status</p>
            <div className="flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
              <span className="font-medium">Online & Operational</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
