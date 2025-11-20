import axios from "axios"

const LUMA_API_URL = process.env.LUMA_API_URL || "https://api.lumalabs.ai/v1"
const LUMA_API_KEY = process.env.LUMA_API_KEY

interface LumaGenerationRequest {
  prompt: string
  aspect_ratio?: "16:9" | "9:16" | "1:1" | "4:3"
  loop?: boolean
  keyframes?: {
    frame0?: { type: "image"; url: string }
    frame1?: { type: "image"; url: string }
  }
}

export async function generateVideo(params: LumaGenerationRequest) {
  try {
    const response = await axios.post(
      `${LUMA_API_URL}/generations`,
      {
        prompt: params.prompt,
        aspect_ratio: params.aspect_ratio || "16:9",
        loop: params.loop || false,
        keyframes: params.keyframes,
      },
      {
        headers: {
          Authorization: `Bearer ${LUMA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    return {
      success: true,
      generationId: response.data.id,
      status: response.data.state,
      data: response.data,
    }
  } catch (error) {
    console.error("Luma Video Generation Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function checkGenerationStatus(generationId: string) {
  try {
    const response = await axios.get(
      `${LUMA_API_URL}/generations/${generationId}`,
      {
        headers: {
          Authorization: `Bearer ${LUMA_API_KEY}`,
        },
      }
    )

    return {
      success: true,
      status: response.data.state,
      videoUrl: response.data.assets?.video,
      thumbnailUrl: response.data.assets?.thumbnail,
      data: response.data,
    }
  } catch (error) {
    console.error("Luma Status Check Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function generateImage(prompt: string, style?: string) {
  try {
    const response = await axios.post(
      `${LUMA_API_URL}/images/generations`,
      {
        prompt: style ? `${prompt}, style: ${style}` : prompt,
        num_images: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${LUMA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    return {
      success: true,
      imageUrl: response.data.images?.[0]?.url,
      data: response.data,
    }
  } catch (error) {
    console.error("Luma Image Generation Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function generateMoodboard(
  theme: string,
  keywords: string[],
  count: number = 4
) {
  try {
    const prompts = keywords.map(
      (keyword) => `${theme} moodboard: ${keyword}, professional, creative, modern`
    )

    const generations = await Promise.all(
      prompts.slice(0, count).map((prompt) => generateImage(prompt, "moodboard"))
    )

    const successfulGenerations = generations.filter((g) => g.success)

    return {
      success: successfulGenerations.length > 0,
      images: successfulGenerations.map((g) => g.imageUrl),
      count: successfulGenerations.length,
    }
  } catch (error) {
    console.error("Luma Moodboard Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function extendVideo(
  videoUrl: string,
  prompt: string,
  direction: "forward" | "backward" = "forward"
) {
  try {
    const response = await axios.post(
      `${LUMA_API_URL}/generations/extend`,
      {
        video_url: videoUrl,
        prompt,
        direction,
      },
      {
        headers: {
          Authorization: `Bearer ${LUMA_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    )

    return {
      success: true,
      generationId: response.data.id,
      status: response.data.state,
    }
  } catch (error) {
    console.error("Luma Video Extension Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
