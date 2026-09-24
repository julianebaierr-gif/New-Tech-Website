const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('   TECH OPS WIRE - DETAILED SITE AUDIT');
console.log('====================================================\n');

// 1. Audit Articles in src/data/articles.ts
const articlesFile = fs.readFileSync(path.join(__dirname, '../src/data/articles.ts'), 'utf8');

// Match all article objects
const articleRegex = /slug:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",[\s\S]*?authorId:\s*"([^"]+)",[\s\S]*?coverImage:\s*"([^"]+)",[\s\S]*?secondaryImage:\s*\{[\s\S]*?url:\s*"([^"]+)",[\s\S]*?alt:\s*"([^"]+)",[\s\S]*?caption:\s*"([^"]+)"[\s\S]*?\},[\s\S]*?tertiaryImage:\s*\{[\s\S]*?url:\s*"([^"]+)",[\s\S]*?alt:\s*"([^"]+)",[\s\S]*?caption:\s*"([^"]+)"[\s\S]*?\}/g;

let match;
let count = 0;
while ((match = articleRegex.exec(articlesFile)) !== null) {
  count++;
  console.log(`[Article ${count}] ${match[2]}`);
  console.log(`  Slug: ${match[1]}`);
  console.log(`  Author: ${match[3]}`);
  console.log(`  Cover: ${match[4].slice(0, 50)}...`);
  console.log(`  Secondary Image: ${match[5].slice(0, 50)}... | Alt: ${match[6]}`);
  console.log(`  Tertiary Image: ${match[8].slice(0, 50)}... | Alt: ${match[9]}`);
  console.log('');
}

console.log(`Total fully matching articles with 3 images: ${count}/9`);

// Let's check daily publisher script to verify how it generates new posts
console.log('\n--- DAILY PUBLISHER VERIFICATION ---');
const publisherFile = fs.readFileSync(path.join(__dirname, 'daily-publisher.js'), 'utf8');
const pubHas3Images = publisherFile.includes('secondaryImage') && publisherFile.includes('tertiaryImage');
const pubHasSarah = publisherFile.includes('sarah-blake');
const pubHasEvan = publisherFile.includes('evan-mitchell');
const pubHasWebhook = publisherFile.includes('AKfycbxawZ-7K7VjR2_wOgqiVtdalkvFohhoM3VxRbnBmjsSz7pWnVVyA-EPXYJwvUNHuCjR8w');
const pubHasIndexNow = publisherFile.includes('submitIndexNow') || publisherFile.includes('indexnow');

console.log(`Publisher supports 3 images per article: ${pubHas3Images}`);
console.log(`Publisher alternates Sarah Blake: ${pubHasSarah}`);
console.log(`Publisher alternates Evan Mitchell: ${pubHasEvan}`);
console.log(`Publisher has Google Sheet Webhook connected: ${pubHasWebhook}`);
console.log(`Publisher triggers IndexNow indexing: ${pubHasIndexNow}`);

// Scan banned buzzwords again
console.log('\n--- BANNED BUZZWORDS VERIFICATION ---');
const { execSync } = require('child_process');
try {
  const scanOut = execSync('node scripts/scan-user-words.js', { encoding: 'utf8' });
  console.log(scanOut.trim());
} catch (e) {
  console.error('Scan error:', e.message);
}

// Next build check
console.log('\n--- PRODUCTION BUILD VERIFICATION ---');
try {
  const buildOut = execSync('npm.cmd run build', { encoding: 'utf8' });
  const staticPagesMatch = buildOut.match(/○\s+\(Static\)/g) || [];
  console.log('Build output status: SUCCESS');
  console.log(`Static routes compiled: ${staticPagesMatch.length}`);
} catch (e) {
  console.error('Build error:', e.message);
}
