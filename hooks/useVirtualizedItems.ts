import { useState, useEffect, useCallback } from 'react'
import Konva from 'konva'

// Fonction debounce simple pour optimiser les performances
function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

interface Viewport {
  x: number
  y: number
  width: number
  height: number
  scale: number
}

interface BoardItem {
  id: string
  x: number
  y: number
  width: number
  height: number
  [key: string]: any
}

export function useVirtualizedItems<T extends BoardItem>(
  items: T[],
  stageRef: React.RefObject<Konva.Stage>,
  buffer: number = 500 // Pixels supplémentaires autour du viewport
) {
  const [visibleItems, setVisibleItems] = useState<T[]>([])
  const [viewport, setViewport] = useState<Viewport>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    scale: 1
  })

  const updateVisibleItems = useCallback(() => {
    if (!stageRef.current) return

    const stage = stageRef.current
    const scale = stage.scaleX()
    const stageX = stage.x()
    const stageY = stage.y()
    
    // Calculer la zone visible dans les coordonnées du monde
    const visibleRect = {
      x: (-stageX - buffer) / scale,
      y: (-stageY - buffer) / scale,
      width: (stage.width() + buffer * 2) / scale,
      height: (stage.height() + buffer * 2) / scale
    }

    setViewport({
      x: visibleRect.x,
      y: visibleRect.y,
      width: visibleRect.width,
      height: visibleRect.height,
      scale
    })

    // Filtrer les items qui intersectent le viewport
    const visible = items.filter(item => {
      return (
        item.x < visibleRect.x + visibleRect.width &&
        item.x + item.width > visibleRect.x &&
        item.y < visibleRect.y + visibleRect.height &&
        item.y + item.height > visibleRect.y
      )
    })

    setVisibleItems(visible)
  }, [items, buffer])

  // Mettre à jour lors du chargement initial, redimensionnement, ou changement d'items
  useEffect(() => {
    updateVisibleItems()
    
    const handleResize = () => {
      updateVisibleItems()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [updateVisibleItems])

  return {
    visibleItems,
    viewport,
    updateVisibleItems: debouncedUpdate,
    forceUpdate: updateVisibleItems
  }
}
