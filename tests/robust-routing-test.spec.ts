
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.PREVIEW_URL || 'http://localhost:3000';

test.describe('Robust Routing Test', () => {
  test('should verify all critical routes work correctly', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'adminadmin');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 15000 });

    // Test each route with proper waiting
    const routes = [
      {
        path: '/dashboard',
        waitFor: 'text=Dashboard',
        name: 'Dashboard'
      },
      {
        path: '/company-values',
        waitFor: 'text=Company Values',
        name: 'Company Values'
      },
      {
        path: '/question-bank',
        waitFor: 'text=Question Bank',
        name: 'Question Bank'
      },
      {
        path: '/system-design-questions',
        waitFor: 'text=System Design',
        name: 'System Design Questions'
      },
      {
        path: '/stories',
        waitFor: 'text=Stories',
        name: 'Stories'
      },
      {
        path: '/admin',
        waitFor: 'text=Admin',
        name: 'Admin'
      }
    ];

    let passedRoutes = 0;
    const totalRoutes = routes.length + 1; // +1 for my-stories redirect

    for (const route of routes) {
      try {
        console.log(`Testing ${route.name}: ${route.path}`);
        
        // Navigate to route
        await page.goto(`${BASE_URL}${route.path}`, { timeout: 15000 });
        
        // Wait for specific content to appear
        await page.waitForSelector(route.waitFor, { timeout: 10000 });
        
        // Verify we're not on an error page
        const title = await page.title();
        if (!title.includes('404') && !title.includes('Error')) {
          console.log(`✅ ${route.name} - PASSED`);
          passedRoutes++;
        } else {
          console.log(`❌ ${route.name} - FAILED (error page detected)`);
        }
        
      } catch (error) {
        console.log(`❌ ${route.name} - FAILED (${error.message})`);
      }
    }

    // Test my-stories redirect
    try {
      console.log('Testing my-stories redirect');
      await page.goto(`${BASE_URL}/my-stories`);
      await page.waitForURL(`${BASE_URL}/stories`, { timeout: 10000 });
      await page.waitForSelector('text=Stories', { timeout: 5000 });
      console.log('✅ my-stories redirect - PASSED');
      passedRoutes++;
    } catch (error) {
      console.log(`❌ my-stories redirect - FAILED (${error.message})`);
    }

    const successRate = (passedRoutes / totalRoutes) * 100;
    console.log(`\nSuccess Rate: ${successRate}% (${passedRoutes}/${totalRoutes})`);
    
    // Expect at least 90% success rate
    expect(successRate).toBeGreaterThanOrEqual(90);
  });

  test('should verify demo login works', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    
    // Click Admin Demo Login
    await page.click('button:has-text("Admin Demo Login")');
    
    // Wait for redirect to dashboard
    await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 10000 });
    
    // Wait for dashboard content
    await page.waitForSelector('text=Dashboard', { timeout: 5000 });
    
    // Verify admin user is logged in
    await page.waitForSelector('text=admin', { timeout: 5000 });
    
    console.log('✅ Demo login test - PASSED');
  });

  test('should verify header navigation', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[placeholder="Username"]', 'admin');
    await page.fill('input[placeholder="Password"]', 'adminadmin');
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 10000 });

    // Wait for header to load
    await page.waitForSelector('header', { timeout: 5000 });
    
    // Check header contains expected elements
    const header = page.locator('header');
    await expect(header).toContainText('EM Interview Prep');
    await expect(header).toContainText('admin');
    
    console.log('✅ Header navigation test - PASSED');
  });
});
