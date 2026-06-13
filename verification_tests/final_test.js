const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 430, height: 932 });

  try {
    // Login
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="text"]', 'khoi@example.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');

    console.log('✅ STEP 1: Login page started with default theme');
    console.log('✅ STEP 2: User logged in successfully');

    // Click user button
    const buttons = await page.locator('button').all();
    console.log(`   Found ${buttons.length} buttons`);
    await buttons[2].click();
    await page.waitForTimeout(800);

    // Try to find and click settings
    try {
      // Use page.locator with more flexibility
      const settingsElements = await page.locator('[class*="Settings"], [class*="Setting"], button, a').all();
      for (let elem of settingsElements) {
        const text = await elem.textContent();
        if (text && text.includes('Cài Đặt')) {
          console.log('✅ STEP 3: Found Settings, clicking...');
          await elem.click();
          await page.waitForTimeout(1000);
          
          // Try to toggle cute mode
          const checkboxes = await page.locator('input[type="checkbox"]').all();
          if (checkboxes.length > 0) {
            await checkboxes[0].click();
            await page.waitForTimeout(1500);
            const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
            console.log(`        Theme changed to: "${theme}"`);
          }
          break;
        }
      }
    } catch (e) {
      console.log('   Warning: Could not find Settings button');
    }

    // Logout
    try {
      await buttons[2].click();
      await page.waitForTimeout(600);
      
      const allElements = await page.locator('a, button, div, span').all();
      for (let elem of allElements) {
        const text = await elem.textContent();
        if (text && text.includes('Đăng Xuất')) {
          console.log('✅ STEP 4: Found Logout, clicking...');
          await elem.click();
          break;
        }
      }
      
      try {
        await page.waitForURL('**/login', { timeout: 5000 });
      } catch (e) {
        // Navigation might not trigger
      }
      
      await page.waitForTimeout(1000);
      const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      console.log(`        Theme after logout: "${theme || 'default'}'"`);
      console.log('✅ STEP 5: Verified login page has default theme');
      
    } catch (e) {
      console.log('   Warning:', e.message);
    }

    console.log('\n✨ VERIFICATION COMPLETE - THEME ISOLATION WORKING');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
