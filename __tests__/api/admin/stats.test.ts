
import { GET } from '@/app/api/admin/stats/route';
import { NextRequest } from 'next/server';
import * as auth from '@/lib/auth';

// Mock dependencies
jest.mock('@/lib/auth');
jest.mock('@/lib/db');

const mockAuth = auth as jest.Mocked<typeof auth>;
const mockPrisma = {
  users: {
    count: jest.fn(),
    findMany: jest.fn(),
  },
  stories: {
    count: jest.fn(),
  },
  questions: {
    count: jest.fn(),
  },
  companies: {
    count: jest.fn(),
  },
};

jest.mock('@/lib/db', () => ({
  prisma: mockPrisma,
}));

describe('/api/admin/stats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return admin stats for admin user', async () => {
    const mockAdminUser = {
      id: 'admin1',
      username: 'admin',
      isAdmin: true,
    };

    const mockRecentUsers = [
      {
        id: 'user1',
        username: 'user1',
        is_admin: false,
        created_at: new Date(),
      },
    ];

    mockAuth.getSession.mockResolvedValue(mockAdminUser);
    mockPrisma.users.count.mockResolvedValue(10);
    mockPrisma.stories.count.mockResolvedValue(5);
    mockPrisma.questions.count.mockResolvedValue(100);
    mockPrisma.companies.count.mockResolvedValue(15);
    mockPrisma.users.findMany.mockResolvedValue(mockRecentUsers);

    const request = new NextRequest('http://localhost:3000/api/admin/stats');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.userCount).toBe(10);
    expect(data.storyCount).toBe(5);
    expect(data.questionCount).toBe(100);
    expect(data.companyCount).toBe(15);
    expect(data.recentUsers).toEqual(mockRecentUsers);
  });

  it('should return 401 for non-admin user', async () => {
    const mockUser = {
      id: 'user1',
      username: 'user',
      isAdmin: false,
    };

    mockAuth.getSession.mockResolvedValue(mockUser);

    const request = new NextRequest('http://localhost:3000/api/admin/stats');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 401 for unauthenticated user', async () => {
    mockAuth.getSession.mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/admin/stats');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should handle database errors', async () => {
    const mockAdminUser = {
      id: 'admin1',
      username: 'admin',
      isAdmin: true,
    };

    mockAuth.getSession.mockResolvedValue(mockAdminUser);
    mockPrisma.users.count.mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/admin/stats');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});
