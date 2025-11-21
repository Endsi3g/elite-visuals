"use client"

import { useState } from "react"
import { 
  Plus, Image, Video, Wand2, Brain, Sparkles, 
  Link, Group, MessageSquare, Download, Eye,
  FileText, Layers
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Keyboard shortcuts for each action
const SHORTCUTS: Record<string, string> = {
  'add-note': 'Ctrl+N',
  'add-image': 'Ctrl+I',
  'add-video': 'Ctrl+V',
  'ai-generate': 'Ctrl+G',
  'ai-analyze': 'Ctrl+A',
  'create-mindmap': 'Ctrl+M',
  'connect': 'Ctrl+L',
  'cluster': 'Ctrl+K',
  'comment': 'Ctrl+/',
  'export': 'Ctrl+E',
  'showroom': 'Ctrl+P'
}

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
        aria-pressed={active}
        title={label}
        type="button"
        className={cn(
          // Base styles with minimum touch target
          "min-w-[44px] min-h-[44px] w-14 h-14 rounded-xl",
          "flex items-center justify-center",
          "transition-all duration-300",
          "border shadow-sm",
          "touch-manipulation", // Disable double-tap zoom on mobile
          // Focus visible for keyboard navigation
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          // Active state
          active && "bg-primary border-primary text-white shadow-glow animate-glow",
          // Hover state
          !active && !disabled && "bg-white border-gray-200 text-gray-600 hover:bg-orange-50 hover:border-primary hover:text-primary hover:shadow-md hover:-translate-y-1 active:scale-95",
          // Disabled state
          disabled && "bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed opacity-50",
          // Glow effect
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

  const getShortcut = (action: string) => SHORTCUTS[action]

  return (
    <nav 
      className={cn(
        "z-40 flex gap-2",
        // Mobile: Bottom bar (horizontal)
        "fixed bottom-4 left-4 right-4 flex-row justify-around",
        "sm:left-4 sm:right-auto sm:w-auto",
        // Desktop: Left sidebar (vertical)
        "lg:fixed lg:left-4 lg:top-20 lg:bottom-auto lg:flex-col"
      )}
      aria-label="Barre d'outils principale"
      role="toolbar"
    >
      <div className={cn(
        "bg-white rounded-2xl shadow-lg border border-gray-200 p-3 flex gap-2",
        // Mobile: Horizontal scroll
        "flex-row overflow-x-auto",
        // Desktop: Vertical
        "lg:flex-col lg:overflow-visible"
      )}>
        {/* Section Créer */}
        <div className="flex gap-2 lg:flex-col" role="group" aria-label="Outils de création">
          <ToolButton
            icon={Plus}
            label={`Ajouter une note (${getShortcut('add-note')})`}
            onClick={() => handleAction('add-note')}
            active={activeAction === 'add-note'}
          />
          <ToolButton
            icon={Image}
            label={`Ajouter une image (${getShortcut('add-image')})`}
            onClick={() => handleAction('add-image')}
            active={activeAction === 'add-image'}
          />
          <ToolButton
            icon={Video}
            label={`Ajouter une vidéo (${getShortcut('add-video')})`}
            onClick={() => handleAction('add-video')}
            active={activeAction === 'add-video'}
          />
        </div>

        <Divider />

        {/* Section IA */}
        <div className="flex gap-2 lg:flex-col" role="group" aria-label="Outils d'intelligence artificielle">
          <ToolButton
            icon={Wand2}
            label={`Générer avec IA (${getShortcut('ai-generate')})`}
            onClick={() => handleAction('ai-generate')}
            active={activeAction === 'ai-generate'}
            glow
          />
          <ToolButton
            icon={Brain}
            label={`Analyser le contenu (${getShortcut('ai-analyze')})`}
            onClick={() => handleAction('ai-analyze')}
            active={activeAction === 'ai-analyze'}
          />
          <ToolButton
            icon={Sparkles}
            label={`Créer mindmap (${getShortcut('create-mindmap')})`}
            onClick={() => handleAction('create-mindmap')}
            active={activeAction === 'create-mindmap'}
            glow
          />
        </div>

        <Divider />

        {/* Section Actions */}
        <div className="flex gap-2 lg:flex-col" role="group" aria-label="Actions sur les éléments">
          <ToolButton
            icon={Link}
            label={`Connecter les éléments (${getShortcut('connect')})`}
            onClick={() => handleAction('connect')}
            active={activeAction === 'connect'}
          />
          <ToolButton
            icon={Layers}
            label={`Créer un cluster (${getShortcut('cluster')})`}
            onClick={() => handleAction('cluster')}
            active={activeAction === 'cluster'}
          />
          <ToolButton
            icon={MessageSquare}
            label={`Ajouter un commentaire (${getShortcut('comment')})`}
            onClick={() => handleAction('comment')}
            active={activeAction === 'comment'}
          />
        </div>

        <Divider />

        {/* Section Export */}
        <div className="flex gap-2 lg:flex-col" role="group" aria-label="Export et présentation">
          <ToolButton
            icon={Download}
            label={`Exporter le board (${getShortcut('export')})`}
            onClick={() => handleAction('export')}
          />
          <ToolButton
            icon={Eye}
            label={`Mode présentation (${getShortcut('showroom')})`}
            onClick={() => handleAction('showroom')}
          />
        </div>
      </div>

      {/* Info Badge - Hidden on mobile */}
      <div className="hidden lg:block bg-white rounded-xl shadow-md border border-gray-200 px-3 py-2 text-center" aria-hidden="true">
        <div className="text-xs font-semibold text-primary">Elite</div>
        <div className="text-[10px] text-gray-500">Visuals</div>
      </div>
    </nav>
  )
}
