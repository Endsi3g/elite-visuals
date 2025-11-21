"use client"

import { useState, useEffect, useRef } from "react"
import {
  Edit,
  Copy,
  ListTodo,
  Palette,
  Layers,
  Sparkles,
  Trash,
  Link2,
  Download,
  Eye,
  MessageSquare
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ContextMenuOption {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  shortcut?: string
  divider?: boolean
  variant?: "default" | "danger"
}

interface ContextMenuProps {
  x: number
  y: number
  isOpen: boolean
  onClose: () => void
  itemId?: string
  onEdit?: () => void
  onDuplicate?: () => void
  onAddToKanban?: () => void
  onChangeColor?: () => void
  onAddToCluster?: () => void
  onGenerateChildren?: () => void
  onDelete?: () => void
  onCopyLink?: () => void
  onExport?: () => void
  onShowroom?: () => void
  onComment?: () => void
}

export default function ContextMenu({
  x,
  y,
  isOpen,
  onClose,
  itemId,
  onEdit,
  onDuplicate,
  onAddToKanban,
  onChangeColor,
  onAddToCluster,
  onGenerateChildren,
  onDelete,
  onCopyLink,
  onExport,
  onShowroom,
  onComment
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x, y })

  // Ajuster la position si le menu dépasse de l'écran
  useEffect(() => {
    if (menuRef.current && isOpen) {
      const menu = menuRef.current
      const menuRect = menu.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      let adjustedX = x
      let adjustedY = y

      // Ajuster X si dépasse à droite
      if (x + menuRect.width > viewportWidth) {
        adjustedX = viewportWidth - menuRect.width - 10
      }

      // Ajuster Y si dépasse en bas
      if (y + menuRect.height > viewportHeight) {
        adjustedY = viewportHeight - menuRect.height - 10
      }

      setPosition({ x: adjustedX, y: adjustedY })
    }
  }, [x, y, isOpen])

  // Fermer au clic extérieur ou Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, onClose])

  const menuOptions: ContextMenuOption[] = [
    ...(onEdit ? [{
      id: "edit",
      label: "Éditer",
      icon: Edit,
      action: () => { onEdit(); onClose() },
      shortcut: "E"
    }] : []),
    ...(onDuplicate ? [{
      id: "duplicate",
      label: "Dupliquer",
      icon: Copy,
      action: () => { onDuplicate(); onClose() },
      shortcut: "Ctrl+D"
    }] : []),
    ...(onComment ? [{
      id: "comment",
      label: "Ajouter commentaire",
      icon: MessageSquare,
      action: () => { onComment(); onClose() }
    }] : []),
    ...(onAddToKanban ? [{
      id: "kanban",
      label: "Ajouter au Kanban",
      icon: ListTodo,
      action: () => { onAddToKanban(); onClose() },
      divider: true
    }] : []),
    ...(onChangeColor ? [{
      id: "color",
      label: "Changer couleur",
      icon: Palette,
      action: () => { onChangeColor(); onClose() }
    }] : []),
    ...(onAddToCluster ? [{
      id: "cluster",
      label: "Ajouter au cluster",
      icon: Layers,
      action: () => { onAddToCluster(); onClose() }
    }] : []),
    ...(onGenerateChildren ? [{
      id: "generate",
      label: "Générer enfants (IA)",
      icon: Sparkles,
      action: () => { onGenerateChildren(); onClose() },
      divider: true
    }] : []),
    ...(onCopyLink ? [{
      id: "link",
      label: "Copier le lien",
      icon: Link2,
      action: () => { onCopyLink(); onClose() }
    }] : []),
    ...(onExport ? [{
      id: "export",
      label: "Exporter",
      icon: Download,
      action: () => { onExport(); onClose() }
    }] : []),
    ...(onShowroom ? [{
      id: "showroom",
      label: "Voir en showroom",
      icon: Eye,
      action: () => { onShowroom(); onClose() },
      divider: true
    }] : []),
    ...(onDelete ? [{
      id: "delete",
      label: "Supprimer",
      icon: Trash,
      action: () => { onDelete(); onClose() },
      shortcut: "Del",
      variant: "danger" as const
    }] : [])
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed z-50 min-w-[220px] bg-white rounded-lg shadow-2xl border border-gray-200 py-2"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`
          }}
          role="menu"
          aria-label="Menu contextuel"
        >
          {menuOptions.map((option, index) => {
            const Icon = option.icon
            const isDanger = option.variant === "danger"

            return (
              <div key={option.id}>
                {option.divider && index > 0 && (
                  <div className="h-px bg-gray-200 my-1" />
                )}
                <button
                  onClick={option.action}
                  className={`
                    w-full px-4 py-2 flex items-center justify-between
                    transition-colors text-left
                    ${isDanger 
                      ? 'hover:bg-red-50 text-red-600' 
                      : 'hover:bg-gray-50 text-gray-700'
                    }
                    focus:outline-none focus:bg-gray-100
                  `}
                  role="menuitem"
                  aria-label={option.label}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isDanger ? 'text-red-500' : 'text-gray-500'}`} />
                    <span className="text-sm font-medium">{option.label}</span>
                  </div>
                  {option.shortcut && (
                    <kbd className="px-2 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">
                      {option.shortcut}
                    </kbd>
                  )}
                </button>
              </div>
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
