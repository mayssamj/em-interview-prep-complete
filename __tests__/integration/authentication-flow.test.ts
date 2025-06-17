
import { NextRequest } from 'next/server';
import { POST as loginPost } from '@/app/api/auth/login/route';
import { POST as registerPost } from '@/app/api/auth/register/route';
import { GET as meGet } from '@/app/api/auth/me/route';

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

const mockBcrypt = require('bcryptjs');
const mockJwt = require('jsonwebtoken');
const mockUuid = require('uuid');

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUuid.v4.mockReturnValue('mock-uuid');
    mockBcrypt.hash.mockResolvedValue('hashedpassword');
    mockBcrypt.compare.mockResolvedValue(true);
    mockJwt.sign.mockReturnValue('mock-token');
    mockJwt.verify.mockReturnValue({
      userId: 'mock-uuid',
      username: 'testuser',
      isAdmin: false,
    });
  });

  it('should complete full registration and login flow', async () => {
    // Step 1: Register new user
    const mockUser = {
      id: 'mock-uuid',
      username: 'testuser',
      password_hash: 'hashedpassword',
      is_admin: false,
      preferences: { email: 'test@example.com' },
      created_at: new Date(),
      updated_at: new Date(),
    };

    mockPrisma.users.findUnique.mockResolvedValueOnce(null); // User doesn't exist
    mockPrisma.users.create.mockResolvedValue(mockUser);

    const registerRequest = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    const registerResponse = await registerPost(registerRequest);
    const registerData = await registerResponse.json();

    expect(registerResponse.status).toBe(200);
    expect(registerData.message).toBe('Registration successful');
    expect(registerData.user.username).toBe('testuser');

    // Step 2: Login with registered user
    mockPrisma.users.findUnique.mockResolvedValueOnce(mockUser);

    const loginRequest = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'testuser',
        password: 'password123',
      }),
    });

    const loginResponse = await loginPost(loginRequest);
    const loginData = await loginResponse.json();

    expect(loginResponse.status).toBe(200);
    expect(loginData.message).toBe('Login successful');
    expect(loginData.user.username).toBe('testuser');

    // Step 3: Verify session with /me endpoint
    mockPrisma.users.findUnique.mockResolvedValueOnce(mockUser);

    const meRequest = new NextRequest('http://localhost:3000/api/auth/me', {
      headers: {
        cookie: 'token=mock-token',
      },
    });

    const meResponse = await meGet(meRequest);
    const meData = await meResponse.json();

    expect(meResponse.status).toBe(200);
    expect(meData.user.username).toBe('testuser');
    expect(meData.user.isAdmin).toBe(false);
  });

  it('should handle admin user flow', async () => {
    const mockAdminUser = {
      id: 'admin-uuid',
      username: 'admin',
      password_hash: 'hashedpassword',
      is_admin: true,
      preferences: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    mockPrisma.users.findUnique.mockResolvedValue(mockAdminUser);
    mockJwt.verify.mockReturnValue({
      userId: 'admin-uuid',
      username: 'admin',
      isAdmin: true,
    });

    const loginRequest = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'admin',
        password: 'adminadmin',
      }),
    });

    const loginResponse = await loginPost(loginRequest);
    const loginData = await loginResponse.json();

    expect(loginResponse.status).toBe(200);
    expect(loginData.user.isAdmin).toBe(true);

    // Verify admin session
    const meRequest = new NextRequest('http://localhost:3000/api/auth/me', {
      headers: {
        cookie: 'token=mock-token',
      },
    });

    const meResponse = await meGet(meRequest);
    const meData = await meResponse.json();

    expect(meResponse.status).toBe(200);
    expect(meData.user.isAdmin).toBe(true);
  });

  it('should prevent duplicate registration', async () => {
    const existingUser = {
      id: 'existing-uuid',
      username: 'existinguser',
      password_hash: 'hashedpassword',
      is_admin: false,
    };

    mockPrisma.users.findUnique.mockResolvedValue(existingUser);

    const registerRequest = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        username: 'existinguser',
        password: 'password123',
      }),
    });

    const registerResponse = await registerPost(registerRequest);
    const registerData = await registerResponse.json();

    expect(registerResponse.status).toBe(409);
    expect(registerData.error).toBe('Username already exists');
  });
});
