const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 430, height: 932 });

  try {
    console.log('===== THEME SWITCHING VERIFICATION =====\n');

    // Step 1: Check login page theme
    console.log('✅ Step 1: Login Page (should be DEFAULT BLUE)');
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    let theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   data-theme: "${theme || '(empty/default)'}\n`);

    // Step 2: Login
    console.log('✅ Step 2: Login');
    await page.fill('input[type="text"]', 'khoi@example.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await page.waitForLoadState('networkidle');
    console.log(`   Logged in. URL: ${page.url()}\n`);

    // Step 3: Enable Cute Mode
    console.log('✅ Step 3: Switch to CUTE MODE (should turn PURPLE)');
    
    // Click user button (index 2)
    const buttons = await page.locator('button').all();
    await buttons[2].click(); // User button
    await page.waitForTimeout(600);
    
    // Find and click Settings button in dropdown
    const settingsLink = await page.locator('a:has-text("Cài Đặt"), button:has-text("Cài Đặt")').first();
    await settingsLink.click();
    await page.waitForTimeout(600);

    // Find cute mode toggle - should be a checkbox
    const cuteCheckbox = await page.locator('input[type="checkbox"]').first();
    await cuteCheckbox.click();
    await page.waitForTimeout(1200); // Wait for theme animation

    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   data-theme after toggle: "${theme}"`);
    console.log(`   ${theme === 'cute' ? '✓' : '?'} Should be "cute"\n`);

    // Step 4: Logout
    console.log('✅ Step 4: LOGOUT (should reset to DEFAULT BLUE)');
    await buttons[2].click(); // Open user menu again
    await page.waitForTimeout(600);
    
    const logoutLink = await page.locator('a:has-text("Đăng Xuất"), button:has-text("Đăng Xuất")').first();
    await logoutLink.click();
    
    // Wait for redirect and theme reset
    await page.waitForURL('**/login');
    await page.waitForTimeout(1000);
    
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   Redirected to: ${page.url()}`);
    console.log(`   data-theme after logout: "${theme || '(empty/default)'}"\n`);

    // Step 5: Verify login page is default
    console.log('✅ Step 5: Login Page Again (should be DEFAULT BLUE)');
    const finalTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   data-theme: "${finalTheme || '(empty/default)'}\n`);

    console.log('===== ✨ TEST COMPLETE =====');
    if (theme === null || theme === '') {
      console.log('✅ PASS - Login page is in default theme after logout');
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
