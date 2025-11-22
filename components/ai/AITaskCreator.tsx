"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { AI_AGENTS, AIAgent } from '@/lib/ai/tasks'
import { Sparkles, Wand2 } from 'lucide-react'

interface AITaskCreatorProps {
  boardId: string
  onCreateTask: (task: {
    description: string
    agent: string
    model?: string
    maxTokens?: number
  }) => void
}

export function AITaskCreator({ boardId, onCreateTask }: AITaskCreatorProps) {
  const [description, setDescription] = useState('')
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null)
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [maxTokens, setMaxTokens] = useState(2000)
  const [isCreating, setIsCreating] = useState(false)

  const handleAgentChange = (agentId: string) => {
    const agent = AI_AGENTS.find((a) => a.id === agentId)
    if (agent) {
      setSelectedAgent(agent)
      setSelectedModel(agent.defaultModel)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!description.trim() || !selectedAgent) {
      return
    }

    setIsCreating(true)

    try {
      onCreateTask({
        description: description.trim(),
        agent: selectedAgent.id,
        model: selectedModel,
        maxTokens,
      })

      // Reset form
      setDescription('')
      setSelectedAgent(null)
      setSelectedModel('')
      setMaxTokens(2000)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Créer une Tâche AI</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description de la tâche</Label>
          <Textarea
            id="description"
            placeholder="Ex: Génère une image d'un coucher de soleil sur la mer..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
          <p className="text-xs text-muted-foreground">
            Décrivez clairement ce que l'IA doit faire
          </p>
        </div>

        {/* Agent Selection */}
        <div className="space-y-2">
          <Label htmlFor="agent">Agent IA</Label>
          <Select
            value={selectedAgent?.id || ''}
            onValueChange={handleAgentChange}
            required
          >
            <SelectTrigger id="agent">
              <SelectValue placeholder="Sélectionner un agent..." />
            </SelectTrigger>
            <SelectContent>
              {AI_AGENTS.map((agent) => (
                <SelectItem key={agent.id} value={agent.id}>
                  <div className="flex items-center gap-2">
                    <span>{agent.icon}</span>
                    <div>
                      <p className="font-medium">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {agent.description}
                      </p>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Model Selection */}
        {selectedAgent && selectedAgent.models.length > 1 && (
          <div className="space-y-2">
            <Label htmlFor="model">Modèle</Label>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger id="model">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {selectedAgent.models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Max Tokens */}
        {selectedAgent && !selectedAgent.capabilities.includes('image-generation') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="tokens">Tokens Maximum</Label>
              <span className="text-sm text-muted-foreground">{maxTokens}</span>
            </div>
            <Slider
              id="tokens"
              min={100}
              max={4000}
              step={100}
              value={[maxTokens]}
              onValueChange={(value) => setMaxTokens(value[0])}
            />
            <p className="text-xs text-muted-foreground">
              Plus de tokens = réponses plus longues (mais plus coûteux)
            </p>
          </div>
        )}

        {/* Agent Info */}
        {selectedAgent && (
          <Card className="p-4 bg-muted">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedAgent.icon}</span>
                <div>
                  <p className="font-medium">{selectedAgent.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedAgent.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedAgent.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="text-xs px-2 py-1 bg-background rounded-full"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={!description.trim() || !selectedAgent || isCreating}
        >
          <Wand2 className="w-4 h-4 mr-2" />
          {isCreating ? 'Création...' : 'Créer la Tâche'}
        </Button>
      </form>
    </Card>
  )
}
