"use client"

import { Group, Rect, Text } from "react-konva"

interface BoardCardProps {
  item: {
    id: string
    type: string
    x: number
    y: number
    width: number
    height: number
    content: any
    title?: string
  }
}

export default function BoardCard({ item }: BoardCardProps) {
  return (
    <Group
      x={item.x}
      y={item.y}
      draggable
      onDragEnd={(e) => {
        // Update position in state
        console.log("Moved to:", e.target.x(), e.target.y())
      }}
    >
      {/* Card Background */}
      <Rect
        width={item.width}
        height={item.height}
        fill="white"
        cornerRadius={8}
        shadowColor="rgba(255, 104, 74, 0.2)"
        shadowBlur={10}
        shadowOffset={{ x: 0, y: 4 }}
        shadowOpacity={0.3}
      />

      {/* Card Title */}
      {item.title && (
        <Text
          text={item.title}
          x={12}
          y={12}
          fontSize={14}
          fontFamily="Inter"
          fontStyle="bold"
          fill="#1f2937"
          width={item.width - 24}
        />
      )}

      {/* Card Content */}
      <Text
        text={typeof item.content === "string" ? item.content : "Media"}
        x={12}
        y={item.title ? 40 : 12}
        fontSize={12}
        fontFamily="Inter"
        fill="#6b7280"
        width={item.width - 24}
        height={item.height - (item.title ? 52 : 24)}
        wrap="word"
      />

      {/* Type Indicator */}
      <Rect
        x={item.width - 40}
        y={8}
        width={32}
        height={20}
        fill="#FF684A"
        cornerRadius={4}
      />
      <Text
        text={item.type.substring(0, 3).toUpperCase()}
        x={item.width - 38}
        y={12}
        fontSize={10}
        fontFamily="Inter"
        fontStyle="bold"
        fill="white"
      />
    </Group>
  )
}
