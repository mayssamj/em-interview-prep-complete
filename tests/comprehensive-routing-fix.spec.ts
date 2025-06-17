
import { test, expect } from '@playwright/test';

// Configure tests to run against preview server URL
const BASE_URL = process.env.PREVIEW_URL || 'http://localhost:3000';

test.describe('Critical Routing Fixes', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin for all tests
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'adminadmin');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`);
  });

  test('should navigate to all header links without 404 errors', async ({ page }) => {
    const navigationRoutes = [
      { name: 'Dashboard', path: '/dashboard' },
      { name: 'Company Values', path: '/company-values' },
      { name: 'Behavioral Questions', path: '/question-bank' },
      { name: 'System Design', path: '/system-design-questions' },
      { name: 'SD Strategy', path: '/system-design-strategy' },
      { name: 'Story Templates', path: '/story-templates' },
      { name: 'Interview Strategy', path: '/interview-strategy' },
      { name: 'Progress Tracker', path: '/progress-tracker' },
      { name: 'FAQ', path: '/faq' },
      { name: 'Admin', path: '/admin' }
    ];

    for (const route of navigationRoutes) {
      console.log(`Testing route: ${route.name} (${route.path})`);
      
      // Navigate to the route
      await page.goto(`${BASE_URL}${route.path}`);
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check that we're not on a 404 page
      const pageContent = await page.textContent('body');
      expect(pageContent).not.toContain('404');
      expect(pageContent).not.toContain('Page Not Found');
      expect(pageContent).not.toContain('This page could not be found');
      
      // Check that the page has loaded successfully
      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title).not.toBe('');
    }
  });

  test('should handle my-stories route correctly', async ({ page }) => {
    // Test the my-stories route that was causing 404
    await page.goto(`${BASE_URL}/my-stories`);
    
    // Should redirect to /stories
    await page.waitForURL(`${BASE_URL}/stories`);
    
    // Verify we're on the stories page
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain('404');
    expect(pageContent).not.toContain('Page Not Found');
  });

  test('should test all story-related routes', async ({ page }) => {
    const storyRoutes = [
      '/stories',
      '/story-templates',
      '/my-stories' // This should redirect to /stories
    ];

    for (const route of storyRoutes) {
      console.log(`Testing story route: ${route}`);
      await page.goto(`${BASE_URL}${route}`);
      await page.waitForLoadState('networkidle');
      
      const pageContent = await page.textContent('body');
      expect(pageContent).not.toContain('404');
      expect(pageContent).not.toContain('Page Not Found');
    }
  });

  test('should verify header navigation links work', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Test clicking each navigation button in the header
    const navButtons = [
      'Company Values',
      'Behavioral Questions', 
      'System Design',
      'SD Strategy',
      'Story Templates',
      'Interview Strategy',
      'Progress Tracker',
      'FAQ'
    ];

    for (const buttonText of navButtons) {
      console.log(`Testing header button: ${buttonText}`);
      
      // Go back to dashboard first
      await page.goto(`${BASE_URL}/dashboard`);
      await page.waitForLoadState('networkidle');
      
      // Find and click the button
      const button = page.locator('button', { hasText: buttonText }).first();
      if (await button.isVisible()) {
        await button.click();
        await page.waitForLoadState('networkidle');
        
        // Verify no 404 error
        const pageContent = await page.textContent('body');
        expect(pageContent).not.toContain('404');
        expect(pageContent).not.toContain('Page Not Found');
      }
    }
  });
});
