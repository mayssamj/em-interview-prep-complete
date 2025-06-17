
/**
 * Regression tests specifically for the JsonValue to string[] type conversion issue
 * These tests ensure the bug doesn't reoccur
 */

import { test, expect } from '@playwright/test';

const BASE_URL = 'https://125d7b9e76-3000.preview.abacusai.app';

test.describe('Regression Tests - Type Conversion Issues', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[name="username"]', 'demo');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('company values page should render without type errors', async ({ page }) => {
    await page.goto(`${BASE_URL}/company-values`);
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
    
    // Check that company cards are rendered
    const companyCards = page.locator('[data-testid="company-card"]');
    await expect(companyCards.first()).toBeVisible({ timeout: 15000 });
    
    // Check that values are displayed as arrays (not JsonValue objects)
    const valuesList = page.locator('[data-testid="company-values"]').first();
    await expect(valuesList).toBeVisible();
    
    // Ensure no "object Object" text appears (would indicate type conversion failure)
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain('[object Object]');
  });

  test('question bank should display tags correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/question-bank`);
    
    // Wait for questions to load
    await page.waitForLoadState('networkidle');
    
    const questionCards = page.locator('[data-testid="question-card"]');
    await expect(questionCards.first()).toBeVisible({ timeout: 15000 });
    
    // Check that tags are displayed as individual badges, not as JsonValue
    const tagBadges = page.locator('[data-testid="question-tag"]');
    if (await tagBadges.count() > 0) {
      const firstTag = await tagBadges.first().textContent();
      expect(firstTag).not.toContain('[object Object]');
      expect(firstTag).not.toContain('JsonValue');
    }
  });

  test('company detail page should show evaluation criteria as list', async ({ page }) => {
    await page.goto(`${BASE_URL}/company/Meta`);
    
    // Wait for company data to load
    await page.waitForLoadState('networkidle');
    
    // Check that evaluation criteria are displayed
    const evaluationCriteria = page.locator('[data-testid="evaluation-criteria"]');
    await expect(evaluationCriteria).toBeVisible({ timeout: 15000 });
    
    // Ensure criteria are displayed as readable text, not JsonValue objects
    const criteriaText = await evaluationCriteria.textContent();
    expect(criteriaText).not.toContain('[object Object]');
    expect(criteriaText).not.toContain('JsonValue');
  });

  test('stories page should handle tags and categories correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/stories`);
    
    // Wait for stories to load
    await page.waitForLoadState('networkidle');
    
    // Try to create a new story to test form handling
    const createButton = page.locator('[data-testid="create-story-button"]');
    if (await createButton.isVisible()) {
      await createButton.click();
      
      const storyForm = page.locator('[data-testid="story-form"]');
      await expect(storyForm).toBeVisible();
      
      // Check that tag input fields work correctly
      const tagInput = page.locator('[data-testid="tags-input"]');
      if (await tagInput.isVisible()) {
        await tagInput.fill('leadership,teamwork');
        // Should not cause type errors
      }
    }
  });

  test('progress tracker should display story data without type errors', async ({ page }) => {
    await page.goto(`${BASE_URL}/progress-tracker`);
    
    // Wait for progress data to load
    await page.waitForLoadState('networkidle');
    
    // Check that the page renders without errors
    const progressContent = page.locator('[data-testid="progress-content"]');
    await expect(progressContent).toBeVisible({ timeout: 15000 });
    
    // Ensure no type conversion errors in displayed data
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain('[object Object]');
    expect(pageContent).not.toContain('JsonValue');
  });

  test('interview strategy page should render company data correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/interview-strategy`);
    
    // Wait for strategy data to load
    await page.waitForLoadState('networkidle');
    
    // Check that company strategy cards are displayed
    const strategyCards = page.locator('[data-testid="strategy-card"]');
    await expect(strategyCards.first()).toBeVisible({ timeout: 15000 });
    
    // Ensure success tips and red flags are displayed as readable lists
    const successTips = page.locator('[data-testid="success-tips"]').first();
    if (await successTips.isVisible()) {
      const tipsText = await successTips.textContent();
      expect(tipsText).not.toContain('[object Object]');
    }
  });

  test('story templates page should handle user stories correctly', async ({ page }) => {
    await page.goto(`${BASE_URL}/story-templates`);
    
    // Wait for templates to load
    await page.waitForLoadState('networkidle');
    
    // Check that the page loads without type errors
    const templatesContent = page.locator('[data-testid="templates-content"]');
    await expect(templatesContent).toBeVisible({ timeout: 15000 });
    
    // Ensure story data is displayed correctly
    const pageContent = await page.textContent('body');
    expect(pageContent).not.toContain('[object Object]');
    expect(pageContent).not.toContain('JsonValue');
  });

  test('API endpoints should return properly typed data', async ({ page }) => {
    // Test companies API
    const companiesResponse = await page.request.get(`${BASE_URL}/api/companies`);
    expect(companiesResponse.status()).toBe(200);
    
    const companies = await companiesResponse.json();
    expect(Array.isArray(companies)).toBeTruthy();
    
    if (companies.length > 0) {
      const firstCompany = companies[0];
      // Values should be an array, not a JsonValue object
      if (firstCompany.values) {
        expect(Array.isArray(firstCompany.values)).toBeTruthy();
      }
    }
    
    // Test questions API
    const questionsResponse = await page.request.get(`${BASE_URL}/api/questions`);
    expect(questionsResponse.status()).toBe(200);
    
    const questions = await questionsResponse.json();
    expect(Array.isArray(questions)).toBeTruthy();
    
    if (questions.length > 0) {
      const firstQuestion = questions[0];
      // Tags should be an array, not a JsonValue object
      if (firstQuestion.tags) {
        expect(Array.isArray(firstQuestion.tags)).toBeTruthy();
      }
    }
  });

  test('should not have TypeScript compilation errors in browser console', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('Type')) {
        consoleErrors.push(msg.text());
      }
    });
    
    // Navigate through all major pages
    const pages = [
      '/dashboard',
      '/question-bank',
      '/company-values',
      '/stories',
      '/progress-tracker',
      '/interview-strategy',
      '/story-templates'
    ];
    
    for (const pagePath of pages) {
      await page.goto(`${BASE_URL}${pagePath}`);
      await page.waitForLoadState('networkidle');
    }
    
    // Should not have any TypeScript-related errors
    expect(consoleErrors).toHaveLength(0);
  });
});
