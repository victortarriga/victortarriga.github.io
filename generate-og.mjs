import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const photoPath = path.join(__dirname, 'public/foto.jpg')
const photoB64  = readFileSync(photoPath).toString('base64')
const photoSrc  = `data:image/jpeg;base64,${photoB64}`

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    background: #080808;
    font-family: 'Inter', system-ui, sans-serif;
    display: flex; align-items: center;
    padding: 0 80px;
    overflow: hidden; position: relative;
  }
  .bg-glow {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 55% 90% at 20% 50%, rgba(234,88,12,0.18) 0%, transparent 65%);
  }
  .bg-dots {
    position: absolute; inset: 0;
    background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.055) 1px, transparent 0);
    background-size: 28px 28px;
  }
  .content {
    position: relative; z-index: 1;
    display: flex; align-items: center; gap: 60px; width: 100%;
  }
  .photo-wrap {
    flex-shrink: 0; position: relative;
  }
  .photo {
    width: 210px; height: 210px; border-radius: 50%; object-fit: cover;
    border: 2px solid rgba(249,115,22,0.35);
    box-shadow: 0 0 80px rgba(249,115,22,0.22), 0 0 0 8px rgba(249,115,22,0.06);
  }
  .online-dot {
    position: absolute; bottom: 14px; right: 14px;
    width: 18px; height: 18px; border-radius: 50%;
    background: #22c55e;
    border: 3px solid #080808;
  }
  .divider {
    width: 1px; height: 180px; flex-shrink: 0;
    background: rgba(255,255,255,0.09);
  }
  .text { flex: 1; }
  .eyebrow {
    font-size: 11px; font-weight: 900; letter-spacing: 0.22em;
    text-transform: uppercase; color: rgba(249,115,22,0.55);
    margin-bottom: 18px;
  }
  .name {
    font-size: 52px; font-weight: 900; color: #ffffff;
    line-height: 1.05; letter-spacing: -2px; margin-bottom: 18px;
  }
  .tags {
    display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px;
  }
  .tag {
    font-size: 13px; font-weight: 600;
    color: rgba(255,255,255,0.55);
    border: 1px solid rgba(255,255,255,0.10);
    border-radius: 999px; padding: 4px 14px;
    background: rgba(255,255,255,0.03);
  }
  .tag.highlight {
    color: rgba(249,115,22,0.9);
    border-color: rgba(249,115,22,0.25);
    background: rgba(249,115,22,0.06);
  }
  .url {
    font-size: 13px; font-weight: 600; letter-spacing: 0.04em;
    color: rgba(249,115,22,0.6); font-family: monospace;
  }
</style>
</head>
<body>
  <div class="bg-glow"></div>
  <div class="bg-dots"></div>
  <div class="content">
    <div class="photo-wrap">
      <img class="photo" src="${photoSrc}" />
      <div class="online-dot"></div>
    </div>
    <div class="divider"></div>
    <div class="text">
      <div class="eyebrow">Portfólio Profissional</div>
      <div class="name">Victor Hugo<br>Tarriga Gomes</div>
      <div class="tags">
        <span class="tag highlight">Squad Leader</span>
        <span class="tag highlight">Scrum Master</span>
        <span class="tag highlight">Product Owner · CSPO®</span>
        <span class="tag">20+ anos de experiência</span>
        <span class="tag">29 certificações</span>
      </div>
      <div class="url">victortarriga.github.io</div>
    </div>
  </div>
</body>
</html>`

const tmpHtml = path.join(__dirname, '.og-tmp.html')
writeFileSync(tmpHtml, html)

const browser = await chromium.launch()
const page    = await browser.newPage()
await page.setViewportSize({ width: 1200, height: 630 })
await page.goto(`file://${tmpHtml}`)
await page.waitForTimeout(800)

const outPath = path.join(__dirname, 'public/og-image.jpg')
await page.screenshot({ path: outPath, type: 'jpeg', quality: 92 })
await browser.close()

import { unlinkSync } from 'fs'
unlinkSync(tmpHtml)

console.log('✓ OG image gerada em public/og-image.jpg')
