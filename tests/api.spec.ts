
import { test, expect } from '@playwright/test';

test.describe('API Endpoints', () => {
  test('should return system design questions', async ({ request }) => {
    const response = await request.get('/api/system-design-questions');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('should return system design frameworks', async ({ request }) => {
    const response = await request.get('/api/system-design-frameworks');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  test('should return companies', async ({ request }) => {
    const response = await request.get('/api/companies');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.companies).toBeDefined();
    expect(Array.isArray(data.companies)).toBe(true);
    expect(data.companies.length).toBeGreaterThan(0);
  });

  test('should return questions', async ({ request }) => {
    const response = await request.get('/api/questions?questionType=behavioral');
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
  });

  test('should handle login API', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        username: 'admin',
        password: 'adminadmin'
      }
    });
    
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data.message).toBe('Login successful');
    expect(data.user.username).toBe('admin');
  });

  test('should handle invalid login', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        username: 'invalid',
        password: 'invalid'
      }
    });
    
    expect(response.status()).toBe(401);
  });
});
