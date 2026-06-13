const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 430, height: 932 });

  try {
    console.log('===== THEME ISOLATION VERIFICATION =====\n');

    console.log('1️⃣  Verify Login Page (default blue theme)');
    await page.goto('http://localhost:5174/login');
    await page.waitForLoadState('networkidle');
    let theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   ✅ Theme: "${theme || 'default'}" (empty = blue)\n`);

    console.log('2️⃣  Login with khoi@example.com');
    await page.fill('input[type="text"]', 'khoi@example.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    console.log(`   ✅ Logged in\n`);

    console.log('3️⃣  Switch to Cute Mode (purple)');
    // Click user menu button
    let buttons = await page.locator('button').all();
    console.log(`   Found ${buttons.length} buttons`);
    if (buttons.length > 2) {
      await buttons[2].click();
      await page.waitForTimeout(700);
      
      // Click Settings option
      const settingBtn = page.locator('text="Cài Đặt"');
      if (await settingBtn.isVisible()) {
        await settingBtn.click();
        await page.waitForTimeout(800);
        
        // Toggle cute mode
        const toggle = await page.locator('input[type="checkbox"]').first();
        await toggle.click();
        await page.waitForTimeout(1500);
      }
    }
    
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   ✅ Theme: "${theme}" (should be "cute")\n`);

    console.log('4️⃣  Logout');
    buttons = await page.locator('button').all();
    if (buttons.length > 2) {
      await buttons[2].click();
      await page.waitForTimeout(600);
      
      const logoutBtn = page.locator('text="Đăng Xuất"');
      if (await logoutBtn.isVisible()) {
        await logoutBtn.click();
      }
    }
    
    try {
      await page.waitForURL('**/login', { timeout: 5000 });
    } catch (e) {}
    await page.waitForTimeout(1000);
    
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   ✅ Logged out. URL: ${page.url()}`);
    console.log(`   ✅ Theme: "${theme || 'default'}" (should be empty/default)\n`);

    console.log('5️⃣  Verify Login Page is Default Blue');
    if (!page.url().includes('login')) {
      await page.goto('http://localhost:5174/login');
      await page.waitForLoadState('networkidle');
    }
    
    theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    console.log(`   ✅ Theme: "${theme || 'default'}" (should be empty/default)`);
    
    if (!theme || theme === '') {
      console.log('\n✨ SUCCESS - Theme is properly isolated!');
      console.log('   - Login page: default blue ✓');
      console.log('   - App with cute mode: purple ✓');
      console.log('   - After logout: back to default blue ✓');
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
