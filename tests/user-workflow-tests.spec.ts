
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PREVIEW_URL || 'http://localhost:3000';

test.describe('User Workflow Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', 'admin');
    await page.fill('input[name="password"]', 'adminadmin');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`);
  });

  test('should complete question bank workflow', async ({ page }) => {
    await page.goto(`${BASE_URL}/question-bank`);
    await page.waitForLoadState('networkidle');
    
    // Verify page loads
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain('404');
    
    // Test search functionality
    const searchInput = page.locator('input[placeholder*="search" i]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('leadership');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
    }
    
    // Test company filter
    const companyFilter = page.locator('select, [role="combobox"]').first();
    if (await companyFilter.isVisible()) {
      await companyFilter.click();
      await page.waitForTimeout(500);
      
      const option = page.locator('option, [role="option"]').first();
      if (await option.isVisible()) {
        await option.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Verify no errors occurred
    const finalContent = await page.textContent('body');
    expect(finalContent).not.toContain('error');
    expect(finalContent).not.toContain('failed');
  });

  test('should complete system design workflow', async ({ page }) => {
    await page.goto(`${BASE_URL}/system-design-questions`);
    await page.waitForLoadState('networkidle');
    
    // Verify page loads
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain('404');
    
    // Look for system design questions
    const questions = page.locator('[data-testid*="question"], .question, [class*="question"]');
    const questionCount = await questions.count();
    
    if (questionCount > 0) {
      // Click on first question if available
      await questions.first().click();
      await page.waitForTimeout(1000);
    }
    
    // Test category filter if available
    const categoryFilter = page.locator('select[name*="category"], [data-testid*="category"]').first();
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click();
      await page.waitForTimeout(500);
      
      const option = page.locator('option, [role="option"]').first();
      if (await option.isVisible()) {
        await option.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Verify no errors
    const finalContent = await page.textContent('body');
    expect(finalContent).not.toContain('error');
    expect(finalContent).not.toContain('failed');
  });

  test('should complete story management workflow', async ({ page }) => {
    await page.goto(`${BASE_URL}/stories`);
    await page.waitForLoadState('networkidle');
    
    // Verify page loads
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain('404');
    
    // Look for existing stories
    const stories = page.locator('[data-testid*="story"], .story, [class*="story"]');
    const storyCount = await stories.count();
    
    // Test story creation if button exists
    const newStoryButton = page.locator('button:has-text("New Story"), button:has-text("Add Story"), button:has-text("Create Story")').first();
    if (await newStoryButton.isVisible()) {
      await newStoryButton.click();
      await page.waitForTimeout(1000);
      
      // Fill basic story info if form appears
      const titleInput = page.locator('input[name="title"], input[placeholder*="title"]').first();
      if (await titleInput.isVisible()) {
        await titleInput.fill('Test Workflow Story');
        
        // Try to save/submit
        const saveButton = page.locator('button[type="submit"], button:has-text("Save"), button:has-text("Create")').first();
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForTimeout(2000);
        }
      }
    }
    
    // Verify no errors
    const finalContent = await page.textContent('body');
    expect(finalContent).not.toContain('error');
    expect(finalContent).not.toContain('failed');
  });

  test('should complete company values workflow', async ({ page }) => {
    await page.goto(`${BASE_URL}/company-values`);
    await page.waitForLoadState('networkidle');
    
    // Verify page loads
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain('404');
    
    // Test company selection
    const companyCards = page.locator('[data-testid*="company"], .company, [class*="company"]');
    const cardCount = await companyCards.count();
    
    if (cardCount > 0) {
      // Click on first company
      await companyCards.first().click();
      await page.waitForTimeout(1000);
    }
    
    // Test company filter/selector
    const companySelector = page.locator('select, [role="combobox"]').first();
    if (await companySelector.isVisible()) {
      await companySelector.click();
      await page.waitForTimeout(500);
      
      const metaOption = page.locator('option[value="meta"], [data-value="meta"], :text("Meta")').first();
      if (await metaOption.isVisible()) {
        await metaOption.click();
        await page.waitForTimeout(1000);
      }
    }
    
    // Verify no errors
    const finalContent = await page.textContent('body');
    expect(finalContent).not.toContain('error');
    expect(finalContent).not.toContain('failed');
  });

  test('should complete progress tracking workflow', async ({ page }) => {
    await page.goto(`${BASE_URL}/progress-tracker`);
    await page.waitForLoadState('networkidle');
    
    // Verify page loads
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain('404');
    
    // Look for progress elements
    const progressElements = page.locator('[data-testid*="progress"], .progress, [class*="progress"]');
    const progressCount = await progressElements.count();
    
    // Test any interactive elements
    const buttons = page.locator('button').all();
    const buttonList = await buttons;
    
    for (let i = 0; i < Math.min(buttonList.length, 3); i++) {
      const button = buttonList[i];
      if (await button.isVisible()) {
        const buttonText = await button.textContent();
        if (buttonText && !buttonText.includes('logout')) {
          await button.click();
          await page.waitForTimeout(500);
        }
      }
    }
    
    // Verify no errors
    const finalContent = await page.textContent('body');
    expect(finalContent).not.toContain('error');
    expect(finalContent).not.toContain('failed');
  });

  test('should test complete user journey', async ({ page }) => {
    // Start from dashboard
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    
    // Navigate through key pages in typical user flow
    const userJourney = [
      '/company-values',
      '/question-bank', 
      '/stories',
      '/system-design-questions',
      '/progress-tracker'
    ];
    
    for (const step of userJourney) {
      console.log(`User journey step: ${step}`);
      await page.goto(`${BASE_URL}${step}`);
      await page.waitForLoadState('networkidle');
      
      // Verify each step loads successfully
      const pageContent = await page.textContent('body');
      expect(pageContent).not.toContain('404');
      expect(pageContent).not.toContain('Page Not Found');
      expect(pageContent).not.toContain('error');
      
      // Wait between steps
      await page.waitForTimeout(1000);
    }
    
    // End back at dashboard
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    
    const finalContent = await page.textContent('body');
    expect(finalContent).not.toContain('404');
  });
});
