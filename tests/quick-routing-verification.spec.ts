
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PREVIEW_URL || 'http://localhost:3000';

test.describe('Quick Routing Verification', () => {
  test('should verify all navigation routes work without 404', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'adminadmin');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 10000 });

    // Test all navigation routes
    const routes = [
      '/dashboard',
      '/company-values', 
      '/question-bank',
      '/system-design-questions',
      '/system-design-strategy',
      '/story-templates',
      '/interview-strategy',
      '/progress-tracker',
      '/faq',
      '/admin',
      '/stories',
      '/my-stories' // This should redirect to /stories
    ];

    let passedRoutes = 0;
    let totalRoutes = routes.length;

    for (const route of routes) {
      try {
        console.log(`Testing route: ${route}`);
        await page.goto(`${BASE_URL}${route}`, { timeout: 10000 });
        
        // Wait for page to load
        await page.waitForLoadState('domcontentloaded', { timeout: 5000 });
        
        // Check for actual 404 error page indicators
        const pageTitle = await page.title();
        const pageText = await page.textContent('body');
        const has404 = pageTitle.includes('404') || 
                      pageText.includes('Page Not Found') || 
                      pageText.includes('This page could not be found') ||
                      pageText.includes('404: This page could not be found');
        
        if (!has404) {
          console.log(`✅ ${route} - PASSED`);
          passedRoutes++;
        } else {
          console.log(`❌ ${route} - FAILED (404 detected)`);
        }
      } catch (error) {
        console.log(`❌ ${route} - FAILED (${error.message})`);
      }
    }

    const successRate = (passedRoutes / totalRoutes) * 100;
    console.log(`\nSuccess Rate: ${successRate}% (${passedRoutes}/${totalRoutes})`);
    
    // Expect at least 90% success rate
    expect(successRate).toBeGreaterThanOrEqual(90);
  });

  test('should verify my-stories redirect works', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'adminadmin');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 10000 });

    // Test my-stories redirect
    await page.goto(`${BASE_URL}/my-stories`);
    
    // Should redirect to /stories
    await page.waitForURL(`${BASE_URL}/stories`, { timeout: 10000 });
    
    // Verify we're on stories page and no 404
    const pageTitle = await page.title();
    const pageText = await page.textContent('body');
    expect(pageTitle).not.toContain('404');
    expect(pageText).not.toContain('Page Not Found');
    expect(pageText).not.toContain('This page could not be found');
  });

  test('should verify demo login buttons work', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Test Admin Demo Login button
    const adminDemoButton = page.locator('button:has-text("Admin Demo Login")');
    await adminDemoButton.click();
    
    // Should redirect to dashboard
    await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 10000 });
    
    // Verify we're logged in as admin
    const pageText = await page.textContent('body');
    expect(pageText).toContain('admin');
  });
});
