const fs = require('fs');
const content = fs.readFileSync('src/data/articles.ts', 'utf8');

const targetSlug = 'how-to-unhide-rows-in-excel';
const slugPos = content.indexOf(`slug: "${targetSlug}"`);
if (slugPos === -1) {
  console.log('Article not found!');
  process.exit(1);
}

const nextSlugPos = content.indexOf('slug: "', slugPos + 25);
const block = content.substring(slugPos - 20, nextSlugPos !== -1 ? nextSlugPos : content.length);

console.log('=== ARTICLE METADATA ===');
const author = block.match(/authorId:\s*"([^"]+)"/)?.[1];
const title = block.match(/title:\s*"([^"]+)"/)?.[1];
const headline = block.match(/headline:\s*"([^"]+)"/)?.[1];
const excerpt = block.match(/excerpt:\s*"([^"]+)"/)?.[1];
const metaTitle = block.match(/metaTitle:\s*"([^"]+)"/)?.[1];
const metaDesc = block.match(/metaDescription:\s*"([^"]+)"/)?.[1];
const readingTime = block.match(/readingTimeMinutes:\s*(\d+)/)?.[1];
const difficulty = block.match(/difficulty:\s*"([^"]+)"/)?.[1];
const coverImage = block.match(/coverImage:\s*"([^"]+)"/)?.[1];
const secondaryImage = block.match(/secondaryImage:\s*(\{[^}]+\})/)?.[1];
const tertiaryImage = block.match(/tertiaryImage:\s*(\{[^}]+\})/)?.[1];

console.log('Title:', title);
console.log('Author ID:', author);
console.log('Cover Image:', coverImage);
console.log('Secondary Image:', secondaryImage);
console.log('Tertiary Image:', tertiaryImage);
console.log('Reading Time:', readingTime);

const contentHtmlMatch = block.match(/contentHtml:\s*`([\s\S]*?)`/);
const html = contentHtmlMatch ? contentHtmlMatch[1] : '';

const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean);
const h2s = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/g) || [];
const tables = html.match(/<table[^>]*>[\s\S]*?<\/table>/g) || [];
const pres = html.match(/<pre[^>]*>[\s\S]*?<\/pre>/g) || [];

console.log('\n=== CONTENT STATS ===');
console.log('Word Count:', words.length);
console.log('HTML Length:', html.length);
console.log('H2 Headings (' + h2s.length + '):');
h2s.forEach((h, i) => console.log('  ' + (i+1) + '. ' + h.replace(/<[^>]+>/g, '')));
console.log('Tables:', tables.length);
console.log('Pre/Code:', pres.length);

console.log('\n=== FULL CONTENT PREVIEW (First 1500 chars) ===');
console.log(html.slice(0, 1500));
