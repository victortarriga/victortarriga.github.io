import { chromium, devices } from 'playwright';
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 14'] });
const page = await ctx.newPage();
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle', timeout: 15000 });
await page.waitForTimeout(2000);
for (const [id, file] of [['certificacoes','/tmp/local-cert.png'],['recomendacoes','/tmp/local-rec.png'],['skills','/tmp/local-skills.png']]) {
  await page.evaluate(id => document.getElementById(id)?.scrollIntoView(), id);
  await page.waitForTimeout(700);
  await page.screenshot({ path: file });
}
await browser.close();
