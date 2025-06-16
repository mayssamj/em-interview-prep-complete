
import { GET } from '@/app/api/system-design-categories/route'
import { NextRequest } from 'next/server'

describe('/api/system-design-categories', () => {
  it('should return exactly 4 categories', async () => {
    const request = new NextRequest('http://localhost:3000/api/system-design-categories')
    const response = await GET()
    
    expect(response.status).toBe(200)
    
    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data).toHaveLength(4)
    
    // Check that all required categories are present
    const categoryNames = data.map((cat: any) => cat.name)
    expect(categoryNames).toContain('Distributed Systems & Infrastructure')
    expect(categoryNames).toContain('Data & AI/ML Systems')
    expect(categoryNames).toContain('Real-time & Communication Systems')
    expect(categoryNames).toContain('Product & Platform Systems')
  })

  it('should return categories with correct structure', async () => {
    const request = new NextRequest('http://localhost:3000/api/system-design-categories')
    const response = await GET()
    const data = await response.json()
    
    data.forEach((category: any) => {
      expect(category).toHaveProperty('id')
      expect(category).toHaveProperty('name')
      expect(category).toHaveProperty('description')
      expect(category).toHaveProperty('count')
      expect(typeof category.id).toBe('string')
      expect(typeof category.name).toBe('string')
      expect(typeof category.description).toBe('string')
      expect(typeof category.count).toBe('number')
    })
  })
})
