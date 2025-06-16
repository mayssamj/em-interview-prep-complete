
import { POST as loginHandler } from '@/app/api/auth/login/route'
import { NextRequest } from 'next/server'

// Mock bcryptjs
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}))

// Mock the database
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
  },
}

jest.mock('@/lib/db', () => ({
  prisma: mockPrisma,
}))

describe('/api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return error for invalid credentials', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'invalid',
        password: 'invalid',
      }),
    })

    const response = await loginHandler(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Invalid credentials')
  })

  it('should return success for valid credentials', async () => {
    const bcrypt = require('bcryptjs')
    bcrypt.compare.mockResolvedValue(true)

    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'user-123',
      username: 'admin',
      password_hash: 'hashed-password',
      is_admin: true,
    })

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'admin',
        password: 'adminadmin',
      }),
    })

    const response = await loginHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBe('Login successful')
    expect(data.user.username).toBe('admin')
  })
})
