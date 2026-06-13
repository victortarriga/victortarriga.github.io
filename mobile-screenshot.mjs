import { chromium, devices } from 'playwright';

const browser = await chromium.launch();
const iPhone = devices['iPhone 14'];
const context = await browser.newContext({ ...iPhone });
const page = await context.newPage();

await page.goto('https://victortarriga.github.io/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(2000);

await page.evaluate(() => {
  document.getElementById('certificacoes')?.scrollIntoView();
});
await page.waitForTimeout(1000);
await page.screenshot({ path: '/tmp/mobile-cert2.png' });

await browser.close();
