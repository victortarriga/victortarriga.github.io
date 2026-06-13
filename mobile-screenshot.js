const { chromium, devices } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const iPhone = devices['iPhone 14'];
  
  const context = await browser.newContext({ ...iPhone });
  const page = await context.newPage();
  
  await page.goto('https://victortarriga.github.io/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: '/tmp/mobile-hero.png', fullPage: false });
  
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/mobile-sobre.png' });
  
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/mobile-exp.png' });

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: '/tmp/mobile-bottom.png' });
  
  await browser.close();
  console.log('Screenshots saved');
})();
