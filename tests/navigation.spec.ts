
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'adminadmin');
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should navigate to all main pages without errors', async ({ page }) => {
    const pages = [
      { url: '/dashboard', title: 'Dashboard' },
      { url: '/question-bank', title: 'Question Bank' },
      { url: '/system-design-questions', title: 'System Design Questions' },
      { url: '/story-templates', title: 'Story Templates' },
      { url: '/company-values', title: 'Company Values' },
      { url: '/system-design-strategy', title: 'System Design Strategy' },
      { url: '/interview-strategy', title: 'Interview Strategy' },
      { url: '/progress-tracker', title: 'Progress Tracker' },
      { url: '/interview-notes', title: 'Interview Notes' },
      { url: '/faq', title: 'FAQ' }
    ];

    for (const pageInfo of pages) {
      await page.goto(pageInfo.url);
      
      // Check page loads without errors
      await expect(page.locator('h1')).toContainText(pageInfo.title);
      
      // Check no "Cannot read properties of undefined" errors
      const errorMessages = await page.locator('text=Cannot read properties of undefined').count();
      expect(errorMessages).toBe(0);
      
      // Check no "Failed to fetch" errors
      const fetchErrors = await page.locator('text=Failed to fetch').count();
      expect(fetchErrors).toBe(0);
    }
  });

  test('should navigate using header links', async ({ page }) => {
    // Test navigation via header
    await page.click('text=Question Bank');
    await expect(page).toHaveURL('/question-bank');
    await expect(page.locator('h1')).toContainText('Question Bank');

    await page.click('text=System Design');
    await expect(page).toHaveURL('/system-design-questions');
    await expect(page.locator('h1')).toContainText('System Design Questions');

    await page.click('text=Stories');
    await expect(page).toHaveURL('/story-templates');
    await expect(page.locator('h1')).toContainText('Story Templates');

    await page.click('text=Company Values');
    await expect(page).toHaveURL('/company-values');
    await expect(page.locator('h1')).toContainText('Company Values');
  });
});
