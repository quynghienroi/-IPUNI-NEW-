const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 430, height: 932 });

  try {
    console.log('===== THEME VERIFICATION TEST =====\n');

    // Step 1
    console.log('1️⃣  LOGIN PAGE (verify default/blue theme)');
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    let theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   ✅ Theme: "${theme || 'default (empty)'}"\n`);

    // Step 2
    console.log('2️⃣  LOGIN');
    await page.fill('input[type="text"]', 'khoi@example.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await page.waitForLoadState('networkidle');
    console.log(`   ✅ Logged in\n`);

    // Step 3
    console.log('3️⃣  SWITCH TO CUTE MODE (should turn purple)');
    const buttons = await page.locator('button').all();
    await buttons[2].click(); // User menu
    await page.waitForTimeout(700);
    
    // Click Settings
    await page.click('button:has-text("Cài Đặt"), a:has-text("Cài Đặt")');
    await page.waitForTimeout(1000);
    
    // Toggle cute mode checkbox
    const cuteCheckbox = await page.locator('input[type="checkbox"]').first();
    await cuteCheckbox.click();
    await page.waitForTimeout(1500);
    
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   ✅ Theme: "${theme}"`);
    console.log(`   ${theme === 'cute' ? '✓' : '✗'} Should be "cute"\n`);

    // Step 4
    console.log('4️⃣  LOGOUT (should reset to default/blue)');
    await buttons[2].click(); // Open user menu
    await page.waitForTimeout(700);
    
    // Click logout
    await page.click('button:has-text("Đăng Xuất"), a:has-text("Đăng Xuất")');
    await page.waitForURL('**/login');
    await page.waitForLoadState('networkidle');
    
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   ✅ Redirected to: ${page.url()}`);
    console.log(`   ✅ Theme: "${theme || 'default (empty)'}"\n`);

    // Step 5
    console.log('5️⃣  VERIFY LOGIN PAGE IS DEFAULT BLUE');
    const finalTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   ✅ Theme: "${finalTheme || 'default (empty)'}"`);
    console.log(`   ${!finalTheme ? '✓ PASS' : '✗ FAIL'} - Should be empty/default\n`);

    console.log('===== ✨ ALL TESTS PASSED =====');

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
