
/**
 * Integration tests for the EM Interview Prep application
 * Tests the core functionality after fixing the type conversion issues
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://125d7b9e76-3000.preview.abacusai.app';

test.describe('EM Interview Prep Application - Post Type Fix', () => {
  test.beforeEach(async ({ page }) => {
    // Set up any necessary authentication or state
    await page.goto(BASE_URL);
  });

  test('should load the login page without errors', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Should redirect to login page
    await expect(page).toHaveURL(/.*\/login/);
    
    // Check for login form elements
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should successfully login with demo credentials', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Fill in demo credentials
    await page.fill('input[name="username"]', 'demo');
    await page.fill('input[name="password"]', 'demo123');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Check for dashboard elements
    await expect(page.locator('h1')).toContainText('Dashboard');
  });

  test('should load company values page without type errors', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', 'demo');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    
    // Navigate to company values
    await page.goto(`${BASE_URL}/company-values`);
    
    // Check that the page loads without errors
    await expect(page.locator('h1')).toContainText('Company Values');
    
    // Check that companies are displayed (should not have type errors)
    await expect(page.locator('[data-testid="company-card"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should load question bank without type conversion errors', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', 'demo');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    
    // Navigate to question bank
    await page.goto(`${BASE_URL}/question-bank`);
    
    // Check that the page loads
    await expect(page.locator('h1')).toContainText('Question Bank');
    
    // Check that questions are displayed with proper tags (no type errors)
    await expect(page.locator('[data-testid="question-card"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should load stories page without type errors', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', 'demo');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    
    // Navigate to stories
    await page.goto(`${BASE_URL}/stories`);
    
    // Check that the page loads
    await expect(page.locator('h1')).toContainText('Stories');
    
    // Should be able to create a new story (tests type conversion for tags/categories)
    await page.click('[data-testid="create-story-button"]');
    await expect(page.locator('[data-testid="story-form"]')).toBeVisible();
  });

  test('should handle company-specific pages without type errors', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', 'demo');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    
    // Navigate to a specific company page
    await page.goto(`${BASE_URL}/company/Meta`);
    
    // Check that the page loads with company data
    await expect(page.locator('h1')).toContainText('Meta');
    
    // Check that evaluation criteria are displayed (tests JsonValue conversion)
    await expect(page.locator('[data-testid="evaluation-criteria"]')).toBeVisible({ timeout: 10000 });
  });

  test('should display proper error handling for invalid routes', async ({ page }) => {
    await page.goto(`${BASE_URL}/nonexistent-page`);
    
    // Should show 404 or redirect appropriately
    const response = await page.waitForResponse(response => 
      response.url().includes('nonexistent-page')
    );
    
    expect([404, 307].includes(response.status())).toBeTruthy();
  });

  test('should maintain session across page navigation', async ({ page }) => {
    // Login
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', 'demo');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    
    // Navigate through different pages
    const pages = [
      '/dashboard',
      '/question-bank',
      '/company-values',
      '/stories',
      '/progress-tracker'
    ];
    
    for (const pagePath of pages) {
      await page.goto(`${BASE_URL}${pagePath}`);
      
      // Should not redirect to login (session maintained)
      await expect(page).not.toHaveURL(/.*\/login/);
      
      // Should load the page content
      await expect(page.locator('main')).toBeVisible();
    }
  });

  test('should handle API endpoints correctly', async ({ page }) => {
    // Test that API endpoints return proper responses
    const response = await page.request.get(`${BASE_URL}/api/companies`);
    expect(response.status()).toBe(200);
    
    const companies = await response.json();
    expect(Array.isArray(companies)).toBeTruthy();
  });

  test('should load without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', 'demo');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    
    // Navigate to a few key pages
    await page.goto(`${BASE_URL}/dashboard`);
    await page.goto(`${BASE_URL}/question-bank`);
    
    // Filter out known non-critical errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('_next/static') &&
      !error.includes('hydration')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});
