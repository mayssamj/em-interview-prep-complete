
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { SystemDesignQuestionBankClient } from '@/components/system-design/system-design-question-bank-client'

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}))

// Mock fetch
global.fetch = jest.fn()

const mockQuestions = [
  {
    id: 'test-1',
    question_text: 'Design a scalable system',
    difficulty: 'Medium',
    category: 'distributed_systems_infrastructure',
    categories: ['Distributed Systems & Infrastructure'],
    is_critical: false,
    tags: ['scalability'],
    usage_count: 5,
    companies: { id: 'comp-1', name: 'Test Company' },
    system_design_questions: {
      architecture_focus: ['scalability'],
      complexity_level: 'medium',
      leadership_aspects: ['team coordination'],
      frameworks: ['microservices'],
      evaluation_criteria: ['scalability'],
      resources: [],
      estimated_time_minutes: 45,
      follow_up_questions: [],
      common_mistakes: [],
      key_tradeoffs: []
    },
    _count: { answers: 2, system_design_answers: 1 }
  }
]

const mockCategories = [
  {
    id: 'distributed_systems_infrastructure',
    name: 'Distributed Systems & Infrastructure',
    description: 'Large-scale distributed systems, infrastructure design',
    count: 3
  },
  {
    id: 'data_ai_ml_systems',
    name: 'Data & AI/ML Systems',
    description: 'Data platforms, AI/ML systems, search engines',
    count: 8
  }
]

describe('SystemDesignQuestionBankClient', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockImplementation((url: string) => {
      if (url.includes('/api/system-design-questions')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockQuestions),
        })
      }
      if (url.includes('/api/system-design-categories')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockCategories),
        })
      }
      return Promise.reject(new Error('Unknown URL'))
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should render questions and categories', async () => {
    render(<SystemDesignQuestionBankClient />)
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading system design questions...')).not.toBeInTheDocument()
    })
    
    // Check if question is displayed
    expect(screen.getByText('Design a scalable system')).toBeInTheDocument()
    
    // Check if categories are loaded in the filter
    expect(screen.getByText('All Categories')).toBeInTheDocument()
  })

  it('should display new category badges', async () => {
    render(<SystemDesignQuestionBankClient />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading system design questions...')).not.toBeInTheDocument()
    })
    
    // Check if the new category badge is displayed
    expect(screen.getByText('Distributed Systems & Infrastructure')).toBeInTheDocument()
  })

  it('should filter questions by category', async () => {
    render(<SystemDesignQuestionBankClient />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading system design questions...')).not.toBeInTheDocument()
    })
    
    // Find and click the category filter
    const categorySelect = screen.getByDisplayValue('All Categories')
    fireEvent.click(categorySelect)
    
    // The component should make a new API call when category changes
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/system-design-questions'))
  })

  it('should handle API errors gracefully', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'))
    
    render(<SystemDesignQuestionBankClient />)
    
    await waitFor(() => {
      expect(screen.queryByText('Loading system design questions...')).not.toBeInTheDocument()
    })
    
    // Component should handle error gracefully and not crash
    expect(screen.getByText(/No questions found/i)).toBeInTheDocument()
  })
})
