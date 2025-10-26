
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface RobotStatusProps {
  className?: string;
  direction: string;
  rfids?: Record<string, string>;
}

const directionMap: Record<string, { label: string; rotation: number }> = {
  straight: { label: "Straight", rotation: 0 },
  left: { label: "Left", rotation: -90 },
  right: { label: "Right", rotation: 90 },
  backward: { label: "Backward", rotation: 180 },
  blocked: { label: "Blocked", rotation: 0 },
};

export function RobotStatus({ className, direction, rfids = {} }: RobotStatusProps) {
  const dir = direction.toLowerCase();
  const directionInfo = directionMap[dir] ?? { label: "Unknown", rotation: 0 };
  const isBlocked = dir === "blocked";
  const itemsCount = Object.keys(rfids).length;

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
        <div className="flex items-center justify-between">
          {/* LEFT SIDE DETAILS */}
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
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Items <Badge variant="secondary" className="ml-1">{itemsCount}</Badge>
              </p>
              {itemsCount > 0 ? (
                <div className="grid grid-cols-1 gap-1 mt-2">
                  {Object.entries(rfids).map(([id, name]) => (
                    <div key={id} className="flex items-center bg-slate-50 p-2 rounded-md">
                      <Package className="h-4 w-4 text-blue-500 mr-2" />
                      <span className="text-sm font-medium">{name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No items</p>
              )}
            </div>
          </div>

          {/* RIGHT SIDE ARROW */}
          <div
            className={cn(
              "flex items-center justify-center w-20 h-20 rounded-full bg-green-100 shadow-inner",
              !isBlocked && "animate-moveArrow"
            )}
          >
            {isBlocked ? (
              <span className="text-red-500 font-bold text-2xl">⛔</span>
            ) : (
              <ArrowUp
                className="text-green-600 w-10 h-10 transition-transform duration-300"
                style={{ transform: `rotate(${directionInfo.rotation}deg)` }}
              />
            )}
          </div>
        </div>
      </CardContent>

      {/* Add keyframes directly in a style tag without jsx */}
      <style>
        {`
          @keyframes moveArrow {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-6px);
            }
          }
          .animate-moveArrow {
            animation: moveArrow 1.2s infinite ease-in-out;
          }
        `}
      </style>
    </Card>
  );
}
