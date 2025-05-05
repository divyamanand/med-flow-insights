"use client"

import { useEffect, useRef, useState } from "react"

interface ECGChartProps {
  value: number
  history: number[]
}

export function ECGChart({ value, history }: ECGChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<number[]>([])
  const [size, setSize] = useState({ width: 0, height: 0 })

  // Track canvas size with ResizeObserver
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setSize({ width, height })
      }
    })
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }
    return () => observer.disconnect()
  }, [])

  // Set data when value updates
  useEffect(() => {
    setData((prev) => [...prev, value].slice(-100))
  }, [value])

  // Init from history
  useEffect(() => {
    if (history.length > 0) {
      setData(history.slice(-100))
    }
  }, [])

  // Drawing logic
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || size.width === 0 || size.height === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = size.width * dpr
    canvas.height = size.height * dpr
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(dpr, dpr)

    // Background
    ctx.fillStyle = "#0f172a"
    ctx.fillRect(0, 0, size.width, size.height)

    // Grid
    ctx.strokeStyle = "#334155"
    ctx.lineWidth = 0.5
    ctx.setLineDash([2, 4])
    for (let x = 0; x <= size.width; x += 20) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, size.height)
      ctx.stroke()
    }
    for (let y = 0; y <= size.height; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(size.width, y)
      ctx.stroke()
    }
    ctx.setLineDash([])

    // ECG waveform
    if (data.length > 1) {
      const min = Math.min(...data)
      const max = Math.max(...data)
      const range = max - min || 1

      const xStep = size.width / (data.length - 1)
      const yScale = (size.height * 0.8) / range
      const yOffset = size.height * 0.1 + min * yScale

      ctx.beginPath()
      ctx.strokeStyle = "#f43f5e"
      ctx.lineWidth = 2
      ctx.shadowColor = "#f43f5e"
      ctx.shadowBlur = 12

      data.forEach((val, i) => {
        const x = i * xStep
        const y = size.height - ((val - min) * yScale + yOffset)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      })

      ctx.stroke()
    }
  }, [data, size])

  return (
    <div
      ref={containerRef}
      className="w-full h-[300px] bg-slate-900 rounded-xl shadow relative overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  )
}
