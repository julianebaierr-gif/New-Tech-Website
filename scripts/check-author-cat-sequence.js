const fs = require('fs');

const content = fs.readFileSync('src/data/articles.ts', 'utf8');
const articleBlocks = content.split(/\{\s*slug:\s*["']/);
const list = [];
for (let i = 1; i < articleBlocks.length; i++) {
  const block = articleBlocks[i];
  const slug = block.match(/^([^"']+)/)?.[1];
  const categoryName = block.match(/categoryName:\s*["']([^"']+)["']/)?.[1];
  const authorId = block.match(/authorId:\s*["']([^"']+)["']/)?.[1];
  const publishedAt = block.match(/publishedAt:\s*["']([^"']+)["']/)?.[1];
  list.push({ slug, categoryName, authorId, publishedAt });
}

console.log('Current articles sequence:');
list.forEach((a, i) => {
  console.log(`${i + 1}. [${a.slug}] ${a.categoryName} | Author: ${a.authorId} (${a.publishedAt})`);
});
