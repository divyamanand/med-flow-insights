"use client"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

interface HealthDataChartProps {
  data: Array<any>
  dataKey: string
  color: string
  name: string
  unit: string
}

export function HealthDataChart({ data, dataKey, color, name, unit }: HealthDataChartProps) {
  // Format data for the chart
  const chartData = data.map((item, index) => ({
    name: new Date(item.timestamp).toLocaleTimeString(),
    [dataKey]: typeof item[dataKey] === "number" ? item[dataKey] : 0,
  }))

  return (
    <ChartContainer
      config={{
        [dataKey]: {
          label: name,
          color: color,
          unit: unit,
        },
      }}
      className="h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              const time = value.split(":")
              return `${time[0]}:${time[1]}`
            }}
          />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area type="monotone" dataKey={dataKey} stroke={color} fillOpacity={1} fill={`url(#gradient-${dataKey})`} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
