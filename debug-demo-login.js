
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  // Navigate to login page
  await page.goto('http://localhost:3000/login');
  
  // Wait for page to load
  await page.waitForSelector('button:has-text("Demo User Login")');
  
  // Check if button is visible and enabled
  const button = page.locator('button:has-text("Demo User Login")');
  console.log('Button visible:', await button.isVisible());
  console.log('Button enabled:', await button.isEnabled());
  
  // Click the button
  console.log('Clicking demo login button...');
  await button.click();
  
  // Wait a bit to see what happens
  await page.waitForTimeout(3000);
  
  // Check current URL
  console.log('Current URL:', page.url());
  
  // Check for any console errors
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await browser.close();
})();
