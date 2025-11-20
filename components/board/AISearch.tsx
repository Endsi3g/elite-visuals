"use client"

import { useState } from "react"
import { Search, Sparkles, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SearchResult {
  id: string
  title: string
  content: string
  type: string
  relevance: number
}

interface AISearchProps {
  items: any[]
  onSelectItem?: (itemId: string) => void
}

export default function AISearch({ items, onSelectItem }: AISearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    type: "all",
    minRelevance: 0,
  })

  const performAISearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    
    // Simulate AI-powered semantic search
    // In production, this would call an AI API (OpenAI, Claude, etc.)
    setTimeout(() => {
      const searchResults: SearchResult[] = items
        .filter(item => {
          const matchesQuery = 
            item.title?.toLowerCase().includes(query.toLowerCase()) ||
            item.content?.toLowerCase().includes(query.toLowerCase())
          
          const matchesType = filters.type === "all" || item.type === filters.type
          
          return matchesQuery && matchesType
        })
        .map(item => ({
          id: item.id,
          title: item.title || item.type,
          content: item.content?.substring(0, 100) || "",
          type: item.type,
          relevance: Math.random() * 100, // Mock relevance score
        }))
        .filter(result => result.relevance >= filters.minRelevance)
        .sort((a, b) => b.relevance - a.relevance)

      setResults(searchResults)
      setIsSearching(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      performAISearch()
    }
  }

  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-2xl px-4">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200">
        {/* Search Input */}
        <div className="flex items-center gap-2 p-4 border-b border-gray-200">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Recherche intelligente sur le board..."
            className="flex-1 outline-none text-sm"
          />
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Button
            onClick={performAISearch}
            disabled={!query.trim() || isSearching}
            className="bg-primary hover:bg-primary/90"
            size="sm"
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Rechercher
              </>
            )}
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Type de contenu
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">Tous</option>
                  <option value="text">Texte</option>
                  <option value="image">Image</option>
                  <option value="video">Vidéo</option>
                  <option value="file">Fichier</option>
                  <option value="ai-generated">IA Généré</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-gray-700 mb-1 block">
                  Pertinence minimale
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.minRelevance}
                  onChange={(e) => setFilters({ ...filters, minRelevance: parseInt(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-gray-600">{filters.minRelevance}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div className="max-h-96 overflow-y-auto">
            {results.map((result) => (
              <div
                key={result.id}
                onClick={() => onSelectItem?.(result.id)}
                className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">{result.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{result.content}...</p>
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-1">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {result.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {Math.round(result.relevance)}% pertinent
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {results.length === 0 && query && !isSearching && (
          <div className="p-8 text-center">
            <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600">Aucun résultat trouvé</p>
            <p className="text-xs text-gray-500 mt-1">
              Essayez une autre recherche ou ajustez les filtres
            </p>
          </div>
        )}

        {/* Help Text */}
        {!query && (
          <div className="p-4 bg-gray-50 text-center">
            <p className="text-xs text-gray-600">
              <Sparkles className="h-3 w-3 inline mr-1" />
              Recherche sémantique propulsée par IA
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
