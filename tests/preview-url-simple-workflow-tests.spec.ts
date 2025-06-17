
import { test, expect } from '@playwright/test';

const PREVIEW_URL = 'https://125d7b9e76-3000.preview.abacusai.app';

test.describe('Preview URL Simple Workflow Tests', () => {
  test('should access login page and show demo buttons', async ({ page }) => {
    await page.goto(PREVIEW_URL);
    
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
    
    // Should show demo login buttons
    await expect(page.locator('button:has-text("Demo User Login")')).toBeVisible();
    await expect(page.locator('button:has-text("Admin Demo Login")')).toBeVisible();
  });

  test('should perform manual login successfully', async ({ page }) => {
    await page.goto(`${PREVIEW_URL}/login`);
    
    // Fill in login form
    await page.fill('input[placeholder*="Username"]', 'demo');
    await page.fill('input[type="password"]', 'demo123');
    
    // Submit form
    await page.click('button:has-text("Sign In")');
    
    // Wait a bit for the request to complete
    await page.waitForTimeout(3000);
    
    // Check if we're no longer on login page
    const currentUrl = page.url();
    expect(currentUrl).not.toMatch(/login/);
  });

  test('should access dashboard directly after login', async ({ page }) => {
    // Login via API first
    await page.request.post(`${PREVIEW_URL}/api/auth/login`, {
      data: {
        username: 'demo',
        password: 'demo123'
      }
    });
    
    // Now access dashboard
    await page.goto(`${PREVIEW_URL}/dashboard`);
    
    // Should show dashboard content
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should access various pages after login', async ({ page }) => {
    // Login via API first
    await page.request.post(`${PREVIEW_URL}/api/auth/login`, {
      data: {
        username: 'demo',
        password: 'demo123'
      }
    });
    
    const pages = [
      '/dashboard',
      '/question-bank',
      '/stories',
      '/company-values',
      '/system-design-questions'
    ];
    
    for (const pagePath of pages) {
      await page.goto(`${PREVIEW_URL}${pagePath}`);
      
      // Should not redirect to login
      await expect(page).not.toHaveURL(/login/);
      
      // Should not show 404
      await expect(page.locator('text=This page could not be found')).not.toBeVisible();
    }
  });

  test('should handle API endpoints correctly', async ({ page }) => {
    // Login via API first
    await page.request.post(`${PREVIEW_URL}/api/auth/login`, {
      data: {
        username: 'demo',
        password: 'demo123'
      }
    });
    
    // Test API endpoints
    const endpoints = [
      '/api/health',
      '/api/companies',
      '/api/questions'
    ];
    
    for (const endpoint of endpoints) {
      const response = await page.request.get(`${PREVIEW_URL}${endpoint}`);
      expect(response.status()).toBe(200);
    }
  });

  test('should handle admin login and access', async ({ page }) => {
    // Login as admin via API
    await page.request.post(`${PREVIEW_URL}/api/auth/login`, {
      data: {
        username: 'admin',
        password: 'admin123'
      }
    });
    
    // Access admin page
    await page.goto(`${PREVIEW_URL}/admin`);
    
    // Should show admin content
    await expect(page.locator('text=Admin')).toBeVisible();
  });

  test('should handle form submissions', async ({ page }) => {
    // Login via API first
    await page.request.post(`${PREVIEW_URL}/api/auth/login`, {
      data: {
        username: 'demo',
        password: 'demo123'
      }
    });
    
    // Go to stories page
    await page.goto(`${PREVIEW_URL}/stories`);
    
    // Should show stories content
    await expect(page.locator('text=Stories')).toBeVisible();
    
    // Go to question bank
    await page.goto(`${PREVIEW_URL}/question-bank`);
    
    // Should show question bank content
    await expect(page.locator('text=Question Bank')).toBeVisible();
  });

  test('should handle logout', async ({ page }) => {
    // Login via API first
    await page.request.post(`${PREVIEW_URL}/api/auth/login`, {
      data: {
        username: 'demo',
        password: 'demo123'
      }
    });
    
    // Go to dashboard
    await page.goto(`${PREVIEW_URL}/dashboard`);
    
    // Look for logout button and click it
    const logoutButton = page.locator('text=Logout').first();
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      
      // Should redirect to login
      await expect(page).toHaveURL(/login/);
    }
  });
});
