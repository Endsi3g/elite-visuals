'use client'

import { MessageCircle, X } from 'lucide-react'
import { useState } from 'react'

interface Comment {
  id: string
  x: number
  y: number
  text: string
  author: string
  timestamp: Date
}

interface CommentPinProps {
  comment: Comment
  isSelected: boolean
  onClick: () => void
  readOnly?: boolean
  onDelete?: (id: string) => void
}

export function CommentPin({
  comment,
  isSelected,
  onClick,
  readOnly = true,
  onDelete,
}: CommentPinProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="absolute z-40"
      style={{
        left: comment.x,
        top: comment.y,
      }}
    >
      {/* Pin orange */}
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
          isSelected || isHovered
            ? 'bg-orange-500 shadow-lg scale-110'
            : 'bg-orange-400 shadow-md'
        }`}
        aria-label="View comment"
      >
        <MessageCircle size={20} className="text-white" />
      </button>

      {/* Popup de commentaire */}
      {isSelected && (
        <div className="absolute left-12 top-0 bg-white rounded-lg shadow-2xl p-4 w-72 border border-gray-200 z-50">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-gray-900">{comment.author}</p>
              <p className="text-xs text-gray-500">
                {new Date(comment.timestamp).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            {!readOnly && onDelete && (
              <button
                onClick={() => onDelete(comment.id)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                aria-label="Delete comment"
              >
                <X size={16} className="text-gray-500" />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{comment.text}</p>
        </div>
      )}

      {/* Ligne de connexion au pin */}
      {isSelected && (
        <div
          className="absolute left-10 top-5 w-3 h-px bg-orange-300"
          style={{ transformOrigin: 'left' }}
        />
      )}
    </div>
  )
}
