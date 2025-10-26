"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, Download } from "lucide-react"
import { format } from "date-fns"

interface HealthData {
  ecg_raw: number
  heart_rate_bpm: number
  "humidity_%": number
  pressure_hPa: number
  "spo2_%": number
  temperature_C: number
  timestamp: number
}

interface HealthDataHistoryProps {
  data: HealthData[]
}

export function HealthDataHistory({ data }: HealthDataHistoryProps) {
  const [sortBy, setSortBy] = useState<keyof HealthData>("timestamp")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    if (sortOrder === "asc") {
      return a[sortBy] > b[sortBy] ? 1 : -1
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1
    }
  })

  // Handle sort
  const handleSort = (key: keyof HealthData) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(key)
      setSortOrder("desc")
    }
  }

  // Export data as CSV
  const exportCSV = () => {
    const headers = [
      "Timestamp",
      "Heart Rate (BPM)",
      "SpO2 (%)",
      "Temperature (°C)",
      "Humidity (%)",
      "Pressure (hPa)",
      "ECG Raw",
    ]

    const csvData = data.map((item) => [
      new Date(item.timestamp).toISOString(),
      item.heart_rate_bpm,
      item["spo2_%"],
      item["temperature_C"],
      item["humidity_%"],
      item["pressure_hPa"],
      item.ecg_raw,
    ])

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `health_data_${new Date().toISOString()}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Health Data History</h3>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                Sort by <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort("timestamp")}>Timestamp</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("heart_rate_bpm")}>Heart Rate</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("spo2_%")}>SpO2</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("temperature_C")}>Temperature</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" className="flex items-center gap-1" onClick={exportCSV}>
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Timestamp</TableHead>
              <TableHead>Heart Rate (BPM)</TableHead>
              <TableHead>SpO2 (%)</TableHead>
              <TableHead>Temperature (°C)</TableHead>
              <TableHead>Humidity (%)</TableHead>
              <TableHead>Pressure (hPa)</TableHead>
              <TableHead>ECG Raw</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{format(new Date(item.timestamp), "HH:mm:ss")}</TableCell>
                <TableCell>{item.heart_rate_bpm.toFixed(1)}</TableCell>
                <TableCell>{item["spo2_%"]}</TableCell>
                <TableCell>{item["temperature_C"].toFixed(1)}</TableCell>
                <TableCell>{item["humidity_%"]}</TableCell>
                <TableCell>{item["pressure_hPa"].toFixed(2)}</TableCell>
                <TableCell>{item.ecg_raw}</TableCell>
              </TableRow>
            ))}
            {sortedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
