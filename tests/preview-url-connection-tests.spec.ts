
import { test, expect } from '@playwright/test';

const PREVIEW_URL = 'https://125d7b9e76-3000.preview.abacusai.app';

test.describe('Preview URL Connection Tests', () => {
  test('should connect to preview URL successfully', async ({ page }) => {
    await page.goto(PREVIEW_URL);
    await expect(page).toHaveTitle(/EM Interview Prep/);
    
    // Should redirect to login page
    await expect(page).toHaveURL(/login/);
    
    // Should show login form
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
    await expect(page.locator('input[placeholder*="Username"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should load demo accounts section', async ({ page }) => {
    await page.goto(PREVIEW_URL);
    
    // Check demo accounts are visible
    await expect(page.locator('h3:has-text("Demo Accounts")')).toBeVisible();
    await expect(page.locator('text=demo / demo123')).toBeVisible();
    await expect(page.locator('text=admin / admin123')).toBeVisible();
  });

  test('should have working demo login buttons', async ({ page }) => {
    await page.goto(PREVIEW_URL);
    
    // Check demo login buttons exist
    await expect(page.locator('text=Demo User Login')).toBeVisible();
    await expect(page.locator('text=Admin Demo Login')).toBeVisible();
  });

  test('should handle API health check', async ({ page }) => {
    const response = await page.request.get(`${PREVIEW_URL}/api/health`);
    expect(response.status()).toBe(200);
  });
});
