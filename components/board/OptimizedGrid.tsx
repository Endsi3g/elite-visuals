'use client'

import { useEffect, useRef } from 'react'
import { Rect, Group } from 'react-konva'
import Konva from 'konva'

interface OptimizedGridProps {
  viewport: {
    x: number
    y: number
    width: number
    height: number
    scale: number
  }
  gridSize?: number
  color?: string
}

/**
 * Grille optimisée qui ne rend que les lignes visibles dans le viewport
 * Au lieu de rendre 2500 rectangles (50x50), on rend seulement ~40 lignes
 */
export function OptimizedGrid({ 
  viewport, 
  gridSize = 100,
  color = '#e5e7eb'
}: OptimizedGridProps) {
  const groupRef = useRef<Konva.Group>(null)

  useEffect(() => {
    if (!groupRef.current) return

    // Mettre en cache le groupe pour améliorer les performances
    groupRef.current.cache()
    
    return () => {
      groupRef.current?.clearCache()
    }
  }, [viewport])

  // Calculer les lignes visibles
  const startX = Math.floor(viewport.x / gridSize) * gridSize
  const endX = Math.ceil((viewport.x + viewport.width) / gridSize) * gridSize
  const startY = Math.floor(viewport.y / gridSize) * gridSize
  const endY = Math.ceil((viewport.y + viewport.height) / gridSize) * gridSize

  const verticalLines = []
  const horizontalLines = []

  // Lignes verticales
  for (let x = startX; x <= endX; x += gridSize) {
    verticalLines.push(
      <Rect
        key={`v-${x}`}
        x={x}
        y={startY}
        width={1}
        height={endY - startY}
        fill={color}
        listening={false} // Important: désactiver les events pour la performance
        perfectDrawEnabled={false} // Désactiver le pixel-perfect drawing
      />
    )
  }

  // Lignes horizontales
  for (let y = startY; y <= endY; y += gridSize) {
    horizontalLines.push(
      <Rect
        key={`h-${y}`}
        x={startX}
        y={y}
        width={endX - startX}
        height={1}
        fill={color}
        listening={false}
        perfectDrawEnabled={false}
      />
    )
  }

  return (
    <Group ref={groupRef}>
      {verticalLines}
      {horizontalLines}
    </Group>
  )
}
