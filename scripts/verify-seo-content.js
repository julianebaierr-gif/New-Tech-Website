const fs = require('fs');
const path = require('path');

const articlesPath = path.join(__dirname, '../src/data/articles.ts');
const raw = fs.readFileSync(articlesPath, 'utf8');

// List of strictly banned AI words and phrases (including all 93 user terms)
const bannedWords = [
  'A deep dive into', 'A Guide to', 'Adopt', 'Adopting', 'An in-depth look at',
  'An in-depth look into', 'As we look ahead', 'Battle-tested', 'Beacon',
  'Bulletproof', 'Complete', 'Comprehensive', 'Comprehensive Guide',
  'Comprehensive Guide to', 'Consumption', 'Cornerstone', 'Crucial',
  'Crucial component', 'Deep dive', 'Delve', 'Delve into', 'Delving',
  'Demystifying', 'Digital', 'Discover', 'Discover verified facts', 'Dive into',
  'Elevate', 'Embark', 'Enterprise-grade', 'Evolution', 'Explore', 'Extracting',
  'Find verified facts', 'Foster', 'Furthermore', 'Game-changer', 'Guide',
  'Harness', 'Helpful background', 'Helpful background details and common queries',
  'High-Fidelity', 'In conclusion', 'In this article', 'In this article, we explore',
  'In today\'s digital era', 'In today\'s fast-paced', 'In today\'s fast-paced digital world',
  'In-depth', 'It is crucial to', 'It is important to note', 'It is important to remember',
  'Key Insights', 'Landscape', 'Learn', 'Learn how', 'Learn more', 'Learn more details',
  'Learn more now', 'Learn more today', 'Leverage', 'Look no further', 'Media',
  'Modern', 'Modern teams adopting', 'Moreover', 'Navigating', 'Navigating the',
  'Orchestrate', 'Paradigm shift', 'Pipelines', 'Pivotal', 'Plethora', 'Powerhouse',
  'Realm', 'Robust', 'Seamless', 'Seamlessly', 'Tapestry', 'Technical', 'Testament',
  'The Ultimate', 'Ultimate', 'Ultimate Guide', 'Ultra-High', 'Uncover', 'Unleash',
  'Unlock', 'Unpacking', 'Verified', 'Vital', 'Vital role'
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

// Check em-dash in articles.ts
if (raw.includes('—')) {
  console.log('[ALERT] Found em-dash (—) in articles.ts!');
} else {
  console.log('[PASS] Zero em-dashes (—) found in articles.ts!');
}

// Check routes
console.log('\n--- 2. Checking Static Pages & Word Counts ---');
const pages = [
  '../src/app/layout.tsx',
  '../src/app/about/page.tsx',
  '../src/app/editorial-policy/page.tsx',
  '../src/app/contact/page.tsx',
  '../src/app/privacy/page.tsx',
  '../src/app/terms/page.tsx',
  '../src/app/category/[slug]/page.tsx',
];

pages.forEach(p => {
  const full = path.join(__dirname, p);
  const content = fs.readFileSync(full, 'utf8');
  const words = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
  console.log(`${p}: ~${words} words`);
  
  // Check em-dash
  if (content.includes('—')) {
    console.log(`  [ALERT] Found em-dash (—) in ${p}!`);
  }

  // Check old date
  if (content.includes('January 1, 2026')) {
    console.log(`  [ALERT] Found old date (January 1, 2026) in ${p}!`);
  }

  // Check banned words
  bannedWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(content)) {
      console.log(`  [ALERT] Found "${word}" in ${p}!`);
    }
  });
});
