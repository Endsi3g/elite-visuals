import { useState, useEffect, useCallback } from 'react'

export interface KeyboardNavigationItem {
  id: string
  type: 'card' | 'cluster' | 'comment' | 'connection'
  x: number
  y: number
  width: number
  height: number
  title?: string
}

export interface KeyboardNavigationOptions {
  items: KeyboardNavigationItem[]
  onSelect?: (id: string) => void
  onMove?: (id: string, dx: number, dy: number) => void
  onDelete?: (id: string) => void
  onActivate?: (id: string) => void
  enabled?: boolean
}

export function useKeyboardNavigation({
  items,
  onSelect,
  onMove,
  onDelete,
  onActivate,
  enabled = true
}: KeyboardNavigationOptions) {
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [isShiftPressed, setIsShiftPressed] = useState(false)

  const focusedItem = items.find(item => item.id === focusedId)

  // Navigate to next/previous item
  const navigateItems = useCallback((direction: 'next' | 'prev') => {
    if (items.length === 0) return

    const currentIndex = focusedId 
      ? items.findIndex(item => item.id === focusedId)
      : -1

    let nextIndex: number
    if (direction === 'next') {
      nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
    }

    const nextItem = items[nextIndex]
    if (nextItem) {
      setFocusedId(nextItem.id)
      onSelect?.(nextItem.id)
    }
  }, [items, focusedId, onSelect])

  // Move focused item with arrow keys
  const moveItem = useCallback((dx: number, dy: number) => {
    if (!focusedId) return
    onMove?.(focusedId, dx, dy)
  }, [focusedId, onMove])

  // Handle keyboard events
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Track shift key for fast movement
      if (e.key === 'Shift') {
        setIsShiftPressed(true)
      }

      // Don't interfere with input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      const moveDistance = isShiftPressed ? 50 : 10

      switch (e.key) {
        case 'Tab':
          e.preventDefault()
          navigateItems(e.shiftKey ? 'prev' : 'next')
          break

        case 'ArrowUp':
          e.preventDefault()
          if (focusedId) {
            moveItem(0, -moveDistance)
          } else {
            navigateItems('prev')
          }
          break

        case 'ArrowDown':
          e.preventDefault()
          if (focusedId) {
            moveItem(0, moveDistance)
          } else {
            navigateItems('next')
          }
          break

        case 'ArrowLeft':
          e.preventDefault()
          if (focusedId) {
            moveItem(-moveDistance, 0)
          } else {
            navigateItems('prev')
          }
          break

        case 'ArrowRight':
          e.preventDefault()
          if (focusedId) {
            moveItem(moveDistance, 0)
          } else {
            navigateItems('next')
          }
          break

        case 'Enter':
        case ' ':
          e.preventDefault()
          if (focusedId) {
            onActivate?.(focusedId)
          } else if (items.length > 0) {
            setFocusedId(items[0].id)
            onSelect?.(items[0].id)
          }
          break

        case 'Escape':
          e.preventDefault()
          setFocusedId(null)
          break

        case 'Delete':
        case 'Backspace':
          if (focusedId && e.target === document.body) {
            e.preventDefault()
            onDelete?.(focusedId)
            setFocusedId(null)
          }
          break
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [
    enabled,
    focusedId,
    isShiftPressed,
    items,
    navigateItems,
    moveItem,
    onActivate,
    onDelete,
    onSelect
  ])

  return {
    focusedId,
    focusedItem,
    setFocusedId,
    isShiftPressed
  }
}
