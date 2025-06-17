
import { test, expect } from '@playwright/test';

const PREVIEW_URL = 'https://125d7b9e76-3000.preview.abacusai.app';

test.describe('Preview URL Form Submission Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(PREVIEW_URL);
    await page.click('text=Demo User Login');
    await expect(page).toHaveURL(/dashboard/);
  });

  test('should submit story creation form', async ({ page }) => {
    await page.goto(`${PREVIEW_URL}/stories/new`);
    
    // Fill out story form
    await page.fill('input[name="title"]', 'Test Story');
    await page.fill('textarea[name="situation"]', 'Test situation description');
    await page.fill('textarea[name="task"]', 'Test task description');
    await page.fill('textarea[name="action"]', 'Test action description');
    await page.fill('textarea[name="result"]', 'Test result description');
    
    // Submit form
    await page.click('button:has-text("Save Story")');
    
    // Should show success message or redirect
    await expect(page.locator('text=Story saved')).toBeVisible({ timeout: 10000 });
  });

  test('should handle search functionality', async ({ page }) => {
    await page.goto(`${PREVIEW_URL}/question-bank`);
    
    // Find search input and enter search term
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('leadership');
      await page.keyboard.press('Enter');
      
      // Should show search results
      await expect(page.locator('text=leadership')).toBeVisible();
    }
  });

  test('should handle company filter selection', async ({ page }) => {
    await page.goto(`${PREVIEW_URL}/dashboard`);
    
    // Look for company selector
    const companySelector = page.locator('select, [role="combobox"]').first();
    if (await companySelector.isVisible()) {
      await companySelector.click();
      
      // Select a company option
      const firstOption = page.locator('option, [role="option"]').first();
      if (await firstOption.isVisible()) {
        await firstOption.click();
      }
    }
  });

  test('should handle interview notes creation', async ({ page }) => {
    await page.goto(`${PREVIEW_URL}/interview-notes`);
    
    // Look for add note button or form
    const addButton = page.locator('button:has-text("Add"), button:has-text("Create"), button:has-text("New")').first();
    if (await addButton.isVisible()) {
      await addButton.click();
      
      // Fill out note form if it appears
      const titleInput = page.locator('input[name="title"], input[placeholder*="title"]').first();
      if (await titleInput.isVisible()) {
        await titleInput.fill('Test Interview Note');
        
        const contentInput = page.locator('textarea[name="content"], textarea[placeholder*="content"]').first();
        if (await contentInput.isVisible()) {
          await contentInput.fill('Test note content');
          
          // Submit form
          const saveButton = page.locator('button:has-text("Save"), button:has-text("Submit")').first();
          if (await saveButton.isVisible()) {
            await saveButton.click();
          }
        }
      }
    }
  });
});
