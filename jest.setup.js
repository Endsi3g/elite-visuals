// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
process.env.OLLAMA_BASE_URL = 'http://localhost:11434'
process.env.OLLAMA_MODEL = 'llama3'

// Mock fetch globally avec support pour blob()
global.fetch = jest.fn((url) => {
  // Mock pour les fichiers audio
  if (typeof url === 'string' && url.includes('audio')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(''),
      blob: () => Promise.resolve(new Blob(['mock audio data'], { type: 'audio/mp3' })),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
    })
  }
  
  // Mock par défaut
  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    blob: () => Promise.resolve(new Blob(['mock data'])),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)),
  })
})

// Mock Konva
jest.mock('konva', () => ({
  Stage: jest.fn(),
  Layer: jest.fn(),
  Rect: jest.fn(),
  Circle: jest.fn(),
  Image: jest.fn(),
}))

// Mock react-konva
jest.mock('react-konva', () => {
  const React = require('react')
  return {
    Stage: ({ children }) => React.createElement('div', { 'data-testid': 'konva-stage' }, children),
    Layer: ({ children }) => React.createElement('div', { 'data-testid': 'konva-layer' }, children),
    Group: ({ children }) => React.createElement('div', { 'data-testid': 'konva-group' }, children),
    Rect: () => React.createElement('div', { 'data-testid': 'konva-rect' }),
    Circle: () => React.createElement('div', { 'data-testid': 'konva-circle' }),
    Image: () => React.createElement('div', { 'data-testid': 'konva-image' }),
    Text: ({ text }) => React.createElement('div', { 'data-testid': 'konva-text' }, text),
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
