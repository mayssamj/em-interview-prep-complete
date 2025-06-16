
import { test, expect } from '@playwright/test';

test.describe('EM Interview Prep - Comprehensive E2E Tests', () => {
  
  test('should load login page successfully', async ({ page }) => {
    await page.goto('/login');
    
    // Check that login page loads
    await expect(page.locator('input[placeholder="Username"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });

  test('should login successfully with admin credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill login form
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'adminadmin');
    
    // Click login button
    await page.click('button:has-text("Sign In")');
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard', { timeout: 10000 });
    
    // Verify we're on dashboard
    await expect(page).toHaveURL('/dashboard');
  });

  test('should navigate to all main pages without errors', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'adminadmin');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('/dashboard');
    
    // Test main pages
    const pages = [
      '/dashboard',
      '/question-bank',
      '/system-design-questions',
      '/system-design-strategy',
      '/stories',
      '/company-values',
      '/interview-strategy',
      '/progress-tracker'
    ];

    for (const url of pages) {
      await page.goto(url);
      await expect(page).toHaveURL(url);
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check for common error messages
      const errorSelectors = [
        'text=Failed to fetch',
        'text=Cannot read properties of undefined',
        'text=Error:',
        'text=500',
        'text=404'
      ];
      
      for (const selector of errorSelectors) {
        await expect(page.locator(selector)).not.toBeVisible();
      }
    }
  });

  test('should test header navigation links', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'adminadmin');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('/dashboard');
    
    // Test navigation links in header
    const navLinks = [
      { text: 'Dashboard', url: '/dashboard' },
      { text: 'Question Bank', url: '/question-bank' },
      { text: 'System Design', url: '/system-design-questions' },
      { text: 'Stories', url: '/stories' },
      { text: 'Company Values', url: '/company-values' }
    ];

    for (const link of navLinks) {
      // Click the navigation link
      await page.click(`text=${link.text}`);
      
      // Wait for navigation
      await page.waitForURL(link.url, { timeout: 5000 });
      
      // Verify URL
      await expect(page).toHaveURL(link.url);
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
    }
  });

  test('should test demo login buttons', async ({ page }) => {
    await page.goto('/login');
    
    // Test demo user login button
    if (await page.locator('button:has-text("Demo User Login")').isVisible()) {
      await page.click('button:has-text("Demo User Login")');
      await page.waitForURL('/dashboard', { timeout: 10000 });
      await expect(page).toHaveURL('/dashboard');
      
      // Logout and test admin demo
      await page.goto('/login');
    }
    
    // Test admin demo login button
    if (await page.locator('button:has-text("Admin Demo Login")').isVisible()) {
      await page.click('button:has-text("Admin Demo Login")');
      await page.waitForURL('/dashboard', { timeout: 10000 });
      await expect(page).toHaveURL('/dashboard');
    }
  });

  test('should handle invalid login credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Try invalid credentials
    await page.fill('input[placeholder="Username"]', 'invalid');
    await page.fill('input[placeholder="Password"]', 'invalid');
    await page.click('button:has-text("Sign In")');
    
    // Should stay on login page or show error
    await page.waitForTimeout(2000);
    
    // Should either stay on login page or show error message
    const currentUrl = page.url();
    const isOnLogin = currentUrl.includes('/login');
    const hasErrorMessage = await page.locator('text=Invalid credentials').isVisible() ||
                           await page.locator('text=Error').isVisible();
    
    expect(isOnLogin || hasErrorMessage).toBeTruthy();
  });

  test('should test API endpoints availability', async ({ request }) => {
    // Test key API endpoints
    const endpoints = [
      '/api/companies',
      '/api/questions', 
      '/api/system-design-frameworks',
      '/api/system-design-questions'
    ];

    for (const endpoint of endpoints) {
      const response = await request.get(endpoint);
      
      // Should return 200 or at least not 404/500
      expect([200, 401, 403]).toContain(response.status());
    }
  });

  test('should verify page titles and basic content', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'adminadmin');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('/dashboard');
    
    // Test that pages have expected content
    const pageTests = [
      { url: '/dashboard', expectedText: 'Dashboard' },
      { url: '/question-bank', expectedText: 'Question Bank' },
      { url: '/system-design-questions', expectedText: 'System Design' },
      { url: '/stories', expectedText: 'Stories' },
      { url: '/company-values', expectedText: 'Company Values' }
    ];

    for (const test of pageTests) {
      await page.goto(test.url);
      await page.waitForLoadState('networkidle');
      
      // Check that page has expected content
      await expect(page.locator(`text=${test.expectedText}`)).toBeVisible();
    }
  });
});
