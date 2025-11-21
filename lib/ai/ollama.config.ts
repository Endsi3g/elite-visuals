// Configuration pour les services AI
// Permet l'injection de dépendances pour les tests

export interface OllamaConfig {
  baseUrl: string
  model: string
  hfApiKey?: string
  hfModel: string
}

// Configuration par défaut depuis les variables d'environnement
export const getDefaultConfig = (): OllamaConfig => ({
  baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
  model: process.env.OLLAMA_MODEL || "llama3",
  hfApiKey: process.env.HUGGINGFACE_API_KEY,
  hfModel: process.env.HF_MODEL || "mistralai/Mistral-7B-Instruct-v0.2",
})

// Configuration globale (peut être overridée pour les tests)
let currentConfig: OllamaConfig = getDefaultConfig()

export const getConfig = (): OllamaConfig => currentConfig

export const setConfig = (config: Partial<OllamaConfig>): void => {
  currentConfig = { ...currentConfig, ...config }
}

export const resetConfig = (): void => {
  currentConfig = getDefaultConfig()
}
