
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should login successfully with admin credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Check login page loads
    await expect(page.locator('h1')).toContainText('EM Interview Prep');
    await expect(page.locator('text=Sign In')).toBeVisible();
    
    // Fill login form
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'adminadmin');
    
    // Submit form
    await page.click('button:has-text("Sign In")');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('text=Welcome back, admin')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill with invalid credentials
    await page.fill('input[placeholder="Username"]', 'invalid');
    await page.fill('input[placeholder="Password"]', 'invalid');
    
    // Submit form
    await page.click('button:has-text("Sign In")');
    
    // Should show error message
    await expect(page.locator('text=Invalid username or password')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'adminadmin');
    await page.click('button:has-text("Sign In")');
    
    // Wait for dashboard
    await expect(page).toHaveURL('/dashboard');
    
    // Logout
    await page.click('button:has-text("Logout")');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });
});
