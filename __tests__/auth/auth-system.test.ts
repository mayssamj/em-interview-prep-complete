
import { getSession, createToken, requireAuth, requireAdmin } from '@/lib/auth';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock the database
const mockUser = {
  id: 'user-123',
  username: 'testuser',
  is_admin: false,
  preferences: { email: 'test@example.com' },
};

const mockAdminUser = {
  id: 'admin-123',
  username: 'admin',
  is_admin: true,
  preferences: { email: 'admin@example.com' },
};

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    users: {
      findUnique: jest.fn(),
    },
  },
}));

const { prisma } = require('@/lib/db');

describe('Authentication System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret-key';
  });

  describe('Token Creation', () => {
    it('should create valid JWT token', () => {
      const user = { id: 'user-123', username: 'testuser', isAdmin: false };
      const token = createToken(user);
      
      expect(typeof token).toBe('string');
      
      const decoded = jwt.verify(token, 'test-secret-key') as any;
      expect(decoded.userId).toBe(user.id);
      expect(decoded.username).toBe(user.username);
      expect(decoded.isAdmin).toBe(user.isAdmin);
    });

    it('should include expiration in token', () => {
      const user = { id: 'user-123', username: 'testuser', isAdmin: false };
      const token = createToken(user);
      
      const decoded = jwt.verify(token, 'test-secret-key') as any;
      expect(decoded.exp).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(Date.now() / 1000);
    });
  });

  describe('Session Validation', () => {
    it('should return null for missing token', async () => {
      const request = {
        cookies: {
          get: jest.fn().mockReturnValue(undefined),
        },
      } as unknown as NextRequest;

      const session = await getSession(request);
      expect(session).toBeNull();
    });

    it('should return null for invalid token', async () => {
      const request = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: 'invalid-token' }),
        },
      } as unknown as NextRequest;

      const session = await getSession(request);
      expect(session).toBeNull();
    });

    it('should return user for valid token', async () => {
      const token = createToken({ id: 'user-123', username: 'testuser', isAdmin: false });
      const request = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: token }),
        },
      } as unknown as NextRequest;

      prisma.users.findUnique.mockResolvedValue(mockUser);

      const session = await getSession(request);
      expect(session).toEqual({
        id: 'user-123',
        username: 'testuser',
        isAdmin: false,
        email: 'test@example.com',
      });
    });

    it('should return null if user not found in database', async () => {
      const token = createToken({ id: 'user-123', username: 'testuser', isAdmin: false });
      const request = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: token }),
        },
      } as unknown as NextRequest;

      prisma.users.findUnique.mockResolvedValue(null);

      const session = await getSession(request);
      expect(session).toBeNull();
    });
  });

  describe('Authentication Requirements', () => {
    it('should throw error for unauthenticated request', async () => {
      const request = {
        cookies: {
          get: jest.fn().mockReturnValue(undefined),
        },
      } as unknown as NextRequest;

      await expect(requireAuth(request)).rejects.toThrow('Authentication required');
    });

    it('should return user for authenticated request', async () => {
      const token = createToken({ id: 'user-123', username: 'testuser', isAdmin: false });
      const request = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: token }),
        },
      } as unknown as NextRequest;

      prisma.users.findUnique.mockResolvedValue(mockUser);

      const user = await requireAuth(request);
      expect(user.id).toBe('user-123');
      expect(user.username).toBe('testuser');
    });
  });

  describe('Admin Requirements', () => {
    it('should throw error for non-admin user', async () => {
      const token = createToken({ id: 'user-123', username: 'testuser', isAdmin: false });
      const request = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: token }),
        },
      } as unknown as NextRequest;

      prisma.users.findUnique.mockResolvedValue(mockUser);

      await expect(requireAdmin(request)).rejects.toThrow('Admin access required');
    });

    it('should return admin user for admin request', async () => {
      const token = createToken({ id: 'admin-123', username: 'admin', isAdmin: true });
      const request = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: token }),
        },
      } as unknown as NextRequest;

      prisma.users.findUnique.mockResolvedValue(mockAdminUser);

      const user = await requireAdmin(request);
      expect(user.id).toBe('admin-123');
      expect(user.isAdmin).toBe(true);
    });
  });

  describe('Token Expiration', () => {
    it('should reject expired tokens', async () => {
      // Create an expired token
      const expiredToken = jwt.sign(
        { userId: 'user-123', username: 'testuser', isAdmin: false },
        'test-secret-key',
        { expiresIn: '-1h' } // Expired 1 hour ago
      );

      const request = {
        cookies: {
          get: jest.fn().mockReturnValue({ value: expiredToken }),
        },
      } as unknown as NextRequest;

      const session = await getSession(request);
      expect(session).toBeNull();
    });
  });
});
