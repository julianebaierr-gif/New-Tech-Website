const fs = require('fs');
const content = fs.readFileSync('src/data/articles.ts', 'utf8');

const targetSlug = 'benefits-of-cloud-computing';
const slugPos = content.indexOf(`slug: "${targetSlug}"`);
if (slugPos === -1) {
  console.log('Article not found!');
  process.exit(1);
}

// Find next article slug or end
const nextSlugPos = content.indexOf('slug: "', slugPos + 20);
const block = content.substring(slugPos, nextSlugPos !== -1 ? nextSlugPos : content.length);

console.log('=== ARTICLE METADATA ===');
const author = block.match(/authorId:\s*"([^"]+)"/)?.[1];
const title = block.match(/title:\s*"([^"]+)"/)?.[1];
const headline = block.match(/headline:\s*"([^"]+)"/)?.[1];
const excerpt = block.match(/excerpt:\s*"([^"]+)"/)?.[1];
const metaTitle = block.match(/metaTitle:\s*"([^"]+)"/)?.[1];
const metaDesc = block.match(/metaDescription:\s*"([^"]+)"/)?.[1];
const readingTime = block.match(/readingTimeMinutes:\s*(\d+)/)?.[1];
const difficulty = block.match(/difficulty:\s*"([^"]+)"/)?.[1];
const primaryKw = block.match(/primaryKeyword:\s*"([^"]+)"/)?.[1];
const secondaryKws = block.match(/secondaryKeywords:\s*(\[[^\]]+\])/)?.[1];
const coverImage = block.match(/coverImage:\s*"([^"]+)"/)?.[1];

console.log('Title:', title);
console.log('Meta Title (' + (metaTitle?.length || 0) + ' chars):', metaTitle);
console.log('Meta Desc (' + (metaDesc?.length || 0) + ' chars):', metaDesc);
console.log('Author ID:', author);
console.log('Reading Time (min):', readingTime);
console.log('Difficulty:', difficulty);
console.log('Cover Image:', coverImage);

// Extract HTML content
const contentHtmlMatch = block.match(/contentHtml:\s*`([\s\S]*?)`/);
const html = contentHtmlMatch ? contentHtmlMatch[1] : '';

const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean);
const h2s = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/g) || [];
const h3s = html.match(/<h3[^>]*>([\s\S]*?)<\/h3>/g) || [];
const tables = html.match(/<table[^>]*>[\s\S]*?<\/table>/g) || [];
const pres = html.match(/<pre[^>]*>[\s\S]*?<\/pre>/g) || [];

console.log('\n=== CONTENT STATS ===');
console.log('Total Word Count:', words.length);
console.log('Total HTML Length:', html.length);
console.log('Total H2 Headings (' + h2s.length + '):');
h2s.forEach((h, i) => console.log('  ' + (i+1) + '. ' + h.replace(/<[^>]+>/g, '')));
console.log('Total H3 Headings (' + h3s.length + '):');
h3s.forEach((h, i) => console.log('  ' + (i+1) + '. ' + h.replace(/<[^>]+>/g, '')));
console.log('Tables Count:', tables.length);
console.log('CLI Code Blocks Count:', pres.length);

// Extract TOC from articles.ts
const tocMatch = block.match(/tableOfContents:\s*(\[[\s\S]*?\]),\s*faqs/);
console.log('\n=== TABLE OF CONTENTS IN ARTICLES.TS ===');
if (tocMatch) {
  try {
    const toc = eval(tocMatch[1]);
    toc.forEach((t, i) => console.log('  ' + (i+1) + '. ' + t.title + ' (id: ' + t.id + ')'));
  } catch (e) {
    console.log('TOC parse error:', e.message);
  }
}

// Extract FAQs
const faqsMatch = block.match(/faqs:\s*(\[[\s\S]*?\]),\s*contentHtml/);
console.log('\n=== FAQS IN ARTICLES.TS ===');
if (faqsMatch) {
  try {
    const faqs = eval(faqsMatch[1]);
    console.log('FAQs Count:', faqs.length);
    faqs.forEach((f, i) => console.log('  Q' + (i+1) + ': ' + f.question));
  } catch (e) {
    console.log('FAQs parse error:', e.message);
  }
}

// Scan for banned words
const { REPLACEMENTS } = require('./sanitize-rules.js');
let bannedCount = 0;
for (const { p } of REPLACEMENTS) {
  const m = html.match(p);
  if (m) {
    console.log(`Warning: Found banned phrase "${p}" (${m.length} times)`);
    bannedCount += m.length;
  }
}
console.log('\nTotal Banned Word Matches in Article HTML:', bannedCount);

console.log('\n=== FIRST 800 CHARACTERS OF CONTENT ===');
console.log(html.slice(0, 800));
