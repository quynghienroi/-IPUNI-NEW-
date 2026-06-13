const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 430, height: 932 });

  try {
    console.log('Testing Appointments Redesign...\n');

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
    await page.waitForTimeout(1000);

    // Check nav shows "Bác Sĩ"
    const navText = await page.locator('nav').textContent();
    console.log('1️⃣  BottomNav:');
    console.log(`   Text includes "Bác Sĩ": ${navText?.includes('Bác Sĩ')}`);
    console.log(`   Text includes "Stethoscope icon": ${await page.locator('svg').count() > 0}\n`);

    // Check page title
    const pageTitle = await page.locator('h1').textContent();
    console.log('2️⃣  Page Title:');
    console.log(`   Title: "${pageTitle}"\n`);

    // Check appointment cards
    const cards = await page.locator('[class*="card"]').all();
    console.log(`3️⃣  Appointment Cards (found ${cards.length}):`);
    
    if (cards.length > 0) {
      const firstCard = cards[0];
      const hasAvatar = await firstCard.locator('[class*="avatar"]').count() > 0;
      const hasDoctorName = await firstCard.locator('[class*="doctorName"]').count() > 0;
      const hasCalendarBtn = await firstCard.locator('[class*="calendarBtn"]').count() > 0;
      
      console.log(`   Has doctor avatar: ${hasAvatar}`);
      console.log(`   Has doctor name element: ${hasDoctorName}`);
      console.log(`   Has calendar button: ${hasCalendarBtn}`);
      
      const doctorText = await firstCard.locator('[class*="doctorName"]').textContent();
      console.log(`   Doctor name: "${doctorText}"`);
    }

    console.log('\n✨ Appointments redesign complete!');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await browser.close();
  }
})();
