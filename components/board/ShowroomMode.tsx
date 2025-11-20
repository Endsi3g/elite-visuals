"use client"

import { useState } from "react"
import { Eye, EyeOff, Lock, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ShowroomModeProps {
  isActive: boolean
  onToggle: () => void
  boardId?: string
}

export default function ShowroomMode({ isActive, onToggle, boardId }: ShowroomModeProps) {
  const [shareLink, setShareLink] = useState("")

  const generateShareLink = () => {
    const link = `${window.location.origin}/showroom/${boardId || 'demo'}`
    setShareLink(link)
    navigator.clipboard.writeText(link)
  }

  return (
    <div className="fixed top-20 right-4 z-20 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-gray-900">Mode Showroom</h3>
        </div>
        <Button
          onClick={onToggle}
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title={isActive ? "Désactiver le mode showroom" : "Activer le mode showroom"}
          aria-label={isActive ? "Désactiver le mode showroom" : "Activer le mode showroom"}
        >
          {isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>

      {isActive ? (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Mode Actif</span>
            </div>
            <p className="text-xs text-green-700">
              Le board est en lecture seule avec watermark Elite Visuals
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-gray-600 font-medium">Fonctionnalités actives:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>✓ Lecture seule</li>
              <li>✓ Watermark automatique</li>
              <li>✓ Interface épurée</li>
              <li>✓ Pas d'édition possible</li>
            </ul>
          </div>

          <Button
            onClick={generateShareLink}
            className="w-full bg-primary hover:bg-primary/90"
            size="sm"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Copier le lien
          </Button>

          {shareLink && (
            <div className="bg-gray-50 rounded p-2">
              <p className="text-xs text-gray-600 break-all">{shareLink}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 mb-3">
            Activez le mode showroom pour partager votre board avec vos clients
          </p>
          <Button
            onClick={onToggle}
            className="bg-primary hover:bg-primary/90"
          >
            <Eye className="h-4 w-4 mr-2" />
            Activer
          </Button>
        </div>
      )}
    </div>
  )
}
