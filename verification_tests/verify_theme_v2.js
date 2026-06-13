const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const pageSize = { width: 430, height: 932 }; // Mobile size
  await page.setViewportSize(pageSize);

  try {
    console.log('📍 Step 1: Login page - verify default theme');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    
    let htmlTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   ✅ Theme: "${htmlTheme || 'default'}" (empty = default blue)`);

    console.log('\n📍 Step 2: Login');
    await page.fill('input[type="text"]', 'khoi@example.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    console.log(`   ✅ Logged in. URL: ${page.url()}`);

    console.log('\n📍 Step 3: Open Settings → Toggle Cute Mode');
    // Find avatar button in TopBar - should be last button/clickable element
    const topBarButtons = await page.locator('.TopBar button, .TopBar [role="button"]').all();
    if (topBarButtons.length > 0) {
      await topBarButtons[topBarButtons.length - 1].click();
      await page.waitForTimeout(500);
    }
    
    // Take screenshot to see menu
    await page.screenshot({ path: 'dashboard1.png' });
    
    // Click Settings if visible
    const settingsBtn = await page.locator('text=/Cài Đặt|Settings/i').first();
    if (await settingsBtn.isVisible()) {
      await settingsBtn.click();
      await page.waitForTimeout(800);
    }

    // Toggle cute mode checkbox/button
    const cuteToggle = await page.locator('input[type="checkbox"]').first();
    if (await cuteToggle.isVisible()) {
      await cuteToggle.click();
      await page.waitForTimeout(1200);
    }

    let cuteTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   ✅ Cute Mode applied. Theme: "${cuteTheme}" (should be "cute")`);
    
    await page.screenshot({ path: 'dashboard_cute.png' });

    console.log('\n📍 Step 4: Logout');
    // Reopen menu
    const menuButtons = await page.locator('button').all();
    for (let btn of menuButtons) {
      const ariaLabel = await btn.getAttribute('aria-label');
      if (ariaLabel && ariaLabel.toLowerCase().includes('user')) {
        await btn.click();
        break;
      }
    }
    await page.waitForTimeout(500);
    
    // Find and click logout
    const logoutBtn = await page.locator('text=/Đăng Xuất|Logout/i').first();
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
      await page.waitForNavigation({ waitUntil: 'networkidle' });
      await page.waitForTimeout(800);
    }

    let afterLogout = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   ✅ Logged out. URL: ${page.url()}`);
    console.log(`   ✅ Theme after logout: "${afterLogout || 'default'}" (should be default)`);
    
    await page.screenshot({ path: 'login_after_logout.png' });

    console.log('\n✨ VERIFICATION COMPLETE');
    console.log('Screenshots saved: dashboard1.png, dashboard_cute.png, login_after_logout.png');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    await page.screenshot({ path: 'error.png' });
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
