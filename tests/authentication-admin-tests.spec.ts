
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PREVIEW_URL || 'http://localhost:3000';

test.describe('Authentication and Admin Tests', () => {
  test('should test complete authentication flow', async ({ page }) => {
    // Test login page loads
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    
    const pageContent = await page.textContent('body');
    expect(pageContent).toContain('Sign In');
    
    // Test invalid credentials
    await page.fill('input[name="username"]', 'invalid');
    await page.fill('input[name="password"]', 'invalid');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Should show error or stay on login page
    const currentUrl = page.url();
    expect(currentUrl).toContain('/login');
    
    // Test valid admin login
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'adminadmin');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await page.waitForURL(`${BASE_URL}/dashboard`);
    expect(page.url()).toBe(`${BASE_URL}/dashboard`);
    
    // Verify admin is logged in
    const dashboardContent = await page.textContent('body');
    expect(dashboardContent).toContain('admin');
  });

  test('should test admin dashboard access', async ({ page }) => {
    // Login as admin
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'adminadmin');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`);
    
    // Navigate to admin page
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('networkidle');
    
    // Verify admin page loads without errors
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain('404');
    expect(pageContent).not.toContain('Access Denied');
    expect(pageContent).not.toContain('Unauthorized');
  });

  test('should test admin functionality', async ({ page }) => {
    // Login as admin
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'adminadmin');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`);
    
    // Test admin page features
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForLoadState('networkidle');
    
    // Look for admin-specific elements
    const adminElements = [
      'Users',
      'Statistics',
      'Activity',
      'Management',
      'Admin'
    ];
    
    const pageContent = await page.textContent('body');
    let foundAdminElements = 0;
    
    for (const element of adminElements) {
      if (pageContent.includes(element)) {
        foundAdminElements++;
      }
    }
    
    // Should find at least some admin elements
    expect(foundAdminElements).toBeGreaterThan(0);
  });

  test('should test logout functionality', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'adminadmin');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`);
    
    // Find and click logout button
    const logoutButton = page.locator('button:has([data-testid="logout"]), button:has-text("logout"), [title="logout"]').first();
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      await page.waitForTimeout(2000);
      
      // Should redirect to login page
      const currentUrl = page.url();
      expect(currentUrl).toContain('/login');
    }
  });

  test('should test regular user access restrictions', async ({ page }) => {
    // Try to access admin page without login
    await page.goto(`${BASE_URL}/admin`);
    
    // Should redirect to login
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    expect(currentUrl).toContain('/login');
  });

  test('should test session persistence', async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'adminadmin');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`);
    
    // Navigate to different pages and verify session persists
    const protectedPages = [
      '/dashboard',
      '/question-bank',
      '/stories',
      '/admin'
    ];
    
    for (const pagePath of protectedPages) {
      await page.goto(`${BASE_URL}${pagePath}`);
      await page.waitForLoadState('networkidle');
      
      // Should not redirect to login
      const currentUrl = page.url();
      expect(currentUrl).not.toContain('/login');
      expect(currentUrl).toContain(pagePath);
    }
  });
});
