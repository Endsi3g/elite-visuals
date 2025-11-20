"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Comment {
  id: string
  x: number
  y: number
  content: string
  author: string
  createdAt: Date
}

interface CommentSystemProps {
  comments: Comment[]
  onAddComment: (x: number, y: number, content: string) => void
  onDeleteComment: (id: string) => void
}

export default function CommentSystem({
  comments,
  onAddComment,
  onDeleteComment
}: CommentSystemProps) {
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [newCommentText, setNewCommentText] = useState("")
  const [tempPosition, setTempPosition] = useState<{ x: number; y: number } | null>(null)

  const handleSubmitComment = () => {
    if (!tempPosition || !newCommentText.trim()) return
    onAddComment(tempPosition.x, tempPosition.y, newCommentText)
    setNewCommentText("")
    setTempPosition(null)
    setIsAddingComment(false)
  }

  return (
    <div className="absolute top-4 left-20 z-10">
      <Button
        onClick={() => setIsAddingComment(!isAddingComment)}
        className={`${
          isAddingComment ? 'bg-primary' : 'bg-white border'
        } shadow-lg`}
        size="icon"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
      
      {/* Comment points rendered on canvas */}
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="absolute w-4 h-4 bg-primary rounded-full cursor-pointer"
          style={{ left: comment.x, top: comment.y }}
          onClick={() => setSelectedComment(comment)}
        />
      ))}
    </div>
  )
}
