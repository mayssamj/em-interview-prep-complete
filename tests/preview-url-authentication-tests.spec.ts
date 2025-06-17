
import { test, expect } from '@playwright/test';

const PREVIEW_URL = 'https://125d7b9e76-3000.preview.abacusai.app';

test.describe('Preview URL Authentication Tests', () => {
  test('should login with demo user successfully', async ({ page }) => {
    await page.goto(PREVIEW_URL);
    
    // Wait for page to load
    await expect(page.locator('button:has-text("Demo User Login")')).toBeVisible();
    
    // Click demo user login button
    await page.click('button:has-text("Demo User Login")');
    
    // Wait for navigation to complete
    await page.waitForURL(/dashboard/, { timeout: 15000 });
    
    // Should show dashboard content
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should login with admin user successfully', async ({ page }) => {
    await page.goto(PREVIEW_URL);
    
    // Wait for page to load
    await expect(page.locator('button:has-text("Admin Demo Login")')).toBeVisible();
    
    // Click admin demo login button
    await page.click('button:has-text("Admin Demo Login")');
    
    // Wait for navigation to complete
    await page.waitForURL(/dashboard/, { timeout: 15000 });
    
    // Should show dashboard content
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should handle manual login form', async ({ page }) => {
    await page.goto(PREVIEW_URL);
    
    // Wait for form to be ready
    await expect(page.locator('input[placeholder*="Username"]')).toBeVisible();
    
    // Fill in manual login form
    await page.fill('input[placeholder*="Username"]', 'demo');
    await page.fill('input[type="password"]', 'demo123');
    
    // Submit form
    await page.click('button:has-text("Sign In")');
    
    // Wait for navigation to complete
    await page.waitForURL(/dashboard/, { timeout: 15000 });
    
    // Should show dashboard content
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should handle logout functionality', async ({ page }) => {
    // Login first
    await page.goto(PREVIEW_URL);
    await expect(page.locator('button:has-text("Demo User Login")')).toBeVisible();
    await page.click('button:has-text("Demo User Login")');
    await page.waitForURL(/dashboard/, { timeout: 15000 });
    
    // Find and click logout button
    await page.click('text=Logout');
    
    // Should redirect back to login
    await page.waitForURL(/login/, { timeout: 10000 });
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });
});
