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

    // Check tab labels
    const tabs = await page.locator('[class*="tab"]').all();
    console.log('✅ Tab Labels:');
    for (let i = 0; i < tabs.length; i++) {
      const text = await tabs[i].textContent();
      console.log(`   Tab ${i + 1}: "${text}"`);
    }

    // Verify the change
    const secondTab = await page.locator('[class*="tab"]').nth(1).textContent();
    if (secondTab === 'Lời dặn') {
      console.log('\n✨ Success! "Từ bác sĩ" → "Lời dặn" ✓');
    }

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await browser.close();
  }
})();
