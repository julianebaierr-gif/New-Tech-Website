const fs = require('fs');
const path = require('path');

const articlesPath = path.join(__dirname, '../src/data/articles.ts');
const raw = fs.readFileSync(articlesPath, 'utf8');

// List of strictly banned AI filler buzzwords
const bannedWords = [
  'delve', 'demystif', 'tapestry', 'testament', 'bulletproof', 'battle-tested',
  'robust', 'cornerstone', 'paradigm shift', 'seamless', 'orchestrat',
  'unleash', 'harness', 'elevate', 'supercharge', 'game-changer', 'realm',
  'revolutionize', 'peer-reviewed', 'errata', 'in today\'s digital landscape',
  'in today\'s fast-paced', 'furthermore', 'moreover', 'beacon of', 'paramount',
  'plethora', 'myriad', 'vital linchpin', 'cutting-edge'
];

console.log('--- 1. Scanning articles.ts for AI buzzwords ---');
let foundAny = false;
bannedWords.forEach(word => {
  const regex = new RegExp(`\\b${word}\\b`, 'gi');
  const matches = [...raw.matchAll(regex)];
  if (matches.length > 0) {
    foundAny = true;
    console.log(`[ALERT] Found "${word}" ${matches.length} times!`);
  }
});
if (!foundAny) {
  console.log('[PASS] Zero AI buzzwords found in articles.ts!');
}

// Check routes
console.log('\n--- 2. Checking Static Pages & Word Counts ---');
const pages = [
  '../src/app/about/page.tsx',
  '../src/app/editorial-policy/page.tsx',
  '../src/app/contact/page.tsx',
  '../src/app/privacy/page.tsx',
  '../src/app/terms/page.tsx',
];

pages.forEach(p => {
  const full = path.join(__dirname, p);
  const content = fs.readFileSync(full, 'utf8');
  const words = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  console.log(`${p}: ~${words} words`);
  
  // Check banned words
  bannedWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(content)) {
      console.log(`  [ALERT] Found "${word}" in ${p}!`);
    }
  });
});
