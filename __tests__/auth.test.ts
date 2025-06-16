
import { verifyToken, createToken, getServerSession } from '@/lib/auth'
import { NextRequest } from 'next/server'

// Mock JWT
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
  sign: jest.fn(),
}))

describe('Authentication Functions', () => {
  describe('verifyToken', () => {
    it('should return null when no token is provided', async () => {
      const mockRequest = {
        cookies: {
          get: jest.fn().mockReturnValue(undefined),
        },
      } as unknown as NextRequest

      const result = await verifyToken(mockRequest)
      expect(result).toBeNull()
    })

    it('should return user data when valid token is provided', async () => {
      const jwt = require('jsonwebtoken')
      const mockRequest = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: 'valid-token' }),
        },
      } as unknown as NextRequest

      jwt.verify.mockReturnValue({
        userId: 'user-123',
        username: 'testuser',
        isAdmin: false,
      })

      const result = await verifyToken(mockRequest)
      expect(result).toEqual({
        id: 'user-123',
        username: 'testuser',
        isAdmin: false,
      })
    })
  })

  describe('createToken', () => {
    it('should create a token with user data', () => {
      const jwt = require('jsonwebtoken')
      jwt.sign.mockReturnValue('mock-token')

      const user = {
        id: 'user-123',
        username: 'testuser',
        isAdmin: false,
      }

      const token = createToken(user)
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          userId: user.id,
          username: user.username,
          isAdmin: user.isAdmin,
        },
        expect.any(String),
        { expiresIn: '24h' }
      )
      expect(token).toBe('mock-token')
    })
  })
})
