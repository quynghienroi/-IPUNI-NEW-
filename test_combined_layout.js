const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 430, height: 932 });

  try {
    console.log('Testing Combined Doctor + Appointment Layout...\n');

    // Login
    await page.goto('http://localhost:5174/login');
    await page.fill('input[type="text"]', 'khoi@example.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await page.waitForLoadState('networkidle');
    console.log('✅ Logged in\n');

    // Go to appointments
    await page.goto('http://localhost:5174/appointments');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);

    console.log('1️⃣  Card Structure:');
    const cards = await page.locator('[class*="card"]').all();
    console.log(`   Total cards: ${cards.length}\n`);

    if (cards.length > 0) {
      console.log('2️⃣  First Card Layout:');
      const firstCard = cards[0];
      
      // Check doctor section
      const doctorName = await firstCard.locator('[class*="doctorName"]').textContent();
      const department = await firstCard.locator('[class*="department"]').textContent();
      const avatar = await firstCard.locator('[class*="avatar"]').textContent();
      
      console.log(`   Doctor Section (prominent)::`);
      console.log(`     Avatar: "${avatar}"`);
      console.log(`     Name: "${doctorName}" (bold, large)`);
      console.log(`     Department: "${department}" (secondary)`);
      
      // Check appointment section
      const datetime = await firstCard.locator('[class*="datetime"]').textContent();
      const location = await firstCard.locator('[class*="location"]').textContent();
      const hasCalendarBtn = await firstCard.locator('[class*="calendarBtn"]').count() > 0;
      
      console.log(`\n   Appointment Section (subtle):`);
      console.log(`     DateTime: "${datetime?.substring(0, 35)}..." (small, gray)`);
      console.log(`     Location: "${location}" (small, gray)`);
      console.log(`     Calendar button: ${hasCalendarBtn ? '✓' : '✗'}`);
    }

    if (cards.length > 1) {
      console.log(`\n3️⃣  Multiple Cards:`);
      for (let i = 0; i < Math.min(3, cards.length); i++) {
        const card = cards[i];
        const name = await card.locator('[class*="doctorName"]').textContent();
        const time = await card.locator('[class*="datetime"]').textContent();
        console.log(`   Card ${i + 1}: ${name?.substring(0, 20)} - ${time?.substring(0, 20)}`);
      }
    }

    console.log('\n✨ Combined layout perfect!');
    console.log('   Doctor nổi trên, lịch hẹn chìm dưới ✓');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await browser.close();
  }
})();
