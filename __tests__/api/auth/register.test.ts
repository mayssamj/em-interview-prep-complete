
import { POST } from '@/app/api/auth/register/route';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

// Mock dependencies
jest.mock('@/lib/db');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('uuid');

const mockPrisma = {
  users: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

jest.mock('@/lib/db', () => ({
  prisma: mockPrisma,
}));

const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = require('jsonwebtoken');
const mockUuid = require('uuid');

describe('/api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUuid.v4.mockReturnValue('mock-uuid');
    mockBcrypt.hash.mockResolvedValue('hashedpassword' as never);
    mockJwt.sign.mockReturnValue('mock-token');
  });

  it('should register successfully with valid data', async () => {
    const mockUser = {
      id: 'mock-uuid',
      username: 'newuser',
      password_hash: 'hashedpassword',
      is_admin: false,
      preferences: { email: 'test@example.com' },
      created_at: new Date(),
      updated_at: new Date(),
    };

    mockPrisma.users.findUnique.mockResolvedValue(null);
    mockPrisma.users.create.mockResolvedValue(mockUser);

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'newuser',
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Registration successful');
    expect(data.user.username).toBe('newuser');
    expect(mockPrisma.users.create).toHaveBeenCalledWith({
      data: {
        id: 'mock-uuid',
        username: 'newuser',
        password_hash: 'hashedpassword',
        preferences: { email: 'test@example.com' },
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      },
    });
  });

  it('should register without email', async () => {
    const mockUser = {
      id: 'mock-uuid',
      username: 'newuser',
      password_hash: 'hashedpassword',
      is_admin: false,
      preferences: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    mockPrisma.users.findUnique.mockResolvedValue(null);
    mockPrisma.users.create.mockResolvedValue(mockUser);

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'newuser',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Registration successful');
    expect(mockPrisma.users.create).toHaveBeenCalledWith({
      data: {
        id: 'mock-uuid',
        username: 'newuser',
        password_hash: 'hashedpassword',
        preferences: null,
        created_at: expect.any(Date),
        updated_at: expect.any(Date),
      },
    });
  });

  it('should return 400 for missing username', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Username and password are required');
  });

  it('should return 400 for invalid email', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'newuser',
        email: 'invalid-email',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid email format');
  });

  it('should return 400 for short password', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'newuser',
        password: '123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Password must be at least 6 characters long');
  });

  it('should return 409 for existing username', async () => {
    mockPrisma.users.findUnique.mockResolvedValue({
      id: 'existing-user',
      username: 'existinguser',
    });

    const request = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'existinguser',
        password: 'password123',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe('Username already exists');
  });
});
