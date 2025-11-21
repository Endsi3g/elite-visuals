"use client"

import { useEffect, useState } from "react"
import { Keyboard, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface Shortcut {
  key: string
  description: string
  category: "navigation" | "edition" | "board" | "kanban" | "general"
}

interface KeyboardShortcutsProps {
  onAddNote?: () => void
  onGenerateAI?: () => void
  onUpload?: () => void
  onSearch?: () => void
  onComment?: () => void
  onExport?: () => void
  onShowroom?: () => void
  onToggleKanban?: () => void
  onSave?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  onSelectAll?: () => void
}

export default function KeyboardShortcuts({
  onAddNote,
  onGenerateAI,
  onUpload,
  onSearch,
  onComment,
  onExport,
  onShowroom,
  onToggleKanban,
  onSave,
  onUndo,
  onRedo,
  onDelete,
  onDuplicate,
  onSelectAll
}: KeyboardShortcutsProps) {
  const [showHelp, setShowHelp] = useState(false)

  const shortcuts: Shortcut[] = [
    // Navigation
    { key: "Ctrl + F", description: "Rechercher", category: "navigation" },
    { key: "Ctrl + K", description: "Toggle Kanban", category: "navigation" },
    { key: "S", description: "Mode Showroom", category: "navigation" },
    { key: "Escape", description: "Fermer modal/menu", category: "navigation" },
    { key: "Tab", description: "Navigation focus", category: "navigation" },
    
    // Édition
    { key: "N", description: "Nouvelle note", category: "edition" },
    { key: "G", description: "Générer IA", category: "edition" },
    { key: "U", description: "Upload fichier", category: "edition" },
    { key: "C", description: "Ajouter commentaire", category: "edition" },
    { key: "E", description: "Éditer sélection", category: "edition" },
    { key: "Delete", description: "Supprimer", category: "edition" },
    { key: "Ctrl + D", description: "Dupliquer", category: "edition" },
    
    // Board
    { key: "Molette", description: "Zoom in/out", category: "board" },
    { key: "Drag Canvas", description: "Pan (déplacement)", category: "board" },
    { key: "Clic Droit", description: "Menu contextuel", category: "board" },
    { key: "Double-clic", description: "Éditer carte", category: "board" },
    { key: "Shift + Drag", description: "Sélection multiple", category: "board" },
    { key: "Arrow Keys", description: "Déplacer sélection", category: "board" },
    
    // Général
    { key: "Ctrl + S", description: "Sauvegarder", category: "general" },
    { key: "Ctrl + Z", description: "Annuler", category: "general" },
    { key: "Ctrl + Y", description: "Refaire", category: "general" },
    { key: "Ctrl + A", description: "Tout sélectionner", category: "general" },
    { key: "Ctrl + E", description: "Exporter", category: "general" },
    { key: "Ctrl + /", description: "Aide raccourcis", category: "general" }
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl + / pour afficher l'aide
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault()
        setShowHelp(!showHelp)
        return
      }

      // Ignorer si dans un input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      // Raccourcis simples (une touche)
      switch (e.key.toLowerCase()) {
        case "n":
          e.preventDefault()
          onAddNote?.()
          break
        case "g":
          e.preventDefault()
          onGenerateAI?.()
          break
        case "u":
          e.preventDefault()
          onUpload?.()
          break
        case "c":
          e.preventDefault()
          onComment?.()
          break
        case "s":
          if (!e.ctrlKey) {
            e.preventDefault()
            onShowroom?.()
          }
          break
        case "e":
          if (!e.ctrlKey) {
            e.preventDefault()
            onExport?.()
          }
          break
        case "delete":
          e.preventDefault()
          onDelete?.()
          break
        case "escape":
          setShowHelp(false)
          break
      }

      // Raccourcis avec Ctrl
      if (e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case "f":
            e.preventDefault()
            onSearch?.()
            break
          case "k":
            e.preventDefault()
            onToggleKanban?.()
            break
          case "s":
            e.preventDefault()
            onSave?.()
            break
          case "z":
            e.preventDefault()
            onUndo?.()
            break
          case "y":
            e.preventDefault()
            onRedo?.()
            break
          case "d":
            e.preventDefault()
            onDuplicate?.()
            break
          case "a":
            e.preventDefault()
            onSelectAll?.()
            break
          case "e":
            e.preventDefault()
            onExport?.()
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    showHelp,
    onAddNote,
    onGenerateAI,
    onUpload,
    onSearch,
    onComment,
    onExport,
    onShowroom,
    onToggleKanban,
    onSave,
    onUndo,
    onRedo,
    onDelete,
    onDuplicate,
    onSelectAll
  ])

  const categories = {
    navigation: "Navigation",
    edition: "Édition",
    board: "Board",
    general: "Général"
  }

  return (
    <>
      {/* Bouton d'aide flottant */}
      <Button
        onClick={() => setShowHelp(!showHelp)}
        className="fixed bottom-6 left-6 z-30 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-lg"
        size="icon"
        aria-label="Aide raccourcis clavier"
      >
        <Keyboard className="h-5 w-5" />
      </Button>

      {/* Modal d'aide */}
      <AnimatePresence>
        {showHelp && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowHelp(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl max-h-[80vh] bg-white rounded-lg shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-primary to-orange-600">
                <div className="flex items-center gap-3">
                  <Keyboard className="h-6 w-6 text-white" />
                  <h2 className="text-xl font-bold text-white">
                    Raccourcis Clavier
                  </h2>
                </div>
                <Button
                  onClick={() => setShowHelp(false)}
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(categories).map(([key, label]) => {
                    const categoryShortcuts = shortcuts.filter(
                      (s) => s.category === key
                    )

                    if (categoryShortcuts.length === 0) return null

                    return (
                      <div key={key}>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                          {label}
                        </h3>
                        <div className="space-y-2">
                          {categoryShortcuts.map((shortcut, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <span className="text-sm text-gray-700">
                                {shortcut.description}
                              </span>
                              <kbd className="px-3 py-1.5 text-xs font-mono bg-gray-100 border border-gray-300 rounded shadow-sm">
                                {shortcut.key}
                              </kbd>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Footer tip */}
                <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-gray-700">
                    <strong className="text-primary">Astuce:</strong> Appuyez sur{" "}
                    <kbd className="px-2 py-1 text-xs bg-white border border-gray-300 rounded">
                      Ctrl + /
                    </kbd>{" "}
                    pour afficher/masquer cette aide à tout moment.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
