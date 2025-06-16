
/**
 * Test helper utilities
 */

export const mockFetch = (responses: Record<string, any>) => {
  global.fetch = jest.fn((url: string) => {
    const urlString = typeof url === 'string' ? url : url.toString()
    
    for (const [pattern, response] of Object.entries(responses)) {
      if (urlString.includes(pattern)) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(response),
          headers: new Headers(),
          ...response._meta
        })
      }
    }
    
    return Promise.reject(new Error(`No mock response for ${urlString}`))
  }) as jest.Mock
}

export const mockAuthenticatedFetch = (token: string = 'mock-token') => {
  return (url: string, options?: RequestInit) => {
    const headers = new Headers(options?.headers)
    headers.set('Cookie', `token=${token}`)
    
    return fetch(url, {
      ...options,
      headers
    })
  }
}

export const createMockUser = (overrides: Partial<any> = {}) => ({
  id: 'user-123',
  username: 'testuser',
  isAdmin: false,
  preferences: { theme: 'light', viewMode: 'normal' },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
})

export const createMockQuestion = (overrides: Partial<any> = {}) => ({
  id: 'question-123',
  question_text: 'Test question',
  difficulty: 'Medium',
  category: 'data_ai_ml_systems',
  categories: ['Data & AI/ML Systems'],
  is_critical: false,
  tags: ['test'],
  usage_count: 1,
  question_type: 'system_design',
  companies: null,
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
  _count: { answers: 0, system_design_answers: 0 },
  ...overrides
})

export const createMockCompany = (overrides: Partial<any> = {}) => ({
  id: 'company-123',
  name: 'Test Company',
  values: ['Innovation', 'Excellence'],
  evaluation_criteria: ['Leadership', 'Technical Skills'],
  interview_format: 'Panel interview',
  success_tips: ['Be prepared', 'Ask questions'],
  red_flags: ['Poor communication', 'Lack of preparation'],
  _count: { questions: 5 },
  ...overrides
})

export const waitForLoadingToFinish = async () => {
  const { waitFor, screen } = await import('@testing-library/react')
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
  }, { timeout: 5000 })
}

export const expectToastMessage = (mockToast: jest.Mock, title: string, description?: string) => {
  expect(mockToast).toHaveBeenCalledWith(
    expect.objectContaining({
      title,
      ...(description && { description })
    })
  )
}
