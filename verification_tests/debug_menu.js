const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 430, height: 932 });

  try {
    // Login
    await page.goto('http://localhost:5173/login');
    await page.fill('input[type="text"]', 'khoi@example.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await page.waitForLoadState('networkidle');

    // Click user button
    const buttons = await page.locator('button').all();
    await buttons[2].click();
    await page.waitForTimeout(800);

    // Log all text in the dropdown
    const allText = await page.locator('body').textContent();
    const lines = allText.split('\n').filter(l => l.trim().length > 0 && l.length < 50);
    console.log('=== TEXT ON PAGE ===');
    lines.forEach(line => console.log(line.trim().substring(0, 50)));

  } finally {
    await browser.close();
  }
})();
