
import { test, expect } from '@playwright/test';

test.describe('System Design Questions', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'adminadmin');
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should load system design questions page successfully', async ({ page }) => {
    await page.goto('/system-design-questions');
    
    // Check page loads
    await expect(page.locator('h1')).toContainText('System Design Questions');
    
    // Check questions are loaded
    await expect(page.locator('[data-testid="system-design-question"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should load system design strategy page successfully', async ({ page }) => {
    await page.goto('/system-design-strategy');
    
    // Check page loads
    await expect(page.locator('h1')).toContainText('System Design Strategy');
    
    // Check frameworks are loaded
    await expect(page.locator('[data-testid="framework-card"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should filter system design questions', async ({ page }) => {
    await page.goto('/system-design-questions');
    
    // Wait for questions to load
    await expect(page.locator('[data-testid="system-design-question"]').first()).toBeVisible({ timeout: 10000 });
    
    // Test filtering if filters are available
    const filterSelect = page.locator('select').first();
    if (await filterSelect.isVisible()) {
      await filterSelect.selectOption({ index: 1 });
      await page.waitForTimeout(1000);
      
      // Questions should still be visible
      await expect(page.locator('[data-testid="system-design-question"]').first()).toBeVisible();
    }
  });
});
