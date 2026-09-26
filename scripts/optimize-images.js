const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function optimizeImages() {
  console.log('=== OPTIMIZING IMAGES STRICTLY UNDER 95 KB ===\n');
  const targetDirs = [
    path.join(__dirname, '..', 'public', 'images', 'articles'),
    path.join(__dirname, '..', 'public', 'authors'),
  ];

  let over100Count = 0;

  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (!file.endsWith('.jpg') && !file.endsWith('.jpeg')) continue;
      const filePath = path.join(dir, file);
      let size = fs.statSync(filePath).size;
      
      if (size > 92 * 1024) {
        const inputBuffer = fs.readFileSync(filePath);
        const metadata = await sharp(inputBuffer).metadata();
        
        let targetWidth = metadata.width > 1200 ? 1200 : metadata.width;
        if (dir.includes('authors') && targetWidth > 400) targetWidth = 400;

        let quality = 75;
        let outputBuffer = await sharp(inputBuffer)
          .resize({ width: targetWidth, withoutEnlargement: true })
          .jpeg({ quality, mozjpeg: true, chromaSubsampling: '4:2:0' })
          .toBuffer();

        while (outputBuffer.length > 92 * 1024 && quality > 55) {
          quality -= 5;
          outputBuffer = await sharp(inputBuffer)
            .resize({ width: targetWidth, withoutEnlargement: true })
            .jpeg({ quality, mozjpeg: true, chromaSubsampling: '4:2:0' })
            .toBuffer();
        }

        fs.writeFileSync(filePath, outputBuffer);
        const newSize = outputBuffer.length;
        console.log(`[OPTIMIZED] ${file}: ${(size/1024).toFixed(1)} KB -> ${(newSize/1024).toFixed(1)} KB (W: ${targetWidth}, Q: ${quality})`);
      }
    }
  }

  // Final check: count any remaining over 100 KB
  console.log('\n--- VERIFYING ALL IMAGES IN PUBLIC/ ---');
  function checkDir(d) {
    fs.readdirSync(d).forEach(f => {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) checkDir(p);
      else {
        const s = fs.statSync(p).size;
        if (s > 100 * 1024) {
          console.warn(`[WARNING] Over 100 KB: ${p} (${(s/1024).toFixed(1)} KB)`);
          over100Count++;
        }
      }
    });
  }
  checkDir(path.join(__dirname, '..', 'public'));
  
  console.log(`\nImages over 100 KB in entire public folder: ${over100Count}`);
}

optimizeImages().catch(err => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
