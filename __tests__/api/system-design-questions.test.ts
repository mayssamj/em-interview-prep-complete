
import { GET } from '@/app/api/system-design-questions/route'
import { NextRequest } from 'next/server'

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    question: {
      findMany: jest.fn(),
    },
  },
}))

describe('/api/system-design-questions', () => {
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

  beforeEach(() => {
    const { prisma } = require('@/lib/db')
    prisma.question.findMany.mockResolvedValue(mockQuestions)
  })

  it('should return system design questions', async () => {
    const request = new NextRequest('http://localhost:3000/api/system-design-questions')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data).toHaveLength(1)
    expect(data[0]).toHaveProperty('question_text')
    expect(data[0]).toHaveProperty('categories')
  })

  it('should filter by category', async () => {
    const request = new NextRequest('http://localhost:3000/api/system-design-questions?category=Distributed Systems & Infrastructure')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    
    const { prisma } = require('@/lib/db')
    expect(prisma.question.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { category: 'Distributed Systems & Infrastructure' },
            { categories: { has: 'Distributed Systems & Infrastructure' } }
          ]
        })
      })
    )
  })

  it('should filter by difficulty', async () => {
    const request = new NextRequest('http://localhost:3000/api/system-design-questions?difficulty=Hard')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    
    const { prisma } = require('@/lib/db')
    expect(prisma.question.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          difficulty: 'Hard'
        })
      })
    )
  })

  it('should filter critical questions only', async () => {
    const request = new NextRequest('http://localhost:3000/api/system-design-questions?critical=true')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    
    const { prisma } = require('@/lib/db')
    expect(prisma.question.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          is_critical: true
        })
      })
    )
  })
})
