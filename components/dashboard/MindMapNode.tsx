"use client"

import { useState } from "react"
import { Group, Rect, Text, Line } from "react-konva"
import { Sparkles } from "lucide-react"

export interface MindMapNodeData {
  id: string
  x: number
  y: number
  width: number
  height: number
  title: string
  content: string
  type: 'root' | 'branch' | 'leaf'
  parentId?: string
  children: string[]
  color?: string
  aiGenerated?: boolean
}

interface MindMapNodeProps {
  node: MindMapNodeData
  onDragEnd?: (id: string, x: number, y: number) => void
  onDoubleClick?: (id: string) => void
  onSelect?: (id: string) => void
  selected?: boolean
}

export default function MindMapNode({ 
  node, 
  onDragEnd, 
  onDoubleClick, 
  onSelect,
  selected 
}: MindMapNodeProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Couleurs selon le type de nœud
  const getNodeStyle = () => {
    switch (node.type) {
      case 'root':
        return {
          fill: '#FF684A',
          stroke: '#ff5535',
          strokeWidth: 0,
          textColor: '#FFFFFF',
          fontSize: 18,
          fontWeight: 'bold',
          shadowBlur: 20,
          shadowColor: 'rgba(255, 104, 74, 0.4)',
        }
      case 'branch':
        return {
          fill: '#FFFFFF',
          stroke: '#FF684A',
          strokeWidth: 2,
          textColor: '#1f2937',
          fontSize: 16,
          fontWeight: 'normal',
          shadowBlur: 12,
          shadowColor: 'rgba(255, 104, 74, 0.2)',
        }
      case 'leaf':
        return {
          fill: '#FFFFFF',
          stroke: '#e5e7eb',
          strokeWidth: 1,
          textColor: '#6b7280',
          fontSize: 14,
          fontWeight: 'normal',
          shadowBlur: 8,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
        }
    }
  }

  const style = getNodeStyle()
  const scale = isHovered ? 1.05 : selected ? 1.03 : 1

  return (
    <Group
      x={node.x}
      y={node.y}
      draggable
      scaleX={scale}
      scaleY={scale}
      onDragEnd={(e) => {
        onDragEnd?.(node.id, e.target.x(), e.target.y())
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDblClick={() => onDoubleClick?.(node.id)}
      onClick={() => onSelect?.(node.id)}
    >
      {/* Background Rectangle */}
      <Rect
        width={node.width}
        height={node.height}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={style.strokeWidth}
        cornerRadius={node.type === 'root' ? 16 : node.type === 'branch' ? 12 : 8}
        shadowColor={style.shadowColor}
        shadowBlur={isHovered ? style.shadowBlur * 1.5 : style.shadowBlur}
        shadowOffset={{ x: 0, y: isHovered ? 6 : 4 }}
        shadowOpacity={isHovered ? 0.4 : 0.3}
      />

      {/* AI Badge */}
      {node.aiGenerated && (
        <>
          <Rect
            x={node.width - 50}
            y={8}
            width={42}
            height={20}
            fill="rgba(255, 104, 74, 0.2)"
            cornerRadius={4}
          />
          <Text
            text="🤖 IA"
            x={node.width - 48}
            y={12}
            fontSize={10}
            fontFamily="Inter"
            fontStyle="bold"
            fill={node.type === 'root' ? '#FFFFFF' : '#FF684A'}
          />
        </>
      )}

      {/* Title */}
      <Text
        text={node.title}
        x={16}
        y={16}
        fontSize={style.fontSize}
        fontFamily="Inter"
        fontStyle={style.fontWeight}
        fill={style.textColor}
        width={node.width - 32}
        wrap="word"
      />

      {/* Content */}
      {node.content && (
        <Text
          text={node.content}
          x={16}
          y={node.title ? 40 : 16}
          fontSize={12}
          fontFamily="Inter"
          fill={node.type === 'root' ? 'rgba(255, 255, 255, 0.9)' : '#6b7280'}
          width={node.width - 32}
          height={node.height - (node.title ? 56 : 32)}
          wrap="word"
          ellipsis
        />
      )}

      {/* Selection Indicator */}
      {selected && (
        <Rect
          width={node.width}
          height={node.height}
          stroke="#FF684A"
          strokeWidth={3}
          cornerRadius={node.type === 'root' ? 16 : node.type === 'branch' ? 12 : 8}
          dash={[8, 4]}
        />
      )}

      {/* Hover Glow Effect */}
      {isHovered && (
        <Rect
          width={node.width}
          height={node.height}
          stroke="#FF684A"
          strokeWidth={2}
          cornerRadius={node.type === 'root' ? 16 : node.type === 'branch' ? 12 : 8}
          opacity={0.5}
        />
      )}
    </Group>
  )
}

// Composant pour les connexions entre nœuds
interface MindMapConnectionProps {
  fromX: number
  fromY: number
  fromWidth: number
  fromHeight: number
  toX: number
  toY: number
  toWidth: number
  toHeight: number
  animated?: boolean
}

export function MindMapConnection({
  fromX,
  fromY,
  fromWidth,
  fromHeight,
  toX,
  toY,
  toWidth,
  toHeight,
  animated
}: MindMapConnectionProps) {
  // Calculer les points de connexion (centre droit du parent vers centre gauche de l'enfant)
  const startX = fromX + fromWidth
  const startY = fromY + fromHeight / 2
  const endX = toX
  const endY = toY + toHeight / 2

  // Points de contrôle pour la courbe de Bézier
  const controlPoint1X = startX + (endX - startX) / 2
  const controlPoint1Y = startY
  const controlPoint2X = startX + (endX - startX) / 2
  const controlPoint2Y = endY

  return (
    <Line
      points={[
        startX, startY,
        controlPoint1X, controlPoint1Y,
        controlPoint2X, controlPoint2Y,
        endX, endY
      ]}
      stroke="#FF684A"
      strokeWidth={2}
      lineCap="round"
      lineJoin="round"
      bezier
      opacity={0.6}
      shadowColor="rgba(255, 104, 74, 0.3)"
      shadowBlur={8}
      shadowOffset={{ x: 0, y: 2 }}
      dash={animated ? [10, 5] : undefined}
      dashEnabled={animated}
    />
  )
}
