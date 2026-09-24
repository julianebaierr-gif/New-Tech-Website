const fs = require('fs');
const path = require('path');

const userList = [
  'A deep dive into', 'A Guide to', 'Adopt', 'Adopting', 'An in-depth look at',
  'An in-depth look into', 'As we look ahead', 'Battle-tested', 'Beacon',
  'Bulletproof', 'Complete', 'Comprehensive', 'Comprehensive Guide',
  'Comprehensive Guide to', 'Consumption', 'Cornerstone', 'Crucial',
  'Crucial component', 'Deep dive', 'Delve', 'Delve into', 'Delving',
  'Demystifying', 'Digital', 'Discover', 'Discover verified facts', 'Dive into',
  'Elevate', 'Embark', 'Enterprise-grade', 'Evolution', 'Explore', 'Extracting',
  'Find', 'Find verified facts', 'Foster', 'Furthermore', 'Game-changer', 'Guide',
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

const articlesPath = path.join(__dirname, '../src/data/articles.ts');
const raw = fs.readFileSync(articlesPath, 'utf8');

// Load articles
const { articles } = require(articlesPath);

console.log('================ AUDIT REPORT ================');

let hasErrors = false;

articles.forEach((art, idx) => {
  console.log(`\n[Article ${idx + 1}] ${art.slug}`);
  const html = art.contentHtml;
  const textOnly = html.replace(/<[^>]*>/g, ' ');
  const words = textOnly.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  console.log(`- Word count: ${wordCount} words (Target: 1,200 - 1,600)`);
  if (wordCount < 1200) {
    console.log(`  [FAIL] Word count below 1,200!`);
    hasErrors = true;
  } else {
    console.log(`  [PASS] Word count target met.`);
  }

  // Banned words check
  userList.forEach(term => {
    const isPhrase = term.includes(' ');
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = isPhrase ? new RegExp(escaped, 'gi') : new RegExp('\\b' + escaped + '\\b', 'gi');
    if (regex.test(html)) {
      if (term === 'Find') {
        // Allow Linux shell find or JS find
        const stripped = html.replace(/find \/|find -|\.find\(/g, '');
        if (!regex.test(stripped)) return;
      }
      console.log(`  [FAIL] Found banned word/phrase: "${term}"`);
      hasErrors = true;
    }
  });

  // Em-dash check
  if (html.includes('—')) {
    console.log(`  [FAIL] Contains em-dash (—)!`);
    hasErrors = true;
  }

  // Check H2 headings count and TOC sync
  const h2Matches = [...html.matchAll(/<h2[^>]*id="([^"]+)"[^>]*>([^<]+)<\/h2>/g)];
  console.log(`- H2 headings found: ${h2Matches.length}`);
  if (h2Matches.length < 4) {
    console.log(`  [WARN] Fewer than 4 H2 headings. Mid-image split expects >= 3 H2s.`);
  }

  // Spaced hyphen check in prose (outside code and pre blocks)
  const proseOnly = html.replace(/<pre[\s\S]*?<\/pre>/gi, '').replace(/<code[\s\S]*?<\/code>/gi, '');
  if (proseOnly.includes(' - ')) {
    console.log(`  [FAIL] Contains spaced hyphen (' - ') in prose text!`);
    hasErrors = true;
  }

  // Check sentence repetition
  const sentences = textOnly
    .split(/[.!?]+/)
    .map(s => s.trim().toLowerCase())
    .filter(s => s.length > 25); // Ignore very short phrases
  
  const sentenceMap = new Map();
  sentences.forEach(s => {
    sentenceMap.set(s, (sentenceMap.get(s) || 0) + 1);
  });
  let repeatedCount = 0;
  for (const [s, count] of sentenceMap.entries()) {
    if (count > 1) {
      console.log(`  [FAIL] Repeated sentence (${count}x): "${s.substring(0, 60)}..."`);
      repeatedCount++;
      hasErrors = true;
    }
  }
  if (repeatedCount === 0) {
    console.log(`  [PASS] Zero repeated sentences.`);
  }
});

console.log('\n==============================================');
if (hasErrors) {
  console.log('AUDIT RESULT: FAILURES FOUND');
  process.exit(1);
} else {
  console.log('AUDIT RESULT: ALL ARTICLES PASSED 100%!');
  process.exit(0);
}
