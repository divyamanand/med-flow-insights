import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Ambulance, Shield, Navigation } from "lucide-react";
import { RobotData } from "@/lib/types";
import { subscribeToRobotData } from "@/lib/realtimeDb";
import { ObstacleDisplay } from "@/components/robots/ObstacleDisplay";
import { RobotStatus } from "@/components/robots/RobotStatus";

// Sample fallback data if Firebase connection fails
const fallbackData: RobotData = {
  obstacle: {
    left: 0,
    mid: 0,
    right: 0,
  },
  direction: 'unknown'
};

export default function Robots() {
  const [robotData, setRobotData] = useState<RobotData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const unsubscribeRef = useRef<() => void>(() => {});

  useEffect(() => {
    // Subscribe to robot data from Firebase Realtime Database
    unsubscribeRef.current = subscribeToRobotData(
      (data) => {
        setRobotData(prevData => {
          // Only update if data has actually changed
          if (JSON.stringify(prevData) !== JSON.stringify(data)) {
            console.log("Received robot data:", data);
            return data;
          }
          return prevData;
        });
        setLoading(false);
      },
      (err) => {
        console.error("Failed to fetch robot data:", err);
        setError(err);
        setLoading(false);
        toast({
          title: "Connection Error",
          description: "Using sample data. Check your Firebase connection.",
          variant: "destructive",
        });
        // Use fallback data if there's an error
        setRobotData(fallbackData);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      console.log("Cleaning up robot data subscription");
      unsubscribeRef.current();
    };
  }, [toast]);

  // Use fallback data if no data is available yet
  const data = robotData || fallbackData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Robot Management</h1>
        <p className="text-muted-foreground">
          Monitor and control hospital automation robot
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Robot ID</span>
                    <Ambulance className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-3xl font-bold">MR-001</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Direction</span>
                    <Navigation className="h-5 w-5 text-blue-500" />
                  </div>
                  <span className="text-3xl font-bold capitalize">
                    {data.direction}
                    <span className="ml-2 inline-block animate-pulse">●</span>
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Obstacles</span>
                    <Shield className="h-5 w-5 text-amber-500" />
                  </div>
                  <span className="text-3xl font-bold">
                    {data.obstacle.left + data.obstacle.mid + data.obstacle.right}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Robot Details</CardTitle>
                <CardDescription>Real-time monitoring of robot status</CardDescription>
              </CardHeader>
              <CardContent>
                <RobotStatus direction = {data.direction}/>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Obstacle Detection</CardTitle>
                <CardDescription>Real-time obstacle detection system</CardDescription>
              </CardHeader>
              <CardContent>
                <ObstacleDisplay obstacles={data.obstacle} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Robot Navigation Map</CardTitle>
              <CardDescription>Current robot location and navigation path</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-slate-50">
              <div className="text-center p-8">
                <div className="mb-4 mx-auto w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                  <Ambulance size={48} className="text-blue-600" />
                </div>
                <h3 className="text-lg font-medium">Navigation Map</h3>
                <p className="text-muted-foreground">
                  Robot direction: <span className="font-medium capitalize">{data.direction}</span>
                  <span className="ml-1 text-blue-500 animate-pulse">●</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
