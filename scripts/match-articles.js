const fs = require('fs');

const content = fs.readFileSync('src/data/articles.ts', 'utf8');

// Match articles in articles array
// We can find all slug: "..."
const slugRegex = /slug:\s*["']([^"']+)["']/g;
const titleRegex = /title:\s*["']([^"']+)["']/g;
const catRegex = /categoryName:\s*["']([^"']+)["']/g;
const tagsRegex = /tags:\s*\[([^\]]+)\]/g;
const dateRegex = /publishedAt:\s*["']([^"']+)["']/g;

// Let's parse articles roughly
const articles = [];
const articleBlocks = content.split(/\{\s*slug:\s*["']/);
for (let i = 1; i < articleBlocks.length; i++) {
  const block = articleBlocks[i];
  const slug = block.match(/^([^"']+)/)?.[1];
  const title = block.match(/title:\s*["']([^"']+)["']/)?.[1];
  const categoryName = block.match(/categoryName:\s*["']([^"']+)["']/)?.[1];
  const publishedAt = block.match(/publishedAt:\s*["']([^"']+)["']/)?.[1];
  const tagsMatch = block.match(/tags:\s*\[([\s\S]*?)\]/);
  let tags = [];
  if (tagsMatch) {
    tags = [...tagsMatch[1].matchAll(/["']([^"']+)["']/g)].map(m => m[1]);
  }
  if (slug && title) {
    articles.push({ slug, title, categoryName, publishedAt, tags });
  }
}

console.log(`Found ${articles.length} articles:`);
articles.forEach((a, idx) => {
  console.log(`${idx + 1}. [${a.slug}] "${a.title}" (${a.categoryName}) - Tags: ${a.tags.join(', ')}`);
});
