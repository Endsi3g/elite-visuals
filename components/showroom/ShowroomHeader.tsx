'use client'

import { ZoomIn, ZoomOut, Download, Share2, X } from 'lucide-react'
import Image from 'next/image'

interface ShowroomHeaderProps {
  boardTitle: string
  onZoomIn: () => void
  onZoomOut: () => void
  onExport: () => void
  onShare: () => void
  readOnly?: boolean
}

export function ShowroomHeader({
  boardTitle,
  onZoomIn,
  onZoomOut,
  onExport,
  onShare,
  readOnly = true,
}: ShowroomHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Logo et titre */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">EV</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">Elite Visuals</span>
        </div>
        <div className="h-6 w-px bg-gray-300" />
        <h1 className="text-lg font-medium text-gray-700">{boardTitle}</h1>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Zoom controls */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={onZoomOut}
            className="p-2 hover:bg-white rounded transition-colors"
            aria-label="Zoom out"
          >
            <ZoomOut size={18} className="text-gray-700" />
          </button>
          <div className="h-4 w-px bg-gray-300" />
          <button
            onClick={onZoomIn}
            className="p-2 hover:bg-white rounded transition-colors"
            aria-label="Zoom in"
          >
            <ZoomIn size={18} className="text-gray-700" />
          </button>
        </div>

        {/* Export button */}
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Download size={18} className="text-gray-700" />
          <span className="text-sm font-medium text-gray-700">Exporter</span>
        </button>

        {/* Share button */}
        <button
          onClick={onShare}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors shadow-sm"
        >
          <Share2 size={18} />
          <span className="text-sm font-medium">Partager</span>
        </button>

        {/* Close button (if not read-only) */}
        {!readOnly && (
          <button
            onClick={() => window.history.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-gray-700" />
          </button>
        )}
      </div>
    </header>
  )
}
