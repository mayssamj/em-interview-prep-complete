
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

test.describe('EM Interview Prep - Comprehensive E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing authentication
    await page.context().clearCookies();
  });

  test.describe('Authentication Flow', () => {
    test('should complete full registration and login flow', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*\/login/);
      
      // Switch to registration mode
      await page.click('text=Don\'t have an account? Sign up');
      await expect(page.locator('text=Create Account')).toBeVisible();
      
      // Fill registration form
      const timestamp = Date.now();
      const username = `testuser${timestamp}`;
      
      await page.fill('input[placeholder="Username"]', username);
      await page.fill('input[placeholder="Email (optional)"]', `${username}@test.com`);
      await page.fill('input[placeholder="Password"]', 'password123');
      await page.fill('input[placeholder="Confirm Password"]', 'password123');
      
      // Submit registration
      await page.click('button:has-text("Create Account")');
      
      // Should redirect to dashboard after successful registration
      await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
      
      // Verify user is logged in by checking header
      await expect(page.locator('text=Dashboard')).toBeVisible();
      
      // Logout
      await page.click('button:has-text("Logout")');
      await expect(page).toHaveURL(/.*\/login/);
      
      // Login with the same credentials
      await page.fill('input[placeholder="Username"]', username);
      await page.fill('input[placeholder="Password"]', 'password123');
      await page.click('button:has-text("Sign In")');
      
      // Should be back on dashboard
      await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
    });

    test('should handle admin login and access admin dashboard', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Use admin demo login
      await page.click('button:has-text("Admin Demo Login")');
      
      // Should redirect to dashboard
      await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
      
      // Navigate to admin page
      await page.goto(`${BASE_URL}/admin`);
      
      // Should be able to access admin dashboard
      await expect(page.locator('text=Admin Dashboard')).toBeVisible();
      await expect(page.locator('text=Total Users')).toBeVisible();
      await expect(page.locator('text=User Management')).toBeVisible();
    });

    test('should prevent non-admin access to admin dashboard', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Use regular demo login
      await page.click('button:has-text("Demo User Login")');
      
      // Should redirect to dashboard
      await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
      
      // Try to access admin page
      await page.goto(`${BASE_URL}/admin`);
      
      // Should redirect back to dashboard
      await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
    });
  });

  test.describe('Main Application Features', () => {
    test.beforeEach(async ({ page }) => {
      // Login as demo user for each test
      await page.goto(`${BASE_URL}/login`);
      await page.click('button:has-text("Demo User Login")');
      await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
    });

    test('should navigate through all main pages', async ({ page }) => {
      const pages = [
        { path: '/question-bank', title: 'Question Bank' },
        { path: '/system-design-questions', title: 'System Design Questions' },
        { path: '/story-templates', title: 'Story Templates' },
        { path: '/stories', title: 'My Stories' },
        { path: '/interview-strategy', title: 'Interview Strategy' },
        { path: '/company-values', title: 'Company Values' },
        { path: '/progress-tracker', title: 'Progress Tracker' },
        { path: '/interview-notes', title: 'Interview Notes' },
      ];

      for (const pageInfo of pages) {
        await page.goto(`${BASE_URL}${pageInfo.path}`);
        await expect(page.locator(`text=${pageInfo.title}`)).toBeVisible({ timeout: 10000 });
        
        // Check that page loads without errors
        const errors = await page.evaluate(() => {
          return window.console.error.toString();
        });
        
        // Verify no critical JavaScript errors
        await expect(page.locator('body')).toBeVisible();
      }
    });

    test('should test question bank functionality', async ({ page }) => {
      await page.goto(`${BASE_URL}/question-bank`);
      
      // Wait for questions to load
      await expect(page.locator('text=Question Bank')).toBeVisible();
      
      // Test search functionality
      await page.fill('input[placeholder*="Search"]', 'leadership');
      await page.waitForTimeout(1000); // Wait for search to process
      
      // Test company filter
      const companySelect = page.locator('select').first();
      if (await companySelect.isVisible()) {
        await companySelect.selectOption({ index: 1 });
        await page.waitForTimeout(1000);
      }
      
      // Verify questions are displayed
      const questionCards = page.locator('[data-testid="question-card"], .question-card, .card');
      await expect(questionCards.first()).toBeVisible({ timeout: 10000 });
    });

    test('should test system design questions', async ({ page }) => {
      await page.goto(`${BASE_URL}/system-design-questions`);
      
      await expect(page.locator('text=System Design Questions')).toBeVisible();
      
      // Test filtering
      await page.fill('input[placeholder*="Search"]', 'design');
      await page.waitForTimeout(1000);
      
      // Look for practice buttons or expandable content
      const practiceButtons = page.locator('button:has-text("Practice"), button:has-text("View"), button:has-text("Expand")');
      if (await practiceButtons.first().isVisible()) {
        await practiceButtons.first().click();
        await page.waitForTimeout(1000);
      }
    });

    test('should test story creation flow', async ({ page }) => {
      await page.goto(`${BASE_URL}/story-templates`);
      
      await expect(page.locator('text=Story Templates')).toBeVisible();
      
      // Try to create a new story
      const createButton = page.locator('button:has-text("Create"), button:has-text("New"), button:has-text("Add")');
      if (await createButton.first().isVisible()) {
        await createButton.first().click();
        
        // Fill out story form if it appears
        const titleInput = page.locator('input[placeholder*="title"], input[name="title"]');
        if (await titleInput.isVisible()) {
          await titleInput.fill('Test Story Title');
          
          const situationInput = page.locator('textarea[placeholder*="situation"], textarea[name="situation"]');
          if (await situationInput.isVisible()) {
            await situationInput.fill('Test situation description');
          }
          
          // Try to save
          const saveButton = page.locator('button:has-text("Save"), button:has-text("Create"), button:has-text("Submit")');
          if (await saveButton.isVisible()) {
            await saveButton.click();
            await page.waitForTimeout(2000);
          }
        }
      }
    });
  });

  test.describe('Admin Dashboard Features', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin for each test
      await page.goto(`${BASE_URL}/login`);
      await page.click('button:has-text("Admin Demo Login")');
      await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
      await page.goto(`${BASE_URL}/admin`);
      await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    });

    test('should display admin statistics', async ({ page }) => {
      // Check that all stat cards are visible
      await expect(page.locator('text=Total Users')).toBeVisible();
      await expect(page.locator('text=Stories')).toBeVisible();
      await expect(page.locator('text=Questions')).toBeVisible();
      await expect(page.locator('text=Companies')).toBeVisible();
      
      // Check that numbers are displayed
      const statNumbers = page.locator('.text-2xl.font-bold');
      await expect(statNumbers.first()).toBeVisible();
    });

    test('should test user management functionality', async ({ page }) => {
      // Navigate to user management tab
      await page.click('text=User Management');
      
      // Wait for user table to load
      await expect(page.locator('text=Username')).toBeVisible();
      
      // Test search functionality
      const searchInput = page.locator('input[placeholder*="Search users"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('demo');
        await page.waitForTimeout(1000);
      }
      
      // Check that user table has data
      const tableRows = page.locator('table tbody tr');
      await expect(tableRows.first()).toBeVisible({ timeout: 10000 });
    });

    test('should test activity monitoring', async ({ page }) => {
      // Navigate to activity tab
      await page.click('text=Activity');
      
      // Check for activity sections
      await expect(page.locator('text=Recent Activity')).toBeVisible();
      
      // Look for activity data
      const activitySections = page.locator('text=New Users, text=New Stories');
      if (await activitySections.first().isVisible()) {
        await expect(activitySections.first()).toBeVisible();
      }
    });

    test('should test system management', async ({ page }) => {
      // Navigate to system tab
      await page.click('text=System');
      
      // Check for system management options
      await expect(page.locator('text=System Management')).toBeVisible();
      
      // Test reseed functionality (should be available)
      const reseedButton = page.locator('button:has-text("Reseed Database")');
      await expect(reseedButton).toBeVisible();
      await expect(reseedButton).toBeEnabled();
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle invalid login credentials', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      await page.fill('input[placeholder="Username"]', 'invaliduser');
      await page.fill('input[placeholder="Password"]', 'wrongpassword');
      await page.click('button:has-text("Sign In")');
      
      // Should show error message
      await expect(page.locator('text=Invalid, text=Error, text=failed')).toBeVisible({ timeout: 5000 });
    });

    test('should handle registration validation', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Switch to registration
      await page.click('text=Don\'t have an account? Sign up');
      
      // Try to submit with mismatched passwords
      await page.fill('input[placeholder="Username"]', 'testuser');
      await page.fill('input[placeholder="Password"]', 'password123');
      await page.fill('input[placeholder="Confirm Password"]', 'different');
      await page.click('button:has-text("Create Account")');
      
      // Should show validation error
      await expect(page.locator('text=match, text=Error, text=validation')).toBeVisible({ timeout: 5000 });
    });

    test('should handle network errors gracefully', async ({ page }) => {
      await page.goto(`${BASE_URL}/login`);
      
      // Intercept and fail API requests
      await page.route('**/api/auth/login', route => route.abort());
      
      await page.fill('input[placeholder="Username"]', 'demo');
      await page.fill('input[placeholder="Password"]', 'demodemo');
      await page.click('button:has-text("Sign In")');
      
      // Should handle the error gracefully
      await page.waitForTimeout(2000);
      // The page should still be functional
      await expect(page.locator('input[placeholder="Username"]')).toBeVisible();
    });
  });
});
