"use client"

import { useState } from "react"
import { Group, Rect, Text } from "react-konva"

export interface CardData {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: 'text' | 'image' | 'video' | 'ai-generated'
  title: string
  content: string
  author: string
  timestamp: Date
  aiModel?: string
  imageUrl?: string
}

interface InteractiveCardProps {
  card: CardData
  onDragEnd?: (id: string, x: number, y: number) => void
  onSelect?: (id: string) => void
  selected?: boolean
}

export default function InteractiveCard({ 
  card, 
  onDragEnd, 
  onSelect,
  selected 
}: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getCardStyle = () => {
    const baseStyle = {
      fill: '#FFFFFF',
      stroke: '#e5e7eb',
      strokeWidth: 1,
      shadowBlur: 8,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
    }

    if (card.type === 'ai-generated') {
      return {
        ...baseStyle,
        stroke: '#FF684A',
        strokeWidth: 2,
        shadowColor: 'rgba(255, 104, 74, 0.2)',
        shadowBlur: 12,
      }
    }

    return baseStyle
  }

  const style = getCardStyle()
  const scale = isHovered ? 1.02 : selected ? 1.01 : 1

  return (
    <Group
      x={card.x}
      y={card.y}
      draggable
      scaleX={scale}
      scaleY={scale}
      onDragEnd={(e) => {
        onDragEnd?.(card.id, e.target.x(), e.target.y())
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect?.(card.id)}
    >
      {/* Card Background */}
      <Rect
        width={card.width}
        height={card.height}
        fill={style.fill}
        stroke={isHovered ? '#FF684A' : style.stroke}
        strokeWidth={isHovered ? 2 : style.strokeWidth}
        cornerRadius={12}
        shadowColor={isHovered ? 'rgba(255, 104, 74, 0.3)' : style.shadowColor}
        shadowBlur={isHovered ? style.shadowBlur * 1.5 : style.shadowBlur}
        shadowOffset={{ x: 0, y: isHovered ? 6 : 4 }}
        shadowOpacity={0.3}
      />

      {/* Type Badge */}
      <Rect
        x={12}
        y={12}
        width={card.type === 'ai-generated' ? 70 : 50}
        height={24}
        fill={card.type === 'ai-generated' ? '#FF684A' : '#f3f4f6'}
        cornerRadius={6}
      />
      <Text
        text={card.type === 'ai-generated' ? '🤖 IA' : card.type.toUpperCase()}
        x={card.type === 'ai-generated' ? 16 : 16}
        y={17}
        fontSize={11}
        fontFamily="Inter"
        fontStyle="bold"
        fill={card.type === 'ai-generated' ? '#FFFFFF' : '#6b7280'}
      />

      {/* Title */}
      <Text
        text={card.title}
        x={16}
        y={48}
        fontSize={16}
        fontFamily="Inter"
        fontStyle="bold"
        fill="#1f2937"
        width={card.width - 32}
        wrap="word"
      />

      {/* Content */}
      <Text
        text={card.content}
        x={16}
        y={76}
        fontSize={13}
        fontFamily="Inter"
        fill="#6b7280"
        width={card.width - 32}
        height={card.height - 120}
        wrap="word"
        ellipsis
      />

      {/* Footer Divider */}
      <Rect
        x={16}
        y={card.height - 44}
        width={card.width - 32}
        height={1}
        fill="#e5e7eb"
      />

      {/* Author & Timestamp */}
      <Text
        text={card.author}
        x={16}
        y={card.height - 32}
        fontSize={11}
        fontFamily="Inter"
        fill="#9ca3af"
      />
      <Text
        text={new Date(card.timestamp).toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'short' 
        })}
        x={card.width - 80}
        y={card.height - 32}
        fontSize={11}
        fontFamily="Inter"
        fill="#9ca3af"
      />

      {/* AI Model Badge (if applicable) */}
      {card.aiModel && (
        <>
          <Rect
            x={card.width - 16}
            y={12}
            width={12}
            height={12}
            fill="#FF684A"
            cornerRadius={6}
            opacity={0.8}
          />
          <Text
            text="✨"
            x={card.width - 14}
            y={13}
            fontSize={8}
          />
        </>
      )}

      {/* Selection Indicator */}
      {selected && (
        <Rect
          width={card.width}
          height={card.height}
          stroke="#FF684A"
          strokeWidth={3}
          cornerRadius={12}
          dash={[8, 4]}
        />
      )}

      {/* Hover Glow */}
      {isHovered && (
        <Rect
          width={card.width}
          height={card.height}
          stroke="#FF684A"
          strokeWidth={2}
          cornerRadius={12}
          opacity={0.3}
        />
      )}
    </Group>
  )
}
