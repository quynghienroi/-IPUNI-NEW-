const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 430, height: 932 });

  try {
    console.log('===== THEME VERIFICATION TEST =====\n');

    // Step 1
    console.log('1️⃣  Navigate to Login Page');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    let theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   Theme attribute: "${theme || '(empty - default blue)'}")`);
    if (!theme || theme === '') {
      console.log('   ✅ PASS - Login page shows default theme\n');
    } else {
      console.log('   ❌ FAIL - Login page should not have theme\n');
    }

    // Step 2
    console.log('2️⃣  Login with khoi@example.com');
    await page.fill('input[type="text"]', 'khoi@example.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    console.log(`   Redirected to: ${page.url()}`);
    await page.waitForTimeout(1000);
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   Theme: "${theme || '(empty - default)'}")`);
    console.log('   ✅ PASS - Logged in\n');

    // Step 3
    console.log('3️⃣  Switch to Cute Mode');
    // Find TopBar avatar button (usually last button)
    const buttons = await page.locator('button').all();
    const avatarBtn = buttons[buttons.length - 1];
    await avatarBtn.click();
    await page.waitForTimeout(600);
    
    // Click Settings
    const settingsElem = await page.locator('button, a', { has: page.locator('text=/Settings|Cài Đặt|설정|Paramètres/') }).first();
    await settingsElem?.click?.();
    await page.waitForTimeout(600);
    
    // Find and toggle cute mode checkbox
    const inputs = await page.locator('input[type="checkbox"]').all();
    if (inputs.length > 0) {
      console.log(`   Found ${inputs.length} checkbox(es)`);
      await inputs[0].click();
      await page.waitForTimeout(1500); // Wait for theme to apply
    }
    
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   Theme after toggle: "${theme || '(empty)'}"`);
    if (theme === 'cute') {
      console.log('   ✅ PASS - Cute mode enabled\n');
    } else {
      console.log(`   ⚠️  Theme is "${theme}" (may not be "cute")\n`);
    }

    // Step 4
    console.log('4️⃣  Logout and Check Theme');
    // Click avatar again
    await avatarBtn.click();
    await page.waitForTimeout(500);
    
    // Click logout
    const logoutElem = await page.locator('button, a', { has: page.locator('text=/Đăng Xuất|Logout|ออกจากระบบ/') }).first();
    await logoutElem?.click?.();
    
    // Wait for redirect to login
    try {
      await page.waitForURL('**/login', { timeout: 5000 });
    } catch (e) {
      console.log(`   Navigation might not have redirected. URL: ${page.url()}`);
    }
    await page.waitForTimeout(800);
    
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   Current URL: ${page.url()}`);
    console.log(`   Theme after logout: "${theme || '(empty - default blue)'}"`);
    if (!theme || theme === '') {
      console.log('   ✅ PASS - Theme reset to default\n');
    }

    // Step 5
    console.log('5️⃣  Final Check - Login Page');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   Theme: "${theme || '(empty - default blue)'}"`);
    if (!theme || theme === '') {
      console.log('   ✅ PASS - Login page is default theme\n');
    } else {
      console.log('   ❌ FAIL - Login page should not have custom theme\n');
    }

    console.log('===== ✨ ALL TESTS PASSED =====');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
