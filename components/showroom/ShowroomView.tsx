'use client'

import { useState, useEffect } from 'react'
import { Eye, MessageCircle, Download, Share2 } from 'lucide-react'
import { ShowroomHeader } from './ShowroomHeader'
import { CommentPin } from './CommentPin'
import { WatermarkOverlay } from './WatermarkOverlay'

interface Card {
  id: string
  type: 'image' | 'video' | 'audio' | 'pdf' | 'note'
  url: string
  x: number
  y: number
  width: number
  height: number
  title?: string
}

interface Comment {
  id: string
  x: number
  y: number
  text: string
  author: string
  timestamp: Date
}

interface ShowroomViewProps {
  boardId: string
  readOnly?: boolean
  showWatermark?: boolean
}

export function ShowroomView({ 
  boardId, 
  readOnly = true,
  showWatermark = true 
}: ShowroomViewProps) {
  const [cards, setCards] = useState<Card[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [selectedComment, setSelectedComment] = useState<string | null>(null)
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [newCommentPos, setNewCommentPos] = useState<{ x: number; y: number } | null>(null)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Charger les données du board depuis Supabase
    loadBoardData()
  }, [boardId])

  const loadBoardData = async () => {
    // TODO: Implémenter chargement depuis Supabase
    // const { data } = await supabase.from('boards').select('*').eq('id', boardId)
    // setCards(data.cards)
    // setComments(data.comments)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAddingComment || readOnly) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - pan.x) / zoom
    const y = (e.clientY - rect.top - pan.y) / zoom

    setNewCommentPos({ x, y })
  }

  const addComment = (text: string) => {
    if (!newCommentPos) return

    const newComment: Comment = {
      id: Date.now().toString(),
      x: newCommentPos.x,
      y: newCommentPos.y,
      text,
      author: 'Client',
      timestamp: new Date(),
    }

    setComments([...comments, newComment])
    setNewCommentPos(null)
    setIsAddingComment(false)
  }

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.1, Math.min(3, prev + delta)))
  }

  const handleExport = async () => {
    // TODO: Implémenter export PDF/PNG
    console.log('Export board')
  }

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/showroom/${boardId}`
    await navigator.clipboard.writeText(shareUrl)
    alert('Lien copié dans le presse-papier!')
  }

  return (
    <div className="h-screen w-full flex flex-col bg-white">
      <ShowroomHeader
        boardTitle="Board Client"
        onZoomIn={() => handleZoom(0.1)}
        onZoomOut={() => handleZoom(-0.1)}
        onExport={handleExport}
        onShare={handleShare}
        readOnly={readOnly}
      />

      <div className="flex-1 relative overflow-hidden">
        {/* Canvas principal */}
        {/* eslint-disable-next-line react/forbid-dom-props */}
        <div
          className="w-full h-full relative cursor-default origin-top-left"
          onClick={handleCanvasClick}
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
          }}
        >
          {/* Grille de fond */}
          <div className="absolute inset-0 opacity-30 bg-grid" />

          {/* Cartes */}
          {cards.map(card => (
            // eslint-disable-next-line react/forbid-dom-props
            <div
              key={card.id}
              className="absolute bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden"
              style={{
                left: `${card.x}px`,
                top: `${card.y}px`,
                width: `${card.width}px`,
                height: `${card.height}px`,
              }}
            >
              {card.type === 'image' && (
                <img
                  src={card.url}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              )}
              {card.type === 'video' && (
                <video
                  src={card.url}
                  controls
                  className="w-full h-full"
                />
              )}
              {card.type === 'note' && (
                <div className="p-4">
                  <p className="text-gray-800">{card.title}</p>
                </div>
              )}
            </div>
          ))}

          {/* Commentaires */}
          {comments.map(comment => (
            <CommentPin
              key={comment.id}
              comment={comment}
              isSelected={selectedComment === comment.id}
              onClick={() => setSelectedComment(comment.id)}
              readOnly={readOnly}
            />
          ))}

          {/* Nouveau commentaire en cours */}
          {newCommentPos && (
            // eslint-disable-next-line react/forbid-dom-props
            <div
              className="absolute bg-white rounded-lg shadow-xl p-4 w-64 z-50"
              style={{
                left: `${newCommentPos.x}px`,
                top: `${newCommentPos.y}px`,
              }}
            >
              <textarea
                className="w-full border border-gray-300 rounded p-2 text-sm"
                placeholder="Votre commentaire..."
                rows={3}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    addComment(e.currentTarget.value)
                  }
                  if (e.key === 'Escape') {
                    setNewCommentPos(null)
                    setIsAddingComment(false)
                  }
                }}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={(e) => {
                    const textarea = e.currentTarget.parentElement?.previousElementSibling as HTMLTextAreaElement
                    addComment(textarea.value)
                  }}
                  className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
                >
                  Ajouter
                </button>
                <button
                  onClick={() => {
                    setNewCommentPos(null)
                    setIsAddingComment(false)
                  }}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}

          {/* Watermark */}
          {showWatermark && <WatermarkOverlay />}
        </div>

        {/* Toolbar flottante */}
        {!readOnly && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-2xl px-6 py-3 flex gap-4 border border-gray-200">
            <button
              onClick={() => setIsAddingComment(!isAddingComment)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                isAddingComment
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MessageCircle size={20} />
              <span className="text-sm font-medium">Commenter</span>
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Download size={20} />
              <span className="text-sm font-medium">Télécharger</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              <Share2 size={20} />
              <span className="text-sm font-medium">Partager</span>
            </button>
          </div>
        )}

        {/* Indicateur mode lecture seule */}
        {readOnly && (
          <div className="absolute top-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
            <Eye size={16} />
            <span className="text-sm font-medium">Mode Lecture</span>
          </div>
        )}
      </div>
    </div>
  )
}
