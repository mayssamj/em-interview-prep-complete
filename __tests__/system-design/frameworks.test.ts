
import { render, screen, waitFor } from '@testing-library/react'
import { SystemDesignStrategyClient } from '@/components/system-design/system-design-strategy-client'

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

describe('SystemDesignStrategyClient', () => {
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders loading state initially', () => {
    global.fetch = jest.fn().mockImplementation(() => new Promise(() => {})) // Never resolves
    
    render(<SystemDesignStrategyClient />)
    expect(screen.getByText('Loading system design frameworks...')).toBeInTheDocument()
  })

  it('renders frameworks after successful fetch', async () => {
    const mockFrameworks = [
      {
        id: '1',
        name: 'CAP Theorem',
        description: 'Test description',
        category: 'data_consistency',
        key_principles: ['Test principle'],
        use_cases: ['Test use case'],
        tradeoffs: ['Test tradeoff'],
        examples: ['Test example'],
        resources: [],
        difficulty: 'Medium',
      },
    ]

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockFrameworks),
    })

    render(<SystemDesignStrategyClient />)

    await waitFor(() => {
      expect(screen.getByText('CAP Theorem')).toBeInTheDocument()
    })

    expect(screen.getByText('Test description')).toBeInTheDocument()
  })

  it('handles fetch errors gracefully', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'))

    render(<SystemDesignStrategyClient />)

    await waitFor(() => {
      expect(screen.queryByText('Loading system design frameworks...')).not.toBeInTheDocument()
    })

    // Should show empty state or error handling
    expect(screen.getByText('No frameworks found')).toBeInTheDocument()
  })

  it('filters frameworks by category', async () => {
    const mockFrameworks = [
      {
        id: '1',
        name: 'CAP Theorem',
        description: 'Test description',
        category: 'data_consistency',
        key_principles: ['Test principle'],
        use_cases: ['Test use case'],
        tradeoffs: ['Test tradeoff'],
        examples: ['Test example'],
        resources: [],
        difficulty: 'Medium',
      },
      {
        id: '2',
        name: 'Load Balancing',
        description: 'Test description 2',
        category: 'scalability',
        key_principles: ['Test principle 2'],
        use_cases: ['Test use case 2'],
        tradeoffs: ['Test tradeoff 2'],
        examples: ['Test example 2'],
        resources: [],
        difficulty: 'Easy',
      },
    ]

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockFrameworks),
    })

    render(<SystemDesignStrategyClient />)

    await waitFor(() => {
      expect(screen.getByText('CAP Theorem')).toBeInTheDocument()
      expect(screen.getByText('Load Balancing')).toBeInTheDocument()
    })
  })
})
