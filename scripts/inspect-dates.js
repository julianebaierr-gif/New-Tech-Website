const fs = require('fs');

const content = fs.readFileSync('src/data/articles.ts', 'utf8');

// Match articles in articles.ts
const articleRegex = /slug:\s*["']([^"']+)["'][\s\S]*?title:\s*["']([^"']+)["'][\s\S]*?publishedAt:\s*["']([^"']+)["'][\s\S]*?updatedAt:\s*["']([^"']+)["']/g;

let match;
console.log('--- Current articles in src/data/articles.ts ---');
const articlesInTs = [];
while ((match = articleRegex.exec(content)) !== null) {
  articlesInTs.push({
    slug: match[1],
    title: match[2],
    publishedAt: match[3],
    updatedAt: match[4]
  });
  console.log(`${match[1]} | pub: ${match[3]} | upd: ${match[4]}`);
}

console.log('\nTotal in articles.ts:', articlesInTs.length);
