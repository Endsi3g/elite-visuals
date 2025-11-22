// Mock pour les services AI
export const mockAIResponse = {
  success: true,
  content: 'Mock AI response',
  error: null,
}

export const mockTranscriptionResponse = {
  success: true,
  text: 'Mock transcription',
  error: null,
}

// Mock pour Ollama
export const callOllama = jest.fn().mockResolvedValue(mockAIResponse.content)

// Mock pour HuggingFace
export const callHuggingFace = jest.fn().mockResolvedValue(mockAIResponse.content)

// Mock pour generateText
export const generateText = jest.fn().mockResolvedValue(mockAIResponse)

// Mock pour transcribeAudio
export const transcribeAudio = jest.fn().mockResolvedValue(mockTranscriptionResponse)
