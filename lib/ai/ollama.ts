import axios from "axios"
import { getConfig } from "./ollama.config"

// Fonction helper pour appeler Ollama
async function callOllama(prompt: string, systemPrompt?: string) {
  const config = getConfig()
  const response = await axios.post(`${config.baseUrl}/api/generate`, {
    model: config.model,
    prompt: systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt,
    stream: false,
    options: {
      temperature: 0.7,
      num_predict: 1000,
    },
  })
  return response.data.response
}

// Alternative: HuggingFace Inference API
async function callHuggingFace(prompt: string, systemPrompt?: string) {
  const config = getConfig()
  if (!config.hfApiKey) {
    throw new Error("HuggingFace API key not configured")
  }

  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt
  
  const response = await axios.post(
    `https://api-inference.huggingface.co/models/${config.hfModel}`,
    { inputs: fullPrompt, parameters: { max_new_tokens: 1000, temperature: 0.7 } },
    { headers: { Authorization: `Bearer ${config.hfApiKey}` } }
  )
  
  return response.data[0]?.generated_text || response.data.generated_text
}

export async function generateScript(prompt: string, context?: string) {
  try {
    const systemPrompt = "Tu es un expert en création de contenu publicitaire et scripts vidéo pour Elite Visuals, une agence créative francophone."
    const fullPrompt = context ? `Contexte: ${context}\n\nPrompt: ${prompt}` : prompt

    // Essayer Ollama d'abord, puis HuggingFace en fallback
    let content: string
    try {
      content = await callOllama(fullPrompt, systemPrompt)
    } catch (ollamaError) {
      console.warn("Ollama not available, trying HuggingFace...", ollamaError)
      content = await callHuggingFace(fullPrompt, systemPrompt)
    }

    return {
      success: true,
      content,
      model: getConfig().model,
    }
  } catch (error) {
    console.error("OpenAI Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function analyzeMedia(
  mediaType: "image" | "video" | "audio",
  content: string
) {
  try {
    // Pour l'analyse d'images, utiliser LLaVA (Ollama) ou BLIP (HuggingFace)
    const prompt = `Analyse ce média ${mediaType} et fournis des insights créatifs pour Elite Visuals:\n\n${content}`
    
    let analysis: string
    
    if (mediaType === "image") {
      // Utiliser LLaVA via Ollama pour l'analyse d'images
      try {
        const response = await axios.post(`${getConfig().baseUrl}/api/generate`, {
          model: "llava", // Modèle vision d'Ollama
          prompt,
          images: [content], // Base64 ou URL
          stream: false,
        })
        analysis = response.data.response
      } catch {
        // Fallback: analyse textuelle simple
        analysis = await callOllama(prompt)
      }
    } else {
      analysis = await callOllama(prompt)
    }

    return {
      success: true,
      analysis,
      model: mediaType === "image" ? "llava" : getConfig().model,
    }
  } catch (error) {
    console.error("OpenAI Analysis Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Alias pour analyzeImage (compatibilité avec les tests)
export async function analyzeImage(imageUrl: string) {
  try {
    const response = await axios.post(`${getConfig().baseUrl}/api/generate`, {
      model: "llava",
      prompt: "Analyse cette image et fournis des insights créatifs.",
      images: [imageUrl],
      stream: false,
    })
    return response.data.response
  } catch (error) {
    throw error
  }
}

export async function transcribeAudio(audioFile: File | string) {
  try {
    let audioBuffer: ArrayBuffer
    
    // Gérer File ou URL
    if (audioFile instanceof File) {
      audioBuffer = await audioFile.arrayBuffer()
    } else {
      const response = await fetch(audioFile)
      const audioBlob = await response.blob()
      audioBuffer = await audioBlob.arrayBuffer()
    }

    // Option 1: HuggingFace Whisper
    const config = getConfig()
    if (config.hfApiKey) {
      const hfResponse = await axios.post(
        "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
        audioBuffer,
        {
          headers: {
            Authorization: `Bearer ${config.hfApiKey}`,
            "Content-Type": "audio/mpeg",
          },
        }
      )
      return hfResponse.data.text
    }

    // Option 2: Whisper local via Ollama (si disponible)
    throw new Error("Transcription requires HuggingFace API key or local Whisper setup")
  } catch (error) {
    console.error("Transcription Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function generateBrief(requirements: string[]) {
  try {
    const systemPrompt = "Tu es un expert en création de briefs créatifs pour Elite Visuals. Génère un brief structuré et professionnel."
    const prompt = `Crée un brief créatif basé sur ces exigences:\n${requirements.join("\n")}`

    let brief: string
    try {
      const config = getConfig()
      const response = await axios.post(`${config.baseUrl}/api/generate`, {
        model: config.model,
        prompt: `${systemPrompt}\n\n${prompt}`,
        stream: false,
        options: {
          temperature: 0.6,
          num_predict: 1500,
        },
      })
      brief = response.data.response
    } catch {
      brief = await callHuggingFace(prompt, systemPrompt)
    }

    return {
      success: true,
      brief,
      model: getConfig().model,
    }
  } catch (error) {
    console.error("Brief Generation Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
