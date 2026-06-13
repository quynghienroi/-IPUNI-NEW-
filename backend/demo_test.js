const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 430, height: 932 });

  try {
    console.log('🎬 DEMO: Medications Feature\n');

    // Login
    console.log('1️⃣  Logging in...');
    await page.goto('http://localhost:5174/login');
    await page.waitForLoadState('networkidle');
    await page.fill('input[type="text"]', 'khoi@example.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    console.log('   ✓ Logged in as khoi@example.com\n');

    // Go to medications
    console.log('2️⃣  Opening Medications page...');
    await page.goto('http://localhost:5174/medications');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    console.log('   ✓ Page loaded\n');

    // Get medications
    const cards = await page.locator('[class*="card"]').all();
    console.log(`3️⃣  Found ${cards.length} medications:\n`);

    for (let i = 0; i < Math.min(3, cards.length); i++) {
      const card = cards[i];
      const name = await card.locator('[class*="name"]').textContent();
      const frequency = await card.locator('[class*="frequency"]').textContent();
      const doctor = await card.locator('[class*="doctor"]').textContent();
      const hasDropdown = await card.locator('select').count() > 0;
      const hasDetail = await card.locator('[class*="detailBtn"]').count() > 0;

      console.log(`   📋 Medication ${i + 1}:`);
      console.log(`      Name: ${name}`);
      console.log(`      Frequency: ${frequency}`);
      console.log(`      Doctor: ${doctor}`);
      console.log(`      Status dropdown: ${hasDropdown ? '✓' : '✗'}`);
      console.log(`      Detail button: ${hasDetail ? '✓' : '✗'}`);
      console.log();
    }

    console.log('4️⃣  Testing Detail Modal (click first medication)...');
    const firstDetail = await cards[0].locator('[class*="detailBtn"]').first();
    await firstDetail.click();
    await page.waitForTimeout(1000);

    const modalTitle = await page.locator('[class*="title"]').textContent();
    const sections = await page.locator('[class*="sectionTitle"]').allTextContents();
    const timeItems = await page.locator('[class*="timeItem"]').all();

    console.log(`   ✓ Modal opened: "${modalTitle}"`);
    console.log(`   ✓ Sections: ${sections.join(', ')}`);
    console.log(`   ✓ Schedule times: ${timeItems.length} giờ uống\n`);

    console.log('✨ DEMO COMPLETE!\n');
    console.log('Bạn có thể test:');
    console.log('  • Thay đổi status từ dropdown');
    console.log('  • Click detail để xem chi tiết loại thuốc');
    console.log('  • Xem lịch uống theo BS kê');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await browser.close();
  }
})();
