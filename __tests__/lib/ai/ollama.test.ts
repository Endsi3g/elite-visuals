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
          prompt: 'Create a marketing script',
          model: expect.any(String),
        })
      )
      expect(result).toBe('Generated script content')
    })

    it('handles API errors gracefully', async () => {
      mockedAxios.post.mockRejectedValue(new Error('API Error'))

      await expect(generateScript('Test prompt')).rejects.toThrow('API Error')
    })

    it('uses correct model from environment', async () => {
      process.env.OLLAMA_MODEL = 'mistral'
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
    it('transcribes audio file', async () => {
      const mockResponse = {
        data: {
          text: 'Transcribed audio content',
        },
      }
      mockedAxios.post.mockResolvedValue(mockResponse)

      const audioFile = new File(['audio'], 'test.mp3', { type: 'audio/mp3' })
      const result = await transcribeAudio(audioFile)

      expect(result).toBe('Transcribed audio content')
    })

    it('handles large audio files', async () => {
      const largeAudio = new File(['x'.repeat(100_000_000)], 'large.mp3', {
        type: 'audio/mp3',
      })

      mockedAxios.post.mockResolvedValue({ data: { text: 'transcription' } })

      await expect(transcribeAudio(largeAudio)).resolves.toBeDefined()
    })
  })
})
