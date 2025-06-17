
import { NextRequest } from 'next/server';

export const createMockRequest = (
  url: string,
  options: {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    cookies?: Record<string, string>;
  } = {}
): NextRequest => {
  const { method = 'GET', body, headers = {}, cookies = {} } = options;

  // Convert cookies to cookie header
  if (Object.keys(cookies).length > 0) {
    headers.cookie = Object.entries(cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');
  }

  const requestInit: RequestInit = {
    method,
    headers,
  };

  if (body) {
    requestInit.body = typeof body === 'string' ? body : JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  }

  return new NextRequest(url, requestInit);
};

export const createMockUser = (overrides: any = {}) => ({
  id: 'mock-user-id',
  username: 'testuser',
  password_hash: 'hashedpassword',
  is_admin: false,
  preferences: null,
  created_at: new Date(),
  updated_at: new Date(),
  ...overrides,
});

export const createMockAdminUser = (overrides: any = {}) => ({
  id: 'mock-admin-id',
  username: 'admin',
  password_hash: 'hashedpassword',
  is_admin: true,
  preferences: null,
  created_at: new Date(),
  updated_at: new Date(),
  ...overrides,
});

export const mockPrismaResponse = (data: any) => {
  return Promise.resolve(data);
};

export const mockPrismaError = (error: string) => {
  return Promise.reject(new Error(error));
};

export const expectJsonResponse = async (
  response: Response,
  expectedStatus: number,
  expectedData?: any
) => {
  expect(response.status).toBe(expectedStatus);
  
  if (expectedData) {
    const data = await response.json();
    expect(data).toMatchObject(expectedData);
    return data;
  }
  
  return await response.json();
};

export const createMockStory = (overrides: any = {}) => ({
  id: 'mock-story-id',
  title: 'Test Story',
  situation: 'Test situation',
  task: 'Test task',
  action: 'Test action',
  result: 'Test result',
  user_id: 'mock-user-id',
  created_at: new Date(),
  updated_at: new Date(),
  ...overrides,
});

export const createMockQuestion = (overrides: any = {}) => ({
  id: 'mock-question-id',
  question: 'Test question?',
  category: 'behavioral',
  difficulty: 'medium',
  company_id: 'mock-company-id',
  created_at: new Date(),
  updated_at: new Date(),
  ...overrides,
});

export const createMockCompany = (overrides: any = {}) => ({
  id: 'mock-company-id',
  name: 'Test Company',
  industry: 'Technology',
  size: 'Large',
  description: 'Test company description',
  values: ['Innovation', 'Excellence'],
  interview_process: ['Phone Screen', 'Technical Interview'],
  created_at: new Date(),
  updated_at: new Date(),
  ...overrides,
});
