const fs = require('fs');

// Robust CSV parser
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
        i++;
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

// Convert 2D array to CSV string
function toCSV(rows) {
  return rows.map(row => {
    return row.map(cell => {
      const str = String(cell ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',');
  }).join('\r\n');
}

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

const baseUrl = 'https://techopswire.com';
const publishDateTime = '2026-09-24 10:00:00';

// 1. Build Sheet1 Data
// Headers: Keywords,Category,Tags,Status,Post Url,Post Date / Tmie
const sheet1Headers = ["Keywords", "Category", "Tags", "Status", "Post Url", "Post Date / Tmie"];
const sheet1Rows = [sheet1Headers];

articles.forEach(art => {
  const keywords = art.primaryKeyword;
  const category = art.categoryName;
  const tags = art.secondaryKeywords.join(', ');
  const status = "Live";
  const postUrl = `${baseUrl}/articles/${art.slug}`;
  const postDate = publishDateTime;

  sheet1Rows.push([keywords, category, tags, status, postUrl, postDate]);
});

fs.writeFileSync('scripts/sheet1_data.csv', toCSV(sheet1Rows), 'utf8');
console.log(`Generated sheet1_data.csv with ${sheet1Rows.length - 1} article rows.`);

// 2. Update Sheet2 Data
const sheet2Content = fs.readFileSync('scripts/sheet2.csv', 'utf8');
const sheet2Rows = parseCSV(sheet2Content);

let updatedCount = 0;
articles.forEach(art => {
  for (let r = 1; r < sheet2Rows.length; r++) {
    const row = sheet2Rows[r];
    const mainKw = (row[2] || '').toLowerCase().trim();
    const propTitle = (row[1] || '').toLowerCase().trim();
    const artKw = (art.primaryKeyword || '').toLowerCase().trim();
    const artTitle = (art.title || '').toLowerCase().trim();

    if (mainKw === artKw || propTitle === artTitle || mainKw.includes(artKw) || artKw.includes(mainKw)) {
      row[9] = "Live"; // Status
      row[10] = `${baseUrl}/articles/${art.slug}`; // Post Url
      row[11] = publishDateTime; // Post Date / Tmie
      updatedCount++;
      console.log(`Updated Sheet2 Row ${r + 1}: [${row[2]}] -> Live | ${row[10]}`);
      break;
    }
  }
});

fs.writeFileSync('scripts/sheet2_updated.csv', toCSV(sheet2Rows), 'utf8');
console.log(`Updated ${updatedCount} rows in sheet2_updated.csv out of ${articles.length} articles.`);
