const fs = require('fs');

// Simple robust CSV parser
function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField);
      currentField = '';
      if (currentRow.length > 1 || currentRow[0] !== '') {
        rows.push(currentRow);
      }
      currentRow = [];
    } else {
      currentField += char;
    }
  }
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }
  return rows;
}

const sheet2Content = fs.readFileSync('scripts/sheet2.csv', 'utf8');
const rows = parseCSV(sheet2Content);
const header = rows[0];
console.log('Headers:', header);

// Read articles from articles.ts
const content = fs.readFileSync('src/data/articles.ts', 'utf8');
const articleBlocks = content.split(/\{\s*slug:\s*["']/);
const articles = [];
for (let i = 1; i < articleBlocks.length; i++) {
  const block = articleBlocks[i];
  const slug = block.match(/^([^"']+)/)?.[1];
  const title = block.match(/title:\s*["']([^"']+)["']/)?.[1];
  const categoryName = block.match(/categoryName:\s*["']([^"']+)["']/)?.[1];
  const publishedAt = block.match(/publishedAt:\s*["']([^"']+)["']/)?.[1];
  const primaryKeyword = block.match(/primaryKeyword:\s*["']([^"']+)["']/)?.[1];
  const tagsMatch = block.match(/secondaryKeywords:\s*\[([\s\S]*?)\]/);
  let secondaryKeywords = [];
  if (tagsMatch) {
    secondaryKeywords = [...tagsMatch[1].matchAll(/["']([^"']+)["']/g)].map(m => m[1]);
  }
  if (slug && title) {
    articles.push({ slug, title, categoryName, publishedAt, primaryKeyword, secondaryKeywords });
  }
}

console.log(`\nFound ${articles.length} articles in articles.ts.`);

// Match with Sheet2 rows
// Header:
// 0: Category (Silo)
// 1: Proposed Article Title (H1)
// 2: Main Target Keyword (H1)
// 3: Main Volume
// 4: Milte Julte Keywords (Sub-headings / Semantic LSI)
// 5: Total Supporting Keywords
// 6: Combined Monthly Volume
// 7: Average KD
// 8: Search Intent
// 9: Status
// 10: Post Url
// 11: Post Date / Tmie

articles.forEach(art => {
  let matchedIndex = -1;
  let matchedRow = null;

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const mainKw = (row[2] || '').toLowerCase().trim();
    const propTitle = (row[1] || '').toLowerCase().trim();
    const artKw = (art.primaryKeyword || '').toLowerCase().trim();
    const artTitle = (art.title || '').toLowerCase().trim();

    if (mainKw === artKw || propTitle === artTitle || mainKw.includes(artKw) || artKw.includes(mainKw)) {
      matchedIndex = r;
      matchedRow = row;
      break;
    }
  }

  if (matchedRow) {
    console.log(`\nMATCHED Article: [${art.slug}]`);
    console.log(`  Row ${matchedIndex + 1} in Sheet2:`);
    console.log(`  Target Keyword: "${matchedRow[2]}"`);
    console.log(`  Title: "${matchedRow[1]}"`);
    console.log(`  Current Status: "${matchedRow[9]}"`);
  } else {
    console.log(`\nNO EXACT MATCH for Article: [${art.slug}] (KW: "${art.primaryKeyword}")`);
  }
});
