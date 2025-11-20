"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Lock } from "lucide-react"

// Import dynamique de Konva pour éviter les erreurs SSR
const Stage = dynamic(() => import("react-konva").then((mod) => mod.Stage), { ssr: false })
const Layer = dynamic(() => import("react-konva").then((mod) => mod.Layer), { ssr: false })
const Rect = dynamic(() => import("react-konva").then((mod) => mod.Rect), { ssr: false })
const Text = dynamic(() => import("react-konva").then((mod) => mod.Text), { ssr: false })

interface BoardItem {
  id: string
  type: "Text" | "Image" | "Video" | "File" | "ai-generated"
  x: number
  y: number
  width: number
  height: number
  content: any
  title?: string
}

export default function ShowroomPage({ params }: { params: { id: string } }) {
  const [items, setItems] = useState<BoardItem[]>([])
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // TODO: Fetch board data from API/Supabase
    // For now, mock data
    setItems([
      {
        id: "1",
        type: "Text",
        x: 100,
        y: 100,
        width: 250,
        height: 150,
        content: "Bienvenue dans le showroom Elite Visuals",
        title: "Présentation",
      },
    ])
  }, [params.id])

  const handleWheel = (e: any) => {
    e.evt.preventDefault()
    const scaleBy = 1.1
    const stage = e.target.getStage()
    const oldScale = stage.scaleX()
    const pointer = stage.getPointerPosition()

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    }

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy
    setScale(newScale)

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    }
    setPosition(newPos)
  }

  return (
    <div className="w-screen h-screen relative bg-gray-50">
      {/* Header with Elite Visuals branding */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">EV</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Elite Visuals</h1>
              <p className="text-xs text-gray-500">Mode Showroom - Lecture seule</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Lock className="h-4 w-4" />
            <span>Lecture seule</span>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute bottom-4 right-4 z-10 opacity-30 pointer-events-none">
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-semibold text-gray-900">Elite Visuals</p>
          <p className="text-xs text-gray-600">Showroom Mode</p>
        </div>
      </div>

      {/* Konva Stage - Read Only */}
      <div className="pt-20">
        <Stage
          width={window.innerWidth}
          height={window.innerHeight - 80}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          draggable
          onWheel={handleWheel}
          onDragEnd={(e) => {
            setPosition({ x: e.target.x(), y: e.target.y() })
          }}
        >
          <Layer>
            {/* Grid Background */}
            {Array.from({ length: 50 }).map((_, i) => (
              <Rect
                key={`grid-${i}`}
                x={i * 100}
                y={0}
                width={1}
                height={5000}
                fill="#e5e7eb"
              />
            ))}
            {Array.from({ length: 50 }).map((_, i) => (
              <Rect
                key={`grid-h-${i}`}
                x={0}
                y={i * 100}
                width={5000}
                height={1}
                fill="#e5e7eb"
              />
            ))}

            {/* Board Items - Read Only */}
            {items.map((item) => (
              <Rect
                key={item.id}
                x={item.x}
                y={item.y}
                width={item.width}
                height={item.height}
                fill="white"
                stroke="#FF684A"
                strokeWidth={2}
                cornerRadius={12}
                shadowColor="rgba(0,0,0,0.1)"
                shadowBlur={10}
                shadowOffsetY={4}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      {/* Info Bar */}
      <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          Zoom: {Math.round(scale * 100)}% | Items: {items.length}
        </p>
      </div>
    </div>
  )
}
