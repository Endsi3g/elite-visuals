"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, X } from "lucide-react"

interface SmartClusterProps {
  items: any[]
  onCluster: (clusterName: string, itemIds: string[]) => void
}

export default function SmartCluster({ items, onCluster }: SmartClusterProps) {
  const [suggestions, setSuggestions] = useState<{
    name: string
    items: string[]
    reason: string
  }[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeProximity = async () => {
    setIsAnalyzing(true)
    
    // Simulation de l'analyse IA
    // En production, appeler OpenAI pour analyser la proximité sémantique
    setTimeout(() => {
      setSuggestions([
        {
          name: "Cluster Inspiration 80s",
          items: ["item1", "item2", "item3"],
          reason: "Éléments visuels et thématiques similaires des années 80",
        },
        {
          name: "Cluster Brief Client",
          items: ["item4", "item5"],
          reason: "Documents et notes liés au brief client",
        },
      ])
      setIsAnalyzing(false)
    }, 2000)
  }

  return (
    <div className="fixed bottom-4 right-4 z-20 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-gray-900">Smart Clustering</h3>
        </div>
      </div>

      {suggestions.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-sm text-gray-600 mb-3">
            L'IA peut détecter des groupes sémantiques dans vos éléments
          </p>
          <Button
            onClick={analyzeProximity}
            disabled={isAnalyzing}
            className="bg-primary hover:bg-primary/90"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Analyse en cours...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyser
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-3 hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-sm text-gray-900">
                  {suggestion.name}
                </h4>
                <span className="text-xs text-gray-500">
                  {suggestion.items.length} items
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-3">{suggestion.reason}</p>
              <Button
                onClick={() => onCluster(suggestion.name, suggestion.items)}
                size="sm"
                className="w-full bg-primary hover:bg-primary/90"
              >
                Créer le cluster
              </Button>
            </div>
          ))}
          <Button
            onClick={() => setSuggestions([])}
            variant="ghost"
            size="sm"
            className="w-full"
          >
            Fermer
          </Button>
        </div>
      )}
    </div>
  )
}
