const https = require('https');

async function fetchGoogleLsiKeywords(keyword) {
  const getSuggest = (query) => new Promise((resolve) => {
    https.get('https://suggestqueries.google.com/complete/search?client=firefox&q=' + encodeURIComponent(query), (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed[1] || []);
        } catch {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });

  // Extract base root concepts from the keyword
  const words = keyword.split(/\s+/).filter(w => !['today', 'news', 'and', 'or', 'in', 'the', 'for'].includes(w.toLowerCase()));
  const rootPhrase = words.slice(0, 2).join(' ') || keyword;

  const querySeeds = [
    keyword,
    rootPhrase,
    `${rootPhrase} architecture`,
    `${rootPhrase} vs`,
    `${rootPhrase} comparison`,
    `${rootPhrase} cost`,
    `${rootPhrase} benchmarks`,
    `${rootPhrase} hardware`,
    `${rootPhrase} models`,
    `${rootPhrase} server`,
    ...['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'm', 'n', 'p', 's', 't', 'v', 'w'].map(l => `${rootPhrase} ${l}`)
  ];

  const lsiSet = new Set();
  for (const seed of querySeeds) {
    const results = await getSuggest(seed);
    results.forEach(kw => {
      if (kw && kw.toLowerCase() !== keyword.toLowerCase()) {
        lsiSet.add(kw.trim());
      }
    });
    if (lsiSet.size >= 60) break;
  }

  return Array.from(lsiSet);
}

async function test() {
  const lsi = await fetchGoogleLsiKeywords('ai chips news today');
  console.log(`✓ Total Google LSI & Semantic Keywords Extracted: ${lsi.length}`);
  console.log('Sample 20 Keywords:');
  lsi.slice(0, 20).forEach((k, i) => console.log(`  ${i+1}. ${k}`));
}

test();
