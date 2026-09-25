const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '../src/data/articles.ts'), 'utf8');

const blocks = content.split(/\{\s*slug:\s*["']/);
console.log(`Found ${blocks.length - 1} article blocks\n`);

const imagesBySlug = {};
let totalImages = 0;

for (let i = 1; i < blocks.length; i++) {
  const b = blocks[i];
  const slug = b.match(/^([^"']+)/)?.[1];
  
  // Extract coverImage
  const coverMatch = b.match(/coverImage:\s*["']([^"']+)["']/);
  // Extract secondaryImage url
  const secBlock = b.match(/secondaryImage:\s*\{([\s\S]*?)\}/);
  const secUrlMatch = secBlock ? secBlock[1].match(/["']?url["']?:\s*["']([^"']+)["']/) : null;
  // Extract tertiaryImage url
  const tertBlock = b.match(/tertiaryImage:\s*\{([\s\S]*?)\}/);
  const tertUrlMatch = tertBlock ? tertBlock[1].match(/["']?url["']?:\s*["']([^"']+)["']/) : null;

  const urls = [
    coverMatch ? coverMatch[1].split('?')[0] : null,
    secUrlMatch ? secUrlMatch[1].split('?')[0] : null,
    tertUrlMatch ? tertUrlMatch[1].split('?')[0] : null,
  ].filter(Boolean);
  
  imagesBySlug[slug] = urls;
  totalImages += urls.length;
  console.log(`[${slug}] (${urls.length} images)`);
  urls.forEach((u, idx) => console.log(`   #${idx + 1}: ${u}`));
}

console.log(`\nTotal Images found across all articles: ${totalImages}`);

// Check duplicates
const seen = {};
let duplicateCount = 0;
console.log('\n=== DUPLICATE ANALYSIS ===');
for (const [slug, urls] of Object.entries(imagesBySlug)) {
  urls.forEach((u, idx) => {
    if (!seen[u]) {
      seen[u] = [{ slug, slot: idx + 1 }];
    } else {
      seen[u].push({ slug, slot: idx + 1 });
      duplicateCount++;
    }
  });
}

for (const [url, locations] of Object.entries(seen)) {
  if (locations.length > 1) {
    console.log(`\nDUPLICATE DETECTED: ${url}`);
    locations.forEach(loc => console.log(`  -> Used in "${loc.slug}" at slot #${loc.slot}`));
  }
}

if (duplicateCount === 0 && totalImages === 30) {
  console.log(`\nSUCCESS! Exactly 30/30 image slots found, and 0 duplicates exist across the entire website! All 30 images are 100% unique!`);
} else {
  console.log(`\nSTATUS: Found ${duplicateCount} duplicates, total slots found: ${totalImages}/30`);
  if (duplicateCount > 0) process.exit(1);
}
