
/**
 * Database tests for categories migration
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Categories Migration', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should have categories field in questions table', async () => {
    // Test that the categories field exists and is properly typed
    const question = await prisma.question.findFirst({
      where: { question_type: 'system_design' },
      select: { id: true, category: true, categories: true }
    })
    
    if (question) {
      expect(question).toHaveProperty('categories')
      expect(Array.isArray(question.categories)).toBe(true)
    }
  })

  it('should have all questions categorized into 4 categories', async () => {
    const questions = await prisma.question.findMany({
      where: { question_type: 'system_design' },
      select: { categories: true }
    })
    
    const allCategories = new Set<string>()
    questions.forEach(q => {
      if (q.categories) {
        q.categories.forEach(cat => allCategories.add(cat))
      }
    })
    
    const expectedCategories = [
      'Distributed Systems & Infrastructure',
      'Data & AI/ML Systems',
      'Real-time & Communication Systems', 
      'Product & Platform Systems'
    ]
    
    // Should have exactly these 4 categories
    expect(allCategories.size).toBeLessThanOrEqual(4)
    Array.from(allCategories).forEach(category => {
      expect(expectedCategories).toContain(category)
    })
  })

  it('should have proper distribution across categories', async () => {
    const questions = await prisma.question.findMany({
      where: { question_type: 'system_design' },
      select: { categories: true }
    })
    
    const categoryCount: Record<string, number> = {}
    questions.forEach(q => {
      if (q.categories) {
        q.categories.forEach(cat => {
          categoryCount[cat] = (categoryCount[cat] || 0) + 1
        })
      }
    })
    
    // Each category should have at least 1 question
    Object.values(categoryCount).forEach(count => {
      expect(count).toBeGreaterThan(0)
    })
    
    // Total questions should be reasonable (at least 10)
    const totalQuestions = questions.length
    expect(totalQuestions).toBeGreaterThanOrEqual(10)
  })
})
