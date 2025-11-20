import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateCreativeContent(
  prompt: string,
  type: "pitch" | "story" | "concept" | "analysis"
) {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 2000,
      system:
        "Tu es Claude, assistant créatif d'Elite Visuals. Tu excelles en storytelling, pitchs créatifs, et analyses conceptuelles.",
      messages: [
        {
          role: "user",
          content: `Type de contenu: ${type}\n\n${prompt}`,
        },
      ],
    })

    return {
      success: true,
      content: message.content[0].type === "text" ? message.content[0].text : "",
      usage: message.usage,
    }
  } catch (error) {
    console.error("Claude Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function synthesizeContent(contents: string[]) {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1500,
      system:
        "Tu es un expert en synthèse et structuration de contenu pour Elite Visuals.",
      messages: [
        {
          role: "user",
          content: `Synthétise ces contenus en un document cohérent et structuré:\n\n${contents.join("\n\n---\n\n")}`,
        },
      ],
    })

    return {
      success: true,
      synthesis: message.content[0].type === "text" ? message.content[0].text : "",
    }
  } catch (error) {
    console.error("Claude Synthesis Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function generatePitch(
  product: string,
  audience: string,
  tone: string
) {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1500,
      system:
        "Tu es un expert en création de pitchs commerciaux percutants pour Elite Visuals.",
      messages: [
        {
          role: "user",
          content: `Crée un pitch créatif pour:\nProduit: ${product}\nAudience: ${audience}\nTone: ${tone}`,
        },
      ],
    })

    return {
      success: true,
      pitch: message.content[0].type === "text" ? message.content[0].text : "",
    }
  } catch (error) {
    console.error("Claude Pitch Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function analyzeCreativeStrategy(context: string) {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 2000,
      system:
        "Tu es un stratège créatif senior chez Elite Visuals. Analyse et propose des stratégies créatives innovantes.",
      messages: [
        {
          role: "user",
          content: `Analyse ce contexte et propose une stratégie créative:\n\n${context}`,
        },
      ],
    })

    return {
      success: true,
      strategy: message.content[0].type === "text" ? message.content[0].text : "",
    }
  } catch (error) {
    console.error("Claude Strategy Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
