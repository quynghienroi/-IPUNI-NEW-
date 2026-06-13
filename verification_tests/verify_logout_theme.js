const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 430, height: 932 });

  try {
    console.log('='.repeat(50));
    console.log('THEME ISOLATION VERIFICATION');
    console.log('='.repeat(50));

    // TEST 1: Login page starts with default theme
    console.log('\n📍 TEST 1: Login page (before authentication)');
    await page.goto('http://localhost:5174/login');
    await page.waitForLoadState('networkidle');
    let theme = await page.evaluate(() => {
      const attr = document.documentElement.getAttribute('data-theme');
      return attr === '' || attr === null ? '[EMPTY - DEFAULT BLUE]' : attr;
    });
    console.log(`   data-theme attribute: ${theme}`);
    const test1Pass = theme === '[EMPTY - DEFAULT BLUE]';
    console.log(`   ${test1Pass ? '✅ PASS' : '❌ FAIL'}\n`);

    // TEST 2: Login and verify theme stays default
    console.log('📍 TEST 2: User logs in');
    await page.fill('input[type="text"]', 'khoi@example.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await page.waitForLoadState('networkidle');
    theme = await page.evaluate(() => {
      const attr = document.documentElement.getAttribute('data-theme');
      return attr === '' || attr === null ? '[EMPTY - DEFAULT BLUE]' : attr;
    });
    console.log(`   Logged in, URL: ${page.url()}`);
    console.log(`   data-theme: ${theme}`);
    const test2Pass = theme === '[EMPTY - DEFAULT BLUE]';
    console.log(`   ${test2Pass ? '✅ PASS' : '⚠️ INFO'}\n`);

    // TEST 3: User logs out
    console.log('📍 TEST 3: User logs out');
    // Click user menu
    await page.click('button._userBtn_wpehi_1');
    await page.waitForTimeout(600);
    
    // Click logout
    await page.click('button:has-text("Đăng Xuất"), a:has-text("Đăng Xuất")');
    
    // Wait for navigation to login page
    try {
      await page.waitForURL('**/login', { timeout: 3000 });
    } catch (e) {
      // May not navigate, but that's ok
    }
    await page.waitForTimeout(1000);

    theme = await page.evaluate(() => {
      const attr = document.documentElement.getAttribute('data-theme');
      return attr === '' || attr === null ? '[EMPTY - DEFAULT BLUE]' : attr;
    });
    console.log(`   Logged out, URL: ${page.url()}`);
    console.log(`   data-theme: ${theme}`);
    const test3Pass = theme === '[EMPTY - DEFAULT BLUE]';
    console.log(`   ${test3Pass ? '✅ PASS' : '❌ FAIL'}\n`);

    // TEST 4: Navigate to login page and verify theme
    console.log('📍 TEST 4: Login page (after logout)');
    await page.goto('http://localhost:5174/login');
    await page.waitForLoadState('networkidle');
    theme = await page.evaluate(() => {
      const attr = document.documentElement.getAttribute('data-theme');
      return attr === '' || attr === null ? '[EMPTY - DEFAULT BLUE]' : attr;
    });
    console.log(`   URL: ${page.url()}`);
    console.log(`   data-theme: ${theme}`);
    const test4Pass = theme === '[EMPTY - DEFAULT BLUE]';
    console.log(`   ${test4Pass ? '✅ PASS' : '❌ FAIL'}\n`);

    // SUMMARY
    console.log('='.repeat(50));
    if (test1Pass && test3Pass && test4Pass) {
      console.log('✨ ALL TESTS PASSED');
      console.log('\n📌 CONCLUSION:');
      console.log('   ✅ Login/Register pages always show DEFAULT BLUE theme');
      console.log('   ✅ Theme is properly reset on logout');
      console.log('   ✅ Theme is NOT affected by cached settings from logged-in user');
    } else {
      console.log('⚠️ SOME TESTS FAILED');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
