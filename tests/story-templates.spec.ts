
import { test, expect } from '@playwright/test';

test.describe('Story Templates', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'adminadmin');
    await page.click('button:has-text("Sign In")');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should load story templates page successfully', async ({ page }) => {
    await page.goto('/story-templates');
    
    // Check page loads
    await expect(page.locator('h1')).toContainText('Story Templates');
    
    // Check STAR method guide is visible
    await expect(page.locator('text=STAR Method Guide')).toBeVisible();
    
    // Check story templates are visible
    await expect(page.locator('text=Leadership Challenge')).toBeVisible();
    await expect(page.locator('text=Technical Decision')).toBeVisible();
    await expect(page.locator('text=Cross-functional Collaboration')).toBeVisible();
  });

  test('should open new story dialog', async ({ page }) => {
    await page.goto('/story-templates');
    
    // Click New Story button
    await page.click('button:has-text("New Story")');
    
    // Check dialog opens
    await expect(page.locator('text=Create New Story')).toBeVisible();
    await expect(page.locator('input[placeholder*="Led team"]')).toBeVisible();
  });

  test('should use a story template', async ({ page }) => {
    await page.goto('/story-templates');
    
    // Click "Use Template" on first template
    await page.click('button:has-text("Use Template")').first();
    
    // Check dialog opens with template data
    await expect(page.locator('text=Create New Story')).toBeVisible();
    await expect(page.locator('input[value="Leadership Challenge"]')).toBeVisible();
  });

  test('should create a new story', async ({ page }) => {
    await page.goto('/story-templates');
    
    // Click New Story button
    await page.click('button:has-text("New Story")');
    
    // Fill out the form
    await page.fill('input[placeholder*="Led team"]', 'Test Story Title');
    await page.fill('textarea[placeholder*="Describe the context"]', 'Test situation description');
    await page.fill('textarea[placeholder*="What was your responsibility"]', 'Test task description');
    await page.fill('textarea[placeholder*="Describe the specific actions"]', 'Test action description');
    await page.fill('textarea[placeholder*="What was the outcome"]', 'Test result description');
    
    // Submit the form
    await page.click('button:has-text("Create Story")');
    
    // Check success message or story appears
    await expect(page.locator('text=Test Story Title')).toBeVisible({ timeout: 10000 });
  });
});
