
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PREVIEW_URL || 'http://localhost:3000';

test.describe('Form Submission Tests', () => {
  test('should test login form submission', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Test valid login
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'adminadmin');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await page.waitForURL(`${BASE_URL}/dashboard`);
    expect(page.url()).toBe(`${BASE_URL}/dashboard`);
  });

  test('should test demo login buttons', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Test Demo User Login button
    const demoUserButton = page.locator('button', { hasText: 'Demo User Login' });
    if (await demoUserButton.isVisible()) {
      await demoUserButton.click();
      await page.waitForURL(`${BASE_URL}/dashboard`);
      expect(page.url()).toBe(`${BASE_URL}/dashboard`);
    }
    
    // Go back to login for admin test
    await page.goto(`${BASE_URL}/login`);
    
    // Test Admin Demo Login button
    const adminDemoButton = page.locator('button', { hasText: 'Admin Demo Login' });
    if (await adminDemoButton.isVisible()) {
      await adminDemoButton.click();
      await page.waitForURL(`${BASE_URL}/dashboard`);
      expect(page.url()).toBe(`${BASE_URL}/dashboard`);
    }
  });

  test('should test story creation form', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'adminadmin');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`);
    
    // Navigate to stories page
    await page.goto(`${BASE_URL}/stories`);
    await page.waitForLoadState('networkidle');
    
    // Look for "New Story" or "Add Story" button
    const newStoryButton = page.locator('button', { hasText: /new story|add story|create story/i }).first();
    if (await newStoryButton.isVisible()) {
      await newStoryButton.click();
      await page.waitForTimeout(1000);
      
      // Fill out story form if it appears
      const titleInput = page.locator('input[name="title"], input[placeholder*="title" i]').first();
      if (await titleInput.isVisible()) {
        await titleInput.fill('Test Story Title');
        
        const situationInput = page.locator('textarea[name="situation"], textarea[placeholder*="situation" i]').first();
        if (await situationInput.isVisible()) {
          await situationInput.fill('Test situation description');
        }
        
        const taskInput = page.locator('textarea[name="task"], textarea[placeholder*="task" i]').first();
        if (await taskInput.isVisible()) {
          await taskInput.fill('Test task description');
        }
        
        const actionInput = page.locator('textarea[name="action"], textarea[placeholder*="action" i]').first();
        if (await actionInput.isVisible()) {
          await actionInput.fill('Test action description');
        }
        
        const resultInput = page.locator('textarea[name="result"], textarea[placeholder*="result" i]').first();
        if (await resultInput.isVisible()) {
          await resultInput.fill('Test result description');
        }
        
        // Submit the form
        const submitButton = page.locator('button[type="submit"], button:has-text("save"), button:has-text("create")').first();
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForTimeout(2000);
          
          // Verify success (no error messages)
          const pageContent = await page.textContent('body');
          expect(pageContent).not.toContain('error');
          expect(pageContent).not.toContain('failed');
        }
      }
    }
  });

  test('should test search functionality', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'adminadmin');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`);
    
    // Test search on question bank page
    await page.goto(`${BASE_URL}/question-bank`);
    await page.waitForLoadState('networkidle');
    
    const searchInput = page.locator('input[placeholder*="search" i], input[type="search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('leadership');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
      
      // Verify search worked (no errors)
      const pageContent = await page.textContent('body');
      expect(pageContent).not.toContain('error');
      expect(pageContent).not.toContain('failed');
    }
  });

  test('should test company filter functionality', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'adminadmin');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`);
    
    // Test company filter on various pages
    const pagesWithFilters = ['/question-bank', '/company-values'];
    
    for (const pagePath of pagesWithFilters) {
      await page.goto(`${BASE_URL}${pagePath}`);
      await page.waitForLoadState('networkidle');
      
      // Look for company selector/filter
      const companySelect = page.locator('select, [role="combobox"]').first();
      if (await companySelect.isVisible()) {
        await companySelect.click();
        await page.waitForTimeout(500);
        
        // Try to select a company option
        const metaOption = page.locator('option[value="meta"], [data-value="meta"]').first();
        if (await metaOption.isVisible()) {
          await metaOption.click();
          await page.waitForTimeout(1000);
          
          // Verify filter worked (no errors)
          const pageContent = await page.textContent('body');
          expect(pageContent).not.toContain('error');
          expect(pageContent).not.toContain('failed');
        }
      }
    }
  });
});
