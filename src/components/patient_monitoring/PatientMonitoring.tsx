"use client"

import { useEffect, useState } from "react"
import { initializeApp } from "firebase/app"
import { getDatabase, ref, onValue } from "firebase/database"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { HealthDataChart } from "./components/health-data-chart"
import { ECGChart } from "./components/ecg-chart"
import { HealthStats } from "./components/health-stats"
import { DashboardHeader } from "./components/dashboard-header"
import { HealthDataHistory } from "./components/health-data-history"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmZCMpwJRuY80CuqzCzT5Eip7HLVN65jc",
  authDomain: "edp82-2653d.firebaseapp.com",
  databaseURL: "https://edp82-2653d-default-rtdb.firebaseio.com",
  projectId: "edp82-2653d",
  storageBucket: "edp82-2653d.firebasestorage.app",
  messagingSenderId: "737187621446",
  appId: "1:737187621446:web:c128dd113d7dd438643847",
  measurementId: "G-09LNEQDYEL",
}

// Health data interface
interface HealthData {
  ecg_raw: number
  heart_rate_bpm: number
  "humidity_%": number
  pressure_hPa: number
  "spo2_%": number
  temperature_C: number
}

export default function DashboardPage() {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [healthData, setHealthData] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const [historyData, setHistoryData] = useState<Array<HealthData & { timestamp: number }>>([])

  useEffect(() => {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig)
    const database = getDatabase(app)
    const healthDataRef = ref(database, "health_data")

    // Listen for changes to health data
    const unsubscribe = onValue(healthDataRef, (snapshot) => {
      const data = snapshot.val()
      setHealthData(data)

      // Add to history with timestamp
      if (data) {
        setLastUpdated(new Date())
        setHistoryData((prev) => {
          const newHistory = [...prev, { ...data, timestamp: Date.now() }]
          // Keep only the last 50 entries
          return newHistory.slice(-50)
        })
      }

      setLoading(false)
    })

    // Cleanup subscription
    return () => unsubscribe()
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Health Dashboard <span className="text-muted-foreground">
             • Last
            updated: {lastUpdated.toLocaleTimeString()}
          </span></h2>
        </div>

        {healthData && (
          <>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <HealthStats data={healthData} />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Heart Rate Monitoring</CardTitle>
                      <CardDescription>Real-time heart rate data in beats per minute (BPM)</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <HealthDataChart
                        data={historyData}
                        dataKey="heart_rate_bpm"
                        color="#ef4444"
                        name="Heart Rate"
                        unit="BPM"
                      />
                    </CardContent>
                  </Card>

                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>ECG Waveform</CardTitle>
                      <CardDescription>Electrocardiogram raw data visualization</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ECGChart value={healthData.ecg_raw} history={historyData.map((d) => d.ecg_raw)} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="charts" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Temperature</CardTitle>
                      <CardDescription>Body temperature in Celsius</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <HealthDataChart
                        data={historyData}
                        dataKey="temperature_C"
                        color="#06b6d4"
                        name="Temperature"
                        unit="°C"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>SpO2 Levels</CardTitle>
                      <CardDescription>Blood oxygen saturation percentage</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <HealthDataChart data={historyData} dataKey="spo2_%" color="#8b5cf6" name="SpO2" unit="%" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Humidity</CardTitle>
                      <CardDescription>Environmental humidity percentage</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <HealthDataChart
                        data={historyData}
                        dataKey="humidity_%"
                        color="#22c55e"
                        name="Humidity"
                        unit="%"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Pressure</CardTitle>
                      <CardDescription>Atmospheric pressure in hPa</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                      <HealthDataChart
                        data={historyData}
                        dataKey="pressure_hPa"
                        color="#f59e0b"
                        name="Pressure"
                        unit="hPa"
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <HealthDataHistory data={historyData} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Skeleton className="h-8 w-[200px]" />
          <div className="ml-auto flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Skeleton className="h-8 w-[250px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-[120px] w-full" />
            ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="col-span-4 h-[300px]" />
          <Skeleton className="col-span-3 h-[300px]" />
        </div>
      </div>
    </div>
  )
}
