const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '../src/data/articles.ts'), 'utf8');

const regex = /slug:\s*["']([^"']+)["'][\s\S]*?contentHtml:\s*`([\s\S]*?)`/g;
let match;
let totalLinks = 0;

console.log('=== INTERNAL LINKS AUDIT ACROSS ARTICLES ===\n');

while ((match = regex.exec(content)) !== null) {
  const slug = match[1];
  const html = match[2];
  const linkMatches = [...html.matchAll(/<a\s+href="\/articles\/([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)];
  
  console.log(`[ARTICLE] /articles/${slug} (${linkMatches.length} internal links):`);
  linkMatches.forEach(lm => {
    console.log(`  -> Links to: /articles/${lm[1]}`);
    console.log(`     Anchor Text: "${lm[2].trim()}"`);
    totalLinks++;
  });
  console.log('');
}

console.log(`TOTAL INTERNAL LINKS ACROSS 10 ARTICLES: ${totalLinks}`);
