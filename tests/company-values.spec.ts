
import { test, expect } from '@playwright/test';

test.describe('Company Values', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'adminadmin');
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should load company values page successfully', async ({ page }) => {
    await page.goto('/company-values');
    
    // Check page loads
    await expect(page.locator('h1')).toContainText('Company Values');
    
    // Check companies are loaded
    await expect(page.locator('[data-testid="company-card"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should filter companies', async ({ page }) => {
    await page.goto('/company-values');
    
    // Wait for companies to load
    await expect(page.locator('[data-testid="company-card"]').first()).toBeVisible({ timeout: 10000 });
    
    // Test search if available
    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('Google');
      await page.waitForTimeout(1000);
      
      // Should show filtered results
      await expect(page.locator('text=Google')).toBeVisible();
    }
  });

  test('should display company details', async ({ page }) => {
    await page.goto('/company-values');
    
    // Wait for companies to load
    await expect(page.locator('[data-testid="company-card"]').first()).toBeVisible({ timeout: 10000 });
    
    // Check that company cards have expected content
    const firstCard = page.locator('[data-testid="company-card"]').first();
    await expect(firstCard.locator('h3')).toBeVisible(); // Company name
    await expect(firstCard.locator('text=Values')).toBeVisible(); // Values section
  });
});
