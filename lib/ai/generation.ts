/**
 * Service de génération IA pour images et vidéos
 * Supporte plusieurs providers: OpenAI DALL-E, Stability AI, Replicate
 */

export interface GenerationOptions {
  prompt: string
  negativePrompt?: string
  width?: number
  height?: number
  steps?: number
  guidance?: number
  seed?: number
  model?: string
}

export interface GenerationResult {
  id: string
  url: string
  prompt: string
  model: string
  createdAt: number
  metadata?: any
}

class AIGenerationService {
  private apiKey: string | null = null
  private provider: 'openai' | 'stability' | 'replicate' = 'openai'

  constructor() {
    // Charger la clé API depuis les variables d'environnement
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || null
  }

  /**
   * Générer une image avec DALL-E 3
   */
  async generateImageDALLE(options: GenerationOptions): Promise<GenerationResult> {
    if (!this.apiKey) {
      throw new Error('Clé API OpenAI non configurée')
    }

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: options.model || 'dall-e-3',
          prompt: options.prompt,
          n: 1,
          size: `${options.width || 1024}x${options.height || 1024}`,
          quality: 'hd',
          style: 'vivid',
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error?.message || 'Erreur de génération')
      }

      const data = await response.json()
      const image = data.data[0]

      return {
        id: crypto.randomUUID(),
        url: image.url,
        prompt: options.prompt,
        model: 'dall-e-3',
        createdAt: Date.now(),
        metadata: {
          revised_prompt: image.revised_prompt,
        },
      }
    } catch (error) {
      console.error('Erreur DALL-E:', error)
      throw error
    }
  }

  /**
   * Générer une image avec Stability AI
   */
  async generateImageStability(options: GenerationOptions): Promise<GenerationResult> {
    const stabilityKey = process.env.NEXT_PUBLIC_STABILITY_API_KEY

    if (!stabilityKey) {
      throw new Error('Clé API Stability AI non configurée')
    }

    try {
      const formData = new FormData()
      formData.append('prompt', options.prompt)
      if (options.negativePrompt) {
        formData.append('negative_prompt', options.negativePrompt)
      }
      formData.append('width', String(options.width || 1024))
      formData.append('height', String(options.height || 1024))
      formData.append('steps', String(options.steps || 30))
      formData.append('cfg_scale', String(options.guidance || 7))
      if (options.seed) {
        formData.append('seed', String(options.seed))
      }

      const response = await fetch(
        'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${stabilityKey}`,
          },
          body: formData,
        }
      )

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur de génération')
      }

      const data = await response.json()
      const artifact = data.artifacts[0]

      // Convertir base64 en blob URL
      const base64Data = artifact.base64
      const blob = this.base64ToBlob(base64Data, 'image/png')
      const url = URL.createObjectURL(blob)

      return {
        id: crypto.randomUUID(),
        url,
        prompt: options.prompt,
        model: 'stable-diffusion-xl',
        createdAt: Date.now(),
        metadata: {
          seed: artifact.seed,
          finishReason: artifact.finishReason,
        },
      }
    } catch (error) {
      console.error('Erreur Stability AI:', error)
      throw error
    }
  }

  /**
   * Générer une vidéo avec Runway ML (via Replicate)
   */
  async generateVideo(options: GenerationOptions): Promise<GenerationResult> {
    const replicateKey = process.env.NEXT_PUBLIC_REPLICATE_API_KEY

    if (!replicateKey) {
      throw new Error('Clé API Replicate non configurée')
    }

    try {
      // Démarrer la génération
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${replicateKey}`,
        },
        body: JSON.stringify({
          version: 'stability-ai/stable-video-diffusion',
          input: {
            prompt: options.prompt,
            num_frames: 25,
            fps: 6,
            motion_bucket_id: 127,
            cond_aug: 0.02,
          },
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur de démarrage de génération vidéo')
      }

      const prediction = await response.json()

      // Attendre la fin de la génération (polling)
      const result = await this.pollPrediction(prediction.id, replicateKey)

      return {
        id: prediction.id,
        url: result.output,
        prompt: options.prompt,
        model: 'stable-video-diffusion',
        createdAt: Date.now(),
        metadata: {
          status: result.status,
        },
      }
    } catch (error) {
      console.error('Erreur génération vidéo:', error)
      throw error
    }
  }

  /**
   * Générer une image (méthode unifiée)
   */
  async generateImage(options: GenerationOptions): Promise<GenerationResult> {
    // Utiliser DALL-E par défaut
    return this.generateImageDALLE(options)
  }

  /**
   * Améliorer un prompt avec GPT-4
   */
  async enhancePrompt(prompt: string): Promise<string> {
    if (!this.apiKey) {
      return prompt // Retourner le prompt original si pas de clé
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Tu es un expert en prompts pour la génération d\'images IA. Améliore les prompts pour obtenir les meilleurs résultats possibles. Réponds uniquement avec le prompt amélioré, sans explications.',
            },
            {
              role: 'user',
              content: `Améliore ce prompt: "${prompt}"`,
            },
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        return prompt
      }

      const data = await response.json()
      return data.choices[0].message.content.trim()
    } catch (error) {
      console.error('Erreur amélioration prompt:', error)
      return prompt
    }
  }

  /**
   * Analyser une image avec GPT-4 Vision
   */
  async analyzeImage(imageUrl: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Clé API OpenAI non configurée')
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4-vision-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Décris cette image en détail. Inclus les éléments visuels, les couleurs, le style, et l\'ambiance.',
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl,
                  },
                },
              ],
            },
          ],
          max_tokens: 500,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur d\'analyse d\'image')
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error('Erreur analyse image:', error)
      throw error
    }
  }

  /**
   * Polling pour attendre la fin d'une prédiction Replicate
   */
  private async pollPrediction(id: string, apiKey: string, maxAttempts = 60): Promise<any> {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Attendre 2s

      const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
        headers: {
          'Authorization': `Token ${apiKey}`,
        },
      })

      const prediction = await response.json()

      if (prediction.status === 'succeeded') {
        return prediction
      }

      if (prediction.status === 'failed') {
        throw new Error('La génération a échoué')
      }
    }

    throw new Error('Timeout: la génération a pris trop de temps')
  }

  /**
   * Convertir base64 en Blob
   */
  private base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: mimeType })
  }
}

// Instance singleton
export const aiGenerationService = new AIGenerationService()
