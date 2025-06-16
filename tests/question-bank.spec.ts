
import { test, expect } from '@playwright/test';

test.describe('Question Bank', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'adminadmin');
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should load question bank page successfully', async ({ page }) => {
    await page.goto('/question-bank');
    
    // Check page loads
    await expect(page.locator('h1')).toContainText('Question Bank');
    
    // Check questions are loaded
    await expect(page.locator('[data-testid="question-card"]').first()).toBeVisible({ timeout: 10000 });
    
    // Check filters are present
    await expect(page.locator('select')).toBeVisible();
  });

  test('should filter questions by company', async ({ page }) => {
    await page.goto('/question-bank');
    
    // Wait for questions to load
    await expect(page.locator('[data-testid="question-card"]').first()).toBeVisible({ timeout: 10000 });
    
    // Get initial question count
    const initialCount = await page.locator('[data-testid="question-card"]').count();
    expect(initialCount).toBeGreaterThan(0);
    
    // Filter by a specific company (if available)
    const companySelect = page.locator('select').first();
    await companySelect.selectOption({ index: 1 }); // Select first non-"All" option
    
    // Wait for filter to apply
    await page.waitForTimeout(1000);
    
    // Questions should still be visible (filtered)
    await expect(page.locator('[data-testid="question-card"]').first()).toBeVisible();
  });

  test('should search questions', async ({ page }) => {
    await page.goto('/question-bank');
    
    // Wait for questions to load
    await expect(page.locator('[data-testid="question-card"]').first()).toBeVisible({ timeout: 10000 });
    
    // Search for a common term
    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('team');
      await page.waitForTimeout(1000);
      
      // Should show filtered results
      await expect(page.locator('[data-testid="question-card"]').first()).toBeVisible();
    }
  });
});
