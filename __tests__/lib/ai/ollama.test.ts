import axios from 'axios'
import { generateScript, analyzeImage, transcribeAudio } from '@/lib/ai/ollama'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Ollama AI Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
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

    it('uses correct model from environment', async () => {
      const originalModel = process.env.OLLAMA_MODEL
      process.env.OLLAMA_MODEL = 'mistral'
      
      // Recharger le module pour prendre en compte la nouvelle variable
      jest.resetModules()
      const { generateScript: generateScriptReloaded } = require('@/lib/ai/ollama')
      
      mockedAxios.post.mockResolvedValue({ data: { response: 'test' } })

      await generateScriptReloaded('Test')

      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          model: 'mistral',
        })
      )
      
      // Restaurer la variable d'environnement
      process.env.OLLAMA_MODEL = originalModel
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
    it('transcribes audio file', async () => {
      // Mock HuggingFace API key
      process.env.HUGGINGFACE_API_KEY = 'test-key'
      
      const mockResponse = {
        data: {
          text: 'Transcribed audio content',
        },
      }
      mockedAxios.post.mockResolvedValue(mockResponse)

      // Mock File.arrayBuffer()
      const audioFile = new File(['audio'], 'test.mp3', { type: 'audio/mp3' })
      audioFile.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(8))

      const result = await transcribeAudio(audioFile)

      expect(result).toBe('Transcribed audio content')
      
      // Cleanup
      delete process.env.HUGGINGFACE_API_KEY
    })

    it('handles large audio files', async () => {
      process.env.HUGGINGFACE_API_KEY = 'test-key'
      
      const largeAudio = new File(['x'.repeat(1000)], 'large.mp3', {
        type: 'audio/mp3',
      })
      largeAudio.arrayBuffer = jest.fn().mockResolvedValue(new ArrayBuffer(1000))

      mockedAxios.post.mockResolvedValue({ data: { text: 'transcription' } })

      await expect(transcribeAudio(largeAudio)).resolves.toBeDefined()
      
      delete process.env.HUGGINGFACE_API_KEY
    })
  })
})
