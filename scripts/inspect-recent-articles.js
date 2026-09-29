const fs = require('fs');
const content = fs.readFileSync('src/data/articles.ts', 'utf8');

const matches = content.matchAll(/slug:\s*"([^"]+)"/g);
const slugs = Array.from(matches).map(m => m[1]);
console.log('Total articles:', slugs.length);
console.log('Last 5 articles:', slugs.slice(-5));

slugs.slice(-5).forEach(slug => {
  const slugPos = content.indexOf(`slug: "${slug}"`);
  const nextSlugPos = content.indexOf('slug: "', slugPos + 25);
  const block = content.substring(slugPos - 20, nextSlugPos !== -1 ? nextSlugPos : content.length);
  const title = block.match(/title:\s*"([^"]+)"/)?.[1];
  const author = block.match(/authorId:\s*"([^"]+)"/)?.[1];
  const cover = block.match(/coverImage:\s*"([^"]+)"/)?.[1];
  const htmlMatch = block.match(/contentHtml:\s*`([\s\S]*?)`/);
  const html = htmlMatch ? htmlMatch[1] : '';
  const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
  const h2Count = (html.match(/<h2[^>]*>/g) || []).length;
  console.log(`\n[${slug}]`);
  console.log(`  Title: ${title}`);
  console.log(`  Author: ${author}`);
  console.log(`  Words: ${words}`);
  console.log(`  H2s: ${h2Count}`);
  console.log(`  Cover: ${cover}`);
});
