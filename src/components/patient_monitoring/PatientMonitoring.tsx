"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { HealthDataChart } from "./components/health-data-chart"
import { ECGChart } from "./components/ecg-chart"
import { HealthStats } from "./components/health-stats"
import { DashboardHeader } from "./components/dashboard-header"
import { HealthDataHistory } from "./components/health-data-history"

// Demo data structure matching backend expectations
const demoCurrentData = {
  ecg_raw: 512,
  heart_rate_bpm: 75,
  "humidity_%": 45,
  pressure_hPa: 1013,
  "spo2_%": 98,
  temperature_C: 37.0
};

const demoHistoryData = [
  {
    ...demoCurrentData,
    timestamp: Date.now() - 300000
  },
  {
    ...demoCurrentData,
    heart_rate_bpm: 78,
    timestamp: Date.now() - 240000
  },
  {
    ...demoCurrentData,
    heart_rate_bpm: 76,
    timestamp: Date.now() - 180000
  },
  {
    ...demoCurrentData,
    heart_rate_bpm: 74,
    timestamp: Date.now() - 120000
  },
  {
    ...demoCurrentData,
    heart_rate_bpm: 75,
    timestamp: Date.now() - 60000
  },
  {
    ...demoCurrentData,
    timestamp: Date.now()
  }
];

export default function PatientMonitoring() {
  const [currentData, setCurrentData] = useState(demoCurrentData);
  const [historyData, setHistoryData] = useState(demoHistoryData);
  const [ecgHistory, setEcgHistory] = useState<number[]>([512, 520, 510, 515, 512]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Connect to backend WebSocket for real-time patient data
    // For now using demo data
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <DashboardHeader />
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <HealthStats data={currentData} />
          
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Heart Rate Trends</CardTitle>
                <CardDescription>Real-time monitoring of heart rate</CardDescription>
              </CardHeader>
              <CardContent>
                <HealthDataChart 
                  data={historyData} 
                  dataKey="heart_rate_bpm"
                  color="hsl(var(--chart-1))"
                  name="Heart Rate"
                  unit="BPM"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>ECG Monitor</CardTitle>
                <CardDescription>Live electrocardiogram reading</CardDescription>
              </CardHeader>
              <CardContent>
                <ECGChart value={currentData.ecg_raw} history={ecgHistory} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <HealthDataHistory data={historyData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
