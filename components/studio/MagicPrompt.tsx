"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Wand2, Sparkles, Video, Image as ImageIcon, FileText, X } from "lucide-react"

interface MagicPromptProps {
  onGenerate: (type: string, prompt: string) => void
  onClose: () => void
}

export default function MagicPrompt({ onGenerate, onClose }: MagicPromptProps) {
  const [prompt, setPrompt] = useState("")
  const [selectedType, setSelectedType] = useState<"video" | "image" | "text">("video")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    
    setIsGenerating(true)
    await onGenerate(selectedType, prompt)
    setIsGenerating(false)
    setPrompt("")
  }

  const generationTypes = [
    { id: "video", label: "Vidéo Luma", icon: Video, color: "text-primary" },
    { id: "image", label: "Image", icon: ImageIcon, color: "text-purple-600" },
    { id: "text", label: "Texte IA", icon: FileText, color: "text-green-600" },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center glow-orange">
              <Wand2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Studio Génératif</h2>
              <p className="text-sm text-gray-500">Créez du contenu avec l'IA</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Type Selection */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {generationTypes.map((type) => {
            const Icon = type.icon
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id as any)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedType === type.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Icon className={`h-6 w-6 mx-auto mb-2 ${type.color}`} />
                <p className="text-sm font-medium text-gray-900">{type.label}</p>
              </button>
            )
          })}
        </div>

        {/* Prompt Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Décrivez ce que vous voulez créer
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              selectedType === "video"
                ? "Ex: Une vidéo cinématique d'un coucher de soleil sur l'océan..."
                : selectedType === "image"
                ? "Ex: Un moodboard minimaliste avec des tons pastel..."
                : "Ex: Rédige un script de 30 secondes pour une pub..."
            }
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            disabled={isGenerating}
          />
        </div>

        {/* Context Suggestions */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-2">Suggestions rapides :</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Style cinématique",
              "Tons chauds",
              "Mouvement lent",
              "Lumière naturelle",
              "Ambiance rêveuse",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setPrompt(prompt + " " + suggestion)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                disabled={isGenerating}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={isGenerating}
          >
            Annuler
          </Button>
          <Button
            onClick={handleGenerate}
            className="flex-1 bg-primary hover:bg-primary/90 glow-orange"
            disabled={!prompt.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Génération...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Générer
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
