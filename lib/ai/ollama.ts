import axios from "axios"

// Configuration Ollama (LLM Open Source)
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434"
const DEFAULT_MODEL = process.env.OLLAMA_MODEL || "llama3" // ou "mistral", "codellama", etc.

// Alternative: Utiliser HuggingFace Inference API
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY
const HF_MODEL = process.env.HF_MODEL || "mistralai/Mistral-7B-Instruct-v0.2"

// Fonction helper pour appeler Ollama
async function callOllama(prompt: string, systemPrompt?: string) {
  const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
    model: DEFAULT_MODEL,
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
  if (!HF_API_KEY) {
    throw new Error("HuggingFace API key not configured")
  }

  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt
  
  const response = await axios.post(
    `https://api-inference.huggingface.co/models/${HF_MODEL}`,
    { inputs: fullPrompt, parameters: { max_new_tokens: 1000, temperature: 0.7 } },
    { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
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
      model: DEFAULT_MODEL,
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
        const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
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
      model: mediaType === "image" ? "llava" : DEFAULT_MODEL,
    }
  } catch (error) {
    console.error("OpenAI Analysis Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function transcribeAudio(audioUrl: string) {
  try {
    // Utiliser Whisper via HuggingFace ou local
    const response = await fetch(audioUrl)
    const audioBlob = await response.blob()
    const audioBuffer = await audioBlob.arrayBuffer()
    const audioBase64 = Buffer.from(audioBuffer).toString('base64')

    // Option 1: HuggingFace Whisper
    if (HF_API_KEY) {
      const hfResponse = await axios.post(
        "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
        audioBuffer,
        {
          headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            "Content-Type": "audio/mpeg",
          },
        }
      )
      return {
        success: true,
        text: hfResponse.data.text,
        model: "whisper-large-v3",
      }
    }

    // Option 2: Whisper local via Ollama (si disponible)
    // Note: Nécessite d'avoir Whisper installé localement
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
      const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
        model: DEFAULT_MODEL,
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
      model: DEFAULT_MODEL,
    }
  } catch (error) {
    console.error("Brief Generation Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
