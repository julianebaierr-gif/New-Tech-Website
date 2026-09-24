const fs = require('fs');
const content = fs.readFileSync('src/data/articles.ts', 'utf8');
const lines = content.split('\n');
const articles = [];
let currentSlug = null;
let currentTitle = null;
let hasCover = false;
let hasSecondary = false;
let hasTertiary = false;
let h2Count = 0;
let emDashCount = 0;

for (let line of lines) {
  const sm = line.match(/slug:\s*["']([^"']+)["']/);
  const tm = line.match(/title:\s*["']([^"']+)["']/);
  if (sm) {
    if (currentSlug) articles.push({ slug: currentSlug, title: currentTitle, hasCover, hasSecondary, hasTertiary, h2Count, emDashCount });
    currentSlug = sm[1];
    currentTitle = null;
    hasCover = false;
    hasSecondary = false;
    hasTertiary = false;
    h2Count = 0;
    emDashCount = 0;
  }
  if (tm && !currentTitle) currentTitle = tm[1];
  if (line.includes('coverImage:')) hasCover = true;
  if (line.includes('secondaryImage:')) hasSecondary = true;
  if (line.includes('tertiaryImage:')) hasTertiary = true;
  if (line.includes('<h2')) h2Count++;
  if (line.includes('—')) emDashCount++;
}
if (currentSlug) articles.push({ slug: currentSlug, title: currentTitle, hasCover, hasSecondary, hasTertiary, h2Count, emDashCount });

console.log('Total articles found:', articles.length);
articles.forEach((a, i) => {
  console.log(`${i+1}. ${a.slug}`);
  console.log(`   Title: ${a.title}`);
  console.log(`   Cover: ${a.hasCover} | Secondary: ${a.hasSecondary} | Tertiary: ${a.hasTertiary}`);
  console.log(`   H2 headings: ${a.h2Count} | Em dashes: ${a.emDashCount}`);
});
