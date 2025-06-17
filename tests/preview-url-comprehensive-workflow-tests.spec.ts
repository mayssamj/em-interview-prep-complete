
import { test, expect } from '@playwright/test';

const PREVIEW_URL = 'https://125d7b9e76-3000.preview.abacusai.app';

test.describe('Preview URL Comprehensive Workflow Tests', () => {
  test('should complete full user workflow', async ({ page }) => {
    // 1. Login
    await page.goto(PREVIEW_URL);
    await page.click('text=Demo User Login');
    await expect(page).toHaveURL(/dashboard/);
    
    // 2. Navigate to question bank
    await page.goto(`${PREVIEW_URL}/question-bank`);
    await expect(page.locator('text=Question Bank')).toBeVisible();
    
    // 3. Navigate to stories
    await page.goto(`${PREVIEW_URL}/stories`);
    await expect(page.locator('text=Stories')).toBeVisible();
    
    // 4. Navigate to company values
    await page.goto(`${PREVIEW_URL}/company-values`);
    await expect(page.locator('text=Company Values')).toBeVisible();
    
    // 5. Navigate to system design
    await page.goto(`${PREVIEW_URL}/system-design-questions`);
    await expect(page.locator('text=System Design')).toBeVisible();
    
    // 6. Navigate to progress tracker
    await page.goto(`${PREVIEW_URL}/progress-tracker`);
    await expect(page.locator('text=Progress')).toBeVisible();
    
    // 7. Logout
    await page.click('text=Logout');
    await expect(page).toHaveURL(/login/);
  });

  test('should complete admin workflow', async ({ page }) => {
    // 1. Login as admin
    await page.goto(PREVIEW_URL);
    await page.click('text=Admin Demo Login');
    await expect(page).toHaveURL(/dashboard/);
    
    // 2. Access admin panel
    await page.goto(`${PREVIEW_URL}/admin`);
    await expect(page.locator('text=Admin')).toBeVisible();
    
    // 3. Navigate through other sections
    await page.goto(`${PREVIEW_URL}/question-bank`);
    await expect(page.locator('text=Question Bank')).toBeVisible();
    
    // 4. Logout
    await page.click('text=Logout');
    await expect(page).toHaveURL(/login/);
  });

  test('should handle API endpoints correctly', async ({ page }) => {
    // Login first
    await page.goto(PREVIEW_URL);
    await page.click('text=Demo User Login');
    await expect(page).toHaveURL(/dashboard/);
    
    // Test various API endpoints
    const apiTests = [
      { endpoint: '/api/health', expectedStatus: 200 },
      { endpoint: '/api/companies', expectedStatus: 200 },
      { endpoint: '/api/questions', expectedStatus: 200 },
      { endpoint: '/api/stories', expectedStatus: 200 },
      { endpoint: '/api/system-design-questions', expectedStatus: 200 }
    ];
    
    for (const apiTest of apiTests) {
      const response = await page.request.get(`${PREVIEW_URL}${apiTest.endpoint}`);
      expect(response.status()).toBe(apiTest.expectedStatus);
    }
  });

  test('should handle error scenarios gracefully', async ({ page }) => {
    // Test 404 page
    await page.goto(`${PREVIEW_URL}/nonexistent-page`);
    // Should show some kind of error or redirect
    
    // Test unauthorized access
    await page.goto(`${PREVIEW_URL}/admin`);
    // Should redirect to login or show unauthorized message
    await expect(page).toHaveURL(/login/);
  });

  test('should maintain session across page navigation', async ({ page }) => {
    // Login
    await page.goto(PREVIEW_URL);
    await page.click('text=Demo User Login');
    await expect(page).toHaveURL(/dashboard/);
    
    // Navigate to multiple pages and ensure session is maintained
    const pages = ['/question-bank', '/stories', '/company-values', '/dashboard'];
    
    for (const pagePath of pages) {
      await page.goto(`${PREVIEW_URL}${pagePath}`);
      // Should not redirect to login
      await expect(page).not.toHaveURL(/login/);
    }
  });
});
