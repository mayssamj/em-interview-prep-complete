
/**
 * Simple test to verify the application is working after the type conversion fix
 * Uses the preview URL format as required
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://125d7b9e76-3000.preview.abacusai.app';

test.describe('Application Working Verification', () => {
  test('should load login page and demo login should work', async ({ page }) => {
    // Navigate to the application
    await page.goto(BASE_URL);
    
    // Should redirect to login page
    await expect(page).toHaveURL(/.*\/login/);
    
    // Check that login form is visible
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // Check that demo login button exists
    await expect(page.locator('button:has-text("Demo User Login")')).toBeVisible();
    
    // Click demo login button
    await page.click('button:has-text("Demo User Login")');
    
    // Wait for navigation to dashboard
    await page.waitForURL(/.*\/dashboard/, { timeout: 15000 });
    
    // Verify we're on the dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Check that dashboard content loads
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to question bank without type errors', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.click('button:has-text("Demo User Login")');
    await page.waitForURL(/.*\/dashboard/, { timeout: 15000 });
    
    // Navigate to question bank
    await page.goto(`${BASE_URL}/question-bank`);
    
    // Check that the page loads without errors
    await expect(page.locator('h1')).toContainText('Question Bank');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Check that no type conversion errors appear in the page
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain('[object Object]');
    expect(pageContent).not.toContain('JsonValue');
  });

  test('should navigate to company values without type errors', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.click('button:has-text("Demo User Login")');
    await page.waitForURL(/.*\/dashboard/, { timeout: 15000 });
    
    // Navigate to company values
    await page.goto(`${BASE_URL}/company-values`);
    
    // Check that the page loads without errors
    await expect(page.locator('h1')).toContainText('Company Values');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Check that no type conversion errors appear in the page
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain('[object Object]');
    expect(pageContent).not.toContain('JsonValue');
  });

  test('should verify API endpoints return proper data', async ({ page }) => {
    // Test companies API
    const companiesResponse = await page.request.get(`${BASE_URL}/api/companies`);
    expect(companiesResponse.status()).toBe(200);
    
    const companies = await companiesResponse.json();
    expect(Array.isArray(companies)).toBeTruthy();
    
    // Test questions API
    const questionsResponse = await page.request.get(`${BASE_URL}/api/questions`);
    expect(questionsResponse.status()).toBe(200);
    
    const questions = await questionsResponse.json();
    expect(Array.isArray(questions)).toBeTruthy();
  });

  test('should verify manual login works', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Fill in credentials manually
    await page.fill('input[type="text"]', 'demo');
    await page.fill('input[type="password"]', 'demo123');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForURL(/.*\/dashboard/, { timeout: 15000 });
    
    // Verify we're on dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
  });
});
