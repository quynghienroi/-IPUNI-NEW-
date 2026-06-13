const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 430, height: 932 });

  try {
    console.log('Testing Medications Enhancement...\n');

    // Login
    await page.goto('http://localhost:5174/login');
    await page.fill('input[type="text"]', 'khoi@example.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await page.waitForLoadState('networkidle');
    console.log('✅ Logged in\n');

    // Go to medications
    await page.goto('http://localhost:5174/medications');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    console.log('1️⃣  Medications Page:');
    const cards = await page.locator('[class*="card"]').all();
    console.log(`   Cards found: ${cards.length}\n`);

    if (cards.length > 0) {
      const firstCard = cards[0];
      
      console.log('2️⃣  First Medication Card:');
      const name = await firstCard.locator('[class*="name"]').textContent();
      const statusSelect = await firstCard.locator('select').count();
      const detailBtn = await firstCard.locator('[class*="detailBtn"]').count();
      
      console.log(`   Name: "${name}"`);
      console.log(`   Has status dropdown: ${statusSelect > 0 ? '✓' : '✗'}`);
      console.log(`   Has detail button: ${detailBtn > 0 ? '✓' : '✗'}\n`);

      // Click detail button
      if (detailBtn > 0) {
        console.log('3️⃣  Opening Detail Modal:');
        await firstCard.locator('[class*="detailBtn"]').click();
        await page.waitForTimeout(800);

        // Check modal content
        const modal = await page.locator('[class*="header"]').count();
        const sectionTitle = await page.locator('[class*="sectionTitle"]').count();
        const timeItems = await page.locator('[class*="timeItem"]').count();

        console.log(`   Modal opened: ${modal > 0 ? '✓' : '✗'}`);
        console.log(`   Sections visible: ${sectionTitle}`);
        console.log(`   Schedule time items: ${timeItems}`);

        if (sectionTitle > 0) {
          const titles = await page.locator('[class*="sectionTitle"]').allTextContents();
          console.log(`\n   Sections:`);
          titles.forEach((t, i) => console.log(`     ${i + 1}. ${t}`));
        }
      }
    }

    console.log('\n✨ Medications feature updated!');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await browser.close();
  }
})();
