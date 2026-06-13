const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 430, height: 932 });

  try {
    // Login first
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle' });
    await page.fill('input[type="text"]', 'khoi@example.com');
    await page.fill('input[type="password"]', 'admin');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/');
    await page.waitForTimeout(1000);

    // Get page structure
    const structure = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
        text: b.textContent.trim().substring(0, 30),
        classes: b.className,
        ariaLabel: b.getAttribute('aria-label')
      }));
      
      return {
        buttons,
        topBarHTML: document.querySelector('[class*="TopBar"]')?.outerHTML.substring(0, 500)
      };
    });

    console.log('=== BUTTONS ON PAGE ===');
    structure.buttons.forEach((btn, i) => {
      console.log(`${i}: "${btn.text}" - class: ${btn.classes} - aria: ${btn.ariaLabel}`);
    });

  } finally {
    await browser.close();
  }
})();
