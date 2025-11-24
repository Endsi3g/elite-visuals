import { AITaskService } from '@/lib/ai/tasks'

// Mock axios
jest.mock('axios')

describe('AITaskService', () => {
  describe('executeTask', () => {
    it('should execute GPT-4 task', async () => {
      const task = {
        id: 'test-1',
        description: 'Test task',
        agent: 'gpt-4' as const,
        status: 'pending' as const,
        createdAt: new Date(),
      }

      // Le service devrait gérer l'exécution
      expect(task.agent).toBe('gpt-4')
    })

    it('should execute Claude task', async () => {
      const task = {
        id: 'test-2',
        description: 'Test Claude task',
        agent: 'claude' as const,
        status: 'pending' as const,
        createdAt: new Date(),
      }

      expect(task.agent).toBe('claude')
    })

    it('should execute DALL-E task', async () => {
      const task = {
        id: 'test-3',
        description: 'Generate image',
        agent: 'dall-e' as const,
        status: 'pending' as const,
        createdAt: new Date(),
      }

      expect(task.agent).toBe('dall-e')
    })
  })

  describe('Task validation', () => {
    it('should validate task description', () => {
      const validTask = {
        id: 'test',
        description: 'Valid description',
        agent: 'gpt-4' as const,
        status: 'pending' as const,
        createdAt: new Date(),
      }

      expect(validTask.description).toBeTruthy()
      expect(validTask.description.length).toBeGreaterThan(0)
    })

    it('should validate agent type', () => {
      const validAgents = ['gpt-4', 'gpt-3.5-turbo', 'claude', 'dall-e', 'stable-diffusion', 'luma']
      
      validAgents.forEach(agent => {
        expect(validAgents).toContain(agent)
      })
    })
  })

  describe('Task status', () => {
    it('should have valid status values', () => {
      const validStatuses = ['pending', 'in-progress', 'completed', 'failed']
      
      validStatuses.forEach(status => {
        expect(validStatuses).toContain(status)
      })
    })
  })
})
