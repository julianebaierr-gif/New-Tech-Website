const fs = require('fs');
const path = require('path');
const content = fs.readFileSync(path.join(__dirname, '../src/data/articles.ts'), 'utf8');

const regex = /slug:\s*["']([^"']+)["'][\s\S]*?publishedAt:\s*["']([^"']+)["']/g;
let m;
const list = [];
while ((m = regex.exec(content)) !== null) {
  list.push({ slug: m[1], publishedAt: m[2] });
}
list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
console.log('REVERSE CHRONOLOGICAL ORDER (NEWEST FIRST):');
list.forEach((item, idx) => {
  console.log(`${idx + 1}. ${item.slug} (${item.publishedAt})`);
});
