
import { GET } from '@/app/api/companies/with-questions/route'
import { NextRequest } from 'next/server'

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    company: {
      findMany: jest.fn(),
    },
  },
}))

describe('/api/companies/with-questions', () => {
  const mockCompanies = [
    {
      id: 'comp-1',
      name: 'Microsoft',
      values: ['Respect', 'Integrity'],
      evaluation_criteria: ['Leadership', 'Technical Excellence'],
      interview_format: 'Multi-stage process',
      success_tips: ['Show growth mindset'],
      red_flags: ['Fixed mindset'],
      _count: { questions: 5 }
    },
    {
      id: 'comp-2', 
      name: 'Google',
      values: ['Innovation', 'User Focus'],
      evaluation_criteria: ['Problem Solving', 'Leadership'],
      interview_format: 'Panel interviews',
      success_tips: ['Think big'],
      red_flags: ['Poor communication'],
      _count: { questions: 8 }
    }
  ]

  beforeEach(() => {
    const { prisma } = require('@/lib/db')
    prisma.companies.findMany.mockResolvedValue(mockCompanies)
  })

  it('should return companies with question counts', async () => {
    const request = new NextRequest('http://localhost:3000/api/companies/with-questions')
    const response = await GET(request)
    
    expect(response.status).toBe(200)
    const data = await response.json()
    
    expect(Array.isArray(data)).toBe(true)
    expect(data).toHaveLength(2)
    
    data.forEach((company: any) => {
      expect(company).toHaveProperty('id')
      expect(company).toHaveProperty('name')
      expect(company).toHaveProperty('values')
      expect(company).toHaveProperty('_count')
      expect(company._count).toHaveProperty('questions')
      expect(typeof company._count.questions).toBe('number')
    })
  })

  it('should include all required company fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/companies/with-questions')
    const response = await GET(request)
    const data = await response.json()
    
    const company = data[0]
    expect(company).toHaveProperty('evaluation_criteria')
    expect(company).toHaveProperty('interview_format')
    expect(company).toHaveProperty('success_tips')
    expect(company).toHaveProperty('red_flags')
    expect(Array.isArray(company.values)).toBe(true)
    expect(Array.isArray(company.evaluation_criteria)).toBe(true)
    expect(Array.isArray(company.success_tips)).toBe(true)
    expect(Array.isArray(company.red_flags)).toBe(true)
  })
})
