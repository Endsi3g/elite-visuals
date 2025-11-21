"use client"

import { useState } from "react"
import { 
  Plus, Image, Video, Wand2, Brain, Sparkles, 
  Link, Group, MessageSquare, Download, Eye,
  FileText, Layers
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ToolButtonProps {
  icon: React.ElementType
  label: string
  onClick?: () => void
  active?: boolean
  glow?: boolean
  disabled?: boolean
}

function ToolButton({ icon: Icon, label, onClick, active, glow, disabled }: ToolButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={label}
        title={label}
        type="button"
        className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300",
          "border shadow-sm",
          active && "bg-primary border-primary text-white shadow-glow animate-glow",
          !active && !disabled && "bg-white border-gray-200 text-gray-600 hover:bg-orange-50 hover:border-primary hover:text-primary hover:shadow-md hover:-translate-y-1",
          disabled && "bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed opacity-50",
          glow && !active && "hover:shadow-glow"
        )}
      >
        <Icon className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Tooltip */}
      {isHovered && !disabled && (
        <div className="absolute left-20 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
            {label}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
          </div>
        </div>
      )}
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-gray-200 my-2" />
}

interface FloatingToolbarProps {
  onAction?: (action: string) => void
  activeAction?: string
}

export default function FloatingToolbar({ onAction, activeAction }: FloatingToolbarProps) {
  const handleAction = (action: string) => {
    onAction?.(action)
  }

  return (
    <div className="fixed left-4 top-20 z-40 flex flex-col gap-2">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3 flex flex-col gap-2">
        {/* Section Créer */}
        <div className="flex flex-col gap-2">
          <ToolButton
            icon={Plus}
            label="Ajouter une note"
            onClick={() => handleAction('add-note')}
            active={activeAction === 'add-note'}
          />
          <ToolButton
            icon={Image}
            label="Ajouter une image"
            onClick={() => handleAction('add-image')}
            active={activeAction === 'add-image'}
          />
          <ToolButton
            icon={Video}
            label="Ajouter une vidéo"
            onClick={() => handleAction('add-video')}
            active={activeAction === 'add-video'}
          />
        </div>

        <Divider />

        {/* Section IA */}
        <div className="flex flex-col gap-2">
          <ToolButton
            icon={Wand2}
            label="Générer avec IA"
            onClick={() => handleAction('ai-generate')}
            active={activeAction === 'ai-generate'}
            glow
          />
          <ToolButton
            icon={Brain}
            label="Analyser le contenu"
            onClick={() => handleAction('ai-analyze')}
            active={activeAction === 'ai-analyze'}
          />
          <ToolButton
            icon={Sparkles}
            label="Créer mindmap"
            onClick={() => handleAction('create-mindmap')}
            active={activeAction === 'create-mindmap'}
            glow
          />
        </div>

        <Divider />

        {/* Section Actions */}
        <div className="flex flex-col gap-2">
          <ToolButton
            icon={Link}
            label="Connecter les éléments"
            onClick={() => handleAction('connect')}
            active={activeAction === 'connect'}
          />
          <ToolButton
            icon={Layers}
            label="Créer un cluster"
            onClick={() => handleAction('cluster')}
            active={activeAction === 'cluster'}
          />
          <ToolButton
            icon={MessageSquare}
            label="Ajouter un commentaire"
            onClick={() => handleAction('comment')}
            active={activeAction === 'comment'}
          />
        </div>

        <Divider />

        {/* Section Export */}
        <div className="flex flex-col gap-2">
          <ToolButton
            icon={Download}
            label="Exporter le board"
            onClick={() => handleAction('export')}
          />
          <ToolButton
            icon={Eye}
            label="Mode présentation"
            onClick={() => handleAction('showroom')}
          />
        </div>
      </div>

      {/* Info Badge */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 px-3 py-2 text-center">
        <div className="text-xs font-semibold text-primary">Elite</div>
        <div className="text-[10px] text-gray-500">Visuals</div>
      </div>
    </div>
  )
}
