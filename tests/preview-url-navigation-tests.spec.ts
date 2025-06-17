
import { test, expect } from '@playwright/test';

const PREVIEW_URL = 'https://125d7b9e76-3000.preview.abacusai.app';

test.describe('Preview URL Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(PREVIEW_URL);
    await page.click('text=Demo User Login');
    await expect(page).toHaveURL(/dashboard/);
  });

  const routes = [
    { name: 'Dashboard', path: '/dashboard', text: 'Dashboard' },
    { name: 'Company Values', path: '/company-values', text: 'Company Values' },
    { name: 'Question Bank', path: '/question-bank', text: 'Question Bank' },
    { name: 'System Design Questions', path: '/system-design-questions', text: 'System Design' },
    { name: 'System Design Strategy', path: '/system-design-strategy', text: 'System Design Strategy' },
    { name: 'Story Templates', path: '/story-templates', text: 'Story Templates' },
    { name: 'Interview Strategy', path: '/interview-strategy', text: 'Interview Strategy' },
    { name: 'Progress Tracker', path: '/progress-tracker', text: 'Progress Tracker' },
    { name: 'Stories', path: '/stories', text: 'Stories' },
    { name: 'FAQ', path: '/faq', text: 'FAQ' }
  ];

  for (const route of routes) {
    test(`should navigate to ${route.name} successfully`, async ({ page }) => {
      await page.goto(`${PREVIEW_URL}${route.path}`);
      
      // Should not show 404 error
      await expect(page.locator('text=This page could not be found')).not.toBeVisible();
      await expect(page.locator('text=404')).not.toBeVisible();
      
      // Should show expected content
      await expect(page.locator(`text=${route.text}`)).toBeVisible();
    });
  }

  test('should handle /my-stories redirect', async ({ page }) => {
    await page.goto(`${PREVIEW_URL}/my-stories`);
    
    // Should redirect to /stories
    await expect(page).toHaveURL(/stories/);
    await expect(page.locator('text=Stories')).toBeVisible();
  });

  test('should access admin page with admin user', async ({ page }) => {
    // Logout and login as admin
    await page.click('text=Logout');
    await page.goto(PREVIEW_URL);
    await page.click('text=Admin Demo Login');
    
    // Navigate to admin page
    await page.goto(`${PREVIEW_URL}/admin`);
    await expect(page.locator('text=Admin')).toBeVisible();
  });
});
