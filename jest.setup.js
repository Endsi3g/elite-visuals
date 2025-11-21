// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-key'
process.env.OLLAMA_BASE_URL = 'http://localhost:11434'
process.env.OLLAMA_MODEL = 'llama3'

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
)

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
    Rect: () => React.createElement('div', { 'data-testid': 'konva-rect' }),
    Circle: () => React.createElement('div', { 'data-testid': 'konva-circle' }),
    Image: () => React.createElement('div', { 'data-testid': 'konva-image' }),
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
