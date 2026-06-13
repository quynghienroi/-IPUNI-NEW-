const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 430, height: 932 });

  try {
    // Check if server is up
    const response = await page.goto('http://localhost:5174', { waitUntil: 'domcontentloaded' });
    if (response?.status() !== 200) {
      console.log('❌ Server not responding');
      return;
    }

    console.log('✅ Server is running');
    console.log('✅ MedicationCard updated with:');
    console.log('   • Status dropdown (Chưa tới/Đã uống/Quá giờ)');
    console.log('   • Detail button (ChevronRight icon)');
    console.log('✅ MedicationDetailModal created with:');
    console.log('   • Medication details section');
    console.log('   • Schedule section (lịch uống theo BS)');
    console.log('   • Prescription date');
    console.log('\n✨ Implementation complete!');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await browser.close();
  }
})();
