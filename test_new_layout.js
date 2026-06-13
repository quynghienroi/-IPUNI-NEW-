const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 430, height: 932 });

  try {
    console.log('Testing New Appointment Layout...\n');

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

    // Check page structure
    console.log('1️⃣  Page Structure:');
    const doctorHeaders = await page.locator('[class*="doctorHeader"]').all();
    const appointmentItems = await page.locator('[class*="appointmentItem"]').all();
    
    console.log(`   Doctor headers (horizontal): ${doctorHeaders.length}`);
    console.log(`   Appointment items (vertical): ${appointmentItems.length}\n`);

    // Check first doctor group
    if (doctorHeaders.length > 0) {
      console.log('2️⃣  First Doctor Group:');
      const firstDoctor = doctorHeaders[0];
      const doctorName = await firstDoctor.locator('[class*="doctorName"]').textContent();
      const department = await firstDoctor.locator('[class*="department"]').textContent();
      const avatar = await firstDoctor.locator('[class*="avatar"]').textContent();
      
      console.log(`   Avatar: "${avatar}"`);
      console.log(`   Name: "${doctorName}"`);
      console.log(`   Department: "${department}"\n`);
    }

    // Check appointment items
    if (appointmentItems.length > 0) {
      console.log('3️⃣  Appointment Items (Vertical List):');
      for (let i = 0; i < Math.min(2, appointmentItems.length); i++) {
        const item = appointmentItems[i];
        const datetime = await item.locator('[class*="datetime"]').textContent();
        const location = await item.locator('[class*="location"]').textContent();
        const hasBtn = await item.locator('[class*="calendarBtn"]').count() > 0;
        
        console.log(`   Item ${i + 1}:`);
        console.log(`     Time: "${datetime?.substring(0, 40)}..."`);
        console.log(`     Location: "${location}"`);
        console.log(`     Has calendar button: ${hasBtn}`);
      }
    }

    console.log('\n✨ Layout test complete!');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await browser.close();
  }
})();
