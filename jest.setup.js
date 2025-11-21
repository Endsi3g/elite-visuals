// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
process.env.OLLAMA_BASE_URL = 'http://localhost:11434'
process.env.OLLAMA_MODEL = 'llama3'

// Mock fetch globally avec support pour blob() et jest.resetModules()
const createFetchMock = () => jest.fn((url) => {
  // Mock pour les fichiers audio
  if (typeof url === 'string' && url.includes('audio')) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
      blob: () => Promise.resolve(new Blob(['mock audio data'], { type: 'audio/mp3' })),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
      headers: new Headers(),
    })
  }
  
  // Mock par défaut
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob(['mock data'])),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
    headers: new Headers(),
  })
})

global.fetch = createFetchMock()

// Reset fetch mock après chaque test
afterEach(() => {
  global.fetch = createFetchMock()
})

// Mock Konva avec support pour jest.resetModules()
jest.mock('konva', () => {
  const mockNode = {
    x: jest.fn().mockReturnThis(),
    y: jest.fn().mockReturnThis(),
    cache: jest.fn(),
    clearCache: jest.fn(),
    destroy: jest.fn(),
  }
  
  return {
    Stage: jest.fn(() => mockNode),
    Layer: jest.fn(() => mockNode),
    Rect: jest.fn(() => mockNode),
    Circle: jest.fn(() => mockNode),
    Image: jest.fn(() => mockNode),
    Group: jest.fn(() => mockNode),
    Text: jest.fn(() => mockNode),
    Line: jest.fn(() => mockNode),
  }
})

// Mock react-konva avec support pour jest.resetModules()
jest.mock('react-konva', () => {
  const React = require('react')
  
  const createMockComponent = (testId) => {
    return React.forwardRef(({ children, ...props }, ref) => {
      return React.createElement('div', { 
        'data-testid': testId,
        ref,
        ...props
      }, children)
    })
  }
  
  return {
    Stage: createMockComponent('konva-stage'),
    Layer: createMockComponent('konva-layer'),
    Group: createMockComponent('konva-group'),
    Rect: createMockComponent('konva-rect'),
    Circle: createMockComponent('konva-circle'),
    Image: createMockComponent('konva-image'),
    Text: createMockComponent('konva-text'),
    Line: createMockComponent('konva-line'),
  }
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}
