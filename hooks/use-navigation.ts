"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export type ViewType = "board" | "kanban" | "showroom" | "search"

interface NavigationState {
  currentView: ViewType
  history: string[]
  canGoBack: boolean
  canGoForward: boolean
}

interface UseNavigationOptions {
  defaultView?: ViewType
  onViewChange?: (view: ViewType) => void
}

export function useNavigation(options: UseNavigationOptions = {}) {
  const router = useRouter()
  const pathname = usePathname()
  const { defaultView = "board", onViewChange } = options

  const [state, setState] = useState<NavigationState>({
    currentView: defaultView,
    history: [pathname],
    canGoBack: false,
    canGoForward: false
  })

  // Naviguer vers une vue
  const navigateTo = useCallback((view: ViewType, path?: string) => {
    setState((prev) => ({
      ...prev,
      currentView: view,
      history: [...prev.history, path || pathname],
      canGoBack: true
    }))

    if (path) {
      router.push(path)
    }

    onViewChange?.(view)
  }, [router, pathname, onViewChange])

  // Retour arrière
  const goBack = useCallback(() => {
    if (state.canGoBack) {
      router.back()
      setState((prev) => ({
        ...prev,
        history: prev.history.slice(0, -1),
        canGoBack: prev.history.length > 2
      }))
    }
  }, [router, state.canGoBack])

  // Avancer
  const goForward = useCallback(() => {
    if (state.canGoForward) {
      router.forward()
    }
  }, [router, state.canGoForward])

  // Naviguer vers le board
  const goToBoard = useCallback(() => {
    navigateTo("board", "/")
  }, [navigateTo])

  // Naviguer vers le Kanban
  const goToKanban = useCallback(() => {
    navigateTo("kanban")
  }, [navigateTo])

  // Naviguer vers le Showroom
  const goToShowroom = useCallback((boardId: string) => {
    navigateTo("showroom", `/showroom/${boardId}`)
  }, [navigateTo])

  // Naviguer vers la recherche
  const goToSearch = useCallback(() => {
    navigateTo("search")
  }, [navigateTo])

  return {
    currentView: state.currentView,
    canGoBack: state.canGoBack,
    canGoForward: state.canGoForward,
    navigateTo,
    goBack,
    goForward,
    goToBoard,
    goToKanban,
    goToShowroom,
    goToSearch
  }
}

// Hook pour gérer les raccourcis clavier globaux
export function useKeyboardNavigation(callbacks: {
  onAddNote?: () => void
  onGenerateAI?: () => void
  onUpload?: () => void
  onSearch?: () => void
  onToggleKanban?: () => void
  onSave?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  onSelectAll?: () => void
  onExport?: () => void
  onShowroom?: () => void
  onComment?: () => void
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorer si dans un input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      // Raccourcis simples
      if (!e.ctrlKey && !e.metaKey && !e.altKey) {
        switch (e.key.toLowerCase()) {
          case "n":
            e.preventDefault()
            callbacks.onAddNote?.()
            break
          case "g":
            e.preventDefault()
            callbacks.onGenerateAI?.()
            break
          case "u":
            e.preventDefault()
            callbacks.onUpload?.()
            break
          case "c":
            e.preventDefault()
            callbacks.onComment?.()
            break
          case "s":
            e.preventDefault()
            callbacks.onShowroom?.()
            break
          case "e":
            e.preventDefault()
            callbacks.onExport?.()
            break
          case "delete":
            e.preventDefault()
            callbacks.onDelete?.()
            break
        }
      }

      // Raccourcis avec Ctrl/Cmd
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "f":
            e.preventDefault()
            callbacks.onSearch?.()
            break
          case "k":
            e.preventDefault()
            callbacks.onToggleKanban?.()
            break
          case "s":
            e.preventDefault()
            callbacks.onSave?.()
            break
          case "z":
            e.preventDefault()
            callbacks.onUndo?.()
            break
          case "y":
            e.preventDefault()
            callbacks.onRedo?.()
            break
          case "d":
            e.preventDefault()
            callbacks.onDuplicate?.()
            break
          case "a":
            e.preventDefault()
            callbacks.onSelectAll?.()
            break
          case "e":
            e.preventDefault()
            callbacks.onExport?.()
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [callbacks])
}

// Hook pour gérer le focus et l'accessibilité
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null)

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    container.addEventListener("keydown", handleTabKey as any)
    return () => container.removeEventListener("keydown", handleTabKey as any)
  }, [])

  const restoreFocus = useCallback(() => {
    focusedElement?.focus()
  }, [focusedElement])

  const saveFocus = useCallback(() => {
    setFocusedElement(document.activeElement as HTMLElement)
  }, [])

  return {
    trapFocus,
    restoreFocus,
    saveFocus
  }
}

// Hook pour détecter le type d'appareil
export function useDeviceType() {
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">("desktop")

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth
      if (width < 768) {
        setDeviceType("mobile")
      } else if (width < 1024) {
        setDeviceType("tablet")
      } else {
        setDeviceType("desktop")
      }
    }

    checkDeviceType()
    window.addEventListener("resize", checkDeviceType)
    return () => window.removeEventListener("resize", checkDeviceType)
  }, [])

  return {
    deviceType,
    isMobile: deviceType === "mobile",
    isTablet: deviceType === "tablet",
    isDesktop: deviceType === "desktop"
  }
}
