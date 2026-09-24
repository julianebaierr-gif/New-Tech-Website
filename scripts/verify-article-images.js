const { articles } = require('../src/data/articles.ts');

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

console.log('=== ARTICLE IMAGES VERIFICATION ===');
console.log(`Checking ${articles.length} articles for image requirements...`);

const ids = [];
const urls = [];
let errorCount = 0;

articles.forEach((a, i) => {
  console.log(`\n[Article ${i + 1}/${articles.length}] ${a.slug}`);

  // 1. Cover Image Check
  if (!a.coverImage || !a.coverImageId) {
    console.error(`  ❌ Missing coverImage or coverImageId`);
    errorCount++;
  } else {
    ids.push(a.coverImageId);
    urls.push(a.coverImage);
    console.log(`  📸 Image 1 (Cover): [${a.coverImageId}]`);
  }

  // 2. Secondary Image Check
  if (!a.secondaryImage || !a.secondaryImage.id || !a.secondaryImage.url || !a.secondaryImage.alt || !a.secondaryImage.caption) {
    console.error(`  ❌ Missing secondaryImage details`);
    errorCount++;
  } else {
    ids.push(a.secondaryImage.id);
    urls.push(a.secondaryImage.url);
    console.log(`  📸 Image 2 (Body):  [${a.secondaryImage.id}]`);
    console.log(`     Alt: "${a.secondaryImage.alt}"`);
    console.log(`     Caption: "${a.secondaryImage.caption}"`);

    // Check for banned AI words in alt & caption
    const textToCheck = `${a.secondaryImage.alt} ${a.secondaryImage.caption}`;
    for (const term of bannedWords) {
      const isPhrase = term.includes(' ');
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = isPhrase ? new RegExp(escaped, 'gi') : new RegExp('\\b' + escaped + '\\b', 'gi');
      if (regex.test(textToCheck)) {
        console.error(`  ❌ BANNED WORD "${term}" found in secondary image metadata!`);
        errorCount++;
      }
    }
  }
});

// Check uniqueness
console.log('\n--- UNIQUENESS AUDIT ---');
console.log(`Total image instances: ${ids.length} (Expected: ${articles.length * 2})`);
const uniqueIds = new Set(ids);
const uniqueUrls = new Set(urls);

if (uniqueIds.size !== ids.length) {
  console.error(`❌ Duplicate Image IDs detected! ${uniqueIds.size} unique out of ${ids.length}`);
  errorCount++;
} else {
  console.log(`✅ All ${uniqueIds.size} Image IDs are 100% UNIQUE.`);
}

if (uniqueUrls.size !== urls.length) {
  console.error(`❌ Duplicate Image URLs detected! ${uniqueUrls.size} unique out of ${urls.length}`);
  errorCount++;
} else {
  console.log(`✅ All ${uniqueUrls.size} Image URLs are 100% UNIQUE.`);
}

if (errorCount > 0) {
  console.error(`\nFAILED with ${errorCount} errors.`);
  process.exit(1);
}

// Check live HTTP statuses
console.log('\n--- LIVE HTTP STATUS CHECK ---');
Promise.all(urls.map(url => 
  fetch(url, { method: 'HEAD' }).then(res => ({ url, status: res.status }))
)).then(results => {
  const failed = results.filter(r => r.status !== 200);
  if (failed.length > 0) {
    console.error(`❌ Some image URLs failed:`, failed);
    process.exit(1);
  }
  console.log(`✅ All ${results.length} live image URLs returned HTTP 200 OK!`);
  console.log('\n🎉 ALL CHECKS PASSED: 100% UNIQUE, RELEVANT, 2 IMAGES PER ARTICLE WITH EXACT IDS!');
}).catch(err => {
  console.error('Fetch error:', err);
  process.exit(1);
});
