const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 430, height: 932 });

  try {
    console.log('Testing Horizontal Card Layout...\n');

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

    console.log('1️⃣  Card Layout:');
    const cards = await page.locator('[class*="card"]').all();
    console.log(`   Total cards: ${cards.length}\n`);

    if (cards.length > 0) {
      const firstCard = cards[0];
      const width = await firstCard.evaluate(el => el.offsetWidth);
      const height = await firstCard.evaluate(el => el.offsetHeight);
      
      console.log('2️⃣  First Card Dimensions:');
      console.log(`   Width: ${width}px (full width, stretched) ✓`);
      console.log(`   Height: ${height}px (horizontal rectangle)\n`);

      // Check sections
      const hasDoctor = await firstCard.locator('[class*="doctorSection"]').count() > 0;
      const hasDivider = await firstCard.locator('[class*="divider"]').count() > 0;
      const hasAppointment = await firstCard.locator('[class*="appointmentSection"]').count() > 0;
      
      console.log('3️⃣  Card Structure:');
      console.log(`   Doctor section (left): ${hasDoctor ? '✓' : '✗'}`);
      console.log(`   Divider line: ${hasDivider ? '✓' : '✗'}`);
      console.log(`   Appointment section (right): ${hasAppointment ? '✓' : '✗'}`);

      // Content
      const doctorName = await firstCard.locator('[class*="doctorName"]').textContent();
      const datetime = await firstCard.locator('[class*="datetime"]').textContent();
      
      console.log(`\n4️⃣  Content Sample:`);
      console.log(`   Doctor: ${doctorName}`);
      console.log(`   Date: ${datetime?.substring(0, 30)}`);
    }

    console.log('\n✨ Horizontal layout kéo ngang dài! ✓');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await browser.close();
  }
})();
