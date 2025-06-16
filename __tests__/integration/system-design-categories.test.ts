
/**
 * Integration tests for system design categories functionality
 */

describe('System Design Categories Integration', () => {
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000'

  it('should have exactly 4 categories', async () => {
    const response = await fetch(`${baseUrl}/api/system-design-categories`)
    expect(response.status).toBe(200)
    
    const categories = await response.json()
    expect(categories).toHaveLength(4)
    
    const expectedCategories = [
      'Distributed Systems & Infrastructure',
      'Data & AI/ML Systems', 
      'Real-time & Communication Systems',
      'Product & Platform Systems'
    ]
    
    const categoryNames = categories.map((cat: any) => cat.name)
    expectedCategories.forEach(expectedName => {
      expect(categoryNames).toContain(expectedName)
    })
  })

  it('should return questions with new categories field', async () => {
    const response = await fetch(`${baseUrl}/api/system-design-questions`)
    expect(response.status).toBe(200)
    
    const questions = await response.json()
    expect(Array.isArray(questions)).toBe(true)
    
    if (questions.length > 0) {
      const question = questions[0]
      expect(question).toHaveProperty('categories')
      expect(Array.isArray(question.categories)).toBe(true)
      
      // Each question should have at least one category
      if (question.categories && question.categories.length > 0) {
        const validCategories = [
          'Distributed Systems & Infrastructure',
          'Data & AI/ML Systems', 
          'Real-time & Communication Systems',
          'Product & Platform Systems'
        ]
        
        question.categories.forEach((category: string) => {
          expect(validCategories).toContain(category)
        })
      }
    }
  })

  it('should filter questions by new category names', async () => {
    const categoryName = 'Data & AI/ML Systems'
    const response = await fetch(`${baseUrl}/api/system-design-questions?category=${encodeURIComponent(categoryName)}`)
    expect(response.status).toBe(200)
    
    const questions = await response.json()
    expect(Array.isArray(questions)).toBe(true)
    
    // All returned questions should belong to the requested category
    questions.forEach((question: any) => {
      if (question.categories && question.categories.length > 0) {
        expect(question.categories).toContain(categoryName)
      }
    })
  })
})
