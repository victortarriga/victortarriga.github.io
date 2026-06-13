import sharp from 'sharp'
import { readdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// foto principal
await sharp(path.join(__dirname, 'public/foto.jpg'))
  .webp({ quality: 90 })
  .toFile(path.join(__dirname, 'public/foto.webp'))
console.log('✓ public/foto.webp')

// recomendações
const recDir = path.join(__dirname, 'public/rec')
const files = await readdir(recDir)
for (const file of files.filter(f => f.endsWith('.jpg'))) {
  await sharp(path.join(recDir, file))
    .webp({ quality: 85 })
    .toFile(path.join(recDir, file.replace('.jpg', '.webp')))
  console.log(`✓ public/rec/${file.replace('.jpg', '.webp')}`)
}

// ícones PWA (192 e 512) via rasterização do SVG
const svgPath = path.join(__dirname, 'public/favicon.svg')
for (const size of [192, 512]) {
  await sharp(svgPath)
    .resize(size, size)
    .png()
    .toFile(path.join(__dirname, `public/icon-${size}.png`))
  console.log(`✓ public/icon-${size}.png`)
}

console.log('\nConversão concluída.')
