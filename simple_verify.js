const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 430, height: 932 });

  try {
    console.log('Testing logo removal...\n');

    // Go to login page
    await page.goto('http://localhost:5174/login', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);

    // Get page content
    const content = await page.content();
    const hasLogoImg = content.includes('logo.jpg') || content.includes('<img');
    const hasDIAText = content.includes('DIA+');
    
    console.log('✅ Page loaded');
    console.log(`   Has logo.jpg reference: ${content.includes('logo.jpg')}`);
    console.log(`   Has <img tags: ${content.includes('<img')}`);
    console.log(`   Has DIA+ text: ${hasDIAText}`);
    
    // Check visible text
    const bodyText = await page.locator('body').textContent();
    console.log(`   Body contains "DIA+": ${bodyText?.includes('DIA+')}`);
    
    // Login
    console.log('\n✅ Logging in...');
    await page.fill('input[type="text"]', 'khoi@example.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    
    try {
      await page.waitForURL('http://localhost:5174/', { timeout: 5000 });
    } catch (e) {
      // May timeout but that's ok
    }
    await page.waitForTimeout(2000);

    console.log('\n✅ In app - checking TopBar');
    const topbarContent = await page.locator('header').innerHTML();
    console.log(`   TopBar has <img: ${topbarContent?.includes('<img')}`);
    console.log(`   TopBar has DIA+: ${topbarContent?.includes('DIA+')}`);
    
    // Get all images on page
    const allImgs = await page.locator('img').all();
    console.log(`\n✅ Total <img> tags on page: ${allImgs.length}`);
    
    for (let i = 0; i < allImgs.length && i < 5; i++) {
      const src = await allImgs[i].getAttribute('src');
      console.log(`   ${i + 1}. src="${src?.substring(0, 40)}"`);
    }

    console.log('\n✨ RESULT: Logo image should be removed, only "DIA+" text shown');

  } catch (error) {
    console.error('❌ ERROR:', error.message);
  } finally {
    await browser.close();
  }
})();
