const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 430, height: 932 });

  try {
    // Login
    await page.goto('http://localhost:5174/login');
    await page.fill('input[type="text"]', 'khoi@example.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await page.waitForLoadState('networkidle');

    // Go to appointments
    await page.goto('http://localhost:5174/appointments');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // Get the tabToggle container
    const tabToggle = await page.locator('[class*="tabToggle"]');
    const text = await tabToggle.textContent();
    console.log('Tab Text Content:', text);

    // Find individual tabs within tabToggle
    const tabs = await page.locator('[class*="tabToggle"] [class*="tab"]').all();
    console.log(`\n✅ Found ${tabs.length} tabs:`);
    for (let i = 0; i < tabs.length; i++) {
      const tabText = await tabs[i].textContent();
      console.log(`   Tab ${i + 1}: "${tabText}"`);
    }

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await browser.close();
  }
})();
