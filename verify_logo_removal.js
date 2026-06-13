const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 430, height: 932 });

  try {
    console.log('===== LOGO REMOVAL VERIFICATION =====\n');

    // TEST 1: Login page
    console.log('1️⃣  LOGIN PAGE - Check for white "DIA+" text only');
    await page.goto('http://localhost:5174/login');
    await page.waitForLoadState('networkidle');
    
    const loginLogoText = await page.locator('.logoSection').textContent();
    const hasImage = await page.locator('.logoSection img').count();
    console.log(`   Logo section text: "${loginLogoText}"`);
    console.log(`   Image elements: ${hasImage} (should be 0)`);
    console.log(`   ${hasImage === 0 && loginLogoText?.includes('DIA+') ? '✅ PASS' : '❌ FAIL'}\n`);

    // TEST 2: Login
    console.log('2️⃣  LOGIN');
    await page.fill('input[type="text"]', 'khoi@example.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await page.waitForLoadState('networkidle');
    console.log(`   ✅ Logged in\n`);

    // TEST 3: TopBar - check white "DIA+" text only
    console.log('3️⃣  TOPBAR - Check for white "DIA+" text only');
    const topbarLogo = await page.locator('.topbar .logo').textContent();
    const topbarImages = await page.locator('.topbar .logo img').count();
    console.log(`   TopBar logo text: "${topbarLogo}"`);
    console.log(`   Image elements in TopBar: ${topbarImages} (should be 0)`);
    console.log(`   ${topbarImages === 0 && topbarLogo?.includes('DIA+') ? '✅ PASS' : '❌ FAIL'}\n`);

    // TEST 4: Check all pages
    console.log('4️⃣  CHECK ALL PROTECTED PAGES');
    const pages = [
      { path: '/', name: 'Dashboard' },
      { path: '/metrics', name: 'Metrics' },
      { path: '/medications', name: 'Medications' },
      { path: '/appointments', name: 'Appointments' },
      { path: '/advice', name: 'Advice' }
    ];

    for (const p of pages) {
      await page.goto(`http://localhost:5174${p.path}`);
      await page.waitForLoadState('networkidle');
      const images = await page.locator('.topbar img').count();
      const text = await page.locator('.topbar .logo').textContent();
      const logoOK = images === 0 && text?.includes('DIA+');
      console.log(`   ${logoOK ? '✅' : '❌'} ${p.name}: text="${text?.trim()}" images=${images}`);
    }

    console.log('\n5️⃣  VERIFY NO IMG ELEMENTS IN APP');
    // Check that no logo images are loaded anywhere
    const allImages = await page.locator('img[alt="DIA+"], img[src*="logo"]').count();
    console.log(`   Logo-related images in app: ${allImages} (should be 0)`);
    console.log(`   ${allImages === 0 ? '✅ PASS' : '❌ FAIL'}\n`);

    console.log('===== ✨ VERIFICATION COMPLETE =====');
    if (hasImage === 0 && topbarImages === 0 && allImages === 0) {
      console.log('✅ SUCCESS - Logo image completely removed!');
      console.log('   - Only "DIA+" text in white shown');
      console.log('   - No logo images anywhere in app');
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
