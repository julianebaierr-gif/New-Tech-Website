const fs = require('fs');
const content = fs.readFileSync('src/data/articles.ts', 'utf8');

const blocks = content.split(/\{\s*slug:\s*"/).slice(1);
console.log('Total articles:', blocks.length);

blocks.forEach((b, i) => {
  const slug = b.match(/^([^"]+)"/)?.[1];
  const excerpt = b.match(/excerpt:\s*"([^"]+)"/)?.[1];
  const metaDesc = b.match(/metaDescription:\s*"([^"]+)"/)?.[1];
  console.log(`\n[${i+1}] ${slug}`);
  console.log('  Excerpt: ' + excerpt);
  console.log('  MetaDesc: ' + metaDesc);
});
