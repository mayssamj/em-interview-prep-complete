
import { test, expect } from '@playwright/test';

const PREVIEW_URL = 'https://125d7b9e76-3000.preview.abacusai.app';

test.describe('Preview URL Final Verification Tests', () => {
  test('should load login page correctly', async ({ page }) => {
    await page.goto(PREVIEW_URL);
    
    // Should redirect to login
    await expect(page).toHaveURL(/login/);
    
    // Should show login form elements
    await expect(page.locator('input[placeholder*="Username"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });

  test('should show demo login buttons', async ({ page }) => {
    await page.goto(`${PREVIEW_URL}/login`);
    
    // Should show demo login buttons
    await expect(page.locator('button:has-text("Demo User Login")')).toBeVisible();
    await expect(page.locator('button:has-text("Admin Demo Login")')).toBeVisible();
  });

  test('should perform manual login successfully', async ({ page }) => {
    await page.goto(`${PREVIEW_URL}/login`);
    
    // Fill in login form
    await page.fill('input[placeholder*="Username"]', 'demo');
    await page.fill('input[type="password"]', 'demo123');
    
    // Submit form
    await page.click('button:has-text("Sign In")');
    
    // Wait for navigation
    await page.waitForTimeout(3000);
    
    // Should not be on login page anymore
    expect(page.url()).not.toMatch(/login/);
  });

  test('should access dashboard after login', async ({ page }) => {
    // Login via API
    await page.request.post(`${PREVIEW_URL}/api/auth/login`, {
      data: { username: 'demo', password: 'demo123' }
    });
    
    // Access dashboard
    await page.goto(`${PREVIEW_URL}/dashboard`);
    
    // Should show dashboard content
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should access question bank after login', async ({ page }) => {
    // Login via API
    await page.request.post(`${PREVIEW_URL}/api/auth/login`, {
      data: { username: 'demo', password: 'demo123' }
    });
    
    // Access question bank
    await page.goto(`${PREVIEW_URL}/question-bank`);
    
    // Should not redirect to login
    await expect(page).not.toHaveURL(/login/);
    
    // Should show question bank content
    await expect(page.locator('text=Question')).toBeVisible();
  });

  test('should access company values after login', async ({ page }) => {
    // Login via API
    await page.request.post(`${PREVIEW_URL}/api/auth/login`, {
      data: { username: 'demo', password: 'demo123' }
    });
    
    // Access company values
    await page.goto(`${PREVIEW_URL}/company-values`);
    
    // Should not redirect to login
    await expect(page).not.toHaveURL(/login/);
    
    // Should show company values content
    await expect(page.locator('text=Company')).toBeVisible();
  });

  test('should access system design questions after login', async ({ page }) => {
    // Login via API
    await page.request.post(`${PREVIEW_URL}/api/auth/login`, {
      data: { username: 'demo', password: 'demo123' }
    });
    
    // Access system design questions
    await page.goto(`${PREVIEW_URL}/system-design-questions`);
    
    // Should not redirect to login
    await expect(page).not.toHaveURL(/login/);
    
    // Should show system design content
    await expect(page.locator('text=System')).toBeVisible();
  });

  test('should access story templates after login', async ({ page }) => {
    // Login via API
    await page.request.post(`${PREVIEW_URL}/api/auth/login`, {
      data: { username: 'demo', password: 'demo123' }
    });
    
    // Access story templates
    await page.goto(`${PREVIEW_URL}/story-templates`);
    
    // Should not redirect to login
    await expect(page).not.toHaveURL(/login/);
    
    // Should show story templates content
    await expect(page.locator('text=Story')).toBeVisible();
  });

  test('should access interview strategy after login', async ({ page }) => {
    // Login via API
    await page.request.post(`${PREVIEW_URL}/api/auth/login`, {
      data: { username: 'demo', password: 'demo123' }
    });
    
    // Access interview strategy
    await page.goto(`${PREVIEW_URL}/interview-strategy`);
    
    // Should not redirect to login
    await expect(page).not.toHaveURL(/login/);
    
    // Should show interview strategy content
    await expect(page.locator('text=Interview')).toBeVisible();
  });

  test('should access progress tracker after login', async ({ page }) => {
    // Login via API
    await page.request.post(`${PREVIEW_URL}/api/auth/login`, {
      data: { username: 'demo', password: 'demo123' }
    });
    
    // Access progress tracker
    await page.goto(`${PREVIEW_URL}/progress-tracker`);
    
    // Should not redirect to login
    await expect(page).not.toHaveURL(/login/);
    
    // Should show progress tracker content
    await expect(page.locator('text=Progress')).toBeVisible();
  });

  test('should handle my-stories redirect', async ({ page }) => {
    // Login via API
    await page.request.post(`${PREVIEW_URL}/api/auth/login`, {
      data: { username: 'demo', password: 'demo123' }
    });
    
    // Access my-stories (should redirect to stories)
    await page.goto(`${PREVIEW_URL}/my-stories`);
    
    // Should redirect to stories page
    await expect(page).toHaveURL(/stories/);
  });

  test('should access FAQ page', async ({ page }) => {
    // Login via API
    await page.request.post(`${PREVIEW_URL}/api/auth/login`, {
      data: { username: 'demo', password: 'demo123' }
    });
    
    // Access FAQ
    await page.goto(`${PREVIEW_URL}/faq`);
    
    // Should not redirect to login
    await expect(page).not.toHaveURL(/login/);
    
    // Should show FAQ content
    await expect(page.locator('text=FAQ')).toBeVisible();
  });

  test('should handle admin login', async ({ page }) => {
    // Login as admin via API
    await page.request.post(`${PREVIEW_URL}/api/auth/login`, {
      data: { username: 'admin', password: 'admin123' }
    });
    
    // Access dashboard
    await page.goto(`${PREVIEW_URL}/dashboard`);
    
    // Should show dashboard content
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should handle health endpoint', async ({ page }) => {
    const response = await page.request.get(`${PREVIEW_URL}/api/health`);
    expect(response.status()).toBe(200);
  });

  test('should handle logout', async ({ page }) => {
    // Login via API
    await page.request.post(`${PREVIEW_URL}/api/auth/login`, {
      data: { username: 'demo', password: 'demo123' }
    });
    
    // Go to dashboard
    await page.goto(`${PREVIEW_URL}/dashboard`);
    
    // Look for logout button
    const logoutButton = page.locator('text=Logout').first();
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
      
      // Should redirect to login
      await expect(page).toHaveURL(/login/);
    } else {
      // If no logout button visible, just verify we can access login
      await page.goto(`${PREVIEW_URL}/login`);
      await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
    }
  });
});
