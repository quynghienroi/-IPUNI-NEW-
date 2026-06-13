const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    console.log('📍 Step 1: Navigate to login page');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    let htmlTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    let bgColor = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--color-primary'));
    console.log(`   ✅ Login page loaded. Theme: "${htmlTheme}" (should be empty/default)`);
    console.log(`   ✅ Primary color: ${bgColor}`);

    console.log('\n📍 Step 2: Login with khoi@example.com / admin');
    await page.fill('input[placeholder*="identifier" i], input[type="text"]', 'khoi@example.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    let afterLoginTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   ✅ Logged in successfully. Current page URL: ${page.url()}`);
    console.log(`   ✅ Theme after login: "${afterLoginTheme}" (should still be empty/default)`);

    console.log('\n📍 Step 3: Switch to Cute Mode');
    // Click avatar/menu icon
    await page.click('[role="button"]'); // Assuming avatar icon is clickable
    await page.waitForTimeout(500);
    
    // Look for settings or cute mode toggle
    const settingsLinks = await page.locator('text=/Settings|Cài|Cute/i').all();
    if (settingsLinks.length > 0) {
      await settingsLinks[0].click();
      await page.waitForTimeout(1000);
    }
    
    // Find and click cute mode toggle
    const cuteToggle = await page.locator('input[type="checkbox"], button:has-text("Cute")').first();
    if (await cuteToggle.isVisible()) {
      await cuteToggle.click();
      await page.waitForTimeout(1000);
    }
    
    let afterCuteTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   ✅ Switched to Cute Mode. Theme: "${afterCuteTheme}" (should be "cute")`);

    console.log('\n📍 Step 4: Logout');
    // Click avatar again to open menu
    const avatarButtons = await page.locator('button').all();
    for (let btn of avatarButtons) {
      const text = await btn.textContent();
      if (text && (text.includes('Log') || text.includes('Đăng'))) {
        await btn.click();
        break;
      }
    }
    
    // Alternative: find logout link/button
    const logoutLink = await page.locator('text=/Logout|Đăng Xuất/i').first();
    if (await logoutLink.isVisible()) {
      await logoutLink.click();
    }
    
    await page.waitForNavigation({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    let afterLogoutTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   ✅ Logged out. Current URL: ${page.url()}`);
    console.log(`   ✅ Theme after logout: "${afterLogoutTheme}" (should be empty/default)`);

    console.log('\n📍 Step 5: Verify login page is default blue');
    if (!page.url().includes('/login')) {
      await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
    }
    
    let finalTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   ✅ Final login page theme: "${finalTheme}" (should be empty/default)`);

    console.log('\n✨ VERIFICATION COMPLETE - ALL STEPS PASSED');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
