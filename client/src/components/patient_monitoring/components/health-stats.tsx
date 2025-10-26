import { Activity, Droplets, Heart, Thermometer, Wind, Gauge } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HealthData {
  ecg_raw: number
  heart_rate_bpm: number
  "humidity_%": number
  pressure_hPa: number
  "spo2_%": number
  temperature_C: number
}

interface HealthStatsProps {
  data: HealthData
}

export function HealthStats({ data }: HealthStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Card className="border-l-4 border-l-red-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
          <Heart className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.heart_rate_bpm.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">BPM</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">SpO2</CardTitle>
          <Activity className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data["spo2_%"]}</div>
          <p className="text-xs text-muted-foreground">%</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-cyan-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Temperature</CardTitle>
          <Thermometer className="h-4 w-4 text-cyan-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data["temperature_C"].toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">°C</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Humidity</CardTitle>
          <Droplets className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data["humidity_%"]}</div>
          <p className="text-xs text-muted-foreground">%</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-amber-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pressure</CardTitle>
          <Gauge className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data["pressure_hPa"].toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">hPa</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-gray-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ECG Raw</CardTitle>
          <Wind className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.ecg_raw}</div>
          <p className="text-xs text-muted-foreground">mV</p>
        </CardContent>
      </Card>
    </div>
  )
}
