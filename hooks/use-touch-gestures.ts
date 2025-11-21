import { useState, useCallback, useRef } from 'react'

export type GestureType = 'pan' | 'pinch' | 'tap' | 'long-press' | null

export interface TouchGestureState {
  gesture: GestureType
  scale: number
  deltaX: number
  deltaY: number
  isPinching: boolean
}

export interface TouchGestureOptions {
  onPinch?: (scale: number) => void
  onPan?: (deltaX: number, deltaY: number) => void
  onTap?: (x: number, y: number) => void
  onLongPress?: (x: number, y: number) => void
  minPinchScale?: number
  maxPinchScale?: number
  longPressDelay?: number
}

function getDistance(touch1: Touch, touch2: Touch): number {
  const dx = touch1.clientX - touch2.clientX
  const dy = touch1.clientY - touch2.clientY
  return Math.sqrt(dx * dx + dy * dy)
}

function getCenter(touch1: Touch, touch2: Touch): { x: number; y: number } {
  return {
    x: (touch1.clientX + touch2.clientX) / 2,
    y: (touch1.clientY + touch2.clientY) / 2
  }
}

export function useTouchGestures({
  onPinch,
  onPan,
  onTap,
  onLongPress,
  minPinchScale = 0.5,
  maxPinchScale = 3,
  longPressDelay = 500
}: TouchGestureOptions = {}) {
  const [state, setState] = useState<TouchGestureState>({
    gesture: null,
    scale: 1,
    deltaX: 0,
    deltaY: 0,
    isPinching: false
  })

  const initialDistance = useRef<number>(0)
  const initialScale = useRef<number>(1)
  const lastTouchPos = useRef<{ x: number; y: number } | null>(null)
  const touchStartTime = useRef<number>(0)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)

  const handleTouchStart = useCallback((e: TouchEvent | React.TouchEvent) => {
    const touches = 'touches' in e ? e.touches : (e as TouchEvent).touches
    touchStartTime.current = Date.now()

    if (touches.length === 2) {
      // Pinch gesture
      e.preventDefault()
      setState(prev => ({ ...prev, gesture: 'pinch', isPinching: true }))
      initialDistance.current = getDistance(touches[0], touches[1])
      initialScale.current = state.scale

      // Clear long press timer
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
        longPressTimer.current = null
      }
    } else if (touches.length === 1) {
      // Pan or tap gesture
      const touch = touches[0]
      lastTouchPos.current = { x: touch.clientX, y: touch.clientY }
      setState(prev => ({ ...prev, gesture: 'pan' }))

      // Start long press timer
      if (onLongPress) {
        longPressTimer.current = setTimeout(() => {
          onLongPress(touch.clientX, touch.clientY)
          setState(prev => ({ ...prev, gesture: 'long-press' }))
        }, longPressDelay)
      }
    }
  }, [state.scale, onLongPress, longPressDelay])

  const handleTouchMove = useCallback((e: TouchEvent | React.TouchEvent) => {
    const touches = 'touches' in e ? e.touches : (e as TouchEvent).touches

    // Clear long press timer on move
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    if (touches.length === 2 && state.gesture === 'pinch') {
      // Pinch zoom
      e.preventDefault()
      const currentDistance = getDistance(touches[0], touches[1])
      const scale = (currentDistance / initialDistance.current) * initialScale.current
      const clampedScale = Math.max(minPinchScale, Math.min(maxPinchScale, scale))

      setState(prev => ({ ...prev, scale: clampedScale }))
      onPinch?.(clampedScale)
    } else if (touches.length === 1 && state.gesture === 'pan' && lastTouchPos.current) {
      // Pan
      const touch = touches[0]
      const deltaX = touch.clientX - lastTouchPos.current.x
      const deltaY = touch.clientY - lastTouchPos.current.y

      setState(prev => ({ ...prev, deltaX, deltaY }))
      onPan?.(deltaX, deltaY)

      lastTouchPos.current = { x: touch.clientX, y: touch.clientY }
    }
  }, [state.gesture, minPinchScale, maxPinchScale, onPinch, onPan])

  const handleTouchEnd = useCallback((e: TouchEvent | React.TouchEvent) => {
    const touches = 'touches' in e ? e.touches : (e as TouchEvent).touches
    const changedTouches = 'changedTouches' in e ? e.changedTouches : (e as TouchEvent).changedTouches

    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }

    // Detect tap (quick touch without movement)
    if (
      state.gesture === 'pan' &&
      touches.length === 0 &&
      Date.now() - touchStartTime.current < 200 &&
      Math.abs(state.deltaX) < 10 &&
      Math.abs(state.deltaY) < 10
    ) {
      const touch = changedTouches[0]
      onTap?.(touch.clientX, touch.clientY)
      setState(prev => ({ ...prev, gesture: 'tap' }))
    }

    // Reset state
    if (touches.length === 0) {
      setState(prev => ({
        ...prev,
        gesture: null,
        deltaX: 0,
        deltaY: 0,
        isPinching: false
      }))
      lastTouchPos.current = null
    } else if (touches.length === 1) {
      // One finger remaining, switch to pan
      setState(prev => ({ ...prev, gesture: 'pan', isPinching: false }))
      lastTouchPos.current = {
        x: touches[0].clientX,
        y: touches[0].clientY
      }
    }
  }, [state.gesture, state.deltaX, state.deltaY, onTap])

  const resetGesture = useCallback(() => {
    setState({
      gesture: null,
      scale: 1,
      deltaX: 0,
      deltaY: 0,
      isPinching: false
    })
    initialDistance.current = 0
    initialScale.current = 1
    lastTouchPos.current = null
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  return {
    ...state,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    resetGesture
  }
}
