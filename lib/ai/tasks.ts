/**
 * Système de gestion de tâches AI
 * Inspiré de AgentsBoard - Kanban AI pour Elite Visuals
 */

export interface AITask {
  id: string
  boardId: string
  description: string
  agent: 'openai' | 'claude' | 'luma' | 'stability'
  model?: string
  maxTokens?: number
  status: 'todo' | 'in-progress' | 'done' | 'failed'
  result?: string
  error?: string
  createdBy: string
  createdAt: string
  updatedAt: string
  executedAt?: string
  metadata?: {
    prompt?: string
    temperature?: number
    topP?: number
    [key: string]: any
  }
}

export interface AIAgent {
  id: string
  name: string
  description: string
  provider: 'openai' | 'claude' | 'luma' | 'stability' | 'openrouter'
  models: string[]
  defaultModel: string
  capabilities: string[]
  icon?: string
}

// Agents IA disponibles
export const AI_AGENTS: AIAgent[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'Modèle le plus puissant d\'OpenAI pour les tâches complexes',
    provider: 'openai',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-4-turbo-preview'],
    defaultModel: 'gpt-4-turbo-preview',
    capabilities: ['text', 'code', 'analysis', 'reasoning'],
    icon: '🤖',
  },
  {
    id: 'gpt-3.5',
    name: 'GPT-3.5 Turbo',
    description: 'Rapide et efficace pour les tâches courantes',
    provider: 'openai',
    models: ['gpt-3.5-turbo', 'gpt-3.5-turbo-16k'],
    defaultModel: 'gpt-3.5-turbo',
    capabilities: ['text', 'code', 'chat'],
    icon: '⚡',
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Excellent pour l\'analyse et la rédaction longue',
    provider: 'claude',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    defaultModel: 'claude-3-sonnet',
    capabilities: ['text', 'analysis', 'reasoning', 'long-context'],
    icon: '🧠',
  },
  {
    id: 'dall-e',
    name: 'DALL-E 3',
    description: 'Génération d\'images de haute qualité',
    provider: 'openai',
    models: ['dall-e-3', 'dall-e-2'],
    defaultModel: 'dall-e-3',
    capabilities: ['image-generation'],
    icon: '🎨',
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    description: 'Génération d\'images open-source',
    provider: 'stability',
    models: ['stable-diffusion-xl-1024-v1-0', 'stable-diffusion-v1-6'],
    defaultModel: 'stable-diffusion-xl-1024-v1-0',
    capabilities: ['image-generation'],
    icon: '🖼️',
  },
  {
    id: 'luma',
    name: 'Luma Dream Machine',
    description: 'Génération de vidéos AI',
    provider: 'luma',
    models: ['luma-video-v1'],
    defaultModel: 'luma-video-v1',
    capabilities: ['video-generation'],
    icon: '🎬',
  },
]

class AITaskService {
  /**
   * Exécuter une tâche AI
   */
  async executeTask(task: AITask): Promise<string> {
    const agent = AI_AGENTS.find((a) => a.id === task.agent)
    if (!agent) {
      throw new Error(`Agent ${task.agent} non trouvé`)
    }

    // Sélectionner la méthode d'exécution selon le provider
    switch (agent.provider) {
      case 'openai':
        return this.executeOpenAI(task, agent)
      case 'claude':
        return this.executeClaude(task, agent)
      case 'luma':
        return this.executeLuma(task, agent)
      case 'stability':
        return this.executeStability(task, agent)
      case 'openrouter':
        return this.executeOpenRouter(task, agent)
      default:
        throw new Error(`Provider ${agent.provider} non supporté`)
    }
  }

  /**
   * Exécuter avec OpenAI
   */
  private async executeOpenAI(task: AITask, agent: AIAgent): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('Clé API OpenAI non configurée')
    }

    const model = task.model || agent.defaultModel
    const isImageGeneration = agent.capabilities.includes('image-generation')

    if (isImageGeneration) {
      // Génération d'image
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          prompt: task.description,
          n: 1,
          size: '1024x1024',
          quality: 'hd',
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur génération image')
      }

      const data = await response.json()
      return data.data[0].url
    } else {
      // Génération de texte
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: task.metadata?.prompt || 'Tu es un assistant IA utile.',
            },
            {
              role: 'user',
              content: task.description,
            },
          ],
          max_tokens: task.maxTokens || 2000,
          temperature: task.metadata?.temperature || 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur génération texte')
      }

      const data = await response.json()
      return data.choices[0].message.content
    }
  }

  /**
   * Exécuter avec Claude (via Anthropic)
   */
  private async executeClaude(task: AITask, agent: AIAgent): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error('Clé API Anthropic non configurée')
    }

    const model = task.model || agent.defaultModel

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: task.maxTokens || 2000,
        messages: [
          {
            role: 'user',
            content: task.description,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error('Erreur Claude')
    }

    const data = await response.json()
    return data.content[0].text
  }

  /**
   * Exécuter avec Luma (vidéo)
   */
  private async executeLuma(task: AITask, agent: AIAgent): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_LUMA_API_KEY
    if (!apiKey) {
      throw new Error('Clé API Luma non configurée')
    }

    // Implémentation Luma API
    // Note: L'API Luma peut varier, adapter selon la documentation
    const response = await fetch('https://api.lumalabs.ai/v1/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: task.description,
        model: task.model || 'luma-video-v1',
      }),
    })

    if (!response.ok) {
      throw new Error('Erreur génération vidéo Luma')
    }

    const data = await response.json()
    return data.video_url || data.url
  }

  /**
   * Exécuter avec Stability AI
   */
  private async executeStability(task: AITask, agent: AIAgent): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_STABILITY_API_KEY
    if (!apiKey) {
      throw new Error('Clé API Stability non configurée')
    }

    const formData = new FormData()
    formData.append('prompt', task.description)
    formData.append('output_format', 'png')

    const response = await fetch(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('Erreur Stability AI')
    }

    const data = await response.json()
    const base64 = data.artifacts[0].base64
    return `data:image/png;base64,${base64}`
  }

  /**
   * Exécuter avec OpenRouter (multi-modèles)
   */
  private async executeOpenRouter(task: AITask, agent: AIAgent): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
    if (!apiKey) {
      throw new Error('Clé API OpenRouter non configurée')
    }

    const model = task.model || agent.defaultModel

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'user',
            content: task.description,
          },
        ],
        max_tokens: task.maxTokens || 2000,
      }),
    })

    if (!response.ok) {
      throw new Error('Erreur OpenRouter')
    }

    const data = await response.json()
    return data.choices[0].message.content
  }

  /**
   * Obtenir les agents disponibles
   */
  getAvailableAgents(): AIAgent[] {
    return AI_AGENTS
  }

  /**
   * Obtenir un agent par ID
   */
  getAgent(agentId: string): AIAgent | undefined {
    return AI_AGENTS.find((a) => a.id === agentId)
  }

  /**
   * Obtenir les agents par capacité
   */
  getAgentsByCapability(capability: string): AIAgent[] {
    return AI_AGENTS.filter((a) => a.capabilities.includes(capability))
  }
}

// Instance singleton
export const aiTaskService = new AITaskService()
