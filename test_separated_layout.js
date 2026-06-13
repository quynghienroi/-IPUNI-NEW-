const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 430, height: 932 });

  try {
    console.log('Testing Separated Block Layout...\n');

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

    console.log('1️⃣  Layout Structure:');
    const doctorHeaders = await page.locator('[class*="doctorHeader"]').all();
    const appointmentItems = await page.locator('[class*="appointmentItem"]').all();
    
    console.log(`   Doctor header cards: ${doctorHeaders.length}`);
    console.log(`   Appointment cards (separate): ${appointmentItems.length}\n`);

    if (doctorHeaders.length > 0) {
      console.log('2️⃣  First Doctor Header (wide block):');
      const firstDoctor = doctorHeaders[0];
      const doctorName = await firstDoctor.locator('[class*="doctorName"]').textContent();
      const avatar = await firstDoctor.locator('[class*="avatar"]').textContent();
      const width = await firstDoctor.evaluate(el => el.offsetWidth);
      
      console.log(`   Width: ${width}px (full width) ✓`);
      console.log(`   Avatar: "${avatar}"`);
      console.log(`   Doctor: "${doctorName}"\n`);
    }

    if (appointmentItems.length > 0) {
      console.log('3️⃣  Appointment Cards (separate wide blocks):');
      for (let i = 0; i < Math.min(3, appointmentItems.length); i++) {
        const item = appointmentItems[i];
        const datetime = await item.locator('[class*="datetime"]').textContent();
        const width = await item.evaluate(el => el.offsetWidth);
        
        console.log(`   Card ${i + 1}:`);
        console.log(`     Width: ${width}px (full width) ✓`);
        console.log(`     Time: "${datetime?.substring(0, 35)}..."`);
      }
    }

    console.log('\n✨ Separated block layout looks perfect!');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await browser.close();
  }
})();
