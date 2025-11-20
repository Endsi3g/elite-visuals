"use client"

import { useState, useEffect } from "react"
import { Eye, Download, Share2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ShowroomModeProps {
  boardId: string
  boardTitle: string
  items: any[]
  onClose: () => void
}

/**
 * Mode Showroom Client - Interface épurée lecture seule
 * Fonctionnalités:
 * - Interface lecture seule (pas d'édition)
 * - Watermarks "Elite Visuals" automatiques
 * - Navigation fluide
 * - Partage simplifié
 */
export default function ShowroomMode({ 
  boardId, 
  boardTitle, 
  items, 
  onClose 
}: ShowroomModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    // Empêcher le scroll en mode showroom
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext()
    if (e.key === 'ArrowLeft') handlePrevious()
    if (e.key === 'Escape') onClose()
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress as any)
    return () => window.removeEventListener('keydown', handleKeyPress as any)
  }, [currentIndex])

  const currentItem = items[currentIndex]

  const copyShareLink = () => {
    const shareUrl = `${window.location.origin}/showroom/${boardId}`
    navigator.clipboard.writeText(shareUrl)
    alert('Lien de partage copié!')
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Eye className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold text-white">{boardTitle}</h1>
              <p className="text-sm text-gray-300">Mode Présentation Client</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={copyShareLink}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="h-full flex items-center justify-center p-20">
        {currentItem && (
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
            {/* Content Display */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-h-full overflow-auto">
              {/* Watermark */}
              <div className="absolute top-4 right-4 opacity-30 pointer-events-none">
                <div className="text-primary font-bold text-sm">
                  ELITE VISUALS
                </div>
              </div>

              {/* Item Content */}
              {currentItem.type === "image" && (
                <div className="relative">
                  <img
                    src={currentItem.content}
                    alt={currentItem.title || "Image"}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  />
                </div>
              )}

              {currentItem.type === "text" && (
                <div className="prose max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {currentItem.title}
                  </h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {currentItem.content}
                  </p>
                </div>
              )}

              {currentItem.type === "video" && (
                <div className="relative">
                  <video
                    src={currentItem.content}
                    controls
                    className="max-w-full max-h-[70vh] rounded-lg"
                  />
                </div>
              )}

              {currentItem.type === "ai-generated" && (
                <div className="prose max-w-none">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-sm text-primary font-semibold">
                      Généré par IA
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {currentItem.title}
                  </h2>
                  <div className="text-gray-700 text-lg leading-relaxed">
                    {currentItem.content}
                  </div>
                </div>
              )}

              {/* Bottom Watermark */}
              <div className="mt-8 pt-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  Créé avec Elite Visuals
                </div>
                <div className="text-xs text-gray-400">
                  {currentIndex + 1} / {items.length}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/80 to-transparent p-6">
        <div className="max-w-7xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-30"
            >
              ← Précédent
            </Button>

            <div className="flex gap-2">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'bg-primary w-8'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={currentIndex === items.length - 1}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-30"
            >
              Suivant →
            </Button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="absolute bottom-24 right-6 text-xs text-white/50">
        ← → pour naviguer | ESC pour quitter
      </div>
    </div>
  )
}
