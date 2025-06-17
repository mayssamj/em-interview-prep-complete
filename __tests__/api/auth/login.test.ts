
import { POST } from '@/app/api/auth/login/route';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

// Mock dependencies
jest.mock('@/lib/db');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

const mockPrisma = {
  users: {
    findUnique: jest.fn(),
  },
};

jest.mock('@/lib/db', () => ({
  prisma: mockPrisma,
}));

const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = require('jsonwebtoken');

describe('/api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login successfully with valid credentials', async () => {
    const mockUser = {
      id: 'user1',
      username: 'testuser',
      password_hash: 'hashedpassword',
      is_admin: false,
    };

    mockPrisma.users.findUnique.mockResolvedValue(mockUser);
    mockBcrypt.compare.mockResolvedValue(true as never);
    mockJwt.sign.mockReturnValue('mock-token');

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Login successful');
    expect(data.user.username).toBe('testuser');
    expect(mockPrisma.users.findUnique).toHaveBeenCalledWith({
      where: { username: 'testuser' },
    });
  });

  it('should return 400 for missing credentials', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Username and password are required');
  });

  it('should return 401 for invalid username', async () => {
    mockPrisma.users.findUnique.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'nonexistent',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Invalid credentials');
  });

  it('should return 401 for invalid password', async () => {
    const mockUser = {
      id: 'user1',
      username: 'testuser',
      password_hash: 'hashedpassword',
      is_admin: false,
    };

    mockPrisma.users.findUnique.mockResolvedValue(mockUser);
    mockBcrypt.compare.mockResolvedValue(false as never);

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser',
        password: 'wrongpassword',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Invalid credentials');
  });

  it('should handle database errors', async () => {
    mockPrisma.users.findUnique.mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});
