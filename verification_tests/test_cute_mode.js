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

    console.log('✅ Logged in to Dashboard');
    let theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   Initial theme: "${theme || 'empty/default'}"`);

    // Get all button classes to find user menu
    const buttons = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).map(b => b.className);
    });
    console.log(`   Buttons: ${buttons.join(', ')}`);

    // Click on buttons to find user menu - try different selectors
    await page.click('button._userBtn_wpehi_1, button[class*="user"]');
    await page.waitForTimeout(800);

    // Check if menu is open
    const menuVisible = await page.evaluate(() => {
      return document.body.textContent.includes('Cài Đặt') || 
             document.body.textContent.includes('Đăng Xuất');
    });
    console.log(`   Menu visible: ${menuVisible}`);

    if (menuVisible) {
      // Click Settings
      await page.click('a:has-text("Cài Đặt"), button:has-text("Cài Đặt")');
      await page.waitForTimeout(1000);

      // Toggle cute mode checkbox
      const checkboxes = await page.locator('input[type="checkbox"]').all();
      if (checkboxes.length > 0) {
        console.log(`   Found ${checkboxes.length} checkbox(es)`);
        await checkboxes[0].click();
        await page.waitForTimeout(1500);
      }

      theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      console.log(`   ✅ After Cute Mode toggle: "${theme}"`);
    }

    // Logout
    await page.click('button._userBtn_wpehi_1, button[class*="user"]');
    await page.waitForTimeout(600);
    
    const logoutVisible = await page.evaluate(() => document.body.textContent.includes('Đăng Xuất'));
    if (logoutVisible) {
      await page.click('a:has-text("Đăng Xuất"), button:has-text("Đăng Xuất")');
      try {
        await page.waitForURL('**/login', { timeout: 5000 });
      } catch (e) {}
    }

    await page.waitForTimeout(1000);
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   ✅ After logout: "${theme || 'empty/default'}"`);

    if (!theme || theme === '') {
      console.log('\n✅ SUCCESS - Theme properly reset to default after logout!');
    }

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
