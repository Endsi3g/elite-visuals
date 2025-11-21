import axios from 'axios'
import { generateScript, analyzeImage, transcribeAudio } from '@/lib/ai/ollama'
import { setConfig, resetConfig } from '@/lib/ai/ollama.config'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// Helper pour créer un mock de File avec arrayBuffer
const createMockFile = (content: string, filename: string, type: string): File => {
  const file = new File([content], filename, { type })
  file.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(content.length))
  return file
}

describe('Ollama AI Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Réinitialiser la configuration pour chaque test
    resetConfig()
  })

  afterEach(() => {
    // Restaurer la configuration par défaut
    resetConfig()
  })

  describe('generateScript', () => {
    it('generates script from prompt', async () => {
      const mockResponse = {
        data: {
          response: 'Generated script content',
        },
      }
      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await generateScript('Create a marketing script')

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/generate'),
        expect.objectContaining({
          prompt: expect.stringContaining('Create a marketing script'),
          model: expect.any(String),
        })
      )
      expect(result.success).toBe(true)
      expect(result.content).toBe('Generated script content')
    })

    it('handles API errors gracefully', async () => {
      mockedAxios.post.mockRejectedValue(new Error('API Error'))

      const result = await generateScript('Test prompt')
      
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('uses correct model from configuration', async () => {
      // Utiliser setConfig au lieu de jest.resetModules()
      setConfig({ model: 'mistral' })
      
      mockedAxios.post.mockResolvedValue({ data: { response: 'test' } })

      await generateScript('Test')

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          model: 'mistral',
        })
      )
    })
  })

  describe('analyzeImage', () => {
    it('analyzes image with LLaVA', async () => {
      const mockResponse = {
        data: {
          response: 'Image contains a sunset over mountains',
        },
      }
      mockedAxios.post.mockResolvedValue(mockResponse)

      const result = await analyzeImage('https://example.com/image.jpg')

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/generate'),
        expect.objectContaining({
          model: 'llava',
          images: expect.arrayContaining([expect.any(String)]),
        })
      )
      expect(result).toContain('sunset')
    })

    it('handles invalid image URLs', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Invalid image'))

      await expect(analyzeImage('invalid-url')).rejects.toThrow()
    })
  })

  describe('transcribeAudio', () => {
    it('transcribes audio file with HuggingFace API', async () => {
      // Utiliser setConfig au lieu de jest.resetModules()
      setConfig({ hfApiKey: 'test-key' })
      
      const mockResponse = {
        data: {
          text: 'Transcribed audio content',
        },
      }
      mockedAxios.post.mockResolvedValue(mockResponse)

      const audioFile = createMockFile('audio', 'test.mp3', 'audio/mp3')
      const result = await transcribeAudio(audioFile)

      expect(result).toBe('Transcribed audio content')
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api-inference.huggingface.co/models/openai/whisper-large-v3',
        expect.any(ArrayBuffer),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-key',
          }),
        })
      )
    })

    it('handles large audio files', async () => {
      setConfig({ hfApiKey: 'test-key' })
      
      mockedAxios.post.mockResolvedValue({ data: { text: 'transcription' } })
      
      const largeAudio = createMockFile('x'.repeat(1000), 'large.mp3', 'audio/mp3')
      const result = await transcribeAudio(largeAudio)

      expect(result).toBe('transcription')
      expect(mockedAxios.post).toHaveBeenCalled()
    })

    it('returns error object when no API key is configured', async () => {
      // Pas de clé API configurée
      resetConfig()
      
      const audioFile = createMockFile('audio', 'test.mp3', 'audio/mp3')
      
      const result = await transcribeAudio(audioFile)
      
      expect(result).toEqual(
        expect.objectContaining({
          success: false,
          error: expect.stringContaining('Transcription requires HuggingFace API key'),
        })
      )
    })
  })
})
