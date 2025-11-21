"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X, Maximize, Share2, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface ShowroomNavigationProps {
  currentIndex: number
  totalItems: number
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
  onShare?: () => void
  autoplay?: boolean
  onToggleAutoplay?: () => void
  title?: string
}

export default function ShowroomNavigation({
  currentIndex,
  totalItems,
  onNext,
  onPrevious,
  onClose,
  onShare,
  autoplay = false,
  onToggleAutoplay,
  title = "Présentation"
}: ShowroomNavigationProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null)

  // Masquer les contrôles après inactivité
  const resetHideTimer = () => {
    setShowControls(true)
    if (hideTimeout) clearTimeout(hideTimeout)
    const timeout = setTimeout(() => setShowControls(false), 3000)
    setHideTimeout(timeout)
  }

  useEffect(() => {
    resetHideTimer()
    return () => {
      if (hideTimeout) clearTimeout(hideTimeout)
    }
  }, [])

  // Gestion du plein écran
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
          onNext()
          resetHideTimer()
          break
        case "ArrowLeft":
          onPrevious()
          resetHideTimer()
          break
        case "Escape":
          onClose()
          break
        case "f":
        case "F":
          toggleFullscreen()
          break
        case " ":
          e.preventDefault()
          onToggleAutoplay?.()
          resetHideTimer()
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [onNext, onPrevious, onClose, onToggleAutoplay])

  // Gestion du mouvement de la souris
  const handleMouseMove = () => {
    resetHideTimer()
  }

  const progress = ((currentIndex + 1) / totalItems) * 100

  return (
    <div
      className="fixed inset-0 z-50"
      onMouseMove={handleMouseMove}
    >
      {/* Header */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-white text-xl font-bold">{title}</h1>
                <span className="text-white/70 text-sm">
                  {currentIndex + 1} / {totalItems}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onToggleAutoplay && (
                  <Button
                    onClick={onToggleAutoplay}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    aria-label={autoplay ? "Pause" : "Play"}
                  >
                    {autoplay ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>
                )}

                {onShare && (
                  <Button
                    onClick={onShare}
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    aria-label="Partager"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                )}

                <Button
                  onClick={toggleFullscreen}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  aria-label="Plein écran"
                >
                  <Maximize className="h-5 w-5" />
                </Button>

                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  aria-label="Fermer"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <AnimatePresence>
        {showControls && (
          <>
            {/* Previous */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-10"
            >
              <Button
                onClick={onPrevious}
                disabled={currentIndex === 0}
                className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30 disabled:opacity-30"
                size="icon"
                aria-label="Précédent"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            </motion.div>

            {/* Next */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-10"
            >
              <Button
                onClick={onNext}
                disabled={currentIndex === totalItems - 1}
                className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30 disabled:opacity-30"
                size="icon"
                aria-label="Suivant"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Progress Bar & Dots */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-6"
          >
            {/* Progress Bar */}
            <div className="w-full h-1 bg-white/20 rounded-full mb-4 overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center items-center gap-2">
              {Array.from({ length: totalItems }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const diff = index - currentIndex
                    if (diff > 0) {
                      for (let i = 0; i < diff; i++) onNext()
                    } else if (diff < 0) {
                      for (let i = 0; i < Math.abs(diff); i++) onPrevious()
                    }
                  }}
                  className={`
                    transition-all duration-300
                    ${index === currentIndex
                      ? "w-8 h-2 bg-primary"
                      : "w-2 h-2 bg-white/40 hover:bg-white/60"
                    }
                    rounded-full
                  `}
                  aria-label={`Aller à la slide ${index + 1}`}
                  aria-current={index === currentIndex ? "true" : "false"}
                />
              ))}
            </div>

            {/* Keyboard Hints */}
            <div className="flex justify-center items-center gap-4 mt-4 text-white/60 text-xs">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd>
                <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd>
                Naviguer
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white/10 rounded">F</kbd>
                Plein écran
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white/10 rounded">Esc</kbd>
                Quitter
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
