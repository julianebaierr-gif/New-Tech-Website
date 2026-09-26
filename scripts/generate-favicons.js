const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Build ICO file buffer from an array of PNG buffers
function createIco(images) {
  // images: array of { width, height, buffer }
  const count = images.length;
  const headerLength = 6;
  const dirEntryLength = 16;
  const dirLength = dirEntryLength * count;

  let currentOffset = headerLength + dirLength;
  const entries = [];

  for (const img of images) {
    const size = img.buffer.length;
    const entry = Buffer.alloc(dirEntryLength);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // No palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Planes
    entry.writeUInt16LE(32, 6); // 32 bpp
    entry.writeUInt32LE(size, 8); // Image size in bytes
    entry.writeUInt32LE(currentOffset, 12); // Offset
    entries.push(entry);
    currentOffset += size;
  }

  const header = Buffer.alloc(headerLength);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(count, 4); // Number of images

  return Buffer.concat([header, ...entries, ...images.map(img => img.buffer)]);
}

async function main() {
  const root = path.resolve(__dirname, '..');
  const publicDir = path.join(root, 'public');
  const appDir = path.join(root, 'src', 'app');
  const iconSvgPath = path.join(appDir, 'icon.svg');

  if (!fs.existsSync(iconSvgPath)) {
    throw new Error('icon.svg not found at ' + iconSvgPath);
  }

  const svgBuffer = fs.readFileSync(iconSvgPath);

  // 1. Generate 16x16, 32x32, 48x48 PNG buffers for ICO
  const p16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const p32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const p48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();

  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: p16 },
    { width: 32, height: 32, buffer: p32 },
    { width: 48, height: 48, buffer: p48 }
  ]);

  // Write favicon.ico to public and src/app
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
  console.log('✓ Created public/favicon.ico and src/app/favicon.ico (16, 32, 48)');

  // 2. Generate explicit 48x48, 96x96, 192x192 PNGs for Google Search & PWA
  await sharp(svgBuffer).resize(48, 48).png().toFile(path.join(publicDir, 'icon-48x48.png'));
  console.log('✓ Created public/icon-48x48.png (Google Search standard multiple of 48px)');

  await sharp(svgBuffer).resize(96, 96).png().toFile(path.join(publicDir, 'icon-96x96.png'));
  console.log('✓ Created public/icon-96x96.png');

  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(publicDir, 'icon-192x192.png'));
  console.log('✓ Created public/icon-192x192.png (PWA / Android standard)');

  await sharp(svgBuffer).resize(32, 32).png().toFile(path.join(publicDir, 'favicon.png'));
  console.log('✓ Updated public/favicon.png (32x32)');

  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('✓ Updated public/apple-touch-icon.png (180x180)');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
